const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'
const bcrypt = require('bcrypt')

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let id, username, password, confirmPassword, theme;
		if (request.query.id) id = request.query.id
		else id = null
		if (request.query.username) username = request.query.username
		else username = null
		if (request.query.password) password = request.query.password
		else password = null
		if (request.query.confirmPassword) confirmPassword = request.query.confirmPassword
		else confirmPassword = null
		if (request.query.theme) theme = request.query.theme
		else theme = 'light'

		console.log({
			id: id,
			username: username,
			password: password,
			confirmPassword: confirmPassword,
			theme: theme,
			if: {
				id: id !== null && id !== 'undefined',
				username: username !== null && username !== 'undefined',
				password: password !== null && password !== 'undefined',
				confirmPassword: confirmPassword !== null && confirmPassword !== 'undefined',
				theme: theme !== null && theme !== 'undefined',
				all: (
					id !== null && id !== 'undefined' &&
					username !== null && username !== 'undefined' &&
					password !== null && password !== 'undefined' &&
					confirmPassword !== null && confirmPassword !== 'undefined' &&
					theme !== null && theme !== 'undefined'
				)
			}
		})
		if (
			id !== null && id !== 'undefined' &&
			username !== null && username !== 'undefined' &&
			password !== null && password !== 'undefined' &&
			confirmPassword !== null && confirmPassword !== 'undefined' &&
			theme !== null && theme !== 'undefined'
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
									database.get(
										'INSERT INTO users (id, username, password, balance, permissions, theme) VALUES (?, ?, ?, ? , ?, ?)',
										[id, username, hashedPassword, 0, 'user', theme],
										(error, results) => {
											if (error) throw error
											database.get('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
												if (error) throw error
												if (results) {
													request.session.username = username
													// fetch('/api/login?username=' + username + '&password=' + password)
													// 	.then(loginResponse => loginResponse.json())
													// 	.then(data => {
													// 		console.log(3);
													// 		console.log(data);
													// 	})
													response.send(results)
												}
											})
										}
									)
								} else response.send({ error: 'A User already has that Username or Id.' })
							}
						)
					}
				)
			} else response.send({ error: 'Passwords do not match.' })
		} else response.send({ error: 'missing ID, Username, Password or Confirm Password.' })
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
