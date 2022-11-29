// Import modules
const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const app = express()
const session = require('express-session')
const database = new sqlite3.Database('./gaidosBank.db', sqlite3.OPEN_READWRITE)
const bcrypt = require('bcrypt')
const { response } = require('express')

// Permission levels are as follows:
// 0 - teacher
// 1 - mod
// 2 - student
// 3 - anyone
// 4 - banned

// Create Sessions
app.use(
	session({
		secret: 'secret', // session encryption code DO NOT LEAVE DEFAULT
		resave: true,
		saveUninitialized: true
	})
)
app.use(express.urlencoded({ extended: true }))

// Variables
const port = 5000

// Functions
// checks if user is logged in
function isAuthenticated(request, response, next) {
	if (request.session.username) {
		next()
	} else response.sendStatus(403)
}

// // checks if user not logged in
function isNotAuthenticated(request, response, next) {
	if (!request.session.username) { next() }
	else response.sendStatus(201)
}

// // checks if user is admin
function isAdmin(request, response, next) {
	database.get(
		'SELECT * FROM users WHERE username = ?', // get data of logged in user
		request.session.username,
		(error, results) => {
			if (error) throw error // if error send error
			if (results) {
				if (results.permissions == 0) next() // if teacher next function
				else response.sendStatus(200) // if not teacher redirect to index
			} else response.sendStatus(403)
		}
	)
}

// Endpoints
app.get('/isAuthenticated', (request, response) => {
	if (request.session.username) {
		response.send(true)
	} else response.send(false)
})

app.get('/isAdmin', (request, response) => {
	database.get(
		'SELECT * FROM users WHERE username = ?',
		request.session.username,
		(error, results) => {
			if (error) throw error
			if (results) {
				if (results.permissions == 0) response.send(true)
				else response.send(false)
			} else response.send(false)
		}
	)
})

// temp
// Gaidos = dark admin
// Rev = dark student
// Kyle = light student
var currentUser = 'Gaidos'
app.get('/getCurrentUser', (request, response) => {
	database.get(
		'SELECT * FROM users WHERE username = ?',
		currentUser,
		(error, results) => {
			if (error) throw error
			response.json(results)
		}
	)
})

// Get User
app.get('/getUser', isAuthenticated, (request, response) => {
	let query = 'SELECT * FROM users WHERE '
	if (request.query.id) id = request.query.id
	else id = null
	if (request.query.username) username = request.query.username
	else username = null
	if (username && id) response.sendStatus(400)
	else {
		if (id && !isNaN(id))
			query += 'id=' + id + ''
		else if (username && isNaN(username))
			query += 'username="' + username + '"'
		else response.sendStatus(400)
	}
	if (query) {
		database.get(
			query,
			(error, results) => {
				if (error) throw error
				if (results) response.json(results)
				else response.sendStatus(404)
			}
		)
	} else response.sendStatus(400)
})

// Get Users
app.get('/getUsers', isAuthenticated, (request, response) => {
	let query = 'SELECT * FROM users'
	for (let query of Object.keys(request.query)) {
		if (query != 'filter' && query != 'sort' && query != 'limit') response.sendStatus(400)
	}
	if (request.query.filter) filterBy = request.query.filter
	else filterBy = null
	if (request.query.sort) sortBy = request.query.sort
	else sortBy = null
	if (request.query.limit) limit = request.query.limit
	else limit = null
	if (filterBy && query) {
		if (filterBy.startsWith('{') && filterBy.endsWith('}')) filterBy = filterBy.slice(1, -1).split(',')
		if (filterBy) query += ' WHERE'
		for (filter of filterBy) {
			if (filter.startsWith('balance'))
				query += ' ' + filter
			else if (filter.startsWith('permissions')) {
				query += ' permissions="' + filter.slice(12) + '"'
			} else response.sendStatus(400)
			if (filterBy.indexOf(filter) < filterBy.length - 1)
				query += ' AND'
		}
	}
	if (sortBy && query) {
		if (sortBy.startsWith('{') && sortBy.endsWith('}')) sortBy = sortBy.slice(1, -1).split(',')

		if (sortBy) query += ' ORDER BY'
		for (sort of sortBy) {
			splitSort = sort.split(':')
			if (splitSort[0] == 'id' || splitSort[0] == 'username' || splitSort[0] == 'balance')
				query += ' ' + splitSort[0]
			else response.sendStatus(400)
			if (splitSort[1] == 'ASC' || splitSort[1] == 'DESC') query += ' ' + splitSort[1]
			else if (splitSort[1]) response.sendStatus(400)
			else {
				query += ' DESC'
			}
			if (sortBy.indexOf(sort) < sortBy.length - 1) {
				query += ','
			}
		}
	}
	if (limit) {
		if (!isNaN(limit)) query += ' LIMIT ' + limit
		else response.sendStatus(400)
	}
	if (query) {
		database.all(
			query,
			(error, results) => {
				if (error) throw error
				if (results) response.json(results)
				else response.sendStatus(404)
			}
		)
	} else response.sendStatus(400)
})

