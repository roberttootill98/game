'use strict'

// npm modules
const express = require('express');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');

// our modules
require('./auth.js');
// database
const db = require('./db/interface.js');
// game modules
const mod_game = require('./game/game.js');
const card = require('./game/card.js');
// config
const config = require('./config');

// network
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

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// LOADOUT FUNCTIONS

// gets a users loadout using goog id
// no loadout id => get current loadout
// provide loadout id => get that loadout
app.get('/api/loadout', async (req, res) => {
  const loadout = await db.loadout.getLoadout(req.session.passport.user.id);
  res.json(loadout);
});

// gets all of users loadouts using goog id
app.get('/api/loadouts', async (req, res) => {
  res.json(await db.loadout.getLoadouts(req.session.passport.user.id));
});

// update a loadout
app.put('/api/loadout', (req, res) => {

});

// create a new loadout
app.post('/api/loadout', async (req, res) => {
  // try {
  await (db.loadout.addLoadout(req.session.passport.user.id, req.query.name,
    req.query.companions.split(',')));

  res.sendStatus(200);
  // } catch(e) {
  //   res.sendStatus(500);
  // }
});

// delete a loadout
// no loadout id => delete current loadout
// provide loadout id => delete that loadout
app.delete('/api/loadout', async (req, res) => {

});

// GAME LISTING FUNCTIONS

// gets game using player id
app.get('/api/game', (req, res) => {
  const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
  res.json(game.info);
});

// gets all games
app.get('/api/games', (req, res) => {
  const games = [];
  for(const game of mod_game.games) {
    games.push(game.info);
  }
  res.json(games);
});

app.post('/api/game', (req, res) => {
  try {
    const game = new mod_game.Game(req.query.name, req.session.passport.user.id);

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
app.put('/api/game/join', (req, res) => {
  const game = mod_game.Game.getByGameID(req.query.id);

  if(game.addPlayer(req.session.passport.user.id)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// GAMEBOARD FUNCTIONS

// init gameboard functions

// get companion by id
app.get('/api/companion', async (req, res) => {
  const result = await db.getCompanion(req.query.id);
  console.log(result);
  res.json(result);
});

// TURN FUNCTIONS

// returns player1 or player2
app.get('/api/game/player/number', (req, res) => {
  const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
  res.json({'playerNumber':
    `player${game.getPlayerNumber(req.session.passport.user.id)}`});
});

app.put('/api/game/start', (req, res) => {
  try {
    const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);

    game.socket.emit('message', 'game starting...');

    game.turn = 0;
    game.setPhase('player1_phase_shop');

    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
});

app.get('/api/game/phase', (req, res) => {
  const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
  res.json({'phase': game.phase});
});

app.put('/api/game/phase/next', (req, res) => {
  try {
    const game = mod_game.Game.getByPlayerID(req.session.passport.user.id);
    game.setPhase(game.nextPhase);

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
  //async function(req, res) {
  function(req, res) {
    req.session.auth = true;

    // store user profile
    // check for record in database using goog id
    // const results = await db.getUser(req.session.passport.user.id);
    // console.log(results);
    // if(!db.getUser(req.session.passport.user.id)) {
    //   // if no record found then add new record
    //   db.addUser(req.session.passport.user.id);
    // }


    // Successful authentication, redirect home.
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
