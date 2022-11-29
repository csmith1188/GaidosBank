const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const session = require("express-session");
const database = new sqlite3.Database(
   "./gaidosBank.db",
   sqlite3.OPEN_READWRITE
);
const bcrypt = require("bcrypt");

let username = "Fred";
let password = "FredPass";
bcrypt.hash(password, 10, function (error, hashedPassword) {
   if (error) throw error;
   database.get(
      "UPDATE users SET password = ? WHERE username = ?",
      [hashedPassword, username],
      (error, results) => {
         if (error) throw error;
      }
   );
});
