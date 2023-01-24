const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'
const bcrypt = require('bcrypt')

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let username = request.session.username;
		username = 'Rev'
		let currentPassword, newPassword, confirmNewPassword;
		if (request.query.currentPassword) currentPassword = request.query.currentPassword
		else currentPassword = null
		if (request.query.newPassword) newPassword = request.query.newPassword
		else newPassword = null
		if (request.query.confirmNewPassword)
			confirmPassword = request.query.confirmNewPassword
		else confirmNewPassword = null
		if (newPassword && confirmNewPassword && newPassword == confirmNewPassword) {
			database.get(
				'SELECT password FROM users WHERE username = ?',
				[username],
				(error, results) => {
					if (error) throw error
					if (results) {
						bcrypt.compare(
							currentPassword,
							results.password,
							(error, isMatch) => {
								if (error) throw error
								if (isMatch) {
									bcrypt.hash(newPassword, 10, (error, hashedPassword) => {
										if (error) throw error
										database.get(
											'UPDATE users SET password = ? WHERE username = ?',
											[hashedPassword, username],
											(error, results) => {
												if (error) throw error
												if (results) response.status(200).send({ error: 'none' })
												else response.status(404).send({ error: 'server' })
											}
										)
									})
								} else response.status(404).send({ error: 'server' })
							}
						)
					} else response.status(400).send({ error: 'server' })
				}
			)
		} else response.status(400).send({ error: 'server' })
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