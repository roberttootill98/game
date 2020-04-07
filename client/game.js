'use strict'

// a two player game

let gameData = {
  playerData: [
    {
      'id': 0,
      'x': 0,
      'y': 0
    },
    {
      'id': 1,
      'x': 0,
      'y': 0
    }
  ]
};

async function createGame() {
  const name = document.getElementById('nameInput').value;

  document.querySelector('.modalWindow').remove();

  const canvas = createGameBoard();

  // post game
  gameData = await postGame(name, canvas);
  // set up socket
  socket = io("/" + gameData.gameID);
  socket.on('message', updateReceived);

  drawPlayerModels(canvas);

  console.log("Creating game: " + gameData.name);

  window.addEventListener("keypress", keyPress);
}

async function joinGame(ev) {
  document.querySelector('.modalWindow').remove();

  // extract info from elements
  const parent = ev.currentTarget;
  const name = parent.childNodes[0].textContent;
  const gameID = parent.id;

  console.log("Joining: " + name);

  // should get canvas from session
  const canvas = createGameBoard();

  // get gameData from server
  gameData = await getGameData(gameID);
  // set up socket
  socket = io("/" + gameData.gameID);
  socket.on('message', updateReceived);

  drawPlayerModels(canvas);

  window.addEventListener("keypress", keyPress);
}

function createGameBoard() {
  // create canvas
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.id = 'gameCanvas';
  canvas.setAttribute('width', 500);
  canvas.setAttribute('height', 200);
  return canvas;
}

// draws players models according to game data
function drawPlayerModels(canvas) {
  let colour = "#FF0000";

  for(let player of gameData.playerData) {
    // draw graphics
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(player.x, player.y, 40, 0, 2 * Math.PI);
    ctx.strokeStyle = colour;
    ctx.stroke();

    if(colour == "#FF0000") {
      colour = "#0000FF";
    }
  }
}

// inputs
const inputs = {
  "w": upP1,
  "d": rightP1,
  "s": downP1,
  "a": leftP1,
  "i": upP2,
  "l": rightP2,
  "k": downP2,
  "j": leftP2
}

async function keyPress(ev) {
  const key = ev['key'];
  const action = inputs[key];

  // should get based on cookie
  if(action) {
    action();

    // get players
    const player1 = gameData.playerData[0];
    const player2 = gameData.playerData[1];

    const canvas = document.getElementById('gameCanvas');

    // clear canvas
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    // draw items again

    // draw each player again
    drawPlayerModels(canvas);

    await updateGameData();
  }
}

function upP1() {
  const player1 = gameData.playerData[0];
  player1.y = player1.y - 5;
}

function rightP1() {
  const player1 = gameData.playerData[0];
  player1.x = player1.x + 5;
}

function downP1() {
  const player1 = gameData.playerData[0];
  player1.y = player1.y + 5;
}

function leftP1() {
  const player1 = gameData.playerData[0];
  player1.x = player1.x - 5;
}

function upP2() {
  const player2 = gameData.playerData[1];
  player2.y = player2.y - 5;
}

function rightP2() {
  const player2 = gameData.playerData[1];
  player2.x = player2.x + 5;
}

function downP2() {
  const player2 = gameData.playerData[1];
  player2.y = player2.y + 5;
}

function leftP2() {
  const player2 = gameData.playerData[1];
  player2.x = player2.x - 5;
}
