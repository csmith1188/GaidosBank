import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import { useEffect } from 'react'

export default function ViewTransations() {
	var currentUser = useAtomValue(currentUserAtom)

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [])

	return (
		<div></div>
	)
}