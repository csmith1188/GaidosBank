import next from 'next'
import http from 'http'
import { Server } from 'socket.io'
import session from 'express-session'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'
import memoryStore from 'memorystore'

const memoryStoreInstance = memoryStore(session)
const verboseSqlite3 = sqlite3.verbose()
const database = new verboseSqlite3.Database(
	'databases/database.db',
	verboseSqlite3.OPEN_READWRITE
)

const dev = process.env.NODE_ENV !== 'production'
if (dev) console.log('Running in Developer mode')
const app = next({ dev })
const handle = app.getRequestHandler()

const sessionMiddleware = session({
	secret: 'your-secret-key',
	resave: false,
	saveUninitialized: true,
	store: new memoryStoreInstance({
		checkPeriod: 86400000,
	}),
	cookie: {
		secure: !dev
	}
})

const PORT = 3000
const WAGE = 20

let classes = []
let users = {}
let leaderBoard = {}
let transactions = []

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
	}).sort()
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
			leaderBoard[user] = { ...users[user] }
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
		// socket.on('getSession', () => {
		// 	socket.emit('getSession', socket.request.session)
		// })

		socket.on('login', (username, password) => {
			if (!socket.request.session.username) {
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
									async (error, isMatch) => {
										if (error) throw error
										if (isMatch) {
											socket.request.session.username = username
											socket.request.session.save()
											socket.emit('login', {
												data: {
													...users[username],
													isAuthenticated: true,
												}
											})
										} else socket.emit('login', { error: 'That is not the users password.' })
									}
								)
							} else socket.emit('login', { error: 'User does not exist.' })
						}
					)
				} else socket.emit('login', { error: 'Missing username or password.' })
			} else socket.emit('login', {
				data: {
					...users[username],
					isAuthenticated: true,
				},
				// error: 'Already logged in'
			})
		})

		socket.on('signup', (
			username,
			password,
			confirmPassword,
			theme,
			className
		) => {
			let permissions = 'user'

			async function sendResult() {
				await getUsers()
				if (users[username]) {
					socket.request.session.username = username
					socket.request.session.save()
					socket.emit('signup', {
						data: {
							...users[username],
							isAuthenticated: true,
						}
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
			if (socket.request.session) {
				// Destroy the session
				socket.request.session.username = ''
				socket.request.session.destroy((error) => {
					if (error) {
						console.error('Error destroying session:', error)
					}
				})
			} else {
				console.warn('No session available.')
			}
		})

		socket.on('getClasses', () => {
			socket.emit('sendClasses', classes)
		})

		socket.on('makeClass', (className) => {
			let currentUser = socket.request.session.username

			if (currentUser) currentUser = users[currentUser]
			else {
				socket.emit('makeClass', { error: 'Not logged in' })
				return
			}

			if (currentUser.permissions !== 'admin') {
				socket.emit('makeClass', { error: 'Not admin' })
				return
			}

			if (classes.includes(className)) {
				socket.emit('makeClass', { error: 'Class already exist' })
				return
			}

			database.run(
				'INSERT INTO classes (class) VALUES (?)',
				[className],
				async (error, results) => {
					if (error) throw error
					socket.emit('makeClass', { className })
					await getClasses()
					io.emit('sendClasses', classes)
				}
			)
		})

		socket.on('deleteClass', async (className) => {
			let currentUser = socket.request.session.username

			if (currentUser) currentUser = users[currentUser]
			else {
				socket.emit('deleteClass', { error: 'Not logged in' })
				return
			}

			if (currentUser.permissions !== 'admin') {
				socket.emit('deleteClass', { error: 'Not admin' })
				return
			}

			if (!classes.includes(className)) {
				socket.emit('deleteClass', { error: 'Class doesn\'t exist' })
				return
			}

			try {
				await database.run('BEGIN TRANSACTION')

				await Promise.all([
					database.run(
						'DELETE FROM classes WHERE class = ?',
						[className]
					),
					database.run(
						'UPDATE users SET class = NULL WHERE class = ?',
						[className]
					)
				])

				await database.run('COMMIT')

				socket.emit('deleteClass', { className })
				await getClasses()
				await getUsers()
				io.emit('sendClasses', classes)
				io.emit('getUsers', users)
			} catch (error) {
				console.error(error)
				await database.run('ROLLBACK')
				socket.emit('deleteClass', { error: 'An error occurred while processing the transaction.' })
			}
		})

		// socket.on('renameClass', async (currentClassName, newClassName) => {
		// 	let currentUser = socket.request.session.username

		// 	if (currentUser) currentUser = users[currentUser]
		// 	else {
		// 		socket.emit('makeClass', { error: 'Not logged in' })
		// 		return
		// 	}

		// 	if (currentUser.permissions !== 'admin') {
		// 		socket.emit('makeClass', { error: 'Not admin' })
		// 		return
		// 	}

		// 	if (classes.includes(currentClassName)) {
		// 		socket.emit('makeClass', { error: 'Selected class does not exist.' })
		// 		return
		// 	}

		// 	if (classes.includes(newClassName)) {
		// 		socket.emit('makeClass', { error: 'New class name already exist.' })
		// 		return
		// 	}

		// 	try {
		// 		await database.run('BEGIN TRANSACTION')

		// 		await Promise.all([
		// 			database.run(
		// 				'UPDATE classes SET class = ? WHERE class = ?',
		// 				[newClassName, currentClassName]
		// 			),
		// 			database.run(
		// 				'UPDATE users SET class = ? WHERE class = ?',
		// 				[newClassName, currentClassName]
		// 			)
		// 		])

		// 		await database.run('COMMIT')

		// 		socket.emit('renameClass', className)
		// 		await getClasses()
		// 		await getUsers()
		// 		io.emit('sendClasses', classes)
		// 		io.emit('getUsers', users)
		// 	} catch (error) {
		// 		console.error(error)
		// 		await database.run('ROLLBACK')
		// 		socket.emit('renameClass', { error: 'An error occurred while processing the transaction.' })
		// 	}
		// })

		// socket.on('changeUsers', (changedData) => {
		// 	let changedDataIndex = 0
		// 	let rowIndex = 0
		// 	for (let [rowId, row] of Object.entries(changedData)) {
		// 		for (let [column, value] of Object.entries(row)) {
		// 			// database.run(
		// 			// 	`UPDATE users SET ${column} = ? WHERE _rowid_ = ?`,
		// 			// 	[
		// 			// 		Number.isInteger(value) ? Number(value) : value,
		// 			// 		Number(rowId) + 1
		// 			// 	],
		// 			// 	(error, results) => {
		// 			// 		if (results) console.log(results)
		// 			// 		if (error) throw error
		// 			// 		io.emit('sendUsers', users)
		// 			// 		io.emit('sendLeaderBoard', leaderBoard)
		// 			// 	}
		// 			// )
		// 		}
		// 	}
		// })

		socket.on('editUsers', async () => {
			await getUsers()
			io.emit('sendUsers', users)
			io.emit('sendLeaderBoard', leaderBoard)
		})

		socket.on('getUsers', () => {
			socket.emit('sendUsers', users)
		})

		socket.on('getLeaderBoard', () => {
			socket.emit('sendLeaderBoard', leaderBoard)
		})

		socket.on('getTransactions', () => {
			socket.emit('sendTransactions', transactions)
		})

		socket.on('makeTransaction', async (
			receiverName = null,
			amount = null
		) => {
			let senderName = socket.request.session.username || null
			let sender, receiver

			if (amount && Number.isInteger(Number(amount)) && Number(amount) > 0) {
				amount = Number(amount)
			}

			if (senderName === null) {
				socket.emit('makeTransaction', { error: 'Not logged in.' })
				return
			}

			if (receiverName === null) {
				socket.emit('makeTransaction', { error: 'Missing account.' })
				return
			}

			if (amount === null) {
				socket.emit('makeTransaction', { error: 'Missing amount.' })
				return
			}

			if (users[senderName])
				sender = users[senderName]
			else {
				socket.emit('makeTransaction', { error: "Account logged into doesn't exist somehow." })
				return
			}

			if (users[receiverName])
				receiver = users[receiverName]
			else {
				socket.emit('makeTransaction', { error: 'User does not exist.' })
				return
			}

			if (senderName === receiverName) {
				socket.emit('makeTransaction', { error: "You can't send money to yourself." })
				return
			}

			if (sender.balance < amount) {
				socket.emit('makeTransaction', { error: "You don't have enough money" })
				return
			}

			let timestamp = new Date()
			timestamp = {
				year: timestamp.getFullYear(),
				month: timestamp.getMonth() + 1,
				day: timestamp.getDate(),
				hours: timestamp.getHours(),
				minutes: timestamp.getMinutes(),
				seconds: timestamp.getSeconds(),
			}

			try {
				await database.run('BEGIN TRANSACTION')

				await Promise.all([
					database.run(
						'UPDATE users SET balance = balance - ? WHERE username = ?',
						[amount, senderName]
					),
					database.run(
						'UPDATE users SET balance = balance + ? WHERE username = ?',
						[amount, receiverName]
					),
					database.run(
						'INSERT INTO transactions (sender, receiver, amount, timestamp) VALUES (?, ?, ?, ?)',
						[
							senderName,
							receiverName,
							amount,
							JSON.stringify(timestamp)
						]
					)
				])

				await database.run('COMMIT')

				await getTransactions()
				await getUsers()

				socket.emit('makeTransaction')
				io.emit('sendTransactions', transactions)
				io.emit('sendUsers', users)
			} catch (error) {
				console.error(error)
				await database.run('ROLLBACK')
				socket.emit('makeTransaction', { error: 'An error occurred while processing the transaction.' })
			}
		})

		socket.on('reloadData', async () => {
			//  await Promise.all([
			await getUsers()
			await getClasses()
			await getTransactions()
			// ])

			console.log(users)
			console.log(transactions)
			io.emit('sendUsers', users)
			io.emit('sendLeaderBoard', leaderBoard)
			io.emit('sendClasses', classes)
			io.emit('sendTransactions', transactions)
		})

		socket.on('startClass', (users) => {
			// users = users.join(', ')
			database.run(
				'UPDATE users SET balance = balance + ?  WHERE username in (?)',
				[WAGE, users],
				(error, results) => {
					if (results) console.log(results)
					if (error) throw error

					console.log('start class')
					getUsers()
				}
			)
		})
	})

	server.listen(PORT, () => {
		console.log(`Running on port ${PORT}`)
	})
})