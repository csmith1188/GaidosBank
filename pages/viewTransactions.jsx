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
		// fetch('/api/getTransactions?user=' + currentUser.username)
		fetch('/api/getTransactions')
			.then(response => response.json())
			.then(data => {
				for (let transaction of data) {
					transaction.timestamp = JSON.parse(transaction.timestamp)
					const monthNames = ["January", "February", "March", "April", "May", "June",
						"July", "August", "September", "October", "November", "December"
					]
					transaction.timestamp.month = monthNames[transaction.timestamp.month - 1]
					if (transaction.timestamp.hours > 12)
						transaction.timestamp.hours = transaction.timestamp.hours - 12 + ' PM'
					else transaction.timestamp.hours = transaction.timestamp.hours + ' AM'
					transaction.timestamp = transaction.timestamp.month + ' / ' + transaction.timestamp.day + ' / ' + transaction.timestamp.year + ' at ' + transaction.timestamp.hours + ' : ' + transaction.timestamp.minutes + ' : ' + transaction.timestamp.seconds
				}
				setTransactions(data)
				document.getElementById('test').innerText = JSON.stringify(data)
			})
	}, [])

	let columns = [
		{ Header: 'Sender ID', accessor: 'senderId' },
		{ Header: 'Sender Username', accessor: 'senderUsername' },
		{ Header: 'Receiver ID', accessor: 'receiverId' },
		{ Header: 'Receiver Username', accessor: 'receiverUsername' },
		{ Header: 'Amount', accessor: 'amount' },
		{ Header: 'Timestamp', accessor: 'timestamp' }
	]

	return (
		<>
			<Table columns={columns} data={transactions} id='viewTransactionsTable' />
			<p id='test' style={{ color: 'white', fontSize: 15 }}></p>
		</>
	)
}