import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let { name } = request.query
		console.log(name)

		database.get(
			'SELECT value FROM settings WHERE name = ?',
			[name],
			(error, results) => {
				if (error) throw error
				if (results) response.json(results.value)
				else response.json({ error: 'no results' })
			}
		)
	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)

process.on('exit', () => {
	database.close()
})