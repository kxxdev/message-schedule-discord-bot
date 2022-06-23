const urlMsc = 'http://worldtimeapi.org/api/timezone/Europe/Moscow';
const fetch = require('node-fetch');

class GetMscTime {
    async getMscTime() {
        const moscowTime = await fetch(urlMsc).then(res => res.json()).then(json => { return json });
        return moscowTime;
    }
}

module.exports = new GetMscTime();