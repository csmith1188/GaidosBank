const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'
const bcrypt = require('bcrypt')

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let username = request.session.username
		username = 'Rev'
		let {
			currentPassword,
			newPassword,
			confirmNewPassword } = request.query.confirmNewPassword

		if (
			typeof currentPassword !== 'undefined' &&
			typeof newPassword !== 'undefined' &&
			typeof confirmNewPassword !== 'undefined'
		) {
			if (newPassword == confirmNewPassword) {
				database.get(
					`SELECT password FROM users WHERE username = ?`,
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
												`UPDATE users SET password = ? WHERE username = ?`,
												[hashedPassword, username],
												(error, results) => {
													if (error) throw error
													if (results) response.json({ error: 'none' })
													else response.json({ error: 'couldn\'t change password' })
												}
											)
										})
									} else response.json({ error: 'password not found' })
								}
							)
						} else response.json({ error: 'user not found' })
					}
				)
			} else response.json({ error: 'newPassword and confirmNewPassword don\'t match' })
		} else response.json({ error: 'missing currentPassword and/or newPassword and/or confirmNewPassword' })
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