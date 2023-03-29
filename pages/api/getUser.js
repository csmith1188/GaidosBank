import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let user, username, id
		let query = 'SELECT * FROM users WHERE '
		if (request.query.user) user = request.query.user
		else user = null

		if (user) {
			if (isNaN(user)) {
				database.get(query + 'username="' + user + '"', (error, results) => {
					if (error) throw error
					if (results) response.send(results)
					else response.send({ error: 'no results' })
				})
			}
			else if (!isNaN(user) && Number.isInteger(parseFloat(user))) {
				database.get(query + 'id=' + parseInt(user), (error, results) => {
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