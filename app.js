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


app.get('/Bank', (req, res) => {
	res.render('Bank');
})


app.get('/admin', (req, res) => {
	res.render('admin');
})



app.get('/Student', (req, res) => {
	res.render('Student');
})

app.get('/login',function(req,res,next){
    res.render('Bank');
   });


app.post('/register', urlencodedParser, (req, res) => {
	if (req.body.studentName && req.body.studentPassword) {
		// Execute SQL query that'll push the new account from the nodejs to the database based on the specified studentname and studentid
		db.get(`INSERT INTO users ( name, password ) VALUES(?,?)`, [req.body.studentName, req.body.studentPassword], function (error, results) {
			// If there is an issue with the query, output the error

			if (error) { throw error; }
			// If the account exists
			else {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.studentname = req.body.studentName;
				// Redirect to home page
				res.redirect('/');
			}

		})
	}
});


app.post('/login', (req, res) => {
	//const encrypted = encryptpwd.encrypt(username);
	//const decrypted = encryptpwd.decrypt(encrypted, password);
	if (req.body.name && req.body.password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.get(`SELECT * FROM users WHERE name = ? AND password = ?`, [req.body.name, req.body.password], function (error, results) {
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