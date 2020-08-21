// defines game class
// game is used to represent game state
// player moves are validated in reference to game state

'use strict'

// modules
const server = require('../server.js');
const io = require('socket.io')(server);

const games = [];
exports.games = games;

const sockets = [];
exports.sockets = sockets;

const phaseOrder = [
  'player1_phase_shop',
  'player1_phase_arrangement',
  'player1_phase_attacking',
  'player2_phase_shop',
  'player2_phase_arrangement',
  'player2_phase_attacking'
];

exports.Game = class Game {
  /**
   * creates a game
   * represents current game state
   * client actions are validated in reference to this game state
   * @constructor
   * @param {string} name, of the game
   * @param {integer} creatorID, goog id of the game creator
   */
  constructor(name, creatorID) {
    // properties
    this.id = Game.generate_gameID();
    this.name = name;
    this.spectators = [];

    // players - array of jsons, max length 2
    this.players = []
    this.players.push({
      'id': creatorID,
      // retrieve ids from joiner table
      // then instantiate companion objects
      'companions': ''
    });

    games.push(this);
  }

  /**
   * generates a unique id for a game
   * @returns {integer} newly generated id
   */
  static generate_gameID() {
    function rngNumberGen() {
      return (Math.floor(Math.random() * 1000000000));
    }

    let id = rngNumberGen();
    // while game can be found with id generated
    while(Game.getByGameID(id)) {
      console.log("generating new key...");
      id = rngNumberGen();
    }
    return id;
  }

  /**
   * gets game using game id
   * @param {integer} id, of the game
   */
  static getByGameID(id) {
    for(const game of games) {
      if(game.id == id) {
        return game;
      }
    }
  }

  /**
   * gets game using a player id
   * a player can only be associated with one game at once
   * there may be multiple players associated with one game
   * @param {integer} id, of the player
   */
  static getByPlayerID(id) {
    for(const game of games) {
      for(const player of game.players) {
        if(player.id == id) {
          return game;
        }
      }
    }
  }

  /**
   * gets player number
   * @param {integer} id, goog id of player
   * @returns {integer} 1 or 2
   */
  getPlayerNumber(id) {
    for(const [i, player] of this.players.entries()) {
      if(player.id == id) {
        return i + 1;
      }
    }
  }

  /**
   * gets game socket using game id
   * @getter
   * @returns {socket} socket associated with game
   */
  get socket() {
    for(const socket of server.sockets) {
      if(socket.name.slice(1) == this.id) {
        return socket;
      }
    }
  }

  /**
   * gets next phase according to phase order
   * @getter
   * @returns {string} next phase
   */
  get nextPhase() {
    let nextPhaseIndex = phaseOrder.indexOf(this.phase) + 1;
    if(nextPhaseIndex == phaseOrder.length) {
      nextPhaseIndex = 0;
    }
    return phaseOrder[nextPhaseIndex];
  }

  /**
   * sets phase and emits socket message
   * @setter
   * @param {string} phase, the phase which is being set, must be from phaseOrder
   */
  setPhase(phase) {
    console.log("setting phase to: " + phase);
    this.phase = phase;
    this.socket.emit('phase', phase);
  }

  /**
   * @getter
   * @returns {integer} number of players in the game
   */
  get playerCount() {
    return this.players.length;
  }

  /**
   * adds a player to game using goog id
   * @param {integer} id, goog id of player to be added
   * @returns {boolean} true if successful
   */
  addPlayer(id) {
    if(this.playerCount < 2) {
      // check user is not in this game...
      if(this.players[0].id != id) {
        this.players.push({
          'id': id,
          // retrieve ids from joiner table
          // then instantiate companion objects
          'companions': ''
        });
        return true;
      }
    }
  }

  /**
   * adds a spectator to a game using goog id
   * @param {integer} id, goog id of spectator
   */
  addSpectator(id) {
    this.spectators.push(id);
  }

  /**
   * gets info about game that is available to users
   * @getter
   * @returns {json} of info
   */
  get info() {
    return {
      'id': this.id,
      'name': this.name,
      'playerCount': this.playerCount
    };
  }
};
