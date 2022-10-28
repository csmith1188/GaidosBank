import React from 'react'
import {useEffect, useState} from 'react'
import * as Nav from '../components/nav'

export default function NavBar() {
	const [currentUser, setCurrentUser] = useState([{}])

	useEffect(() => {
		fetch('/getCurrentUser')
			.then(response => response.json())
			.then(data => {
				setCurrentUser(data)
			})
	}, [])
	let theme
	if (currentUser.theme == 1) theme = 'dark'
	else theme = 'light'
	function ifAdmin(tag) {
		if (currentUser.permissions == 'admin') {
			return tag
		}
	}
	return (
		<Nav.Root color={theme}>
			<Nav.List>
				<Nav.Item>
					<Nav.Link color={theme} active='true' href='/makeTransaction'>
						Make Transaction
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link color={theme} active='true' href='/viewTransactions'>
						View Transactions
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					{ifAdmin(
						<Nav.Link color={theme} active='true' href='/debug'>
							Debug
						</Nav.Link>
					)}
				</Nav.Item>
			</Nav.List>
			<Nav.List style={{marginLeft: 'auto', marginRight: 'auto'}}>
				<Nav.Item
					style={{
						justifySelf: 'center',
						margin: '0px'
					}}
				>
					<Nav.Link
						style={{
							color: 'rgb(19, 161, 14)',
							marginLeft: 'auto',
							marginRight: 'auto'
						}}
						color={theme}
						active='true'
						href='/'
					>
						&#128176; Bank of Gaidos
					</Nav.Link>
				</Nav.Item>
			</Nav.List>
			<Nav.List>
				<Nav.Item>
					<Nav.Link color={theme} active='true' href='/userSettings'>
						User Settings
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link color={theme} active='true' href='/logout'>
						Logout
					</Nav.Link>
				</Nav.Item>
			</Nav.List>
		</Nav.Root>
	)
}
