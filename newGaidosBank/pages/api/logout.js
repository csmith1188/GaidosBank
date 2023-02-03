import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(
	async function handler(request, response) {
		request.session.username = null
		response.status(200).send({ error: 'none' })
	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)