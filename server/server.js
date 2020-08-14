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
const card = require('./game/card.js');

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

// GAME LISTING FUNCTIONS

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// gets game using player id
app.get('/api/game', (req, res) => {
  const game = _game.utility.search_playerID(req.session.passport.user.id);
  res.json(game.info());
});

// gets all games
app.get('/api/games', (req, res) => {
  const games = [];
  for(const game of _game.games) {
    games.push(game.info());
  }
  res.json(games);
});

app.post('/api/game', (req, res) => {
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
});

// adds a player to an existing game
app.put('/api/game_join', (req, res) => {
  const game = _game.utility.search_gameID(req.query.id);

  if(game.addPlayer(req.session.passport.user.id)) {
    // join socket game room
    //io.socket
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// GAMEBOARD FUNCTIONS

// init gameboard functions

// get companions associated with account
app.get('/api/companions', (req, res) => {

});

// TURN FUNCTIONS

// returns player1 or player2
app.get('/api/game/player/number', (req, res) => {
  const game = _game.utility.search_playerID(req.session.passport.user.id);
  res.json({'playerNumber': `player${game.players.indexOf(req.session.passport.user.id) + 1}`});
});

app.put('/api/game/start', (req, res) => {
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
});

app.get('/api/game/phase', (req, res) => {
  const game = _game.utility.search_playerID(req.session.passport.user.id);
  res.json({'phase': game.phase});
});

app.put('/api/game/phase/next', (req, res) => {
  try {
    const game = _game.utility.search_playerID(req.session.passport.user.id);
    game.setPhase(_game.utility.getNextPhase(game.phase));

    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
});

// gets a single card using name
app.get('/api/game/card', (req, res) => {
  // find card
  res.json(card.getCard_name(req.query.name));
});

// SHOPPING PHASE

// gets 3 cards for shop
app.get('/api/game/shop/cards', (req, res) => {
  // decide which cards will be selected
  // for now first three
  const cards = card.getCards();
  // associate cards with game

  res.json(cards.slice(0, 3));
});

// ATTACKING PHASE

// get current attacking companion
app.get('/api/game/attacking/companion', (req, res) => {
  res.json({'index': 0});
});

// 0auth 2.0
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/user/name', (req, res) => {
  if(req.session.auth) {
    res.send(req.session.passport.user.displayName);
  } else {
    res.send(null);
  }
});

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
