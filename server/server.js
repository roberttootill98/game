'use strict'

// npm modules
const express = require('express');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');

// our modules
// database
const db = require('./db/interface.js');
// game modules
const mod_game = require('./game/game.js');
const card = require('./game/card.js');
// config
const config = require('./config');
// modules we need locally
require('./auth.js');

// network
const server = app.listen(config.network.port);
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

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// LOADOUT FUNCTIONS

/**
 * gets all loadouts associated with a user
 * uses goog id
 * @response {<json>} of loadouts
 */
app.get('/api/loadouts', async (req, res) => {
  console.log(req.session);
  res.json(await db.loadout.getByUserID(req.session.passport.user.id));
});

/**
 * gets a users loadout using loadout id
 * @query_param {integer} id, of loadout
 * @response {json} of loadouts
 */
app.get('/api/loadout', async (req, res) => {
  try {
    const result = await db.loadout.getByID(req.query.id);
    if(result) {
      res.json(result);
    } else {
      throw 'Record not found';
    }
  } catch(e) {
    res.sendStatus(404);
  }
});

/**
 * creates a new loadout
 * @query_param {string} name, of new loadout
 * @query_param {<integer>} companion_ids, list of companion ids for new loadout
 * @response {status}
 */
app.post('/api/loadout', async (req, res) => {
  try {
    const result = await db.loadout.add(req.session.passport.user.id,
      req.query.name, req.query.companion_ids.split(','));
    res.sendStatus(result);
  } catch(e) {
    res.sendStatus(400);
  }
});

/**
 * update a loadout
 * @query_param {integer} id, of loadout
 * @query_param {string} name, of loadout
 * @query_param {<integer>} companion_ids, list of companion ids for loadout
 * @response {status}
 */
app.put('/api/loadout', async (req, res) => {
  try {
    const result = await db.loadout.update(req.session.passport.user.id,
      req.query.id, req.query.name, req.query.companion_ids.split(','));
    res.sendStatus(result);
  } catch(e) {
    res.sendStatus(500);
  }
});

/**
 * delete a loadout using loadout id
 * @query_param {integer} id, of loadout
 * @response {status}
 */
app.delete('/api/loadout', async (req, res) => {
  try {
    const result = await db.loadout.delete(req.session.passport.user.id,
      req.query.id);
    res.sendStatus(result);
  } catch(e) {
    res.sendStatus(500);
  }
});


// GAME LISTING FUNCTIONS

/**
 * gets game using player id
 * @response {json} of game information
 */
app.get('/api/game', async (req, res) => {
  const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
  res.json(await game.retrieveInfo());
});

/**
 * gets all games
 * @response {<json>} of game information
 */
app.get('/api/games', async (req, res) => {
  const games = [];
  for(const game of mod_game.games) {
    games.push(await game.retrieveInfo());
  }
  res.json(games);
});

/**
 * creates a new game
 * @query_param {string} name, of new game
 * @response {status}
 */
app.post('/api/game', async (req, res) => {
  try {
    const game = new mod_game.Game(req.query.name, req.session.passport.user.id);

    // create socket
    const socket = io.of(game.id);
    sockets.push(socket);

    res.sendStatus(204);
  } catch(e) {
    res.sendStatus(404);
  }
});

/**
 * adds a player to an existing game
 * @query_param {integer} id, of game that player is joining
 * @response {status}
 */
app.put('/api/game/join', async (req, res) => {
  const game = mod_game.Game.getByGameID(req.query.id);

  if(game.addPlayer(req.session.passport.user.id)) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

// LOBBY FUNCTIONS

/**
 * player announcing they are ready to start
 * sends socket message
 * @response {status}
 */
app.put('/api/lobby/ready', (req, res) => {
  const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
  const playerNumber = game.getPlayerNumber(req.session.passport.user.id);
  const player = game.players[playerNumber - 1];
  player.ready = true;

  // send socket message
  game.socket.emit('ready', playerNumber + '_ready');

  res.sendStatus(204);
});

/**
 * player announcing they are ready to start
 * sends socket message
 * @response {status}
 */
app.put('/api/lobby/unready', (req, res) => {
  const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
  const playerNumber = game.getPlayerNumber(req.session.passport.user.id);
  const player = game.players[playerNumber - 1];
  player.ready = false;

  // send socket message
  game.socket.emit('ready', playerNumber + '_unready');

  res.sendStatus(204);
});


// GAMEBOARD FUNCTIONS
/**
 * get companion by id
 * @query_param {integer} id, of companion
 * @response {json} of companion
 */
app.get('/api/companion', async (req, res) => {
  res.json(await db.companion.getByID(req.query.id));
});

// TURN FUNCTIONS

/**
 * starts the game associated with a player
 * @response {status}
 */
app.put('/api/game/start', (req, res) => {
  try {
    const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
    // check if the game can be started

    game.start();

    res.sendStatus(204);
  } catch(e) {
    res.sendStatus(404);
  }
});

/**
 * identifies if player is player1 or player2
 * @response {json} should be res.send
 */
app.get('/api/game/player/number', (req, res) => {
  const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
  res.json({'playerNumber':
    `player${game.getPlayerNumber(req.session.passport.user.id)}`});
});

/**
 * gets the current phase
 * @response {json} should be res.send
 */
app.get('/api/game/phase', (req, res) => {
  const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
  res.json({'phase': game.phase});
});

/**
 * moves the game to the next phase
 * @response {status}
 */
app.put('/api/game/phase/next', (req, res) => {
  try {
    const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
    game.setPhase(game.nextPhase);

    res.sendStatus(204);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
});

/**
 * gets a card's details using a given name
 * @query_param {string} name, of card
 * @response {json} card details
 */
app.get('/api/game/card', (req, res) => {
  // find card
  res.json(card.getByName(req.query.name));
});

// SHOPPING PHASE

/**
 * gets 3 cards for shop
 * generated pseudo-randomly
 * @response {<json>} containing 3 cards
 */
app.get('/api/game/shop/cards', (req, res) => {
  // decide which cards will be selected
  // for now first three
  const cards = card.getCards();
  // associate cards with game

  res.json(cards.slice(0, 3));
});

// ATTACKING PHASE

/**
 * gets current attacking companion
 * @response {json} should be res.send
 */
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
  //async function(req, res) {
  function(req, res) {
    req.session.auth = true;
    // Successful authentication, redirect home.
    console.log(`User: ${req.user.displayName} authenticated`);
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
  res.end();
});

app.get('/failed', (req, res) => res.send('You failed to login'));

/**
 * checks if the user has an authenticated session
 * @response {status}
 */
app.get('/api/authCheck', (req, res) => {
  if(req.session.auth) {
    res.sendStatus(204);
  } else {
    res.sendStatus(403);
  }
});

console.log('Server listening on:', config.network.domain + ':' +
  config.network.port);

// DEBUG

// logins into an account
// user id as query_param.id
app.get('/api/debug/login', async (req, res) => {
  req.session.auth = true;
  req.session.passport = {'user': {'id': req.query.id}};

  if(!(await db.getUser(req.query.id))) {
    db.addUser(req.query.id);
  }

  res.redirect('/');
  res.end();
});

app.get('/api/debug/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
  res.end();
});
