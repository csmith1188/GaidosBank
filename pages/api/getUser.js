import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let user = request.query.user

		if (typeof user !== 'undefined') {
			if (isNaN(user)) {
				database.get(`SELECT id, username, balance, permissions, theme FROM users WHERE username="${user}"`, (error, results) => {
					if (error) throw error
					if (results) response.send(results)
					else response.send({ error: 'no results' })
				})
			} else if (!isNaN(user) && Number.isInteger(parseFloat(user))) {
				database.get(`SELECT id, username, balance, permissions, theme FROM users WHERE id=${parseInt(user)}`, (error, results) => {
					if (error) throw error
					if (results) response.send(results)
					else response.send({ error: 'no results' })
				})
			} else response.send({ error: 'id has to be integer' })
		} else response.send({ error: 'no user requested' })

	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)