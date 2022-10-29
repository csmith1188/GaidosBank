// Import modules
const { query } = require('express')
const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const app = express()
// const session = require('express-session')
const database = new sqlite3.Database('./gaidosBank.db', sqlite3.OPEN_READWRITE)
// const bcrypt = require('bcrypt')

// Permission levels are as follows:
// 0 - teacher
// 1 - mod
// 2 - student
// 3 - anyone
// 4 - banned

// app.use(express.json())
// Express Setup
// app.set('view engine', 'ejs')
// app.use(express.static('static'))
// Create Sessions
// app.use(
// 	session({
// 		secret: 'secret', // session encryption code DO NOT LEAVE DEFAULT
// 		resave: true,
// 		saveUninitialized: true
// 	})
// )
// app.use(express.urlencoded({extended: true}))

// Variables
const port = 5000

// Functions
// checks if user is logged in
// function isAuthenticated(request, response, next) {
// 	if (request.session.username) {
// 		//if user is logged in
// 		next() // next function
// 	} else response.redirect('/login') // redirect to login page
// }

// // checks if user not logged in
// function isNotAuthenticated(request, response, next) {
// 	if (request.session.username) response.redirect('/') // redirect to home page
// 	else next() // next function
// }

// // checks if user is admin
// function isAdmin(request, response, next) {
// 	database.get(
// 		'SELECT * FROM users WHERE username = ?', // get data of logged in user
// 		[request.session.username],
// 		(error, results) => {
// 			if (error) throw error // if error send error
// 			if (results) {
// 				if (results.permissions == 0) next() // if teacher next function
// 				else response.redirect('/') // if not teacher redirect to index
// 			}
// 		}
// 	)
// }

// // sort list of objects by a property
// function sortByProperty(property) {
// 	let sortOrder = -1
// 	if (property[0] == '-') {
// 		sortOrder = 1
// 		property = property.substr(1)
// 	}
// 	return function (a, b) {
// 		var result =
// 			a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0
// 		return result * sortOrder
// 	}
// }

// Endpoints
// homepage
// app.get('/', isAuthenticated, (request, response) => {
// 	let page = request.route.path
// 	// define variables
// 	let username = request.session.username
// 	let tempLeaderBoard = []
// 	let keys = []
// 	database.get(
// 		'SELECT * FROM users WHERE username = ?', // get user data from database
// 		[username],
// 		(error, loggedUser) => {
// 			if (error) throw error
// 			if (loggedUser) {
// 				// if user exist
// 				database.all(
// 					'SELECT * FROM users', // get all user data
// 					(error, leaderBoard) => {
// 						// store user data as leaderBoard variable
// 						if (error) throw error
// 						if (leaderBoard) {
// 							// if leaderBoard exist
// 							for (i = 0; i < 2; i++) {
// 								for (user in leaderBoard) {
// 									if (leaderBoard[user].permissions != 2) {
// 										leaderBoard.splice(user, 1)
// 									}
// 								}
// 							}
// 							leaderBoard.sort(sortByProperty('balance')) // sort leaderBoard by balance highest to lowest
// 							while (leaderBoard.length > 10) {
// 								// while more then top ten users remove user
// 								leaderBoard.pop()
// 							}
// 							response.render('index.ejs', {
// 								// render home page, and send loggedUser as user and leaderBoard
// 								user: loggedUser,
// 								leaderBoard: leaderBoard,
// 								page: page
// 							})
// 						}
// 					}
// 				)
// 			}
// 		}
// 	)
// })

// // debug
// app.get('/debug', isAuthenticated, isAdmin, (request, response) => {
// 	let user = request.session.username
// 	let page = request.route.path
// 	database.get(
// 		'SELECT * FROM users WHERE username = ?',
// 		[user],
// 		(error, user) => {
// 			if (error) throw error
// 			database.all('SELECT * FROM users', (error, users) => {
// 				// get all user data
// 				if (error) throw error
// 				database.all(
// 					'SELECT * FROM transactions',
// 					(error, transactions) => {
// 						// get all transactions
// 						if (error) throw error
// 						response.render('debug.ejs', {
// 							// render debug menu, and send users and transactions
// 							users: users,
// 							transactions: transactions,
// 							page: page,
// 							user: user
// 						})
// 					}
// 				)
// 			})
// 		}
// 	)
// })

// // User Setting
// app.get('/userSettings', isAuthenticated, (request, response) => {
// 	let user = request.session.username
// 	let page = request.route.path
// 	database.get(
// 		'SELECT * FROM users WHERE username = ?',
// 		[user],
// 		(error, user) => {
// 			if (error) throw error
// 			response.render('userSettings.ejs', {
// 				// render user settings, and send user and page
// 				page: page,
// 				user: user
// 			})
// 		}
// 	)
// })

