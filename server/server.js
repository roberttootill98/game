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

// create socket
const io = require('socket.io')(server);

// game hosting and connecting


// session stuff - player specific
// cookie session
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }
));

// game listings
const games = [];

app.get('/api/game', getGame);
app.get('/api/games', getGames);
app.post('/api/game', postGame);

async function getGame(req, res) {
  res.json(games[req.query.id]);
}

async function getGames(req, res) {
  res.json(games);
}

async function postGame(req, res) {
  try {
    const name = req.query.name;

    const game = {
      'name': name,
      'players': [],
      'spectators': []
    }

    // add player id of player who is creating game
    game.players.push(req.session.passport.user.id)
    games.push(game);

    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
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
