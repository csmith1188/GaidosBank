import * as Nav from './styled/nav'
import * as Form from './styled/form'
import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import { IconSun, IconMoonStars } from '@tabler/icons'
import { io } from 'socket.io-client'

const socket = io()

export default function NavBar() {
	var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

	async function logout() {
		setCurrentUser(previousCurrentUser => {
			return {
				username: null,
				balance: null,
				permissions: null,
				class: null,
				theme: previousCurrentUser.theme,
				isAuthenticated: false,
			}
		})

		socket.emit('logout')
	}

	function toggleTheme() {
		try {
			setCurrentUser(previousCurrentUser => ({
				...previousCurrentUser,
				theme: previousCurrentUser.theme === 'dark' ? 'light' : 'dark'
			}))
			// if (typeof window !== 'undefined') {
			// 	if (currentUser.theme === 'dark') document.body.style.backgroundColor = 'rgb(20, 20, 20)'
			// 	else document.body.style.backgroundColor = 'rgb(255, 255, 255)'
			// }
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<Nav.Root
			theme={currentUser.theme}
			id='nav'
		>
			<Nav.List className='list' id='list1'>
				<Nav.Item>
					<Nav.Link theme={currentUser.theme} active='true' href='/make-transaction'>
						Make Transaction
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link theme={currentUser.theme} active='true' href='/view-transactions'>
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
