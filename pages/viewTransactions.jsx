import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import { useEffect, useMemo } from 'react'

import { useTable } from 'react-table'

export default function ViewTransations() {
	var currentUser = useAtomValue(currentUserAtom)
	var transactions = []

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [currentUser])

	// useEffect(() => {
	// 	fetch('/api/getTransactions')
	// 		.then(response => response.json())
	// 		.then(data => {
	// 			transactions = data
	// 			document.getElementById('test').innerText = JSON.stringify(transactions)
	// 		})
	// }, [])

	return (
		<>
			<p id='test' style={{ color: 'white', fontSize: 40 }}></p>
		</>
	)
} 