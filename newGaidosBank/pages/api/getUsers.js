import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let filterBy, sortBy, limit;
		let query = 'SELECT * FROM users'
		for (let query of Object.keys(request.query)) {
			if (query != 'filter' && query != 'sort' && query != 'limit') response.sendStatus(400)
		}
		if (request.query.filter) filterBy = request.query.filter
		else filterBy = null
		if (request.query.sort) sortBy = request.query.sort
		else sortBy = null
		if (request.query.limit) limit = request.query.limit
		else limit = null
		if (filterBy && query) {
			if (filterBy.startsWith('{') && filterBy.endsWith('}')) filterBy = filterBy.slice(1, -1).split(',')
			if (filterBy) query += ' WHERE'
			for (let filter of filterBy) {
				if (filter.startsWith('balance'))
					query += ' ' + filter
				else if (filter.startsWith('permissions')) {
					query += ' permissions="' + filter.slice(12) + '"'
				} else response.send({ error: 'filter' + filter + 'doesn\'t exist' })
				if (filterBy.indexOf(filter) < filterBy.length - 1)
					query += ' AND'
			}
		}
		if (sortBy && query) {
			if (sortBy.startsWith('{') && sortBy.endsWith('}')) sortBy = sortBy.slice(1, -1).split(',')

			if (sortBy) query += ' ORDER BY'
			for (let sort of sortBy) {
				let splitSort = sort.split(':')
				if (splitSort[0] == 'id' || splitSort[0] == 'username' || splitSort[0] == 'balance')
					query += ' ' + splitSort[0]
				else response.send({ error: 'sort' + sort + 'doesn\'t exist' })
				if (splitSort[1] == 'ASC' || splitSort[1] == 'DESC') query += ' ' + splitSort[1]
				else if (splitSort[1]) response.send({ error: 'server' })
				else {
					query += ' DESC'
				}
				if (sortBy.indexOf(sort) < sortBy.length - 1) {
					query += ','
				}
			}
		}
		if (limit) {
			if (!isNaN(limit)) query += ' LIMIT ' + limit
			else response.send({ error: 'limit has to be number' })
		}
		if (query) {
			database.all(
				query,
				(error, results) => {
					if (error) throw error
					if (results) response.send(results)
					else response.send({ error: 'no results' })
				}
			)
		} else response.send({ error: 'no query somehow' })
	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)