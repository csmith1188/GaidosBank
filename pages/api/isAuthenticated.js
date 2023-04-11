import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(
	async function handler(request, response) {
		let currentUser = request.session.username

		if (currentUser) response.send(true)
		else response.send(false)
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