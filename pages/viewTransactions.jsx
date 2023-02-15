import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { Table } from '../components/table'

export default function ViewTransations() {
	var currentUser = useAtomValue(currentUserAtom)
	var [transactions, setTransactions] = useState([])

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [currentUser])

	useEffect(() => {
		fetch('/api/getTransactions')
			.then(response => response.json())
			.then(data => {
				setTransactions(data)
				document.getElementById('test').innerText = JSON.stringify(data)
			})
	}, [])

	let columns = [
		{ Header: 'senderId', accessor: 'senderId' },
		{ Header: 'receiverId', accessor: 'receiverId' },
		{ Header: 'senderUsername', accessor: 'senderUsername' },
		{ Header: 'receiverUsername', accessor: 'receiverUsername' },
		{ Header: 'amount', accessor: 'amount' },
		{ Header: 'timestamp', accessor: 'timestamp' }
	]

	return (
		<>
			<Table columns={columns} data={transactions} />
			<p id='test' style={{ color: 'white', fontSize: 40 }}></p>
		</>
	)
}