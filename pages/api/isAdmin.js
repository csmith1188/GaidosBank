import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(

	async function handler(request, response) {
		let currentUser = request.session.username

		if (currentUser) {
			database.get(
				'SELECT permissions FROM users WHERE currentUser = ?',
				currentUser,
				(error, results) => {
					if (error) throw error
					if (results) {
						if (results.permissions === 'admin') response.send(true)
						else response.send(false)
					} else response.send(false)
				}
			)
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