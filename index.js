const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./gaidosBank.db');

let sql = `SELECT uID id,
                  Name name
           FROM users
           WHERE uID  = ?`;
let userId = 9999 ;

// first row only
db.get(sql, [userId], (err, row) => {
  if (err) {
    return console.error(err.message);
  }
  return row
    ? console.log(row.id, row.name)
    : console.log(`No user found with the id ${userId}`);

});

// close the database connection
db.close();
