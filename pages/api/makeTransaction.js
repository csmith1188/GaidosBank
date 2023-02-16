const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let sender = request.session.username;
		let receiver, amount;
		if (request.query.account) receiver = request.query.account
		else receiver = null;
		if (request.query.amount) amount = request.query.amount
		else amount = null;
		if (sender) {
			if (receiver != null && amount != null) {
				database.get(
					'SELECT * FROM users WHERE username = ?', sender, (error, sender) => {
						if (error) throw error;
						if (sender) {
							database.get('SELECT * FROM users WHERE username = ?', receiver, (error, receiver) => {
								if (error) throw error
								if (receiver) {
									if (amount != null) {
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
									}
								}
							})
						} else response.send({ error: 'account logged into doesn\'t exist somehow' })
					})
			} else response.send({ error: 'missing account, amount and/or item' })
		} else response.send({ error: 'not logged in' })
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