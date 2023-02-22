const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'

// temp
// Gaidos = dark admin
// Rev = dark student
// Kyle = light student

export default withIronSessionApiRoute(
	async function handler(request, response) {
		var currentUser = request.session.username;
		database.get(
			'SELECT * FROM users WHERE username = ?',
			currentUser,
			(error, results) => {
				if (error) throw error.message
				console.log(request.session)
				if (results) response.send(results)
				else response.send({ error: 'no user' })
			}
		)
	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)
