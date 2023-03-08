import * as nav from './styled/nav'
import { useAtom } from 'jotai';
import { currentUserAtom } from '../atoms'
import { useIsMounted } from '../hooks/useIsMounted';
import { IconSun, IconMoonStars } from '@tabler/icons'

export default function NavBar() {
	const mounted = useIsMounted()
	var [currentUser, setCurrentUser] = useAtom(currentUserAtom);

	function updateCurrentUser() {
		setCurrentUser({
			balance: currentUser.balance,
			username: currentUser.username,
			id: currentUser.id,
			permissions: currentUser.permissions,
			theme: currentUser.theme,
			isAuthenticated: currentUser.isAuthenticated,
			transactions: currentUser.transactions
		})
	}

	const logout = () => {
		fetch('/api/logout')
			.then(response => response.json())
			.then(data => {
				currentUser = {
					theme: currentUser.theme,
					isAuthenticated: false,
					transactions: [],
					balance: 0
				}
				updateCurrentUser()
			})
			.catch(error => { throw error })
	}

	function changeTheme() {
		if (currentUser.theme === 'dark') {
			document.body.style.backgroundColor = 'rgb(20, 20, 20)'
		} else {
			document.body.style.backgroundColor = 'rgb(255, 255, 255)'
		}
	}

	function toggleTheme() {
		if (currentUser.theme === 'dark') currentUser.theme = 'light'
		else if (currentUser.theme === 'light') currentUser.theme = 'dark'
		updateCurrentUser()
		changeTheme()
	}

	return (
		<nav.root theme={mounted && currentUser.theme} id='nav'>
			<nav.list className='list' id='list1'>
				<nav.item>
					<nav.link theme={mounted && currentUser.theme} active='true' href='/makeTransaction'>
						Make Transaction
					</nav.link>
				</nav.item>
				<nav.item>
					<nav.link theme={mounted && currentUser.theme} active='true' href='/viewTransactions'>
						View Transactions
					</nav.link>
				</nav.item>
				{mounted && currentUser.permissions === 'admin' &&
					<nav.item>
						<nav.link theme={mounted && currentUser.theme} active='true' href='/Admin'>
							Admin
						</nav.link>
					</nav.item>
				}
			</nav.list>
			<nav.list id='title'>
				<nav.item>
					<nav.link
						style={{ color: 'rgb(19, 161, 14)', }}
						theme={mounted && currentUser.theme}
						active='true'
						href='/'
					>
						&#128176;Bank of Gaidos
					</nav.link>
				</nav.item>
			</nav.list>
			<nav.list className='list' id='list2'>
				{/* <nav.item>
					<nav.link theme={mounted&&currentUser.theme} active='true' href='/userSettings'>
						User Settings
						</nav.link>
				</nav.item> */}
				<nav.item>
					<nav.button
						theme={mounted && currentUser.theme}
						onClick={logout}
						id='logout'
					>
						logout
					</nav.button>
				</nav.item>
			</nav.list>
			<nav.button
				theme={mounted && currentUser.theme}
				onClick={toggleTheme}
				id='theme'
			>
				{
					mounted &&
					(
						currentUser.theme === 'dark' ?
							<IconSun style={{ color: 'rgb(255,200,0)' }} />
							: <IconMoonStars style={{ color: 'rgb(0,0,255)' }} />
					)
				}
			</nav.button>
		</nav.root >
	)
}
