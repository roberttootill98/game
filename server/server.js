'use strict'

// npm modules
const express = require('express');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
// our modules
require('./auth.js');
const _game = require('./game/game.js');
_game.utility = require('./game/game_utility.js');
const card = require('./game/cards.js');

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

// socket
const io = require('socket.io')(server);
const sockets = [];
exports.sockets = sockets;

// game listings
app.get('/api/game', getGame);
app.get('/api/games', getGames);
app.post('/api/game', postGame);
app.put('/api/game_join', joinGame);

// gets game using player id
async function getGame(req, res) {
  const game = _game.utility.search_playerID(req.session.passport.user.id);
  res.json(game.info());
}

// gets all games
async function getGames(req, res) {
  const games = [];
  for(const game of _game.games) {
    games.push(game.info());
  }
  res.json(games);
}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

async function postGame(req, res) {
  try {
    const name = req.query.name;
    const game = new _game.Game(name, req.session.passport.user.id);

    // create socket
    const socket = io.of(game.id);
    sockets.push(socket);

    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
}

// adds a player to an existing game
async function joinGame(req, res) {
  const game = _game.utility.search_gameID(req.query.id);

  if(game.addPlayer(req.session.passport.user.id)) {
    // join socket game room
    //io.socket
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
}

// init gameboard functions
app.get('/api/companions', getCompanions);

async function getCompanions(req, res) {

}

// turn gameboard functions
app.get('/api/game_getPlayerNumber', game_getPlayerNumber);
app.put('/api/game_start', startGame);
app.get('/api/game_getPhase', game_getPhase);
app.put('/api/game_nextPhase', game_nextPhase);

// returns player1 or player2
async function game_getPlayerNumber(req, res) {
  const game = _game.utility.search_playerID(req.session.passport.user.id);
  res.json({'playerNumber': `player${game.players.indexOf(req.session.passport.user.id) + 1}`});
}

async function startGame(req, res) {
  try {
    const game = _game.utility.search_playerID(req.session.passport.user.id);

    _game.utility.getSocket(game.id).emit('message', 'game starting...');

    game.turn = 0;
    game.setPhase('player1_phase_shop');

    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
}

function game_getPhase(req, res) {
  const game = _game.utility.search_playerID(req.session.passport.user.id);
  res.json({'phase': game.phase});
}

async function game_nextPhase(req, res) {
  try {
    const game = _game.utility.search_playerID(req.session.passport.user.id);
    console.log("ending phase: " + game.phase);
    console.log("starting phase: " + _game.utility.getNextPhase(game.phase));
    game.setPhase(_game.utility.getNextPhase(game.phase));

    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
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
  const game = _game.utility.search_playerID(req.session.passport.user.id);
  console.log("sending message: " + req.query.message);
  console.log("down socket: " + game.socket.name);

  game.socket.emit('message', req.query.message);
}

async function gameSocket_updateReceived(ev) {
  console.log("game socket update received");
  console.log(ev);
}
