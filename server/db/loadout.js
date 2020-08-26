// queries specifically todo with getting loadouts
'use strict';

const db = require('./interface.js');

/**
 * gets loadout using loadout id
 * @param {integer} loadout_id
 * @returns {record} result of query
 */
async function getByID(loadout_id) {
  const result = await ((await db.getConnection()).query(db.mysql.format(
    'SELECT * FROM Loadouts WHERE ID = ?', [loadout_id])));
  return result[0][0];
}
exports.getByID = getByID;

/**
 * gets loadouts by user id
 * @param {integer} user_id, goog id
 * @returns {record} result of query
 */
exports.getByUserID = async function(user_id) {
  const result = await ((await db.getConnection()).query(db.mysql.format(
    'SELECT * FROM Loadouts WHERE User_ID = ?', [user_id])));
  return result[0];
}

/**
 * queries for loadout with given user id and name
 * @param {integer} user_id, of loadout
 * @param {string} name, of loadout
 * @returns {record} result of query
 */
async function getByUserID_AND_name(user_id, name) {
  let result = await ((await db.getConnection()).execute(
    'SELECT * FROM Loadouts WHERE User_ID = ? AND NAME = ?', [user_id, name],
  ));
  return result[0][0];
}

/**
 * adds a new record to Loadouts
 * adds 4 records to Loadouts_Companions
 * @param {integer} user_id, goog id of user that is adding a new loadout
 * @param {string} name, of loadout
 * @param {[integer]} companion_ids, list of companion ids
 * @returns {status}
 */
exports.add = async function(user_id, name, companion_ids) {
  // check there isnt already a loadout for this user with this name
  // check that each companion id is valid before adding to loadout
  if(await getByUserID_AND_name(user_id, name) ||
    !(await db.companion.checkCompanions(companion_ids))) {
    return 400;
  }

  // add new record to loadouts
  await (await db.getConnection()).query(db.mysql.format(
    'INSERT INTO Loadouts(User_ID, Name) VALUES(?)', [[user_id, name]]));
  // retrieve new loadout using User_ID and Name to get ID
  let loadout_id = await ((await db.getConnection()).execute(
    'SELECT * FROM Loadouts WHERE User_ID = ? AND Name = ?', [user_id, name],
    (err, rows, fields) => {
      // only expecting one record so we can index into it
      // BUG indexing doesnt seem to work here
      return rows;
    }
  ));
  // HACK
  loadout_id = loadout_id[0][0].ID;

  // add 4 records to Loadouts_Companions
  for(const companion_id of companion_ids) {
    // add new records
    await (await db.getConnection()).query(db.mysql.format(
      'INSERT INTO Loadouts_Companions(Loadout_ID, Companion_ID) VALUES(?)',
      [[loadout_id, companion_id]]));
  }

  // successfully created records
  return 201;
}

/**
 * updates loadout
 * must update associated companions if changed
 * no matter how a loadout is changed it is still owned by the same user
 * @param {integer} user_id, to check that the user has permission to update this record
 * @param {integer} loadout_id, goog id of user that is adding a new loadout
 * @param {string} name, of loadout
 * @param {[integer]} companion_ids, list of companion ids
 * @returns {status}
 */
exports.update = async function(user_id, loadout_id, name, companion_ids) {
  // check that this user has permission to update this record
  const loadout = await getByID(loadout_id);
  if(loadout.User_ID == user_id) {
    // check if already have loadout with this name associated with this user
    // check if companions are valid
    if(await getByUserID_AND_name(user_id, name) ||
      !(await db.companion.checkCompanions(companion_ids))) {
      return 400;
    }

    // update loadout
    await ((await db.getConnection()).query(db.mysql.format(
      'UPDATE Loadouts SET Name = ? WHERE ID = ?',
      [[name], loadout_id])));

    // update associated records
    // delete old associated records
    await ((await db.getConnection()).query(db.mysql.format(
      'DELETE FROM Loadouts_Companions WHERE Loadout_ID = ?', [loadout_id])));
    for(const companion_id of companion_ids) {
      // create new records
      await ((await db.getConnection()).query(db.mysql.format(
        'INSERT INTO Loadouts_Companions(Loadout_ID, Companion_ID) VALUES(?)',
        [[loadout_id, companion_id]])));
    }

    // successfully updated records
    return 200;
  } else {
    return 403;
  }
}

/**
 * deletes a loadout using loadout id
 * @param {integer} user_id, to check that the user has permission to update this record
 * @param {integer} loadout_id, of record to be deleted
 * @returns {status}
 */
exports.delete = async function(user_id, loadout_id) {
  // check that this user has permission to delete this record
  const loadout = await getByID(loadout_id);
  if(loadout.User_ID == user_id) {
    // delete associated records
    await ((await db.getConnection()).query(db.mysql.format(
      'DELETE FROM Loadouts_Companions WHERE Loadout_ID = ?', [loadout_id])));

    // delete record
    await ((await db.getConnection()).query(db.mysql.format(
      'DELETE FROM Loadouts WHERE ID = ?', [loadout_id])));

    // successfully deleted record
    return 200;
  } else {
    return 403;
  }
}
