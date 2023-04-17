const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'
const bcrypt = require('bcrypt')

export default withIronSessionApiRoute(
	function handler(request, response) {
		let currentUser = request.session.username
		let { username, password } = request.query

		if (typeof currentUser !== 'undefined') {
			database.get(
				`SELECT permissions FROM users WHERE username = ?`,
				[currentUser],
				(error, results) => {
					if (error) throw error
					if (results) {
						if (results.permissions === 'admin') {
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
														database.exec(
															'DELETE FROM users WHERE username = ?',
															[username],
															(error, results) => {
																if (error) throw error
																if (results) response.json({ error: 'none' })
																else response.json({ error: 'server no user' })
															}
														)
													} else response.json({ error: 'That is not the users password.' })
												}
											)
										}
									})
							} else response.json({ error: 'missing username or password' })
						}
						else response.json({ error: 'not admin' })
					} else response.json({ error: 'not admin' })
				}
			)
		} else response.json({ error: 'not logged in' })
	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)

process.on('exit', () => {
	database.close()
})