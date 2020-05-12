const API_PATH = '/emby';

const ENDPOINTS = {
    SessionsService: {
        Sessions: '/Sessions',
        Playing: '/Sessions/{Id}/Playing',
        PlayingCommand: '/Sessions/{Id}/Playing/{Command}'
    },
    ItemsService: {
        Items: '/Items'
    }
};


function getAuthShit() {
    return ({
        key: $('#key').val(),
        host: $('#host').val(),
        port: $('#port').val()
    })
}

function buildFetch(endpoint, params = '') {
    let auth = getAuthShit();
    return `${auth.host}:${auth.port}${API_PATH}${endpoint}?api_key=${auth.key}`;
}


function getSessions() {
    fetch(buildFetch(ENDPOINTS.SessionsService.Sessions))
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        let data = '';
        json.forEach(mbSession => {
            let device = mbSession.DeviceName;
            let sid = mbSession.Id;
            let name = mbSession.UserName ? mbSession.UserName : 'none';
            data = data.concat(`
            <tr>
                <td>${name}</td>
                <td>${device}</td>
                <td>${sid}</td>
            </tr>
            `);
            $('#session-info tr:last').after(data);
        });

        $('#session-info').html(data);
    });
}

function start() {
    let mid = $('#movie-id').val();
    let start = $('#start-time').val().split(':');
    
    let sminutes = start[0] * 60;
    let sseconds = start[1];

    let ticks = secondsToTicks(parseInt(sminutes) + parseInt(sseconds));


    $('#group-list').val().split('\n').forEach((sid) => {
        fetch(buildFetch(ENDPOINTS.SessionsService.Playing).replace('{Id}', sid) + `&PlayCommand=PlayNow&ItemIds=${mid}&StartPositionTicks=${ticks}`, {
            method: 'POST'
        })
        .then((response) => response.text())
        .then((text) => console.log(`Start sent to ${sid}`));
    });

    // https://emby.jmoore.dev:8920/emby/Sessions/a1a8d21675c18cfabe6b090ebb8e99c8/Playing?ItemIds=41149&StartPositionTicks=13800000000&PlayCommand=PlayNow
}

function playPause() {
    let group = $('#group-list').val().split('\n');
    
    group.forEach((sid) => {
        fetch(buildFetch(ENDPOINTS.SessionsService.PlayingCommand).replace('{Id}', sid).replace('{Command}', 'PlayPause'), {
            method: 'POST'
        })
        .then((response) => response.text())
        .then((text) => console.log(`Play/Pause sent to ${sid}`));
    });
}

function stop() {

}

function search() {
    let query = $('#search').val();

    fetch(buildFetch(ENDPOINTS.ItemsService.Items) + `&Recursive=true&SearchTerm=${encodeURI(query)}`)
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        let data = '';
        if (json.TotalRecordCount < 1) {
            alert('No results');
            return;
        }
        json.Items.forEach(item => {
            let title = item.Name;
            let type = item.Type;
            let mid = item.Id;
            data = data.concat(`
            <tr>
                <td>${title}</td>
                <td>${type}</td>
                <td>${mid}</td>
            </tr>
            `);
            $('#movie-info tr:last').after(data);
        });

        $('#movie-info').html(data);
    });
}

function secondsToTicks(seconds) {
    return seconds * 1000 * 10000;
}