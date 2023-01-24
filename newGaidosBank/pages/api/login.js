const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'
const bcrypt = require('bcrypt')

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let username, password;
		if (request.query.username) username = request.query.username
		else username = null
		if (request.query.password) password = request.query.password
		else password = null
		if (username && password) {
			database.get(
				'SELECT * FROM users WHERE username = ?',
				[username],
				(error, results) => {
					if (error) throw error
					if (results) {
						let databasePassword = results.password
						bcrypt.compare(
							password,
							databasePassword,
							(error, isMatch) => {
								if (error) throw error
								if (isMatch) {
									request.session.username = username
									console.log(request.session);
									response.status(200).send({ error: 'none' })
								} else response.status(404).send({ error: 'server' })
							}
						)
					} else response.status(403).send({ error: 'server' })
				}
			)
		} else response.status(400).send({ error: 'server' })
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