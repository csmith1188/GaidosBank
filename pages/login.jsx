import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/form'

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
	Math.r

	return (
		<div id='login'>
			<form.root onSubmit={handleSubmit} theme={currentUser.theme}>
				<form.label htmlFor='' theme={currentUser.theme}></form.label>
				<form.input
					type='text'
					id='username'
					placeholder='Username'
					value={username}
					onChange={(event) => username = event.target.value}
					theme={currentUser.theme}
				/>
				<br />
				<form.input
					type='text'
					id='password'
					placeholder='Password'
					value={password}
					onChange={(event) => password = event.target.value}
					theme={currentUser.theme} />
				<br />
				<form.input type='submit' theme={currentUser.theme} />
			</form.root>
		</div>
	)
}