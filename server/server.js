'use strict'

// npm modules
const express = require('express');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
// our modules
const card = require('./cards.js');
require('./auth.js');

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

// game hosting and connecting
app.get('/api/games', getGames);
app.get('/api/game', getGame);
app.post('/api/game', postGame);
app.put('/api/game', updateGame);

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
  try {
    const gameID = req.query.gameID;

    // should use user cookie to valid that they are player of the game

    // get game from server memory
    //const game = findGame(gameID);
    // get socket
    const socket = getSocket(gameID);
    socket.emit('message', 'update message');

    res.sendStatus(200);
  } catch(e) {
    console.error(e);
    res.sendStatus(404);
  }
}

function findGame(gameID) {
  // find game
  for(let game of games) {
    if(game.id == gameID) {
      return game;
    }
  }
}

function getSocket(gameID) {
  for(let socket of sockets) {
    if(socket.name.slice(1) == gameID) {
      return socket;
    }
  }
}

// player specific
app.get('/api/companions', getCompanions);

async function getCompanions(req, res) {
  const playerID = req.query.cookie;
}

// cookie session
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }
));

// 0auth 2.0
let user;

app.use(passport.initialize());
app.use(passport.session());

const isloggedIn = (req, res, next) => {
  if(req.user) {
    next()
  } else {
    res.sendStatus(401);
  }
}

app.get('/google',
  passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/google/callback',
  passport.authenticate('google', {failureRedirect: '/failed'}),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(`User: ${req.user.displayName} authenticated`);
    user = req.user;

    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

app.get('/failed', (req, res) => res.send('You failed to login'));

console.log('Server listening on port:', port);
