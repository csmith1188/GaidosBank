import next from 'next'
import http from 'http'
import { Server } from 'socket.io'
import session from 'express-session'
import { getIronSession } from 'iron-session'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = 3000

const sessionMiddleware = async (request, response, next) => {
	request.session = await getIronSession(request, response, {
		cookieName: 'my-session',
		password: 'complex_password_at_least_32_characters_long',
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production',
		},
	})
	next()
}

app.prepare().then(() => {
	const server = http.createServer((request, response) => {
		sessionMiddleware(request, response, () => {
			handle(request, response)
		})
	})

	const io = new Server(server)

	io.use((socket, next) => {
		sessionMiddleware(socket.request, {}, next)
	})

	io.on('connection', (socket) => {

	})

	server.listen(PORT, () => {
		console.log(`Running on port ${PORT}`)
	})
})
