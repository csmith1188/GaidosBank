import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let currentUser = request.session.username
		let {
			currentClass,
			newClass
		} = request.query

		if (currentUser) {
			database.get(
				`SELECT * FROM users WHERE username = ?`,
				[currentUser],
				(error, results) => {
					if (error) throw error
					if (results) currentUser = results
					if (currentUser.permissions == 'admin') {
						database.all(
							'SELECT * FROM classes',
							(error, results) => {
								if (error) throw error
								let classes = results.map(result => result.class)
								if (classes.includes(currentClass)) {
									if (!classes.includes(newClass)) {
										database.run('UPDATE classes SET class = ? WHERE class = ?',
											[newClass, currentClass],
											(error, results) => {
												if (error) throw error
												database.run(
													'UPDATE users SET class = ? WHERE class = ?',
													[newClass, currentClass],
													(error, results) => {
														if (error) throw error
														response.json({ error: 'none' })
													}
												)
											}
										)
									} else response.json({ error: 'new class already exist' })
								} else response.json({ error: 'current class does not exist' })
							}
						)
					} else response.json({ error: 'not admin' })
				})
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