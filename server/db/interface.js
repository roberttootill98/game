// database interfacing functions for the server
'use strict';

const fs = require('fs');
const util = require('util');
const config = require('../config');
const mysql = require('mysql2/promise');
exports.mysql = mysql;
// our modules
exports.loadout = require('./loadout.js');

/**
 * initialise the database, done on server startup
 */
async function getConnection() {
  return await mysql.createConnection(config.mysql);
}
exports.getConnection = getConnection;

/**
 * queries user table for user with id passed
 * @param {integer} id, goog id of the user
 * @returns {record} single record or empty set
 */
exports.getUser = async function(id) {
  return await ((await getConnection()).execute(
    'SELECT * FROM Users WHERE ID = ?', [id], (err, rows, fields) => {
      return rows;
    }
  ));
}

exports.addUser = async function(id) {

}

/**
 * gets a companion using id
 * @param {integer} id, of companion
 */
exports.getCompanion = async function(id) {
  return await ((await getConnection()).execute(
    'SELECT * FROM Companions WHERE ID = ?', [id], (err, rows, fields) => {
      return rows;
    }
  ));
}
