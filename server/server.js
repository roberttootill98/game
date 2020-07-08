'use strict'

// npm modules
const express = require('express');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
// our modules
const card = require('./cards.js');
require('./auth.js');

const config = require('./config');

const port = config.network.port;
const server = app.listen(port);
app.use('/', express.static('client', {'extensions': ['html']}));

// session stuff - player specific
// cookie session
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }
));

// game listings
const games = [];
// create socket
const io = require('socket.io')(server);
const gameSockets = [];

// gets socket using gameID
// a game socket can only be associated with one game
function getGameSocket(gameID) {
  for(let socket of gameSockets) {
    if(socket.name.slice(1) == gameID) {
      return socket;
    }
  }
}

// returns a unique game id that is not in use
// used as namespace for sockets
function generate_gameID() {
  function rngNumberGen() {
    return (Math.floor(Math.random() * 1000000000));
  }

  let id = rngNumberGen();

  // while game can be found with id generated
  while(getGame_id(id)) {
    console.log("generating new key...");
    id = rngNumberGen();
  }
  return id;
}

// gets game using id
function getGame_id(id) {
  for(const game of games) {
    if(game.id == id) {
      return game;
    }
  }
}

// gets game using player id
// a player can only be associated with one game at a time
function getGame_playerID(playerID) {
  for(const game of games) {
    for(const player of game.players) {
      if(player == playerID) {
        return game;
      }
    }
  }
}

app.get('/api/game', getGame);
app.get('/api/games', getGames);
app.post('/api/game', postGame);
app.put('/api/game_join', joinGame);

async function getGame(req, res) {
  res.json(getGame_id(req.query.id));
}

async function getGames(req, res) {
  res.json(games);
}

async function postGame(req, res) {
  try {
    const name = req.query.name;

    // generate gameID
    const gameID = generate_gameID()
    // create socket
    const gameSocket = io.of(gameID);
    gameSockets.push(gameSocket);

    const game = {
      'id': gameID,
      'name': name,
      'players': [],
      'spectators': []
    }

    // add player id of player who is creating game
    game.players.push(req.session.passport.user.id)
    games.push(game);

    res.json(game);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
}

// adds a player to an existing game
async function joinGame(req, res) {
  const game = getGame_id(req.query.id);

  if(game.players.length == 2) {
    console.log("game full...");
    res.sendStatus(404);
  } else {
    game.players.push(req.session.passport.user.id);
    res.json(game);
  }
}

// gameboard functions
app.get('/api/companions', getCompanions);

async function getCompanions(req, res) {

}

// 0auth 2.0
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/user_name', get_user_name);

async function get_user_name(req, res) {
  if(req.session.auth) {
    res.send(req.session.passport.user.displayName);
  } else {
    res.send(null);
  }
}

app.get('/google',
  passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/google/callback',
  passport.authenticate('google', {failureRedirect: '/failed'}),
  function(req, res) {
    // Successful authentication, redirect home.

    // validate session
    req.session.auth = true;

    // store user profile
    console.log(`User: ${req.user.displayName} authenticated`);

    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
  res.end();
});

app.get('/failed', (req, res) => res.send('You failed to login'));

console.log('Server listening on port:', port);

// debug
app.get('/debug/sendsocketmessage', sendsocketmessage);

// sends message down game socket
// in req.query.message
async function sendsocketmessage(req, res) {
  // get game using player id
  const game = getGame_playerID(req.session.passport.user.id);

  // get socket using game id
  const gameSocket = getGameSocket(game.id);
  gameSocket.emit('message', req.query.message);
}
