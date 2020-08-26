// class definition for players that associated with games
'use strict';

// our modules
const db = require('../db/interface.js');
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
  }

  /**
   * gets all of the players loadouts
   * @returns {<json>} jsons are loadouts
   */
  async retrieveLoadouts() {
    return await db.loadout.getByUserID(this.id);
  }

  /**
   * updates the players selected loadout
   * @param {integer} id, of loadout
   * @returns {boolean} true if successful
   */
  async setLoadout(id) {
    const loadout = await db.loadout.getByID(id);
    // check loadout exists
    // check user owns loadout before setting this
    if(loadout && loadout.User_ID == this.id) {
      this.loadout = loadout;
      return true;
    } else {
      return false;
    }
  }

  /**
   * gets info about player that is safe for users
   * @returns {json} of info
   */
  async retrieveInfo() {
    return {
      'ready': this.ready,
      'loadouts': await this.retrieveLoadouts()
    }
  }
}
