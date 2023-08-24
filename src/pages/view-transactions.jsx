import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import { useEffect, useState } from 'react'
import { Table } from '../components/table'
import Head from 'next/head'
import { io } from 'socket.io-client'
import * as Text from '../components/styled/text'

const socket = io()

export default function ViewTransactions() {
	const currentUser = useAtomValue(currentUserAtom)
	const [transactions, setTransactions] = useState([])

	useEffect(() => {
		socket.emit('getTransactions')

		socket.on('sendTransactions', (data) => {
			let username = currentUser.username
			if (
				!username
			) {
				username = JSON.parse(sessionStorage.getItem('currentUser')).username
			}
			if (username) {
				data = data.filter(transaction =>
					transaction.sender === username ||
					transaction.receiver === username
				)

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
			}
		})

		return () => {
			socket.off('sendTransactions')
		}
	}, [])

	// useEffect(() => {
	// 	if (currentUser) socket.emit('getTransactions')
	// }, [currentUser])


	let columns = [
		{
			header: 'Sender Username',
			accessorKey: 'sender',
			sortingFn: 'alphanumeric'
		},
		{
			header: 'Receiver Username',
			accessorKey: 'receiver',
			sortingFn: 'alphanumeric'
		},
		{
			header: 'Amount',
			accessorKey: 'amount',
			sortingFn: 'basic'
		},
		{
			header: 'Timestamp',
			accessorKey: 'readableTimestamp',
			sortingFn: (rowA, rowB, id) => {
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
			<Text.H1
				theme={currentUser.theme}
			>
				View Transaction
			</Text.H1>
			{transactions.length > 0 ?
				<Table
					columns={columns}
					data={transactions}
					enableFilters={true}
					enableSorting={true}
				/>
				: <Text.H1 theme={currentUser.theme}>No Transactions Found</Text.H1>
			}
		</div >
	)
}