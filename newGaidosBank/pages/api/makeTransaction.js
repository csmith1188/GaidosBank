const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)
import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let sender = request.session.username;
		let receiver, amount;
		if (request.query.account) receiver = request.query.account
		else receiver = null;
		if (request.query.amount) amount = request.query.amount
		else amount = null;
		if (sender && receiver && amount) {
			database.get(
				'SELECT * FROM users WHERE username = ?', sender, (error, sender) => {
					console.log(3);
					if (error) throw error;
					if (sender) {
						response.status(200).send(sender, receiver, amount);
					} else response.status(400).send({ error: 'server' })
				})
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