// app.get('/getTransaction', (request, response) => {

// })


// Get Transactions
app.get('/getTransactions', isAuthenticated, (request, response) => {
	let query = 'SELECT * FROM transactions'
	if (query) {
		database.all(
			query,
			(error, results) => {
				if (error) throw error
				if (results) response.json(results)
				else response.sendStatus(404)
			}
		)
	}
})

// Make Transaction
app.get('/makeTransactions', isAuthenticated, (request, response) => {
	let sender = request.session.username
	if (request.query.account) receiver = request.query.account
	else receiver = null
	if (request.query.amount) amount = request.query.amount
	else amount = null
	if (sender && receiver && amount) {
		database.get(
			'SELECT * FROM users WHERE username = ?', sender, (error, sender) => {
				if (error) throw error;
				if (sender) {
					console.log(sender);
				}
			})
	} else response.sendStatus(400)
})

// Login
app.get('/login', isNotAuthenticated, (request, response) => {
	if (request.query.username) username = request.query.username
	else username = null
	if (request.query.password) password = request.query.password
	else password = null
	if (username && password) {
		request.session.regenerate((error) => {
			if (error) throw error
			database.get(
				'SELECT * FROM users WHERE username = ?',
				[username],
				(error, results) => {
					if (error) throw error
					if (results) {
						let databasePassword = results.password
						bcrypt.compare(
							password,
							databasePassword,
							(error, isMatch) => {
								if (error) throw error
								if (isMatch) {
									request.session.username = username
									console.log(request.session);
									response.sendStatus(200)
								} else response.sendStatus(404)
							}
						)
					} else response.sendStatus(404)
				}
			)
		})
	} else response.sendStatus(400)
})

// Signup
app.get('/signup', isNotAuthenticated, (request, response) => {
	if (request.query.username) username = request.query.username
	else username = null
	if (request.query.password) password = request.query.password
	else password = null
	if (request.query.confirmPassword) confirmPassword = request.query.confirmPassword
	else confirmPassword = null
	request.session.regenerate((error) => {
		if (error) throw error
		if (username && password && confirmPassword) {
			database.get(
				'SELECT * FROM users WHERE username = ?',
				[username],
				(error, results) => {
					if (error) throw error
					if (!results) {
						if (password == confirmPassword) {
							bcrypt.hash(
								password,
								10,
								(error, hashedPassword) => {
									if (error) throw error
									database.get(
										'INSERT INTO users (username, password, balance, permissions) VALUES (?, ?, ?)',
										[username, hashedPassword, 0, 3],
										(error, results) => {
											if (results) {
												if (error) throw error
												request.session.username = username
												response.sendStatus(200)
											} else response.sendStatus(404)
										}
									)
								}
							)
						} else response.sendStatus(400)
					} else response.sendStatus(409)
				}
			)
		} else response.sendStatus(400)
	})
})


// Logout
app.get('/logout', isAuthenticated, (request, response) => {
	request.session.username = null
	request.session.save((error) => {
		if (error) throw error
		request.session.regenerate((error) => {
			if (error) throw error
			response.sendStatus(200)
		})
	})
})

// Change Password
app.post('/changePassword', isAuthenticated, function (request, response) {
	if (request.query.currentPassword) username = request.query.currentPassword
	else currentPassword = null
	if (request.query.newPassword) password = request.query.newPassword
	else newPassword = null
	if (request.query.confirmNewPassword)
		confirmPassword = request.query.confirmNewPassword
	else confirmNewPassword = null
	const username = request.session.username
	if (newPassword == confirmNewPassword) {
		database.get(
			'SELECT password FROM users WHERE username = ?',
			[username],
			(error, results) => {
				if (error) throw error
				if (results) {
					bcrypt.compare(
						currentPassword,
						results.password,
						(error, isMatch) => {
							if (error) throw error
							if (isMatch) {
								bcrypt.hash(newPassword, 10, (error, hashedPassword) => {
									if (error) throw error
									database.get(
										'UPDATE users SET password = ? WHERE username = ?',
										[hashedPassword, username],
										(error, results) => {
											if (error) throw error
											if (results) response.sendStatus(200)
											else response.sendStatus(404)
										}
									)
								})
							} else response.sendStatus(404)
						}
					)
				} else response.sendStatus(400)
			}
		)
	} else response.sendStatus(400)
})

// Delete Account
app.get('/deleteAccount', isAuthenticated, (request, response) => {
	let username = request.session.username
	database.get(
		'DELETE FROM users WHERE username = ?',
		[username],
		(error, results) => {
			if (error) throw error
			if (results) response.sendStatus(200)
			else response.sendStatus(404)
		}
	)
})

// Run Website
app.listen(port, error => {
	if (error) throw error
	else console.log('Running on port', port)
})