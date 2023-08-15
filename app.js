import next from 'next'
import http from 'http'
import { Server } from 'socket.io'
import { getIronSession } from 'iron-session'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'

const verboseSqlite3 = sqlite3.verbose()
const database = new verboseSqlite3.Database('database.db', sqlite3.OPEN_READWRITE)

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = 3000

let classes = []
let users = {}
let leaderBoard = {}
let transactions = []
let loggedInUsers = []

class User {
	constructor(username, balance, permissions, userClass, theme) {
		this.username = username
		this.balance = balance
		this.permissions = permissions
		this.class = userClass
		this.theme = theme
	}
}

class Transaction {
	constructor(sender, receiver, amount, timestamp) {
		this.sender = sender
		this.receiver = receiver
		this.amount = amount
		this.timestamp = timestamp
	}
}

async function getClasses() {
	const databaseClasses = await new Promise((resolve, reject) => {
		database.all('SELECT * FROM classes', (error, results) => {
			if (error) reject(error)
			else resolve(results)
		})
	})
	if (databaseClasses) classes = databaseClasses.map(className => {
		return className.class
	})
}

async function getUsers() {
	const databaseUsers = await new Promise((resolve, reject) => {
		database.all('SELECT username, balance, permissions, class, theme FROM users', (error, results) => {
			if (error) reject(error)
			else resolve(results)
		})
	})
	databaseUsers.map(user => {
		users[user.username] = new User(
			user.username,
			user.balance,
			user.permissions,
			user.class,
			user.theme
		)
	})

	getLeaderBoard()
}

async function getTransactions() {
	const databaseTransactions = await new Promise((resolve, reject) => {
		database.all('SELECT * FROM transactions', (error, results) => {
			if (error) reject(error)
			else resolve(results)
		})
	})
	for (let transaction of databaseTransactions) {
		transaction.timestamp = JSON.parse(transaction.timestamp)
	}
	transactions = databaseTransactions.map(transaction => {
		return new Transaction(
			transaction.sender,
			transaction.receiver,
			transaction.amount,
			transaction.timestamp,
		)
	})
}

function getLeaderBoard() {
	for (let user in users) {
		if (users[user].permissions !== 'admin') {
			leaderBoard[user] = users[user]
		}
	}

	leaderBoard = Object.fromEntries(
		Object.entries(leaderBoard).sort(([, a], [, b]) => b.balance - a.balance)
	)

	let rank = 1
	for (let user in leaderBoard) {
		leaderBoard[user].rank = rank++
	}
}
getClasses()
getUsers()
getTransactions()

const sessionMiddleware = async (request, response, next) => {
	request.session = await getIronSession(request, response, {
		cookieName: 'my-session',
		password: 'complex_password_at_least_32_characters_long',
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production',
		},
	})
	next()
}

