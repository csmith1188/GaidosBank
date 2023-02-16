import * as nav from '../components/nav'
import { useAtom } from 'jotai';
import { currentUserAtom } from '../atoms'

export default function NavBar() {
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
					theme: 'dark',
					isAuthenticated: false,
					transactions: [],
					balance: 0
				}
				updateCurrentUser()
			})
			.catch(error => { throw error })
	}

	// function ifAdmin(tag) {
	// 	if (currentUser.permissions === 'admin') {
	// 		return tag
	// 	}
	// }

	return (
		<nav.root color={currentUser.theme} id='nav'>
			<nav.list className='list' id='list1'>
				<nav.item>
					<nav.link color={currentUser.theme} active='true' href='/makeTransaction'>
						Make Transaction
					</nav.link>
				</nav.item>
				<nav.item>
					<nav.link color={currentUser.theme} active='true' href='/viewTransactions'>
						View Transactions
					</nav.link>
				</nav.item>
				{currentUser.permissions === 'admin' ?
					<nav.item>
						<nav.link color={currentUser.theme} active='true' href='/Admin'>
							Admin
						</nav.link>
					</nav.item> : null
				}
			</nav.list>
			<nav.list id='title'>
				<nav.item
				>
					<nav.link
						style={{ color: 'rgb(19, 161, 14)', }}
						color={currentUser.theme}
						active='true'
						href='/'
					>
						&#128176;Bank of Gaidos
					</nav.link>
				</nav.item>
			</nav.list>
			<nav.list className='list' id='list2'>
				<nav.item>
					<nav.link color={currentUser.theme} active='true' href='/userSettings'>
						User Settings
					</nav.link>
				</nav.item>
				<nav.item>
					<nav.button
						color={currentUser.theme}
						onClick={logout}
						id='logout'
						className='navButton'
					>
						logout
					</nav.button>
				</nav.item>
			</nav.list>
		</nav.root >
	)
}
