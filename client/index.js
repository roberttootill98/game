'use strict'

let playerData;
let gameSocket;

async function boot() {
  if(playerData) {
    // prompt game list
    await promptGameList();
  } else {
    // diplaying landing page contents
    await headerButtons();
    //prompt_usernameSelection_window();
  }
}

// adds buttons to header
async function headerButtons() {
  const container = document.getElementById('container_headerButtons');

  // login/logout
  const button_login = document.createElement('button');
  container.appendChild(button_login);
  button_login.classList.add('button');
  button_login.classList.add('headerButton');

  // if the user is logged in
  const name = await getName();

  if(name) {
    // - add logout button
    button_login.textContent = 'Logout';
    button_login.onclick = logout;
  } else {
    // - else add login button
    button_login.textContent = 'Login';
    button_login.onclick = login;
  }

  // settings
  const button_settings = document.createElement('button');
  container.appendChild(button_settings);
  button_settings.classList.add('button');
  button_settings.classList.add('headerButton');
  button_settings.textContent = 'Settings';
  button_settings.onclick = settings_onclick;
}

async function getName() {
  const response = await fetch("/api/user_name");
  if(response.ok) {
    return await response.text();
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
  await createGameBoard();
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

window.addEventListener("load", boot);
