import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		database.all(
			'SELECT t.*, s.username AS senderUsername, r.username AS receiverUsername FROM transactions t LEFT JOIN users s ON s.id = t.senderId LEFT JOIN users r ON r.id = t.receiverId',
			(error, results) => {
				if (error) throw error
				if (results) {
					response.json(results)
				} else response.json({ error: 'no results' })
			})
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