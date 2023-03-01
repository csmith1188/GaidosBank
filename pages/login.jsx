import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/form'
import * as text from '../components/text'

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

	function handleSubmit(event) {
		event.preventDefault()
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
	let theme

	if (currentUser.theme) theme = 'rgb(255, 255, 255)'
	else theme = 'rgb(0, 0, 0)'
	Math.r

	return (
		<div id='login'>
			<form.root onSubmit={handleSubmit} theme={currentUser.theme}>
				<form.input
					type='text'
					id='username'
					placeholder='Username'
					value={username}
					onChange={(event) => username = event.target.value}
					theme={currentUser.theme}
				/>
				<form.input
					type='text'
					id='password'
					placeholder='Password'
					value={password}
					onChange={(event) => password = event.target.value}
					theme={currentUser.theme} />
				<div>
					<form.input type='submit' theme={currentUser.theme} />
					<text.a href='/login' theme={currentUser.theme}>Login</text.a>
				</div>
			</form.root>
		</div>
	)
}