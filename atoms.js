import { atomWithStorage } from 'jotai/utils'
import { useAtomsDevtools } from 'jotai/devtools'

export const currentUserAtom = atomWithStorage('currentUser',
	{
		theme: 'dark',
		isAuthenticated: false,
		transactions: [],
		balance: 0
	}
)
currentUserAtom.debugLabel = 'currentUserAtom'

export const leaderBoardAtom = atomWithStorage('leaderBoard', [])
leaderBoardAtom.debugLabel = 'leaderBoardAtom'

export const DebugAtoms = (({ children }) => {
	useAtomsDevtools("atoms")
	return children
})