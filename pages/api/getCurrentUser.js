const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

// temp
// Gaidos = dark admin
// Rev = dark student
// Kyle = light student
var currentUser = 'Gaidos'

export default function handler(request, response) {
	database.get(
		'SELECT * FROM users WHERE username = ?',
		currentUser,
		(error, results) => {
			if (error) throw error.message
			if (results) response.send(results)
			else response.send({ error: 'no user' })
		}
	)
}
