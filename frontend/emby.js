const API_PATH = '/emby';

const ENDPOINTS = {
    SessionsService: {
        Sessions: '/Sessions',
        PlayingCommand: '/Sessions/{Id}/Playing/{Command}'
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