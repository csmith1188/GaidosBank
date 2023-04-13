import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()

const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let currentUser = request.session.username

		database.get(
			'SELECT * FROM users WHERE username = ?',
			currentUser,
			(error, results) => {
				if (error) throw error
				if (results) {
					response.send(results)
				} else {
					response.send({ error: 'no user' })
				}
			}
		)
	},
	{
		cookieName: 'session',
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production',
		},
	}
)

process.on('exit', () => {
	database.close()
})