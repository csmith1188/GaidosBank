import { withIronSessionApiRoute } from 'iron-session/next'
const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('gaidosBank.db', sqlite3.OPEN_READWRITE)

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let filterBy, sortBy, limit
		let finalQuery = 'SELECT * FROM users'
		for (let query of Object.keys(request.query)) {
			if (query != 'filter' && query != 'sort' && query != 'limit') response.send({ error: 'Query is empty' })
		}
		if (request.query.filter) filterBy = request.query.filter
		else filterBy = null
		if (request.query.sort) sortBy = request.query.sort
		else sortBy = null
		if (request.query.limit) limit = request.query.limit
		else limit = null
		if (filterBy && finalQuery) {
			if (filterBy.startsWith('{') && filterBy.endsWith('}')) filterBy = filterBy.slice(1, -1).split(',')
			if (filterBy) finalQuery += ' WHERE'
			for (let filter of filterBy) {
				if (filter.startsWith('balance'))
					finalQuery += ' ' + filter
				else if (filter.startsWith('permissions')) {
					finalQuery += ' permissions="' + filter.slice(12) + '"'
				} else response.send({ error: 'filter' + filter + 'doesn\'t exist' })
				if (filterBy.indexOf(filter) < filterBy.length - 1)
					finalQuery += ' AND'
			}
		}
		if (sortBy && finalQuery) {
			if (sortBy.startsWith('{') && sortBy.endsWith('}')) sortBy = sortBy.slice(1, -1).split(',')

			if (sortBy) finalQuery += ' ORDER BY'
			for (let sort of sortBy) {
				let splitSort = sort.split(':')
				if (splitSort[0] == 'id' || splitSort[0] == 'username' || splitSort[0] == 'balance')
					finalQuery += ' ' + splitSort[0]
				else response.send({ error: 'sort' + sort + 'doesn\'t exist' })
				if (splitSort[1] == 'ASC' || splitSort[1] == 'DESC') finalQuery += ' ' + splitSort[1]
				else if (splitSort[1]) response.send({ error: 'server' })
				else {
					finalQuery += ' DESC'
				}
				if (sortBy.indexOf(sort) < sortBy.length - 1) {
					finalQuery += ','
				}
			}
		}
		if (limit) {
			if (!isNaN(limit)) finalQuery += ' LIMIT ' + limit
			else response.send({ error: 'limit has to be number' })
		}
		if (finalQuery) {
			database.all(
				finalQuery,
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