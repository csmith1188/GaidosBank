import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import { useEffect, useState } from 'react'
import { Table } from '../components/table'
import * as form from '../components/styled/Form'
import Head from 'next/head'
import * as tabs from '../components/styled/tabs'
import { Separator } from '../components/styled/separator'
import { io } from 'socket.io-client'
import { sortingFns } from '@tanstack/react-table'

const socket = io()

export default function Admin() {
	const currentUser = useAtomValue(currentUserAtom)
	const [users, setUsers] = useState([])
	const [transactions, setTransactions] = useState([])
	const [classes, setClasses] = useState([])
	const [newClass, setNewClass] = useState([])

	function camelCaseToCapitalized(text) {
		if (!text) return null
		let result = text.replace(/([A-Z])/g, " \$1")
		return result.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
	}

	useEffect(() => {
		socket.emit('getClasses')
		socket.emit('getUsers')
		socket.emit('getTransactions')

		socket.on('sendClasses', (classes) => {
			classes = classes.map(className => {
				return { class: className }
			})
			setClasses([...classes])
		})

		socket.on('sendUsers', (data) => {
			data = Object.values(data)
			for (let user of data) {
				camelCaseToCapitalized(user.permissions)
				camelCaseToCapitalized(user.class)
				camelCaseToCapitalized(user.Theme)
			}
			setUsers([...data])
		})

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

		return () => {
			socket.off('sendClasses')
			socket.off('sendUsers')
			socket.off('sendTransactions')
		}
	}, [])

	let transactionsColumns = [
		{
			header: 'Sender Username',
			accessorKey: 'sender',
			sortingFn: 'alphanumeric',
		},
		{
			header: 'Receiver Username',
			accessorKey: 'receiver',
			sortingFn: 'alphanumeric',
		},
		{
			header: 'Amount',
			accessorKey: 'amount',
			sortingFn: 'basic',
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
		},
		// {
		// 	Header: 'Reverse Transaction',
		// 	Cell: ({ row }) => (
		// 		<form.button
		// 			theme={currentUser.theme}
		// 			id={row.index}
		// 			onClick={() => { console.log(row.original) }
		// 			}
		// 		>
		// 			Reverse Transaction
		// 		</form.button >
		// 	),
		// }
	]

	function updateUsers(changedUsers) {
		console.log(changedUsers)
	}

	let userColumns = [
		{
			header: 'Username',
			accessorKey: 'username',
			sortingFn: 'alphanumeric',
		},
		{
			header: 'Balance',
			accessorKey: 'balance',
			sortingFn: 'basic',
			sortDescFirst: true
		},
		{
			header: 'Permissions',
			accessorKey: 'permissions',
			accessorFn: (row) => {
				if (row.permissions)
					return camelCaseToCapitalized(row.permissions)
				else return 'Not Assigned'
			},
			sortingFn: (rowA, rowB, columnId) => {
				let valueA = rowA.original[columnId]
				let valueB = rowB.original[columnId]

				if (valueA === 'admin') return 1
				else if (valueB === 'admin') return -1
				else if (valueA === 'user') return 1
				else if (valueB === 'user') return -1
				else if (!valueA) return 1
				else if (!valueB) return -1
				else return 0
			},
			sortDescFirst: true
		},
		{
			header: 'Class',
			accessorFn: (row) => {
				if (row.class)
					return row.class
				else return 'Not Assigned'
			},
			sortingFn: (rowA, rowB, columnId) => {
				let valueA = rowA.original[columnId]
				let valueB = rowB.original[columnId]

				if (!valueA) return 1
				return sortingFns.alphanumeric(rowA, rowB, columnId)
			}
		},
		{
			header: 'Theme',
			accessorKey: 'theme',
			accessorFn: (row) => {
				return camelCaseToCapitalized(row.theme)
			},
			sortType: 'alphanumeric'
		},
		// {
		// 	Header: 'Delete User',
		// 	Cell: ({ row }) => (
		// 		<form.button
		// 			theme={currentUser.theme}
		// 			id={row.index}
		// 			onClick={() => { console.log(row.original) }}
		// 		>
		// 			Delete User
		// 		</form.button>
		// 	),
		// }
	]

	let classesColumns = [
		{
			header: 'Class',
			accessorKey: 'class',
			// sortType: 'alphanumeric',
			// sortInverted: true
		},
		{
			header: 'Delete Class',
			cell: ({ row }) => (
				<form.Button
					theme={currentUser.theme}
					id={row.index}
					onClick={async () => {
						let confirmation = confirm(`Are you sure you want to delete class ${row.original.class}`)
						if (confirmation) {
							let response = await fetch(`/api/removeClass?class=${row.original.class}`)
							let data = await response.json()
							if (data.error) console.log(data.error)
						}
					}}
				>
					Delete Class
				</form.Button>
			),
		}
	]

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
						<Separator className='separator' decorative orientation="vertical" theme={currentUser.theme} />
						<tabs.trigger value="transactions" theme={currentUser.theme}>
							Transactions
						</tabs.trigger>
						<Separator className='separator' decorative orientation="vertical" theme={currentUser.theme} />
						<tabs.trigger value="classes" theme={currentUser.theme}>
							Classes
						</tabs.trigger>
					</tabs.list>
					<tabs.content
						id='users'
						value="users"
						theme={currentUser.theme}
					>
						<Table
							columns={userColumns}
							data={users}
							enableFilters={true}
							enableSorting={true}
							updateData={(changedData) => {
								console.log('data:', changedData)
								socket.emit('changeUsers', changedData)
							}}
							editableColumns={{
								balance: {
									type: 'number',
									min: 0
								},
								permissions: {
									type: [
										{
											value: 'user',
											displayValue: 'User'
										},
										{
											value: 'admin',
											displayValue: 'Admin'
										}
									]
								},
								// theme: {
								// 	type: [
								// 		{
								// 			value: 'dark',
								// 			displayValue: 'Dark'
								// 		},
								// 		{
								// 			value: 'light',
								// 			displayValue: 'Light'
								// 		}
								// 	]
								// }
							}}
						/>
					</tabs.content>
					<tabs.content
						id='transactions'
						value="transactions"
						theme={currentUser.theme}
					>
						<Table
							columns={transactionsColumns}
							data={transactions}
							enableFilters={true}
							enableSorting={true}
						// sortBy={[{ id: 'readableTimestamp', desc: false }]}
						// canFilter={true}
						/>
					</tabs.content>
					<tabs.content
						id='classes'
						value="classes"
						theme={currentUser.theme}
					>
						<Table
							columns={classesColumns}
							data={classes}
							sortable={true}
							sortBy={[{ id: 'class', desc: true }]}
							canFilter={true}
						/>
						<div>
							<form.Button
								theme={currentUser.theme}
								id={'newClass'}
								onClick={async () => {
									if (newClass) {
										console.log(newClass)
										let confirmation = confirm(`Are you sure you want to add class ${newClass}`)
										if (confirmation) {
											socket.emit('makeClass', newClass)
											let response = await fetch(`/api/makeClass?class=${newClass}`)
											let data = await response.json()
											if (data.error) console.log(data.error)
										}
									}
								}
								}
							>
								Add Class
							</form.Button>
							<form.input
								type='text'
								id='newClass'
								autoComplete='off'
								placeholder='New Class'
								onChange={(event) => setNewClass(event.target.value)}
								theme={currentUser.theme}
							/>
						</div>
					</tabs.content>
				</tabs.root >
				: ''}
		</div>
	)
}