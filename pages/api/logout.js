import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(
	async function handler(request, response) {
		try {
			request.session.destroy()
			response.json({ error: 'none' })
		} catch (error) {
			throw error
		}
	},
	{
		cookieName: "session",
		password: "wNKp0tI)2\"b/L/K[IG'jqeK;wA$3*X*g",
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		}
	}
)