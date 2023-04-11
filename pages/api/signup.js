const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'
const bcrypt = require('bcrypt')

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let {
			id,
			username,
			password,
			confirmPassword,
			theme
		} = request.query
		if (typeof theme === 'undefined') theme = 'light'
		console.log(id, username, password, confirmPassword, theme)
		if (
			typeof id !== 'undefined' &&
			typeof username !== 'undefined' &&
			typeof password !== 'undefined' &&
			typeof confirmPassword !== 'undefined' &&
			typeof theme !== 'undefined'
		) {
			if (password == confirmPassword) {
				bcrypt.hash(
					password,
					10,
					(error, hashedPassword) => {
						if (error) throw error
						database.get(
							'SELECT * FROM users WHERE username = ? OR id =?',
							[username, id],
							(error, results) => {
								if (error) throw error
								if (!results) {
									console.log(id, username, hashedPassword, theme)
									database.get(
										'INSERT INTO users (id, username, password, balance, permissions, theme) VALUES (?, ?, ?, ? , ?, ?)',
										[id, username, hashedPassword, 0, 'user', theme],
										(error, results) => {
											if (error) throw error
											database.get(
												'SELECT * FROM users WHERE username = ?',
												[username],
												async (error, results) => {
													if (error) throw error
													if (results) {
														request.session.username = username
														console.log(id, username, theme)
														response.send({
															id: id,
															username: username,
															balance: 0,
															permissions: 'user',
															theme: theme,
															isAuthenticated: true,
														})
													}
												}
											)
										}
									)
								} else response.send({ error: 'A User already has that Username or Id.' })
							}
						)
					}
				)
			} else response.send({ error: 'Passwords do not match.' })
		} else response.send({ error: 'missing ID, Username, Password, Confirm Password, and/or theme.' })
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
