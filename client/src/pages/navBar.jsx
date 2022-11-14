import React from 'react'
import { useEffect, useState } from 'react'
import * as Nav from '../components/nav'

export default function NavBar() {

	const logout = () => {
		console.log('hi');
		fetch('/logout')
			.catch(error => { throw error })
	}

	const [currentUser, setCurrentUser] = useState([{}])

	useEffect(() => {
		fetch('/getCurrentUser')
			.then(response => response.json())
			.then(data => {
				setCurrentUser(data)
			})
	}, [])
	let theme
	if (currentUser.theme === 1) theme = 'dark'
	else theme = 'light'
	function ifAdmin(tag) {
		if (currentUser.permissions === 'admin') {
			return tag
		}
	}

	return (
		<Nav.Root color={theme} id='nav'>
			<Nav.List class='links'>
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
			<Nav.List style={{ marginLeft: 'auto', marginRight: 'auto' }} id='title'>
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
						<span role='img'>&#128176;</span>
						Bank of Gaidos
					</Nav.Link>
				</Nav.Item>
			</Nav.List>
			<Nav.List class='links'>
				<Nav.Item>
					<Nav.Link color={theme} active='true' href='/userSettings'>
						User Settings
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Button color={theme} onClick={logout} id='logout' className='navButton'>logout</Nav.Button>
				</Nav.Item>
			</Nav.List>
		</Nav.Root >
	)
}
