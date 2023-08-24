import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../../atoms'
import { useEffect, useState } from 'react'
import { Table } from '../../components/table'
import Checkbox from '../../components/checkbox'
import Head from 'next/head'
import * as Tabs from '../../components/styled/tabs'
import { Separator } from '../../components/styled/separator'
import { io } from 'socket.io-client'
import { sortingFns } from '@tanstack/react-table'
import { useRouter } from "next/router"
import * as Form from '../../components/styled/form'
import { H1 } from "../../components/styled/text"

const socket = io()

export default function Admin() {
	const currentUser = useAtomValue(currentUserAtom)
	const [users, setUsers] = useState([])
	const [classNames, setClassNames] = useState([])
	const [classes, setClasses] = useState([])
	let here = []

	const router = useRouter()

	function camelCaseToCapitalized(text) {
		if (!text) return null
		let result = text.replace(/([A-Z])/g, " \$1")
		return result.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
	}

	function filterUsersByClass(users, className) {
		const userEntries = Object.entries(users)
		const filteredEntries = userEntries.filter(([key, user]) => user.class === className)
		const filteredUsers = Object.fromEntries(filteredEntries)

		return filteredUsers
	}

	useEffect(() => {
		socket.emit('getClasses')
		socket.emit('getUsers')

		socket.on('sendClasses', (classes) => {
			setClassNames([...classes])
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

		return () => {
			socket.off('sendClasses')
			socket.off('sendUsers')
		}
	}, [])

	useEffect(() => {
		if (users && classNames) {
			let classes = {}

			for (let className of classNames) {
				classes[className] = []
			}
			classes['Not Assigned'] = []

			for (let user of users) {
				if (user.class) {
					if (classNames.includes(user.class))
						classes[user.class].push(user)
				} else classes['Not Assigned'].push(user)
			}

			setClasses(classes)
		}
	}, [users, classNames])

	return (
		<div id='start-class' className='admin'>
			<Head>
				<title>Start Class</title>
			</Head>
			<H1
				theme={currentUser.theme}
			>
				Start Class
			</H1>
			<Tabs.Root
				id='tabRoot'
				defaultValue={router.asPath.split('#')[1]}
				orientation="vertical"
				theme={currentUser.theme}
				onValueChange={(value) => {
					router.push(`/admin/start-class#${value}`)
				}}
			>
				<Tabs.List aria-label="Tabs example" theme={currentUser.theme}>
					{
						Object.keys(classes).map((className, key) => {
							return <>
								{
									key ?
										<Separator className='separator' decorative orientation="vertical" theme={currentUser.theme} />
										: null
								}
								<Tabs.Trigger value={className} theme={currentUser.theme}>
									{className}
								</Tabs.Trigger>
							</>
						})
					}
				</Tabs.List>
				{
					Object.keys(classes).map((className, key) => {
						let classUsers = classes[className]
						return <Tabs.Content
							id={className}
							value={className}
							key={className}
							theme={currentUser.theme}
						>
							<Form.Button
								theme={currentUser.theme}
								style={{
									fontSize: '2rem'
								}}
								onClick={() => {
									socket.emit('startClass', here)
								}}
							>
								Start Class
							</Form.Button>
							<Table
								columns={[
									{
										header: 'Username',
										accessorKey: 'username',
										sortingFn: 'alphanumeric'
									},
									{
										header: 'On Time',
										cell: ({ row }) => (
											<Checkbox Checkbox
												theme={currentUser.theme}
												defaultValue={here.includes(row.getValue('username'))}
												onValueChange={(value) => {
													let username = row.getValue('username')

													if (
														value &&
														!here.includes(username)
													) here.push(username)

													if (
														!value &&
														here.includes(username)
													) here = here.filter(
														(user) => { return user !== username }
													)
												}}
											/>
										)
									}
								]}
								data={classUsers}
								enableFilters={true}
								enableSorting={true}
							/>
						</Tabs.Content>
					})
				}
			</Tabs.Root >
		</div >
	)
}