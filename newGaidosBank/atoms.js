import { atom } from 'jotai'
import { useAtomsDevtools } from 'jotai/devtools'

export const currentUserAtom = atom(
	{ theme: 'dark', isAuthenticated: false, transactions: [], balance: 0 }
)
currentUserAtom.debugLabel = 'currentUserAtom'

export const leaderBoardAtom = atom([])
leaderBoardAtom.debugLabel = 'leaderBoardAtom'

export const DebugAtoms = () => {
	useAtomsDevtools('atoms')
}