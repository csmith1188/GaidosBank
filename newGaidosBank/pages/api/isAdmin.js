import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		database.get(
			'SELECT * FROM users WHERE username = ?',
			request.session.username,
			(error, results) => {
				if (error) throw error
				if (results) {
					if (results.permissions == 0) response.send(true)
					else response.send(false)
				} else response.send(false)
			}
		)
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