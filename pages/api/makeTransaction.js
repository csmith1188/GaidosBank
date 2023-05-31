const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(async function handler(request, response) {
	let sender = request.session.username
	let receiver = request.query.account
	let amount
	if (amount && Number.isInteger(Number(amount)) && Number(amount) > 0) {
		amount = Number(amount)
	} else {
		amount = null
	}

	if (typeof sender !== 'undefined') {
		if (typeof amount !== 'undefined') {
			database.serialize(() => {
				database.get('SELECT * FROM users WHERE username = ? OR id = ?', [sender, sender], (error, senderData) => {
					if (error) throw error
					if (senderData) {
						if (senderData.class) {
							database.get('SELECT * FROM users WHERE username = ? OR id = ?', [receiver, receiver], (error, receiverData) => {
								if (error) throw error
								if (receiverData) {
									if (senderData.username !== receiverData.username) {
										if (senderData.balance >= amount) {
											database.run('BEGIN TRANSACTION', () => {
												database.run('UPDATE users SET balance = ? WHERE id = ?', [senderData.balance - amount, senderData.id], (error, results) => {
													if (error) {
														database.run('ROLLBACK')
														throw error
													}
												})
												database.run('UPDATE users SET balance = ? WHERE id = ?', [receiverData.balance + amount, receiverData.id], (error, results) => {
													if (error) {
														database.run('ROLLBACK')
														throw error
													}
												})
												let date = new Date()
												date = {
													year: date.getFullYear(),
													month: date.getMonth() + 1,
													day: date.getDate(),
													hours: date.getHours(),
													minutes: date.getMinutes(),
													seconds: date.getSeconds(),
												}
												database.run(
													'INSERT INTO transactions (senderId, receiverId, amount, timestamp) VALUES (?, ?, ?, ?)',
													[sender.id, receiver.id, amount, JSON.stringify(date)],
													(error, results) => {
														if (error) {
															database.run('ROLLBACK')
															throw error
														}
														database.run('COMMIT')
														response.json({ error: 'none' })
													}
												)
											})
										} else response.json({ error: "You don't have enough money" })
									} else response.json({ error: "You can't send money to yourself." })
								} else response.json({ error: 'receiverData does not exist.' })
							})
						} else response.json({ error: "You are not in a class." })
					} else response.json({ error: "Account logged into doesn't exist somehow." })
				})
			})
		} else {
			response.json({ error: 'Missing account and/or amount.' })
		}
	} else {
		response.json({ error: 'Not logged in.' })
	}
}, {
	cookieName: 'session',
	password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},
})
