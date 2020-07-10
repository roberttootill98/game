// utility functions todo with game class
// eg. search for a game using given criteria

'use strict'

// modules
const server = require('../server.js');
const _game = require('./game');

// search funcs - searchs for a game using a particular field
// defined as search_fieldName
function search_gameID(id) {
  for(const game of _game.games) {
    if(game.id == id) {
      return game;
    }
  }
}
exports.search_gameID = search_gameID;
// a player can only be associated with one game at once
// there may be multiple players associated with one game
exports.search_playerID = function search_playerID(id) {
  for(const game of _game.games) {
    for(const player of game.players) {
      if(player == id) {
        return game;
      }
    }
  }
}

exports.generate_gameID = function () {
  function rngNumberGen() {
    return (Math.floor(Math.random() * 1000000000));
  }

  let id = rngNumberGen();
  // while game can be found with id generated
  while(search_gameID(id)) {
    console.log("generating new key...");
    id = rngNumberGen();
  }
  return id;
}

const phaseOrder = [
  'player1_phase_shop',
  'player1_phase_arrangement',
  'player1_phase_attacking',
  'player2_phase_shop',
  'player2_phase_arrangement',
  'player2_phase_attacking'
];

exports.getNextPhase = function (oldPhase) {
  let nextPhaseIndex = phaseOrder.indexOf(oldPhase) + 1;
  if(nextPhaseIndex == phaseOrder.length) {
    nextPhaseIndex = 0;
  }
  return phaseOrder[nextPhaseIndex];
}

// searches for game socket using game id
exports.getSocket = function (gameID) {
  for(const socket of server.sockets) {
    if(socket.name.slice(1) == gameID) {
      return socket;
    }
  }
}
