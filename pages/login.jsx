import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'

export default function Login() {
	var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

	if (typeof window !== 'undefined' && currentUser.isAuthenticated) {
		Router.push('/')
	}

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

	let username, password

	function changeTheme() {
		if (currentUser.theme === 'dark') {
			document.body.style.backgroundColor = 'rgb(20, 20, 20)'
		} else {
			document.body.style.backgroundColor = 'rgb(255, 255, 255)'
		}
	}

	function handleSubmit(event) {
		event.preventDefault()
		if (username && password) {
			fetch('/api/login?username=' + username + '&password=' + password)
				.then(response => response.json())
				.then(data => {
					currentUser = data
					updateCurrentUser()
					console.log(data);
					setTimeout(() => {
						Router.push('/')
					}, 10000);
				})
		}
	}
	let theme

	if (currentUser.theme) theme = 'rgb(255, 255, 255)'
	else theme = 'rgb(0, 0, 0)'


	return (
		<div
			style={{
				width: '80%',
				marginLeft: '10%',
				marginBottom: '0px',
				justifyContent: 'center',
				textAlign: 'center',
				theme: { theme }
			}}
		>
			<form onSubmit={handleSubmit} style={{ marginTop: '2rem', zoom: '250%' }}>
				<label htmlFor=''></label>
				<input
					type='text'
					id='username'
					value={username}
					onChange={(event) => username = event.target.value}
				/>
				<br />
				<input type='text' id='password' value={password} onChange={(event) => password = event.target.value} /><br />
				<input type='submit' />
			</form>
		</div>
	)
}