const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3101
const fs = require('fs');
const session = require('express-session');
const db = new sqlite3.Database('./gaidosBank.db', sqlite3.OPEN_READWRITE)




const view = `SELECT * FROM transactions WHERE amount = ?`




app.set('view engine', 'ejs');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.render('home');
})

app.listen(port, (err) =>{
	if (err) {
	  console.error(err);
	} else {
	  console.log(`Running on port ${port}`);
	}
  });