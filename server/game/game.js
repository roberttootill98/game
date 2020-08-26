// defines game class
// game is used to represent game state
// player moves are validated in reference to game state

'use strict'

// modules
const server = require('../server.js');
const io = require('socket.io')(server);
// our modules
const mod_player = require('./player.js');

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
    this.players = Array(2);
    this.addPlayer(creatorID);

    this.phase = 'lobby';

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
   * starts the game
   * at least two players must be present
   */
  start() {
    this.turn = 0;
    this.setPhase('player1_phase_shop');
  }

  /**
   * sets phase and emits socket message
   * @setter
   * @param {string} phase, the phase which is being set, must be from phaseOrder
   */
  setPhase(phase) {
    if(this.phase == phase) {
      return;
    }
    console.log("setting phase to: " + phase);
    this.phase = phase;
    this.socket.emit('phase', phase);
  }

  /**
   * @getter
   * @returns {integer} number of players in the game
   */
  get playerCount() {
    let length = 0;
    for(const player of this.players) {
      if(player) {
        length++;
      }
    }
    return length;
  }

  /**
   * @getter
   * @returns {integer} number of spectator of the game
   */
  get spectatorCount() {
    return this.spectators.length;
  }

  /**
   * adds a player to game using goog id
   * @param {integer} id, goog id of player to be added
   * @returns {boolean} true if successful
   */
  addPlayer(id) {
    if(this.playerCount < 2) {
      // check user is not in this game...
      for(const player of this.players) {
        if(player && player.id == id) {
          return false;
        }
      }

      for(const [i, player] of this.players.entries()) {
        if(!player) {
          this.players[i] = new mod_player.Player(id);
          return true;
        }
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
   * gets info about game that is safe for users
   * @returns {json} of info
   */
  async retrieveInfo() {
    const players = [];
    for(const player of this.players) {
      if(player) {
        players.push(await player.retrieveInfo());
      }
    }

    return {
      'id': this.id,
      'name': this.name,
      'playerCount': this.playerCount,
      'players': players,
      'spectatorCount': this.spectatorCount,
    };
  }
};
