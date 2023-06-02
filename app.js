const next = require('next')
const http = require('http')
const socketIO = require('socket.io')
const { getIronSession } = require('iron-session')
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE)

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = 3000

let classes = []
let users = {}
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
}

async function getTransactions() {
	const databaseTransactions = await new Promise((resolve, reject) => {
		database.all('SELECT * FROM transactions', (error, results) => {
			if (error) reject(error)
			else resolve(results)
		})
	})
	transactions = databaseTransactions.map(transaction => {
		new Transaction(
			transaction.sender,
			transaction.receiver,
			transaction.amount,
			transaction.timestamp,
		)
	})
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

	const io = socketIO(server)

	io.use((socket, next) => {
		sessionMiddleware(socket.request, {}, next)
	})

	io.on('connection', (socket) => {
		socket.on('makeClass', (newClass) => {
			console.log(newClass)
			// let currentUser = socket.request.session.username
			// currentUser = 'ryan'
			// database.get(
			// 	`SELECT * FROM users WHERE username = ?`,
			// 	[currentUser],
			// 	(error, results) => {
			// 		if (error) throw error
			// 		if (results) currentUser = results
			// 		if (currentUser.permissions == 'admin') {
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
								socket.emit('getClasses', classes)
							}
						)
					}
				}
			)
			// 	}
			// })
		})

		socket.on('getClasses', async () => {
			console.log(classes)
			socket.emit('getClasses', classes)
		})
	})

	server.listen(PORT, () => {
		console.log(`Running on port ${PORT}`)
	})
})
