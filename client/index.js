'use strict'

// if the user is logged in
let loggedIn = false;

async function boot() {
  await add_headerButtons();

  if(loggedIn) {
    add_createGameButton();
    await add_gameList();
  } else {
    // display default splash
  }
}

// empties page apart from header
function clearContent() {
  const children = Array.from(document.getElementById('main').children);
  for(let child of children) {
    child.remove();
  }
}

// adds buttons to header
async function add_headerButtons() {
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

    loggedIn = true;
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

function remove_headerButtons() {
  const container = document.getElementById('container_headerButtons');
  // make copy by value of array
  const children = Array.from(container.children);

  for(const child of children) {
    child.remove();
  }
}

// button for creating a new game
// prompts a modal window
function add_createGameButton() {
  const button = document.createElement('button');
  document.getElementById('main').appendChild(button);
  button.classList.add('button');
  button.textContent = 'Create game';
  button.onclick = promptWindow_createGame;
}

// prompt the modal window for creating a game
// name
// potential password
// then password
// other settings
function promptWindow_createGame() {
  // container
  const window_createGame = document.createElement('div');
  document.getElementById('main').appendChild(window_createGame);
  window_createGame.id = 'window_createGame';
  window_createGame.classList.add('modalWindow');

  // name
  const nameContainer = document.createElement('span');
  window_createGame.appendChild(nameContainer);
  // label
  const nameLabel = document.createElement('p');
  nameContainer.appendChild(nameLabel);
  nameLabel.textContent = 'Name:';
  // input
  const nameInput = document.createElement('input');
  nameContainer.appendChild(nameInput);
  nameInput.id = 'input_gameName';
  nameInput.classList.add('input');

  // buttons
  const buttonContainer = document.createElement('div');
  window_createGame.appendChild(buttonContainer);
  // confirm button
  // don't enable until name is entered
  const confirmButton = document.createElement('button');
  buttonContainer.appendChild(confirmButton);
  confirmButton.classList.add('button');
  confirmButton.textContent = 'Confirm';
  confirmButton.onclick = confirm_createGame;
  // cancel button
  const cancelButton = document.createElement('button');
  buttonContainer.appendChild(cancelButton);
  cancelButton.classList.add('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.onclick = cancel_createGame;
}

// list game on server
// then launch user into game
async function confirm_createGame() {
  // get details of game
  const name = document.getElementById('input_gameName').value;

  // make api call
  await createGame(name);
  const game = await getGame();

  // get game socket using game id
  gameSocket = io("/" + game.id);
  gameSocket.on('message', gameSocket_message);
  gameSocket.on('phase', gameSocket_phase);

  // load gameboard
  clearContent();
  await createGameBoard();
}

async function createGame(name) {
  let url = '/api/game';
  url += `?name=${name}`;

  const response = await fetch(url, {method: 'post'});
  if(response.ok) {
    console.log("created game");
  } else {
    console.error("failed to post game");
  }
}

// gets game associated with player
// can only be one at a time
async function getGame() {
  const response = await fetch('/api/game');
  if(response.ok) {
    return await response.json();
  } else {
    console.error("failed to get game");
  }
}

// dismiss modal window
function cancel_createGame() {
  const modalWindow = document.getElementById('window_createGame');
  modalWindow.remove();
}

// get list of games from the server and display them
async function add_gameList() {
  const games = await getGames();

  // container
  const gameList = document.createElement('div');
  document.getElementById('main').appendChild(gameList);
  gameList.id = 'gameList';

  for(const game of games) {
    // container
    const gameListing = document.createElement('div');
    gameList.appendChild(gameListing);
    gameListing.id = game.id;
    gameListing.classList.add('gameListing');

    // name
    const nameLabel = document.createElement('p');
    gameListing.appendChild(nameLabel);
    nameLabel.textContent = game.name;

    // player number
    const playerNumber = document.createElement('p');
    gameListing.appendChild(playerNumber);
    playerNumber.textContent = `${game.playerCount}/2`;

    // buttons
    const buttonContainer = document.createElement('div');
    gameListing.appendChild(buttonContainer);
    // join button
    const joinButton = document.createElement('button');
    buttonContainer.appendChild(joinButton);
    joinButton.classList.add('button');
    joinButton.textContent = 'Join';
    joinButton.onclick = joinGame;
  }
}

async function getGames() {
  const response = await fetch('/api/games');
  if(response.ok) {
    return await response.json();
  } else {
    console.error("failed to get game");
  }
}

// make put request
// obtain socket, gameID
// load gameboard
async function joinGame(ev) {
  console.log("joining game...");

  const gameID = ev.target.parentElement.parentElement.id;
  await game_addPlayer(gameID);
  const game = await getGame();

  // get game socket using game id
  gameSocket = io("/" + game.id);
  gameSocket.on('message', gameSocket_message);
  gameSocket.on('phase', gameSocket_phase);

  // load gameboard
  clearContent();
  await createGameBoard();

  // make request to server to start game
  await startGame();
}

// put request to join game
async function game_addPlayer(gameID) {
  let url = '/api/game_join';
  url += `?id=${gameID}`;

  const response = await fetch(url, {method: 'put'});
  if(response.ok) {
    console.log("joined game");
  } else {
    console.error("failed to add player to game");
  }
}

window.addEventListener("load", boot);
