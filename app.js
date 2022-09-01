const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 7000
const fs = require('fs');
const db = new sqlite3.Database('./gaidosBank.db', sqlite3.OPEN_READWRITE, (err)=>{
if (err) return console.error(err.messafe);

console.log("connection successful");
})


const sql = `INSERT INTO users (uID, Name )
                VALUES(?,?)`
const view = `SELECT * FROM users`




app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) =>{
  res.render('home');
})


app.post('/giveMoney',(req, res) =>{



if(req.body.id){
const userID = req.body.id;


let userGuy = `SELECT uID id,
                  Name name
           FROM users
           WHERE uID  = ?`;
let accountID = userID;

db.get(userGuy, [accountID], (err, row) => {
  return row
  ? console.log(row.id, row.name)
  : console.log(`No user found with the id ${userID}`);
})

  } else {
    res.send('You kinda suck, send better params, and fill in all the info');
  }
})





app.listen(port);

//db.close((err) => {
  //if(err) return console.error(err.message);
//})
