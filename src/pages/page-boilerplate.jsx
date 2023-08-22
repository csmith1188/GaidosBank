import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'

export default function Boilerplate() {
	var currentUser = useAtomValue(currentUserAtom)

	return (
		<></>
	)
}
