const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'
const bcrypt = require('bcrypt')

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let {
			id,
			username,
			password,
			confirmPassword,
			className,
			theme
		} = request.query
		let permissions = 'user'
		if (typeof theme === 'undefined') theme = 'light'
		if (
			typeof id !== 'undefined' &&
			typeof username !== 'undefined' &&
			typeof password !== 'undefined' &&
			typeof confirmPassword !== 'undefined' &&
			typeof theme !== 'undefined'
		) {
			if (password == confirmPassword) {
				console.log('hi1')
				bcrypt.hash(
					password,
					10,
					(error, hashedPassword) => {
						console.log('hi2')
						if (error) throw error
						if (hashedPassword) {
							console.log('hi3')
							database.get(
								`SELECT * FROM users WHERE username = ? OR id = ?`,
								[username, id],
								(error, results) => {
									if (error) throw error
									if (!results) {
										console.log('hi4')
										database.all('SELECT * FROM users', (error, results) => {
											if (error) throw error
											if (!results) permissions = 'admin'
											console.log('hi5')
											console.log(`INSERT INTO users(id, username, password, balance, permissions, ${className ? 'class, ' : ''}theme) VALUES(${id}, " ${className ? '"' + className + '", ' : ''}"${theme}")`)
											database.exec(
												`INSERT INTO users (id, username, password, balance, permissions, ${className ? 'class, ' : ''}theme) VALUES (?, ?, ?, ?, ?, ${className ? '"' + className + '", ' : ''}, ?)`,
												[
													id,
													username,
													hashedPassword,
													0,
													permissions,
													className,
													theme
												],
												(error, results) => {
													console.log('hi6')
													if (error) throw error
													database.get(
														`SELECT id, username, balance, permissions, theme FROM users WHERE username = ?`,
														[username],
														async (error, results) => {
															if (error) throw error
															if (results) {
																request.session.username = username
																await request.session.save()
																response.json({
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
										})
									} else response.json({ error: 'A User already has that Username or Id.' })
								}
							)
						}
					}
				)
			} else response.json({ error: 'Passwords do not match.' })
		} else response.json({ error: 'missing ID, Username, Password, Confirm Password, and/or theme.' })
	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)
