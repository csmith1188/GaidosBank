import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let username, id;
		let query = 'SELECT * FROM users WHERE '
		if (request.query.id) id = request.query.id
		else id = null

		if (request.query.username) username = request.query.username
		else username = null
		if (username && id) response.status(400).send({ error: 'can\'t have both username and id' })
		else {
			if (id && !isNaN(id))
				query += 'id=' + id + ''
			else if (username && isNaN(username))
				query += 'username="' + username + '"'
			else response.status(400).send({ error: 'server error' })
		}
		console.log(username, id);
		if (username || id) {
			if (query) {
				database.get(
					query,
					(error, results) => {
						if (error) throw error
						if (results) response.status(200).send(results)
						else response.status(404).send({ error: 'no results' })
					}
				)
			} else response.status(400).send({ error: 'server error' })
		} else response.status(400).send({ error: 'missing username or id' })
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