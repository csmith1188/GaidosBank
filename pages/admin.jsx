import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { Table } from '../components/table'
import * as form from '../components/styled/form'
import { useIsMounted } from '../hooks/useIsMounted'
import Head from 'next/head'
import * as tabs from '../components/styled/tabs'
import { Separator } from '../components/styled/separator'

export default function Admin() {
	const mounted = useIsMounted()
	const currentUser = useAtomValue(currentUserAtom)
	const [transactions, setTransactions] = useState([])
	const [users, setUsers] = useState([])
	const [skipPageReset, setSkipPageReset] = useState(false)

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [currentUser.isAuthenticated])

	async function getTransactions() {
		const response = await fetch('/api/getTransactions')
		const data = await response.json()
		try {
			for (let transaction of data) {
				transaction.timestamp = JSON.parse(transaction.timestamp)
				const monthNames = ["January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November", "December"
				]
				transaction.timestamp.month = monthNames[transaction.timestamp.month - 1]
				if (transaction.timestamp.hours > 12) transaction.timestamp.hours = transaction.timestamp.hours - 12
				else transaction.timestamp.hours = transaction.timestamp.hours
				transaction.readableTimestamp = transaction.timestamp.month + ' / ' + transaction.timestamp.day + ' / ' + transaction.timestamp.year + ' at ' + transaction.timestamp.hours + ' : ' + transaction.timestamp.minutes + ' : ' + transaction.timestamp.seconds + (transaction.timestamp.hours > 12 ? ' PM' : ' AM')
			}
			setTransactions(data)
		} catch (error) {
			throw error
		}
	}

	useEffect(() => {
		getTransactions()
	}, [])

	let transactionsColumns = [
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
		},
		{
			Header: 'Reverse Transaction',
			Cell: ({ row }) => (
				<form.button
					theme={currentUser.theme}
					onClick={() => { console.log(row.original) }}
				>
					Reverse Transaction
				</form.button>
			),
		}
	]

	async function getUsers() {
		const response = await fetch('/api/getUsers')
		const data = await response.json()
		try {
			setUsers(data)
		} catch (error) {
			throw error
		}
	}

	useEffect(() => {
		getUsers()
	}, [])

	let userColumns = [
		{
			Header: 'ID',
			accessor: 'id',
			sortType: 'basic',
			sortInverted: true
		},
		{
			Header: 'Username',
			accessor: 'username',
			sortType: 'alphanumeric',
			sortInverted: true
		},
		{
			Header: 'Balance',
			accessor: 'balance',
			sortType: 'basic',
			sortInverted: true
		},
		{
			Header: 'Permissions',
			accessor: 'permissions',
			sortType: 'alphanumeric',
			sortInverted: true
		},
		{
			Header: 'Theme',
			accessor: 'theme',
			sortType: 'alphanumeric',
			sortInverted: true
		},
		{
			Header: 'Delete User',
			Cell: ({ row }) => (
				<form.button
					theme={currentUser.theme}
					onClick={() => { console.log(row.original) }}
				>
					Delete User
				</form.button>
			),
		}
	]

	useEffect(() => {
		setSkipPageReset(false)
	}, [])

	function updateUsers(changedUsers) {
		setSkipPageReset(true)
		console.log(changedUsers)
		// if (rowIndex && columnId && value) {
		// 	console.log('updateUsers: ', rowIndex, columnId, value)
		// 	setUsers(old =>
		// 		old.map(async (row, index) => {
		// 			if (index === rowIndex) {
		// 				return {
		// 					...old[rowIndex],
		// 					[columnId]: value,
		// 				}
		// 			}
		// 			if (window !== 'undefined') {
		// 				console.log(rowIndex, columnId, value)
		// 				const response = await fetch(`/api/UpdateUser?index=${rowIndex}&property=${columnId}&value=${value}`)
		// 				const data = await response.json()
		// 				return row
		// 			}
		// 		})
		// 	)
		// }
	}

	return (
		<div id='admin'>
			<Head>
				<title>Admin</title>
			</Head>
			{users && transactions ?
				<tabs.root id='tabRoot' defaultValue="users" orientation="vertical" theme={currentUser.theme}>
					<tabs.list aria-label="tabs example" theme={currentUser.theme}>
						<tabs.trigger value="users" theme={currentUser.theme}>
							Users
						</tabs.trigger>
						<Separator className='separator' decorative orientation="vertical" theme={mounted && currentUser.theme} />
						<tabs.trigger value="transactions" theme={currentUser.theme}>
							Transactions
						</tabs.trigger>
					</tabs.list>
					<tabs.content
						id='users'
						value="users"
						theme={currentUser.theme}
						style={
							mounted ?
								currentUser.theme === 'dark' ? {
									backgroundColor: 'rgb(0, 0, 0)',
									borderColor: 'rgb(75, 75, 75)'
								}
									: {
										borderColor: 'rgb(0, 0, 0)'
									}
								: {}
						}
					>
						<Table
							columns={userColumns}
							data={users}
							sortable={true}
							sortBy={[{ id: 'balance', desc: false }]}
							canFilter={true}
							updateData={updateUsers}
							skipPageReset={skipPageReset}
							getData={getUsers}
							editableColumns={[
								{
									column: 'balance',
									type: 'int'
								},
								{
									column: 'permissions',
									type: ['user', 'admin']
								},
								{
									column: 'theme',
									type: ['dark', 'light']
								}
							]}
						/>
					</tabs.content>
					<tabs.content
						id='transactions'
						value="transactions"
						theme={currentUser.theme}
						style={
							mounted ?
								currentUser.theme === 'dark' ? {
									backgroundColor: 'rgb(0, 0, 0)',
									borderColor: 'rgb(75, 75, 75)'
								}
									: {
										borderColor: 'rgb(0, 0, 0)'
									}
								: {}
						}
					>
						<Table
							columns={transactionsColumns}
							data={transactions}
							sortable={true}
							sortBy={[{ id: 'readableTimestamp', desc: false }]}
							canFilter={true}
							getData={getTransactions}
						/>
					</tabs.content>
				</tabs.root >
				: ''}
		</div>
	)
}