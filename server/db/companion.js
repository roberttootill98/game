// queries specifically todo with getting companions
'use strict';

const db = require('./interface.js');

/**
 * gets companion using companion id
 * @param {integer} companion_id
 * @returns {<record>} result of query
 */
async function getByID(companion_id) {
  const result = await ((await db.getConnection()).query(db.mysql.format(
    'SELECT * FROM Companions WHERE ID = ?', [companion_id])));
  return result[0][0];
}
exports.getByID = getByID;

/**
 * checks if the passed companion ids have associated records
 * @param {<integer>} ids, of companions
 * @returns {boolean} only true if all ids are valid
 */
exports.checkCompanions = async function(ids) {
  for(const id of ids) {
    if(!(await getByID(id))) {
      return false;
    }
  }
  return true;
}
