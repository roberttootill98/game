// defines game class

'use strict'

// modules
const server = require('../server.js');
const io = require('socket.io')(server);
const utility = require('./game_utility');

const games = [];
exports.games = games;

const sockets = [];
exports.sockets = sockets;

exports.Game = class Game {
  constructor(name, creatorID) {
    // properties
    this.id = utility.generate_gameID();
    this.name = name;
    this.players = [creatorID]; // list of goog ids
    this.spectators = [];
    this.socket = io.of(this.id);
    sockets.push(this.socket);

    games.push(this);
  }

  // getters
  get playerCount() {
    return this.players.length;
  }
  // setters
  // sets phase and emits socket message
  setPhase(phase) {
    console.log("setting phase to: " + phase);
    this.phase = phase;
    this.socket.emit('phase', phase);
    io.of(this.id).emit('message', 'bruh');
  }

  // methods
  // adds a player to game using goog id
  // returns false if there are already two players
  addPlayer(id) {
    if(this.playerCount < 2) {
      // check user is not in this game...

      this.players.push(id);
      return true;
    } else {
      return false;
    }
  }

  // adds a spectator to a game using goog id
  addSpectator(id) {
    this.spectators.push(id);
  }

  // returns info about game that can is available to users
  // in json form
  info() {
    return {
      'id': this.id,
      'name': this.name,
      'playerCount': this.playerCount
    };
  }
};
