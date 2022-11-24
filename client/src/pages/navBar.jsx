import React, { useContext } from 'react'
import * as Nav from '../components/nav'
import { CurrentUserContext, biggerSideContext } from '../context'

export default function NavBar() {
	let currentUser = useContext(CurrentUserContext);
	let biggerSide = useContext(biggerSideContext)

	const logout = () => {
		fetch('/logout')
			.catch(error => { throw error })
	}

	function ifAdmin(tag) {
		if (currentUser.permissions === 'admin') {
			return tag
		}
	}

	return (
		<Nav.Root color={currentUser.theme} id='nav' orientation={biggerSide === 'width' ? 'horizontal' : 'vertical'}>
			<Nav.List className='list' id='list1'>
				<Nav.Item>
					<Nav.Link color={currentUser.theme} active='true' href='/makeTransaction'>
						Make Transaction
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link color={currentUser.theme} active='true' href='/viewTransactions'>
						View Transactions
					</Nav.Link>
				</Nav.Item>
				{currentUser.permissions === 'admin' ?
					<Nav.Item>
						<Nav.Link color={currentUser.theme} active='true' href='/debug'>
							Debug
						</Nav.Link>
					</Nav.Item> : null
				}
			</Nav.List>
			<Nav.List id='title'>
				<Nav.Item
				>
					<Nav.Link
						style={{ color: 'rgb(19, 161, 14)', }}
						color={currentUser.theme}
						active='true'
						href='/'
					>
						&#128176;Bank of Gaidos
					</Nav.Link>
				</Nav.Item>
			</Nav.List>
			<Nav.List className='list' id='list2'>
				<Nav.Item>
					<Nav.Link color={currentUser.theme} active='true' href='/userSettings'>
						User Settings
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Button
						color={currentUser.theme}
						onClick={logout}
						id='logout'
						className='navButton'
					>
						logout
					</Nav.Button>
				</Nav.Item>
			</Nav.List>
		</Nav.Root >
	)
}
