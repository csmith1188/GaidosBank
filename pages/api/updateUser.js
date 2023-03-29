import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	function handler(request, response) {
		let currentUser, user, property, value
		if (request.query.user) user = request.query.user
		else user = null
		if (request.query.property) property = request.query.property
		else property = null
		if (request.query.value) value = request.query.value
		else value = null

		if (user) {
			if (request.session.username) {
				database.get(`SELECT * FROM users WHERE username='${request.session.username}'`, (error, results) => {
					if (error) throw error
					if (results) currentUser = results
					if (currentUser.permissions == 'admin') {
						if (isNaN(user)) {
							database.get(`SELECT * FROM users where username='${user}'`, (error, results) => {
								if (error) throw error
								if (results) user = results
								if (user[property] !== undefined) {
									database.run(`UPDATE users set ${property}='${value}' WHERE username='${user.username}'`, (error, results) => {
										if (error) throw error
										response.json({ error: null })
									})
								} else response.json({ error: 'property does not exist' })
							})
						}
						else if (!isNaN(user) && Number.isInteger(parseFloat(user))) {
							database.get(`SELECT * FROM users where id='${user}'`, (error, results) => {
								if (error) throw error
								if (results) user = result
								if (user[property] !== undefined) {
									database.run(`UPDATE users set ${property}='${value}' WHERE username='${user.username}'`, (error, results) => {
										if (error) throw error
										response.json({ error: null })
									})
								} else response.json({ error: 'property does not exist', })
							})
						} else response.json({ error: 'id has to be integer' })
					} else response.json({ error: 'not admin' })
				})
			} else response.json({ error: 'not logged in' })
		} else response.send({ error: 'no user requested' })
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