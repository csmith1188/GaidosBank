const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'
const bcrypt = require('bcrypt')

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let currentUser = request.session.username
		let { username, password } = request.query

		if (!currentUser) {
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
								async (error, isMatch) => {
									if (error) throw error
									if (isMatch) {
										request.session.username = username
										console.log(request.session)
										await request.session.save()
										response.json({
											...results,
											isAuthenticated: true,
										})
									} else response.json({ error: 'That is not the users password.' })
								}
							)
						} else response.json({ error: 'User does not exist.' })
					}
				)
			} else response.json({ error: 'Missing username or password.' })
		} else response.json({ error: 'Already logged in' })
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