import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let user
		let query = 'SELECT * FROM transactions'
		if (request.query.user) user = request.query.user
		else user = null
		if (parseInt(user) == NaN)
			username = user
		else id = user

		if (user) {
			query += ' Where '
			if (Number.isInteger(parseFloat(user))) {
				database.all(query + 'senderId=' + parseInt(user) + ' or receiverId=' + parseInt(user), (error, results) => {
					if (error) throw error
					if (results)
						response.send(results)
					else response.send({ error: 'no results' })
				})
			}
			else response.send({ error: 'not int' })
		}
		else {
			database.all(query, (error, results) => {
				if (error) throw error
				if (results)
					response.send(results)
				else response.send({ error: 'no results' })
			})
		}

	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)