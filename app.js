const next = require('next')
const http = require('http')
const socketIO = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const port = 3000

app.prepare().then(() => {
	const server = http.createServer((req, res) => {
		handle(req, res)
	})

	const io = socketIO(server)

	io.on('connection', (socket) => {
		console.log('User connected')
		if (socket.request.session.user) {
			console.log(socket)
		}

		socket.on('hi', () => {
			for (let i = 0; i < 10; i++) {
				console.log('hi')
			}
		})
	})

	server.listen(port, () => {
		console.log(`Running on port ${port}`)
	})
})