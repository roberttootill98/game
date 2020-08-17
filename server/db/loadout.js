// queries specifically todo with getting loadouts
'use strict';

const db = require('./interface.js');

exports.getLoadout = async function(user_id, loadout_id) {
  if(loadout_id) {
    const query = db.mysql.format('SELECT * FROM Loadouts WHERE User_ID = ? AND ID = ?',
      [user_id, loadout_id]);
    query = sql_query + 'AND "ID" = ' + loadout_id;
  } else {
    const query = db.mysql.format('SELECT * FROM Loadouts WHERE User_ID = ?',
      [user_id]);
  }

  return await (await db.getConnection()).query(query, (err, rows, fields) => {
      return rows[0];
    }
  );
}

exports.getLoadouts = async function(user_id) {
  const query = db.mysql.format('SELECT * FROM Loadouts WHERE User_ID = ?',
    [user_id]);

  return await (await db.getConnection()).query(query, (err, rows, fields) => {
      return rows;
    }
  );
}

exports.updateLoadout = async function(user_id) {

}

/**
 * adds a new record to Loadouts
 * adds 4 records to Loadouts_Companions
 * @param {integer} user_id, goog id of user that is adding a new loadout
 * @param {string} name, of loadout
 * @param {[integer]} companions, list of companion ids
 */
exports.addLoadout = async function(user_id, name, companions) {
  console.log(user_id);
  console.log(name);
  console.log(companions);

  // check there isnt already a loadout for this user with this name

  // add new record to loadouts
  // console.log(db.mysql.format('INSERT INTO Loadouts(User_ID, Name) VALUES(?);', [[user_id, name]]));

  const loadout = await (await (await db.getConnection()).execute(
    'INSERT INTO Loadouts (User_ID, Name) VALUES (?)', [[user_id, name]],
    (err, rows, fields) => {
      console.log(errs);
      console.log(rows);
      console.log(fields);
      return rows;
    }
  ));

  // const sql = "INSERT INTO Loadouts (User_ID, Name) VALUES (?)";
  // const values = [
  //   [user_id, name]
  // ];
  //
  // const connection = await db.getConnection();
  // await connection.query(sql, [values], function(err) {
  //   if(err) throw err;
  //   connection.end();
  // });

  console.log(loadout);

  // add 4 records to Loadouts_Companions
  for(const companion_id of companions) {
    // check that each companion id is valid

    // add new records
    await ((await db.getConnection()).execute(
      'INSERT INTO Loadouts_Companions SET ?', [loadout.id, companion_id],
      (err, rows, fields) => {
        return rows;
      }
    ));
  }
}

exports.deleteLoadout = async function(user_id, loadout_id) {
  // check that user id is actually owner of loadout
}
