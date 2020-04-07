'use strict';

const fs = require('fs');
const util = require('util');
const config = require('./config');
const mysql = require('mysql2/promise');

let sql;

/**
* initialise the database, done on server startup
*/
async function init() {
  sql = await mysql.createConnection(config.mysql);
}

async function getUser(username, password) {
  let query = `SELECT * FROM Users WHERE Username = "${username}" AND Password = "${password}" ;`;
  query = sql.format(query);
  const rows = await sql.query(query);
  return rows[0][0];
}

module.exports = {
  init: init,
  getUser: getUser
}
