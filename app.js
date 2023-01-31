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
	res.render('Bank');
})


app.get('/homepage', (req, res) => {
	res.render('homepage');
})

app.post('/', urlencodedParser, (req, res) => {
	let studentname = req.body.studentName;
	if (studentname) {
		// Execute SQL query that'll push the new account from the nodejs to the database based on the specified studentname and studentid
		db.get(`INSERT INTO users ( name ) VALUES(?)`, [studentname], function (error, results) {
			// If there is an issue with the query, output the error

			if (error) { throw error; }
			// If the account exists
			else {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.studentname = studentname;
				// Redirect to home page
				res.redirect('/');
			}

		})
	}
});

app.post('/Login', urlencodedParser, (req, res) => {
	let username = req.body.studentName;
	let password = req.body.studentPassword;

app.get('/Bank', (req, res) => {
	res.render('Bank');
})

app.get('/login',function(req,res,next){
    res.render('Bank');
   });

app.post('/login', (req, res) => {
	let username = req.body.name;
	let password = req.body.id;
	const encrypted = encryptpwd.encrypt(username, password);
	const decrypted = encryptpwd.decrypt(encrypted, password);
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.get(`SELECT * FROM users WHERE Name = ? AND uID = ?`, [username, password], function (error, results) {
			// If there is an issue with the query, output the error
			console.log(results);
			if (error) throw error;
			// If the account exists
			if (results) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				console.log(encrypted);
				// Redirect to home page
				res.redirect('/homepage');
			} else {
				res.send('Incorrect Username and/or Password!');
			}
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
})

	app.listen(port, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`Running on port ${port}`);
		}
});