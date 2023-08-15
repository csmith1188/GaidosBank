import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import { useEffect, useState } from 'react'
import { Table } from '../components/table'
import Head from 'next/head'
import { io } from 'socket.io-client'

const socket = io()

export default function ViewTransactions() {
	var currentUser = useAtomValue(currentUserAtom)
	var [transactions, setTransactions] = useState([])


	useEffect(() => {
		socket.emit('getTransactions', currentUser.username)

		socket.on('sendTransactions', (data) => {
			for (let transaction of data) {
				const monthNames = ["January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November", "December"
				]
				transaction.timestamp.month = monthNames[transaction.timestamp.month - 1]
				if (transaction.timestamp.hours > 12) transaction.timestamp.hours = transaction.timestamp.hours - 12
				else transaction.timestamp.hours = transaction.timestamp.hours
				transaction.readableTimestamp = transaction.timestamp.month + ' / ' + transaction.timestamp.day + ' / ' + transaction.timestamp.year + ' at ' + transaction.timestamp.hours + ' : ' + transaction.timestamp.minutes + ' : ' + transaction.timestamp.seconds + (transaction.timestamp.hours > 12 ? ' PM' : ' AM')
			}
			if (JSON.stringify(data) !== JSON.stringify(transactions)) setTransactions(data)
		})

		socket.off('sendTransactions')
	}, [])

	let columns = [
		{
			Header: 'Sender Username',
			accessor: 'sender',
			sortType: 'alphanumeric',
			sortInverted: true
		},
		{
			Header: 'Receiver Username',
			accessor: 'receiver',
			sortType: 'alphanumeric',
			sortInverted: true
		},
		{
			Header: 'Amount',
			accessor: 'amount',
			sortType: 'basic',
			sortInverted: true
		},
		{
			Header: 'Timestamp',
			accessor: 'readableTimestamp',
			sortInverted: true,
			sortType: (rowA, rowB, id) => {
				let timestampA = transactions.find((transaction) => transaction.readableTimestamp == rowA.original[id]).timestamp
				let timestampB = transactions.find((transaction) => transaction.readableTimestamp == rowB.original[id]).timestamp
				const timestamps = [
					['year', timestampA.year, timestampB.year],
					['month', timestampA.month, timestampB.month],
					['day', timestampA.day, timestampB.day],
					['hours', timestampA.hours, timestampB.hours],
					['minutes', timestampA.minutes, timestampB.minutes],
					['seconds', timestampA.seconds, timestampB.seconds],
				]

				for (const [unit, a, b] of timestamps) {
					if (a < b) {
						return -1
					}
					if (a > b) {
						return 1
					}
				}

				return 0
			}
		}
	]

	return (
		<div id='viewTransactionsTable'>
			<Head>
				<title>View Transaction</title>
			</Head>
			<Table
				columns={columns}
				data={transactions}
				sortable={true}
				sortBy={[{ id: 'readableTimestamp', desc: false }]}
				canFilter={true}
			/>
		</div >
	)
}