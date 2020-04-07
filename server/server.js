'use strict'

// npm modules
const express = require('express');
const app = express();
const throttle = require("express-throttle");
// our modules
const db = require('./modelSQL.js');
const auth = require('./auth-server.js');
const toxySetup = require('./toxySetup');

const port = 80;

const server = app.listen(port);
app.use('/', express.static('client', {'extensions': ['html']}));

const io = require('socket.io')(server);

// http verbs
app.get('/api/game', getGame);
app.get('/api/games', throttle({ "rate": "50/s" }), getGames);
app.post('/api/game', postGame);
app.put('/api/game', updateGame);
// auth
app.post('/api/login', auth.login);

db.init();

// gets a specific game with game cookie
async function getGame(req, res) {
  const gameID = req.query.gameID;
  const clientCookie = req.query.cookie;

  // get game from server memory
  let responseGame;
  for(let game of games) {
    if(gameID == game.gameID) {
      responseGame = game;
      break;
    }
  }

  // add joining client cookie to game data as player 2
  responseGame.playerData[1].id = clientCookie;

  console.log(`Player ${auth.getClient('cookie', clientCookie).username} just joined a game!`);

  if(responseGame) {
    res.json(responseGame);
  } else {
    res.sendStatus(404);
  }
}

// returns all sessions
async function getGames(req, res) {
  res.json(games);
}

// adds a new session to sessions json
async function postGame(req, res) {
  try {
    const hostCookie = req.query.hostCookie;
    const name = req.query.name;

    // create gameID
    const gameID = auth.generateCookie();

    // create a socket for this game
    // namespace is gameID
    const namespace = io.of(gameID);
    sockets.push(namespace);

    // create game json
    const game = {
      'name': name,
      'gameID': gameID,
      'playerData': [
        {'id': hostCookie, 'x': 50, 'y': 50}, // host is player one
        {'id': null, 'x': 250, 'y': 100}
      ]
    };


    console.log(`Player ${auth.getClient('cookie', hostCookie).username} just created a game!`);

    games.push(game);
    res.json(game);
  } catch(e) {
    console.error(e);
    res.sendStatus(404);
  }
}

// updates game data
async function updateGame(req, res) {
  const gameData = JSON.parse(req.query.gameData);

  try {
    // get game from server memory
    let gameFound;
    for(let game of games) {
      if(gameData.gameID == game.gameID) {
        // update game player data
        game.playerData = gameData.playerData;
        gameFound = game;
        break;
      }
    }

    // find associated socket based on gameID
    getSocket(gameFound.gameID).emit('message', gameFound);

    res.sendStatus(200);
  } catch(e) {
    console.error(e);
    res.sendStatus(404);
  }
}

function getSocket(gameID) {
  for(let socket of sockets) {
    if(socket.name.slice(1) == gameID) {
      return socket;
    }
  }
}

// in memory data
let games = [];
let sockets = [];

console.log('Server listening on port:', port);
