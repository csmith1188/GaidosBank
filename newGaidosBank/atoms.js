import { atom } from 'jotai'
import { useAtomsDevtools } from 'jotai/devtools'

export const currentUserAtom = atom(
	{
		theme: 'dark',//local storage
		isAuthenticated: false,//session storage
		transactions: [],//local storage
		balance: 0//local storage
	}
)
currentUserAtom.debugLabel = 'currentUserAtom'

export const leaderBoardAtom = atom([])
leaderBoardAtom.debugLabel = 'leaderBoardAtom'

export const DebugAtoms = () => {
	useAtomsDevtools('atoms')
}