// // make transaction
// app.get('/makeTransaction', isAuthenticated, (request, response) => {
// 	let user = request.session.username
// 	let page = request.route.path
// 	database.get(
// 		'SELECT * From users WHERE username = ?',
// 		[user],
// 		(error, user) => {
// 			if (error) throw error
// 			response.render('makeTransaction.ejs', {page: page, user: user}) // render make transaction page
// 		}
// 	)
// })

// app.post('/makeTransactions', isAuthenticated, (request, response) => {
// 	let page = request.route.path
// 	let sender = request.session.username
// 	let receiver = request.body.account
// 	let amount = request.body.amount
// 	if (!isNaN(amount)) amount = Number(amount)
// 	database.get(
// 		'SELECT * FROM users WHERE username = ?',
// 		[sender],
// 		(error, sender) => {
// 			// get sender data
// 			if (error) throw error
// 			if (sender) {
// 				let senderBalance = sender.balance - amount
// 				if (!isNaN(receiver)) {
// 					database.get(
// 						'SELECT * FROM users WHERE id = ?',
// 						[receiver],
// 						(error, receiver) => {
// 							// get receiver data
// 							if (error) throw error
// 							if (receiver) {
// 								let receiverBalance = receiver.balance + amount
// 								database.get(
// 									'UPDATE users SET balance = ? WHERE username = ?',
// 									[senderBalance, sender.username],
// 									(error, results) => {
// 										if (error) throw error
// 									}
// 								)
// 								database.get(
// 									'UPDATE users SET balance = ? WHERE username = ?',
// 									[receiverBalance, receiver.username],
// 									(error, results) => {
// 										if (error) throw error
// 									}
// 								)
// 								database.get(
// 									'INSERT INTO transactions (senderId, receiverId, amount) VALUES (?, ?, ?)',
// 									[sender.id, receiver.id, amount],
// 									(error, results) => {
// 										if (error) throw error
// 										response.redirect('/')
// 									}
// 								)
// 							}
// 						}
// 					)
// 				} else {
// 					database.get(
// 						'SELECT * FROM users WHERE username = ?',
// 						[receiver],
// 						(error, receiver) => {
// 							// get receiver data
// 							if (error) throw error
// 							if (receiver) {
// 								let receiverBalance = receiver.balance + amount
// 								database.get(
// 									'UPDATE users SET balance = ? WHERE username = ?',
// 									[senderBalance, sender.username],
// 									(error, results) => {
// 										if (error) throw error
// 									}
// 								)
// 								database.get(
// 									'UPDATE users SET balance = ? WHERE username = ?',
// 									[receiverBalance, receiver.username],
// 									(error, results) => {
// 										if (error) throw error
// 									}
// 								)
// 								database.get(
// 									'INSERT INTO transactions (senderId, receiverId, amount) VALUES (?, ?, ?)',
// 									[sender.id, receiver.id, amount],
// 									(error, results) => {
// 										if (error) throw error
// 										response.redirect('/')
// 									}
// 								)
// 							}
// 						}
// 					)
// 				}
// 			}
// 		}
// 	)
// })

// // view transactions
// app.get('/viewTransactions', isAuthenticated, (request, response) => {
// 	// define variables
// 	let page = request.route.path
// 	let user = request.session.username
// 	let transactions = []
// 	let keys = []
// 	database.get(
// 		'SELECT * FROM users WHERE username = ?',
// 		['Gaidos'],
// 		(error, user) => {
// 			// get logged in user id and set user to its id
// 			if (error) throw error
// 			if (user) {
// 				database.all(
// 					'SELECT * FROM transactions', // get all transactions
// 					(error, transactions) => {
// 						if (error) throw error
// 						for (transaction in transactions) {
// 							if (
// 								transactions[transaction].senderId != user.id &&
// 								transactions[transaction].receiverId != user.id
// 							)
// 								transactions.splice(transactions, 1)
// 						}
// 						response.render('viewTransactions.ejs', {
// 							page: page,
// 							transactions: transactions
// 						})
// 					}
// 				)
// 			}
// 		}
// 	)
// })

// // login
// app.get('/login', isNotAuthenticated, function (request, response) {
// 	let page = request.route.path
// 	response.render('login.ejs', {page: page})
// })

