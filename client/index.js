'use strict'

let playerData;
let gameSocket;

async function boot() {
  if(playerData) {
    // prompt game list
    await promptGameList();
  } else {
    prompt_usernameSelection_window();
  }
}

function prompt_usernameSelection_window() {
  // container
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.classList.add('modalWindow');

  // name
  // label
  const nameLabel = document.createElement('p');
  container.appendChild(nameLabel);
  nameLabel.classList.add('label');
  nameLabel.textContent = 'Username:';
  // input
  const nameInput = document.createElement('input');
  container.appendChild(nameInput);
  nameInput.id = 'nameInput';
  nameInput.classList.add('input');

  // submit button
  const submit = document.createElement('button');
  container.appendChild(submit);
  submit.classList.add('button');
  submit.onclick = submitName;
  submit.textContent = 'Submit';
}

async function submitName() {
  const username = document.getElementById('nameInput').value;
  playerData = {'username': username};

  await boot();
}

async function promptGameList() {
  // remove modal window
  document.querySelector('.modalWindow').remove();

  // create game list
  // container
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.classList.add('modalWindow');

  // header
  const header = document.createElement('h3');
  container.appendChild(header);
  header.id = 'title';
  header.textContent = 'Join or create a game';

  // get games
  const games = await getGames();
  for(let game of games) {
    const gameContainer = document.createElement('div');
    container.appendChild(gameContainer);
    gameContainer.id = game.id;
    gameContainer.classList.add('gameContainer');
    gameContainer.onclick = joinGame;

    // name
    const gameID = document.createElement('p');
    gameContainer.appendChild(gameID);
    gameID.textContent = "Game ID: " + game.id;
    // player count
    const playerCount = document.createElement('p');
    gameContainer.appendChild(playerCount);
    playerCount.textContent = "Player count: " + game.playerCount;
  }

  // add create game button
  const create = document.createElement('button');
  container.appendChild(create);
  create.classList.add('button');
  create.onclick = createGame;
  create.textContent = 'Create a game';
}

async function getGames() {
  const response = await fetch('/api/games');

  if(response.ok) {
    return await response.json();
  } else {
    console.error("Failed to get games.");
  }
}

async function createGame() {
  console.log("creating game");

  // post game on server
  const gameData = await postGame();

  // get socket
  gameSocket = io("/" + gameData.id);
  gameSocket.on('message', updateReceived);

  // create game dom
  createGameBoard();
}

async function postGame() {
  let url = '/api/game';

  const response = await fetch(url, {method: 'POST'});
  if(response.ok) {
    return await response.json();
  } else {
    console.error("Failed to post game");
  }
}

async function joinGame(ev) {
  console.log("joining game");

  // get game container
  let el = ev.target;
  while(!el.classList.contains('gameContainer')) {
    el = el.parentNode;
  }

  const gameData = await getGame(el.id);
  // get socket
  gameSocket = io("/" + gameData.id);
  gameSocket.on('message', updateReceived);

  // create game dom
  createGameBoard();
}

async function getGame(gameID) {
  const url = `/api/game?gameID=${gameID}`;

  const response = await fetch(url);
  if(response.ok) {
    return await response.json();
  } else {
    console.error("Failed to get game");
  }
}

async function updateReceived(ev) {
  console.log(ev);
}

// creates dom for game board
function createGameBoard() {
  // remove modal window
  document.querySelector('.modalWindow').remove();

  console.log("creating game board");

  const gameContainer = document.createElement('div');
  document.body.appendChild(gameContainer);
  gameContainer.id = 'gameContainer';

  // create opposition side
  const oppositionContainer = document.createElement('div');
  gameContainer.appendChild(oppositionContainer);
  oppositionContainer.id = 'oppositionContainer';
  oppositionContainer.classList.add('sideContainer');
  // add companions
  createCompanions(oppositionContainer);

  // battlefield container
  const battlefieldContainer = document.createElement('div');
  gameContainer.appendChild(battlefieldContainer);
  battlefieldContainer.id = 'battlefieldContainer';

  // create player side
  const playerContainer = document.createElement('div');
  gameContainer.appendChild(playerContainer);
  playerContainer.id = 'playerContainer';
  playerContainer.classList.add('sideContainer');
  // add companions
  createCompanions(playerContainer);
}

// should get companion data and create them according to state
function createCompanions(container) {
  // in memory data
  const companions = [
    {
      'name': 'aang',
      'icon': '/assets/companions/aang.png',
      'spells': [
        {
          'name': 'glider',
          'element': 'air'
        },
        {
          'name': 'hot squat',
          'element': 'fire'
        },
        null,
        null
      ]
    },
    {
      'name': 'katara',
      'icon': '/assets/companions/katara.png',
      'spells': [
        {
          'name': 'healing',
          'element': 'water'
        },
        {
          'name': 'freeze',
          'element': 'water'
        },
        {
          'name': 'wet',
          'element': 'water'
        },
        null
      ]
    },
    {
      'name': 'sokka',
      'icon': '/assets/companions/sokka.png',
      'spells': [
        {
          'name': 'boomerang',
          'element': 'none'
        },
        null,
        null,
        null
      ]
    },
    {
      'name': 'suki',
      'icon': '/assets/companions/suki.png',
      'spells': [
        {
          'name': 'shield',
          'element': 'none'
        },
        null,
        null,
        null
      ]
    }
  ];

  for(let i = 0; i < companions.length; i++) {
    const companion = companions[i];

    const companionContainer = document.createElement('div');
    container.appendChild(companionContainer);
    companionContainer.classList.add('companionContainer');
    companionContainer.classList.add('companion' + i);

    // header
    const header = document.createElement('div');
    companionContainer.appendChild(header);
    header.classList.add('header');
    // name
    const name = document.createElement('p');
    header.appendChild(name);
    name.textContent = companion.name;

    // main area
    // icon
    const icon = document.createElement('div');
    companionContainer.appendChild(icon);
    icon.classList.add('icon');
    icon.textContent = 'companion icon';

    // spells, always create 4 slots, may not all be filled
    for(let j = 0; j < companion.spells.length; j++) {
      const spell = companion.spells[j];

      const spellSlot = document.createElement('div');
      companionContainer.appendChild(spellSlot);
      spellSlot.classList.add('spell' + j);
      spellSlot.classList.add('spell');

      if(spell) {
        spellSlot.textContent = spell.name;
        spellSlot.classList.add(spell.element);
      }
    }
  }
}

window.addEventListener("load", boot);
