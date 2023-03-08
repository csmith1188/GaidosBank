const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'
const bcrypt = require('bcrypt')

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let username, password;
		if (request.query.username) username = request.query.username
		else username = null
		if (request.query.password) password = request.query.password
		else password = null
		if (username && password) {
			database.get(
				'SELECT * FROM users WHERE username = ?',
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
									request.session.username = username
									request.session.save()
									setTimeout(() => {
										response.send({
											balance: results.balance,
											username: results.username,
											id: results.id,
											permissions: results.permissions,
											theme: results.theme,
											isAuthenticated: true,
											session: request.session
										})
									}, 10)
								} else response.send({ isAuthenticated: false })
							}
						)
					} else response.send({ isAuthenticated: false })
				}
			)
		} else response.send({ isAuthenticated: false })
	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)