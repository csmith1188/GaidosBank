import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	function handler(request, response) {
		let currentUser = request.session.username
		let { user, property, value } = request.query

		if (user) {
			if (currentUser) {
				database.get(
					`SELECT * FROM users WHERE username = ?`,
					[currentUser],
					(error, results) => {
						if (error) throw error
						if (results) currentUser = results
						if (currentUser.permissions == 'admin') {
							if (isNaN(user)) {
								database.get(
									`SELECT * FROM users where username = ?`,
									[user],
									(error, results) => {
										if (error) throw error
										if (results) user = results
										if (user[property] !== 'undefined') {
											database.run(`UPDATE users set ? = ? WHERE username = ?`,
												[property, value, user.username],
												(error, results) => {
													if (error) throw error
													response.json({ error: null })
												})
										} else response.json({ error: 'property does not exist' })
									})
							} else if (!isNaN(user) && Number.isInteger(parseFloat(user))) {
								database.get(
									`SELECT * FROM users where id = ?`,
									[user],
									(error, results) => {
										if (error) throw error
										if (results) user = result
										if (user[property] !== 'undefined') {
											database.run(`UPDATE users set ? = ? WHERE username = ?`,
												[property, value, user.username],
												(error, results) => {
													if (error) throw error
													response.json({ error: null })
												})
										} else response.json({ error: 'property does not exist', })
									})
							} else response.json({ error: 'id has to be integer' })
						} else response.json({ error: 'not admin' })
					})
			} else response.json({ error: 'not logged in' })
		} else response.json({ error: 'no user requested' })
	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)