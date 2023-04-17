import * as nav from './styled/nav'
import * as form from './styled/form'
import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import { useIsMounted } from '../hooks/useIsMounted'
import { IconSun, IconMoonStars } from '@tabler/icons'

export default function NavBar() {
	const mounted = useIsMounted()
	var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

	async function logout() {
		const response = await fetch('/api/logout')
		const data = await response.json()
		if (!data.error) throw data.error
		else {
			try {
				setCurrentUser({
					theme: currentUser.theme,
					isAuthenticated: false,
				})
			} catch (error) {
				throw error
			}
		}
	}

	function changeTheme() {
		if (typeof window !== 'undefined') {
			if (currentUser.theme === 'dark') document.body.style.backgroundColor = 'rgb(20, 20, 20)'
			else document.body.style.backgroundColor = 'rgb(255, 255, 255)'
		}
	}

	function toggleTheme() {
		try {
			setCurrentUser({
				...currentUser,
				theme: currentUser.theme === 'dark' ? currentUser.theme === 'light' : currentUser.theme === 'dark'
			})
			changeTheme()
		} catch (error) {
			throw error
		}
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
						<nav.link theme={mounted && currentUser.theme} active='true' href='/admin'>
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
					<form.button
						theme={mounted && currentUser.theme}
						onClick={logout}
						id='logout'
					>
						Logout
					</form.button>
				</nav.item>
			</nav.list>
			<form.button
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
			</form.button>
		</nav.root >
	)
}
