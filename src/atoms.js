import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useAtomsDevtools } from 'jotai-devtools'
import { useEffect } from 'react'

const storage = createJSONStorage(() => {
	if (typeof window !== 'undefined') {
		return window.sessionStorage
	}
})

export const currentUserAtom = atomWithStorage(
	'currentUser',
	{
		username: null,
		balance: null,
		permissions: null,
		class: null,
		theme: 'dark',
		isAuthenticated: null
	},
	storage,
)
currentUserAtom.debugLabel = 'currentUser'

export const leaderBoardAtom = atomWithStorage('leaderBoard', [])
leaderBoardAtom.debugLabel = 'leaderBoardAtom'