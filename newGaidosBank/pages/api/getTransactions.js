import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let user, transactions
		let query = 'SELECT * FROM transactions'
		if (request.query.user) user = request.query.user
		else user = null



		async function getUsernames() {
			if (transactions) {
				for (let transaction of transactions) {
					database.get('SELECT username FROM users WHERE id=?', transaction.senderId, (error, sender) => {
						if (error) throw error
						if (sender) {
							transaction.senderUsername = sender.username
							// console.log(transaction)
						}
					})
					database.get('SELECT username FROM users WHERE id=?', transaction.receiverId, (error, receiver) => {
						if (error) throw error
						if (receiver) {
							transaction.receiverUsername = receiver.username
							// console.log(transaction)
						}
					})
				}
			}
			else response.send({ error: 'no results' })
		}

		if (user) {
			query += ' WHERE '
			if (Number.isInteger(parseFloat(user))) {
				database.all(query + 'senderId=' + parseInt(user) + ' or receiverId=' + parseInt(user), (error, results) => {
					if (error) throw error
					transactions = results
					getUsernames().then(set)
					response.send(transactions)
				})
			}
			else if (!isNaN(user)) response.send({ error: 'not int' })
			else {
				database.get('SELECT id FROM users WHERE username=?', user, (error, results) => {
					if (error) throw error
					user = results.id
					database.all(query + 'senderId=' + parseInt(user) + ' or receiverId=' + parseInt(user), (error, results) => {
						if (error) throw error
						if (results)
							response.send(results)
						else response.send({ error: 'no results' })
					})
				})
			}
		}
		else {
			database.all(query, (error, results) => {
				if (error) throw error
				if (results)
					response.send(results)
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