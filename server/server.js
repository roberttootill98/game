'use strict'

// npm modules
const express = require('express');
const app = express();
// our modules
const card = require('./cards.js');

const port = 80;

const server = app.listen(port);
app.use('/', express.static('client', {'extensions': ['html']}));
// create socket
const io = require('socket.io')(server);

let games = [
  {
    'id': 0,
    'playerCount': 1
  }
];

let sockets = [];

// http verbs
app.get('/api/games', getGames);
app.get('/api/game', getGame);
app.post('/api/game', postGame);

async function getGames(req, res) {
  res.json(games);
}

async function getGame(req, res) {
  const gameID = req.query.gameID;

  res.json(findGame(gameID));
}

async function postGame(req, res) {
  const gameID = games.length; // therefore next id, enumerate

  // create a socket for this game
  // namespace is gameID
  const namespace = io.of(gameID);
  sockets.push(namespace);

  const game = {
    'id': gameID,
    'playerCount': 1 // always one at start
  }

  console.log("Game created"); // should include player info

  games.push(game);
  res.json(game);
}

// emits socket.io message done socket for gameID on query
async function updateGame(req, res) {
  const gameID = req.query.gameID;

  // should use user cookie to valid that they are player of the game

  // get game from server memory
  const game = findGame(gameID);

}

function findGame(gameID) {
  // find game
  for(let game of games) {
    if(game.id == gameID) {
      return game;
    }
  }
}

console.log('Server listening on port:', port);
