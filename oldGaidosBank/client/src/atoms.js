const { atom } = require('jotai');

export const currentUserAtom = atom(
	{ theme: 'dark', isAuthenticated: false, transactions: {} }
)

export const leaderBoardAtom = atom([])