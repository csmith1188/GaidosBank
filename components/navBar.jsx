import * as Nav from './styled/Nav'
import * as Form from './styled/Form'
import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import { IconSun, IconMoonStars } from '@tabler/icons'
import { io } from 'socket.io-client'

const socket = io()

export default function NavBar() {
	var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

	async function logout() {
		setCurrentUser({
			username: null,
			balance: null,
			permissions: null,
			class: null,
			theme: currentUser.theme,
			isAuthenticated: false,
		})

		socket.emit('logout')
	}

	function toggleTheme() {
		try {
			setCurrentUser(previousCurrentUser => {
				let newTheme
				if (previousCurrentUser.theme === 'dark') newTheme = 'light'
				else newTheme = 'dark'
				return {
					...previousCurrentUser,
					theme: newTheme
				}
			})
			// if (typeof window !== 'undefined') {
			// 	if (currentUser.theme === 'dark') document.body.style.backgroundColor = 'rgb(20, 20, 20)'
			// 	else document.body.style.backgroundColor = 'rgb(255, 255, 255)'
			// }
		} catch (error) {
			throw error
		}
	}

	function logoutTest() {
		socket.emit('logout')
	}

	return (
		<Nav.Root
			theme={currentUser.theme}
			id='nav'
		>
			<Nav.List className='list' id='list1'>
				<Nav.Item>
					<Nav.Link theme={currentUser.theme} active='true' href='/makeTransaction'>
						Make Transaction
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link theme={currentUser.theme} active='true' href='/viewTransactions'>
						View Transactions
					</Nav.Link>
				</Nav.Item>
				{currentUser.permissions === 'admin' &&
					<Nav.Item>
						<Nav.Link theme={currentUser.theme} active='true' href='/admin'>
							Admin
						</Nav.Link>
					</Nav.Item>
				}
			</Nav.List>
			<Nav.List id='title'>
				<Nav.Item>
					<Nav.Link
						style={{ color: 'rgb(19, 161, 14)', }}
						theme={currentUser.theme}
						active='true'
						href='/'
					>
						&#128176;Bank of Gaidos
					</Nav.Link>
				</Nav.Item>
			</Nav.List>
			<Nav.List className='list' id='list2'>
				{/* <Nav.Item>
					<Nav.Link theme={currentUser.theme} active='true' href='/userSettings'>
						User Settings
						</Nav.Link>
				</Nav.Item> */}
				<Nav.Item>
					<Form.Button
						theme={currentUser.theme}
						onClick={logout}
						id='logout'
					>
						Logout
					</Form.Button>
					<Form.Button
						theme={currentUser.theme}
						onClick={logoutTest}
						id='logout'
					>
						Logout Test
					</Form.Button>
				</Nav.Item>
			</Nav.List>
			<Form.Button
				theme={currentUser.theme}
				onClick={toggleTheme}
				id='theme'
			>
				{
					currentUser.theme === 'dark' ?
						<IconSun style={{ color: 'rgb(255,200,0)' }} />
						: <IconMoonStars style={{ color: 'rgb(0,0,255)' }} />
				}
			</Form.Button>
		</Nav.Root >
	)
}
