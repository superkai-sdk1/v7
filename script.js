const numPlayers = 10;
const playerTable = document.getElementById('player-rows');
const ps = new BroadcastChannel('panel_status');
const pl = new BroadcastChannel('player_list');
const cl = new BroadcastChannel('class_list');
const gi = new BroadcastChannel('game_info');

function createPlayerRows(num) {
    for (let i = 1; i <= num; i++) {
        const row = document.createElement('tr');
        row.className = 'player';
        row.id = `player_${i}`;
        row.innerHTML = `
                            <td class="number"><p onclick="highlightSpeaker(${i})">${i}</p></td>
                            <td class="players"><select class="player-list"></select></td>
                            <td class="s-button killed-button"><div onclick="changeStatus(this, 'killed')"></div></td>
                            <td class="s-button voted-button"><div onclick="changeStatus(this, 'voted')"></div></td>
                            <td class="s-button deleted-button"><div onclick="changeStatus(this, 'deleted')"></div></td>
                            <td></td>
                            <td class="s-button don-button"><div onclick="changeRole(this, 'don')"></div></td>
                            <td class="s-button mafia-button"><div onclick="changeRole(this, 'mafia')"></div></td>
                            <td class="s-button sheriff-button"><div onclick="changeRole(this, 'sheriff')"></div></td>
                        `;
        playerTable.appendChild(row);
    }
}

$(document).ready(function () {
    createPlayerRows(numPlayers);
    $('.main').hide();
    $('#main-buttons').hide();
    getPlayerList(player_list);
});

function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];
    var fileReader = new FileReader();

    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        getPlayerList(textFromFileLoaded.split('\r\n'));
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
    $('.main').show();
    $('#main-buttons').show();
}

function getPlayerList(playerArray) {
    document.querySelectorAll('.player-list').forEach((element, index) => {
        $(element).empty();
        playerArray.forEach(player => {
            element.add(new Option(player.trim()));
        });
        $(element).children('option').eq(index).attr('selected', 'selected');
    });
}

function changeStatus(object, status) {
    const element = object.parentElement.parentElement;
    if (element.classList.contains(status)) {
        element.classList.remove(status);
        element.classList.remove('dead');
    } else {
        if (element.classList.contains('dead')) {
            element.classList.remove('killed', 'voted', 'deleted');
        } else {
            element.classList.add('dead');
        }
        element.classList.add(status);
    }
    cl.postMessage(`${element.id}|${element.classList.value}`);
}

function changeRole(object, role) {
    const element = object.parentElement.parentElement;
    if (element.classList.contains(role)) {
        element.classList.remove(role);
    } else {
        element.classList.remove('don', 'mafia', 'sheriff');
        element.classList.add(role);
    }
    cl.postMessage(`${element.id}|${element.classList.value}`);
}

function clearStatus() {
    document.querySelectorAll('.killed, .voted, .deleted, .dead').forEach(item => {
        item.classList.remove('killed', 'voted', 'deleted', 'dead');
    });
    document.querySelectorAll('.player').forEach(element => {
        cl.postMessage(`${element.id}|${element.classList.value}`);
    });
}

function clearRole() {
    document.querySelectorAll('.don, .mafia, .sheriff').forEach(item => {
        item.classList.remove('don', 'mafia', 'sheriff');
    });
    document.querySelectorAll('.player').forEach(element => {
        cl.postMessage(`${element.id}|${element.classList.value}`);
    });
}

$('#button-panel').click(function () {
    ps.postMessage(`body|${$('#button-panel').find('.checkbox')[0].checked ? 'visible' : ''}`);
});

$('#button-roles').click(function () {
    ps.postMessage(`footer|${$('#button-roles').find('.checkbox')[0].checked ? 'show-roles' : ''}`);
});

$('.player-table select').on('change', function () {
    const player = `${$(this).parents('.player')[0].id}|${$(this).find(":selected").val()}`;
    pl.postMessage(player);
});

function sendAllData() {
    document.querySelectorAll('.player').forEach(element => {
        const item = element.querySelector('.player-list');
        const player = `${element.id}|${$(item[item.selectedIndex]).text()}`;
        pl.postMessage(player);
    });
}

$('.input-file input[type=file]').on('change', function () {
    const file = this.files[0];
    $(this).closest('.input-file').find('.input-file-text').html(file.name);
});

$('#game-number-input').on('input', function () {
    const gameNumber = $(this).val();
    gi.postMessage(gameNumber);
});

function highlightSpeaker(playerNumber) {
    ps.postMessage(`highlight|player_${playerNumber}`);
}  