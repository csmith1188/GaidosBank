import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { Table } from '../components/table'
import * as form from '../components/form'
import * as collapsible from '../components/collapsible'
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';

export default function ViewTransactions() {
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
					transaction.readableTimestamp = transaction.timestamp.month + ' / ' + transaction.timestamp.day + ' / ' + transaction.timestamp.year + ' at ' + transaction.timestamp.hours + ' : ' + transaction.timestamp.minutes + ' : ' + transaction.timestamp.seconds
				}
				setTransactions(data)
			})
	}, [])

	let columns = [
		{
			Header: 'Sender ID',
			accessor: 'senderId',
			sortType: 'basic',
			sortInverted: true
		},
		{
			Header: 'Sender Username',
			accessor: 'senderUsername',
			sortType: 'alphanumeric',
			sortInverted: true
		},
		{
			Header: 'Receiver ID',
			accessor: 'receiverId',
			sortType: 'basic',
			sortInverted: true
		},
		{
			Header: 'Receiver Username',
			accessor: 'receiverUsername',
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
				];

				for (const [unit, a, b] of timestamps) {
					if (a < b) {
						return -1;
					}
					if (a > b) {
						return 1;
					}
				}

				return 0;
			}
		}
	]

	const [open, setOpen] = useState(false);

	return (
		<div id='viewTransactionsTable' color='currentUser.theme' style={{
			width: '90%',
			marginLeft: '5%',
			backgroundColor: 'rgb(0, 0, 0)',
			borderColor: 'rgb(75, 75, 75)',
			borderStyle: 'solid',
			overflow: 'hidden',
		}}>
			<collapsible.root open={open} onOpenChange={setOpen}>
				<collapsible.trigger asChild>
					<button>{open ? <Cross1Icon /> : <HamburgerMenuIcon />}</button>
				</collapsible.trigger>
				<collapsible.content>
					<form.label for='senderID' color={currentUser.theme}>Sender ID</form.label>
					<form.input type='number' name='senderID' color={currentUser.theme} />
					<form.label for='senderUsername' color={currentUser.theme}>Sender Username</form.label>
					<form.input type='text' name='senderUsername' color={currentUser.theme} />
					<form.label for='receiverID' color={currentUser.theme}>Receiver ID</form.label>
					<form.input type='number' name='receiverID' color={currentUser.theme} />
					<form.label for='receiverUsername' color={currentUser.theme}>Receiver Username</form.label>
					<form.input type='text' name='receiverUsername' color={currentUser.theme} />
					<form.label for='amount' color={currentUser.theme}>Amount</form.label>
					<form.input type='text' name='amount' color={currentUser.theme} />
				</collapsible.content>
			</collapsible.root >
			<Table columns={columns} data={transactions} sortBy={[{ id: 'readableTimestamp', desc: false }]} />
		</div >
	)
}