// app.post('/login', isNotAuthenticated, function (request, response) {
// 	const {username, password} = request.body
// 	request.session.regenerate(function (error) {
// 		if (error) throw error
// 		if (username && password) {
// 			database.get(
// 				'SELECT * FROM users WHERE username = ?',
// 				[username],
// 				function (error, results) {
// 					if (error) throw error
// 					if (results) {
// 						let databasePassword = results.password
// 						bcrypt.compare(
// 							password,
// 							databasePassword,
// 							(error, isMatch) => {
// 								if (error) throw error
// 								if (isMatch) {
// 									if (results) {
// 										request.session.username = username
// 										response.redirect('/')
// 									}
// 								} else response.redirect('/login')
// 							}
// 						)
// 					} else response.redirect('/login')
// 				}
// 			)
// 		} else response.redirect('/login')
// 	})
// })

// // signup
// app.get('/signup', isNotAuthenticated, function (request, response) {
// 	let page = request.route.path
// 	try {
// 		response.render('signup.ejs')
// 	} catch (error) {
// 		response.send(error.message)
// 	}
// })

// app.post('/signup', isNotAuthenticated, function (request, response) {
// 	const {username, password, confirmPassword} = request.body
// 	request.session.regenerate(function (error) {
// 		if (error) throw error
// 		if (username && password && confirmPassword) {
// 			database.get(
// 				'SELECT * FROM users WHERE username = ?',
// 				[username],
// 				(error, results) => {
// 					if (error) throw error
// 					if (!results) {
// 						if (password == confirmPassword) {
// 							bcrypt.hash(
// 								password,
// 								10,
// 								function (error, hashedPassword) {
// 									if (error) throw error
// 									database.get(
// 										'INSERT INTO users (username, password, balance, permissions) VALUES (?, ?, ?)',
// 										[username, hashedPassword, 0, 3],
// 										(error, results) => {
// 											if (error) throw error
// 											request.session.username = username
// 											response.redirect('/')
// 										}
// 									)
// 								}
// 							)
// 						}
// 					}
// 				}
// 			)
// 		} else response.redirect('/signup')
// 	})
// })

// // logout
// app.get('/logout', isAuthenticated, function (request, response) {
// 	let page = request.route.path
// 	request.session.username = null
// 	request.session.save(function (error) {
// 		if (error) throw error
// 		request.session.regenerate(function (error) {
// 			if (error) throw error
// 			response.redirect('/login')
// 		})
// 	})
// })

// // change password
// app.get('/changePassword', isAuthenticated, function (request, response) {
// 	let page = request.route.path
// 	try {
// 		response.render('changePassword.ejs')
// 	} catch (error) {
// 		response.send(error.message)
// 	}
// })

// app.post('/changePassword', isAuthenticated, function (request, response) {
// 	const {currentPassword, newPassword, confirmNewPassword} = request.body
// 	const username = request.session.username
// 	database.get(
// 		'SELECT password FROM users WHERE username = ?',
// 		[username],
// 		function (error, results) {
// 			if (error) throw error
// 			if (results) {
// 				bcrypt.compare(
// 					currentPassword,
// 					results.password,
// 					(error, isMatch) => {
// 						if (error) throw error
// 						if (isMatch && newPassword == confirmNewPassword) {
// 							bcrypt.hash(newPassword, 10, (error, hashedPassword) => {
// 								if (error) throw error
// 								database.get(
// 									'UPDATE users SET password = ? WHERE username = ?',
// 									[hashedPassword, username],
// 									(error, results) => {
// 										if (error) throw error
// 										response.redirect('/logout')
// 									}
// 								)
// 							})
// 						} else response.redirect('/')
// 					}
// 				)
// 			} else response.redirect('/')
// 		}
// 	)
// })

// // delete account
// app.get('/deleteAccount', isAuthenticated, function (request, response) {
// 	let page = request.route.path
// 	username = request.session.username
// 	database.get(
// 		'DELETE FROM users WHERE username = ?',
// 		[username],
// 		(error, results) => {
// 			if (error) throw error
// 			response.redirect('/logout')
// 		}
// 	)
// })

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

app.get('/getUser', (request, response) => {
	let query = 'SELECT * FROM users WHERE '
	if (request.query.username) username = request.query.username
	else username = null
	if (request.query.id) id = request.query.id
	else id = null
	if (username && id) query = null
	else {
		if (username && isNaN(username))
			query += 'username="' + username + '"'
		else if (id && !isNaN(id))
			query += 'id=' + id + ''
		else query = null
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

app.get('/getUsers', (request, response) => {
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

// Run Website
app.listen(port, error => {
	if (error) {
		console.error(error)
	} else {
		console.log('Running on port', port)
	}
})