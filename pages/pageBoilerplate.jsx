import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'

export default function boilerplate() {
	var currentUser = useAtomValue(currentUserAtom)

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [currentUser.isAuthenticated])

	return (
		//html
	)
}
