const ps = new BroadcastChannel('panel_status');
const pl = new BroadcastChannel('player_list');
const cl = new BroadcastChannel('class_list');
const gi = new BroadcastChannel('game_info');

$(document).ready(function () {
    var element = document.getElementsByTagName("body")[0];
});

pl.onmessage = (event) => {
    const player_list = event.data.split('|');
    document.getElementById(player_list[0]).querySelectorAll('.nick')[0].innerHTML = player_list[1];
    document.getElementById(player_list[0]).querySelectorAll('.photo')[0].style.backgroundImage = 'url("content/photo/' + player_list[1] + '.png")';
}

cl.onmessage = (event) => {
    const class_list = event.data.split('|');
    document.getElementById(class_list[0]).setAttribute('class', class_list[1]);
}

ps.onmessage = (event) => {
    const [command, elementId] = event.data.split('|');
    if (command === 'highlight') {
        const element = document.getElementById(elementId);
        if (element.classList.contains('highlight')) {
            element.classList.remove('highlight');
            element.classList.remove('speaker');
        } else {
            document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
            document.querySelectorAll('.speaker').forEach(el => el.classList.remove('speaker'));
            element.classList.add('highlight');
            element.classList.add('speaker');
        }
    } else {
        const panel_status = event.data.split('|');
        document.getElementsByTagName(panel_status[0])[0].setAttribute('class', panel_status[1]);
    }
}

gi.onmessage = (event) => {
    document.getElementById('game-info').innerText = event.data;
}