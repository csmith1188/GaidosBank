const next = require('next')
const http = require('http')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const port = 3000

app.prepare().then(() => {
	const server = http.createServer((req, res) => {
		handle(req, res)
	})

	server.listen(port, (err) => {
		if (err) throw err
		console.log(`Running on port ${port}`)
	})
})
