const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const port = 3101

const fs = require('fs');
const session = require('express-session');
const db = new sqlite3.Database('./gaidosBank.db', sqlite3.OPEN_READWRITE)
const bodyParser = require('body-parser')
const encryptpwd = require('encrypt-with-password');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine', 'ejs');
app.use(express.static('./static'))
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
	res.render('login');
})


app.get('/bank', (req, res) => {
	res.render('bank');
})


app.get('/admin', (req, res) => {
	res.render('admin');
})



app.get('/Student', (req, res) => {
	res.render('Student');
})

let amount;
  db.get(`SELECT amount FROM transactions WHERE user = ?`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
  });

db.serialize(function (name)  {
	app.post('/', urlencodedParser, (req, res) => {
	    if (amount <= req.body.money) {
			db.get(`UPDATE transactions SET tx_id = "${req.body.money}" = ? WHERE user = "${name}"`) 
			db.get(`UPDATE transactions SET amount = amount - tx_id WHERE "${name}" = ?`)
			db.get(`UPDATE transactions SET amount = amount + ? WHERE "${req.body.user}" = ?`)
			} else {
			res.send("Insufficient Funds")
			console.log(amount)
			}
		})
})


app.get('/History' ,function(req, res) {
	res.render('History');
})


app.post('/register', urlencodedParser, (req, res) => {
	let studentName = req.body.studentName
	let studentPassword = req.body.studentPassword
	if (studentName && studentPassword) {
		// Execute SQL query that'll push the new account from the form to the database based on the specified value of studentname and studentid
		db.get(`INSERT INTO transactions ( user, tx_id, rx_id, amount ) VALUES(?,0,0,0)`, [studentName]) 
		db.get(`INSERT INTO users ( name, password ) VALUES(?,?)`, [studentName, studentPassword], function (error, results) {
			// If there is an issue with the query, output the error
			if (error) { throw error; }
			// If the account exists
			else {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.studentname = req.body.studentName;
				// Redirect to login page
				res.redirect('/');
			}

		})
	}
});

app.post('/login', (req, res) => {
	let name = req.body.name
	let password = req.body.password
	//const encrypted = encryptpwd.encrypt(username);
	//const decrypted = encryptpwd.decrypt(encrypted, password);
	if (name && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.get(`SELECT * FROM users WHERE name = ? AND password = ?`, [name, password], function (error, results) {
			// If there is an issue with the query, output the error
			console.log(results);
			if (error) throw error;
			// If the account exists
			if (results) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = req.body.name;
				//console.log(encrypted);
				//Redirect to home page
				res.redirect('/Bank');
			} else {
				res.send('Incorrect Username and/or Password!');
			}
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.listen(port, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log(`Running on port ${port}`);
	}
});