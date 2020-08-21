// class definition for players that associated with games
'use strict';

// our modules
const companion = require('./companion.js');

exports.Player = class Player {
  /**
   * creates a new player
   * @constructor
   * @param {integer} id, goog id of player
   * @param {<integer>} loadout, list of companion ids
   */
  constructor(id) {
    this.id = id;
    this.ready = false;
    // this.companions = [];
    // for(companion_id of loadout) {
    //   this.companions.push(new companion.Companion(companion_id));
    // }
  }
}
