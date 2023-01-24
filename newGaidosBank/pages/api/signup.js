const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'
const bcrypt = require('bcrypt')

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let username, password, confirmPassword;
		if (request.query.username) username = request.query.username
		else username = null
		if (request.query.password) password = request.query.password
		else password = null
		if (request.query.confirmPassword) confirmPassword = request.query.confirmPassword
		else confirmPassword = null
		if (username && password && confirmPassword) {
			database.get(
				'SELECT * FROM users WHERE username = ?',
				[username],
				(error, results) => {
					if (error) throw error
					console.log(error, results);
					if (!results) {
						if (password == confirmPassword) {
							bcrypt.hash(
								password,
								10,
								(error, hashedPassword) => {
									console.log(hashedPassword);
									if (error) throw error
									database.get(
										'INSERT INTO users (username, password, balance, permissions, theme) VALUES (?, ?, ?, ? , ?)',
										[username, hashedPassword, 0, 'user', 'light'],
										(error, results) => {
											console.log(error, results);
											if (results) {
												if (error) throw error
												request.session.username = username
												response.status(200).send({ error: 'none' })
											} else response.status(404).send({ error: 'server' })
										}
									)
								}
							)
						} else response.status(400).send({ error: 'password do not match' })
					} else response.status(409).send({ error: 'user exist' })
				}
			)
		} else response.status(400).send({ error: 'missing username, password or confirmPassword' })
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
