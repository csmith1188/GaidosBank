const next = require('next')
const http = require('http')
const socketIO = require('socket.io')
const { getIronSession } = require('iron-session')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const port = 3000

const sessionMiddleware = async (req, res, next) => {
	req.session = await getIronSession(req, res, {
		cookieName: 'my-session',
		password: 'complex_password_at_least_32_characters_long',
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production',
		},
	})
	next()
}

app.prepare().then(() => {
	const server = http.createServer((req, res) => {
		sessionMiddleware(req, res, () => {
			handle(req, res)
		})
	})

	const io = socketIO(server)

	io.use((socket, next) => {
		sessionMiddleware(socket.request, {}, next)
	})

	io.on('connection', (socket) => {
		console.log('User connected')
		if (socket.request.session.user) {
			console.log(socket)
		}

		socket.on('hi', () => {
			for (let i = 0; i < 10; i++) {
				console.log('hi')
			}
			console.log(socket.request.session)
		})
	})

	server.listen(port, () => {
		console.log(`Running on port ${port}`)
	})
})
