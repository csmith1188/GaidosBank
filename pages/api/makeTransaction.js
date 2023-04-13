const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let sender = request.session.username
		let receiver = request.query.account
		let amount
		if (
			request.query.amount &&
			Number.isInteger(Number(request.query.amount)) &&
			Number(request.query.amount) > 0
		) amount = Number.parseInt(request.query.amount)
		else amount = null

		if (typeof sender !== 'undefined') {
			if (
				typeof receiver !== 'undefined' &&
				typeof amount !== 'undefined'
			) {
				database.get(
					'SELECT * FROM users WHERE username = ?  OR id = ?', [sender, sender], (error, sender) => {
						if (error) throw error
						if (sender) {
							database.get('SELECT * FROM users WHERE username = ? OR id = ?', [receiver, receiver], (error, receiver) => {
								if (error) throw error
								if (receiver) {
									if (sender.username !== receiver.username) {
										if (sender.balance >= amount) {
											database.run('UPDATE users SET balance=? WHERE id=?', [(sender.balance - amount), sender.id], (error, results) => {
												if (error) throw error
											})
											database.run('UPDATE users SET balance=? WHERE id=?', [(receiver.balance + amount), receiver.id], (error, results) => {
												if (error) throw error
											})
											let date = new Date()
											date = {
												year: date.getFullYear(),
												month: date.getMonth() + 1,
												day: date.getDate(),
												hours: date.getHours(),
												minutes: date.getMinutes(),
												seconds: date.getSeconds()
											}
											database.run('INSERT INTO transactions (senderId, receiverId, amount, timestamp) VALUES (?, ?, ?, ?)', [sender.id, receiver.id, amount, JSON.stringify(date)], (error, results) => {
												if (error) throw error
											})
											response.send({ error: 'none' })
										} else {
											console.log('You don\'t have enough money')
											response.send({ error: 'You don\'t have enough money' })
										}
									} else response.send({ error: 'You can\'t send money to yourself.' })
								} else response.send({ error: 'Receiver does not exist.' })
							})
						} else response.send({ error: 'Account logged into doesn\'t exist somehow.' })
					})
			} else response.send({ error: 'Missing account and/or amount.' })
		} else response.send({ error: 'Not logged in.' })
	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)