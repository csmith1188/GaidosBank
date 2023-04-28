import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let { user } = request.query

		if (typeof user !== 'undefined') {
			database.get(
				`SELECT id, username, balance, permissions, theme FROM users WHERE username = ? or id = ?`,
				[user, user],
				(error, results) => {
					if (error) throw error
					if (results) response.json(results)
					else response.json({ error: 'no results' })
				})
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