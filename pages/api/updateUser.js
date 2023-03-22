import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	function handler(request, response) {
		let currentUser, editingUser, index, property, value
		if (request.query.index) index = request.query.index
		else index = null
		if (request.query.property) property = request.query.property
		else property = null
		if (request.query.value) value = request.query.value
		else value = null

		if (request.session.username) {
			database.get(`SELECT * FROM users WHERE username='${request.session.username}'`, (error, results) => {
				if (error) throw error
				if (results) currentUser = results
				if (currentUser.permissions == 'admin') {
					database.all('SELECT * FROM users', (error, results) => {
						if (error) throw error
						if (results) {
							if (results[index]) {
								editingUser = results[index]
								console.log(editingUser, property)
								if (editingUser[property] !== 'undefined') {
									console.log(editingUser[property])
									database.exec(`UPDATE users set ${property}=${value} WHERE username='${editingUser.username}'`, (error, results) => {
										if (error) throw error
										response.json({ error: 'none', query: request.query })
									})
								} else response.json({ error: 'property does not exist' })
							} else response.json({ error: 'there is no user with that index' })
						}
					})
				} else response.json({ error: 'not admin' })
			})
		} else response.json({ error: 'not logged in' })
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