import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../../atoms'
import { useEffect, useState } from 'react'
import { Table } from '../../components/table'
import * as Form from '../../components/styled/form'
import Head from 'next/head'
import { A } from '../../components/styled/text'
import * as Tabs from '../../components/styled/tabs'
import { Separator } from '../../components/styled/separator'
import { io } from 'socket.io-client'
import { sortingFns } from '@tanstack/react-table'
import * as Text from '../../components/styled/text'

const socket = io()

export default function Admin() {
	const currentUser = useAtomValue(currentUserAtom)
	const [users, setUsers] = useState([])
	const [transactions, setTransactions] = useState([])
	const [classes, setClasses] = useState([])
	const [newClass, setNewClass] = useState([])

	let hideError

	function setError(error = null, success) {
		let errorElement = document.getElementById('error')
		let errorText = errorElement.getElementsByTagName('p')[0]

		errorElement.style.visibility = ''
		if (error) {
			errorElement.className = 'error'
			errorText.innerHTML = error
		} else {
			errorElement.className = 'success'
			errorText.innerHTML = success
		}
		hideError = setTimeout(() => {
			errorElement.style.visibility = 'hidden'
		}, 3000)
	}

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

	useEffect(() => {
		socket.on('makeClass', ({error = null, className}) => setError(error, `Made class ${className}`))
		socket.on('deleteClass', ({error = null, className}) => setError(error, `Deleted class ${className}`))

		return () => {
			socket.off('makeClass')
			socket.off('deleteClass')
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
		// 		<Form.Button
		// 			theme={currentUser.theme}
		// 			id={row.index}
		// 			onClick={() => { console.log(row.original) }
		// 			}
		// 		>
		// 			Reverse Transaction
		// 		</Form.Button >
		// 	),
		// }
	]

	function editUsers(changedUsers) {
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
		// 		<Form.Button
		// 			theme={currentUser.theme}
		// 			id={row.index}
		// 			onClick={() => { console.log(row.original) }}
		// 		>
		// 			Delete User
		// 		</Form.Button>
		// 	),
		// }
	]

	let classesColumns = [
		{
			header: 'Class',
			accessorKey: 'class',
			cell: ({ cell }) => {
				return (
					<A
						theme={currentUser.theme}
						href={`/admin/start-class#${cell.getValue()}`}
					>
						{cell.getValue()}
					</A >
				)
			}
		},
		{
			header: 'Delete Class',
			cell: ({ row }) => (
				<Form.Button
					theme={currentUser.theme}
					id={row.index}
					onClick={async () => {
						let confirmation = confirm(`Are you sure you want to delete class ${row.original.class}`)
						if (confirmation) {
							socket.emit('deleteClass', row.getValue('class'))
						}
					}}
				>
					Delete Class
				</Form.Button>
			),
		}
	]

	return (
		<div id='admin' className='admin'>
			<Head>
				<title>Admin</title>
			</Head>
			<Text.H1
				theme={currentUser.theme}
			>
				Admin
			</Text.H1>
			{users && transactions ?
				<Tabs.Root
					id='tabRoot'
					defaultValue="users"
					orientation="vertical"
					theme={currentUser.theme}
				>
					<Tabs.List aria-label="Tabs example" theme={currentUser.theme}>
						<Tabs.Trigger value="users" theme={currentUser.theme}>
							Users
						</Tabs.Trigger>
						<Separator className='separator' decorative orientation="vertical" theme={currentUser.theme} />
						<Tabs.Trigger value="transactions" theme={currentUser.theme}>
							Transactions
						</Tabs.Trigger>
						<Separator className='separator' decorative orientation="vertical" theme={currentUser.theme} />
						<Tabs.Trigger value="classes" theme={currentUser.theme}>
							Classes
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content
						id='users'
						value="users"
						theme={currentUser.theme}
					>
						<Table
							columns={userColumns}
							data={users}
							enableFilters={true}
							enableSorting={true}
						// updateData={(changedData) => {
						// 	console.log('data:', changedData)
						// 	socket.emit('changeUsers', changedData)
						// }}
						// editableColumns={{
						// 	balance: {
						// 		type: 'number',
						// 		min: 0
						// 	},
						// 	permissions: {
						// 		type: [
						// 			{
						// 				value: 'user',
						// 				displayValue: 'User'
						// 			},
						// 			{
						// 				value: 'admin',
						// 				displayValue: 'Admin'
						// 			}
						// 		]
						// 	},
						// }}
						/>
					</Tabs.Content>
					<Tabs.Content
						id='transactions'
						value="transactions"
						theme={currentUser.theme}
					>
						<Table
							columns={transactionsColumns}
							data={transactions}
							enableFilters={true}
							enableSorting={true}
						/>
					</Tabs.Content>
					<Tabs.Content
						id='classes'
						value="classes"
						theme={currentUser.theme}
					>
						<Table
							columns={classesColumns}
							data={classes}
							enableFilters={true}
							enableSorting={true}
						/>
						<div>
							<Form.Input
								type='text'
								id='newClass'
								autoComplete='off'
								placeholder='New Class'
								onChange={(event) => setNewClass(event.target.value)}
								theme={currentUser.theme}
							/>
							<Form.Button
								theme={currentUser.theme}
								id={'newClass'}
								onClick={async () => {
									if (newClass) {
										let confirmation = confirm(`Are you sure you want to add class ${newClass}`)
										if (confirmation) socket.emit('makeClass', newClass)
									}
								}
								}
							>
								Add Class
							</Form.Button>
						</div>
						<div
							id='error'
							style={{
								visibility: 'hidden'
							}}
						>
							<Form.Button theme={currentUser.theme} onClick={() => { document.getElementById('error').visibility = 'hidden' }}>
								X
							</Form.Button>
							<Text.P theme={currentUser.theme}></Text.P>
						</div>
					</Tabs.Content>
				</Tabs.Root >
				: ''}
		</div >
	)
}