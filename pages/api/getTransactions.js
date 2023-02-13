import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let user, transactions
		let query = 'SELECT * FROM transactions'
		if (request.query.user) user = request.query.user
		else user = null

		function sendTransactions() {
			if (transactions) {
				database.serialize(() => {
					for (let transaction of transactions) {
						database.get('SELECT username FROM USERS WHERE id=?', transaction.senderId, (error, sender) => {
							if (error) throw error
							if (sender) {
								console.log(sender);
								transaction.senderUsername = sender.username
							}
						})
						database.get('SELECT username FROM USERS WHERE id=?', transaction.receiverId, (error, receiver) => {
							if (error) throw error
							if (receiver) {
								console.log(receiver);
								transaction.receiverUsername = receiver.username
							}
						})
					}
				})
				setTimeout(() => {
					response.send(transactions)
				}, 10);
			}
			else response.send([])
		}

		if (user) {
			if (Number.isInteger(parseFloat(user))) {
				console.log(1);
				database.all(query + ' WHERE senderId=' + parseInt(user) + ' or receiverId=' + parseInt(user), (error, results) => {
					if (error) throw error
					transactions = results
					sendTransactions()
				})
			}
			else if (!isNaN(user)) response.send({ error: 'not int' })
			else {
				console.log(2);
				database.get('SELECT id FROM users WHERE username=?', user, (error, userId) => {
					if (error) throw error
					if (userId) {
						user = userId.id
						database.all(query + ' WHERE senderId=' + user + ' OR receiverId=' + user, (error, results) => {
							if (error) throw error
							transactions = results
							console.log(transactions);
							sendTransactions()
						})
					}
				})
			}
		}
		else {
			database.all(query, (error, results) => {
				if (error) throw error
				if (results) {
					transactions = results
					sendTransactions()
				}
				else response.send({ error: 'no results' })
			})
		}

	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)