app.prepare().then(() => {
	const server = http.createServer((request, response) => {
		sessionMiddleware(request, response, () => {
			handle(request, response)
		})
	})

	const io = new Server(server)

	io.use((socket, next) => {
		sessionMiddleware(socket.request, {}, next)
	})

	io.on('connection', (socket) => {
		socket.on('login', (username, password) => {
			let session = socket.request.session
			if (!session.username) {
				if (
					typeof username !== 'undefined' &&
					typeof password !== 'undefined'
				) {
					database.get(
						`SELECT password FROM users WHERE username = ?`,
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
											session.username = username
											session.save()
											socket.emit('login', {
												...users[username],
												isAuthenticated: true,
											})
										} else socket.emit('login', { error: 'That is not the users password.' })
									}
								)
							} else socket.emit('login', { error: 'User does not exist.' })
						}
					)
				} else socket.emit('login', { error: 'Missing username or password.' })
			} else socket.emit('login', { error: 'Already logged in' })
		})

		socket.on('signup', (
			username,
			password,
			confirmPassword,
			theme,
			className
		) => {
			let session = socket.request.session
			let permissions = 'user'

			async function sendResult() {
				await getUsers()
				if (users[username]) {
					session.username = username
					session.save()
					socket.emit('signup', {
						...users[username],
						isAuthenticated: true,
					})
				}
				io.emit('sendUsers', users)
				io.emit('sendLeaderBoard', leaderBoard)
			}

			if (typeof theme === 'undefined') theme = 'light'
			if (
				typeof username !== 'undefined' &&
				typeof password !== 'undefined' &&
				typeof confirmPassword !== 'undefined' &&
				typeof theme !== 'undefined'
			) {
				if (password == confirmPassword) {
					bcrypt.hash(
						password,
						10,
						(error, hashedPassword) => {
							if (error) throw error
							if (hashedPassword) {
								if (!users[username]) {
									if (users.length == 0) {
										permissions = 'admin'
									}
									if (className) {
										if (classes.includes(className)) {
											database.run(
												`INSERT INTO users (username, password, balance, permissions, class, theme) VALUES (?, ?, ?, ?, ?, ?)`,
												[
													username,
													hashedPassword,
													0,
													permissions,
													className,
													theme
												],
												(error, results) => {
													if (error) throw error
													sendResult()
												}
											)
										} else socket.emit('signup', { error: 'That Class does not exist.' })
									} else {
										database.run(
											`INSERT INTO users (username, password, balance, permissions, theme) VALUES (?, ?, ?, ?, ?)`,
											[
												username,
												hashedPassword,
												0,
												permissions,
												theme
											],
											(error, results) => {
												if (error) throw error
												sendResult()
											}
										)
									}
								} else socket.emit('signup', { error: 'A User already has that Username.' })
							}
						}
					)
				} else socket.emit('signup', { error: 'Passwords do not match.' })
			} else socket.emit('signup', { error: 'missing Username, Password, Confirm Password, and/or theme.' })
		})

		socket.on('logout', () => {
			socket.request.session.destroy()
		})

		socket.on('makeClass', (newClass) => {
			console.log('newClass', newClass)
			console.log(socket.request.session)
			let currentUser = socket.request.session.username
			database.get(
				'SELECT * FROM users WHERE username = ?',
				[currentUser],
				(error, results) => {
					if (error) throw error
					if (results) currentUser = results
					if (currentUser) return
					if (currentUser.permissions !== 'admin') return
					console.log('makeClass')
					database.all(
						'SELECT * FROM classes',
						(error, results) => {
							if (error) throw error
							let classes = results.map(result => result.class)
							if (!classes.includes(newClass)) {
								database.run('INSERT INTO classes (class) VALUES (?)',
									[newClass],
									(error, results) => {
										if (error) throw error
										getClasses()
										io.emit('sendClasses', classes)
									}
								)
							}
						}
					)
				})
		})

		socket.on('getClasses', () => {
			socket.emit('sendClasses', classes)
		})

		socket.on('changeUsers', (changedData) => {
			let changedDataIndex = 0
			let rowIndex = 0
			console.log(changedData.length)
			for (let [rowId, row] of Object.entries(changedData)) {
				for (let [column, value] of Object.entries(row)) {
					// database.run(
					// 	`UPDATE users SET ${column} = ? WHERE _rowid_ = ?`,
					// 	[
					// 		Number.isInteger(value) ? Number(value) : value,
					// 		Number(rowId) + 1
					// 	],
					// 	(error, results) => {
					// 		if (results) console.log(results)
					// 		if (error) throw error
					// 		io.emit('sendUsers', users)
					// 		io.emit('sendLeaderBoard', leaderBoard)
					// 	}
					// )
				}
			}
		})

		socket.on('updateUsers', () => {
			getUsers()
			io.emit('sendUsers', users)
			io.emit('sendLeaderBoard', leaderBoard)
		})

		socket.on('getUsers', () => {
			socket.emit('sendUsers', users)
		})

		socket.on('getLeaderBoard', () => {
			socket.emit('sendLeaderBoard', leaderBoard)
		})

		socket.on('getTransactions', (username) => {
			if (username) {
				socket.emit('sendTransactions', transactions.filter(transaction =>
					transaction.sender === username ||
					transaction.receiver === username
				))
			} else socket.emit('sendTransactions', transactions)
		})
	})

	server.listen(PORT, () => {
		console.log(`Running on port ${PORT}`)
	})
})
