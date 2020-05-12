const API_PATH = '/emby';

const ENDPOINTS = {
    SessionsService: {
        Sessions: '/Sessions',
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