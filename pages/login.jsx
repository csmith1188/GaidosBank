import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/form'
import * as text from '../components/text'
import { useEffect } from 'react'
import { useIsMounted } from '../hooks/useIsMounted'

export default function Login() {
	const mounted = useIsMounted()

	var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

	useEffect(() => {
		if (currentUser.isAuthenticated) {
			Router.push('/')
		}
	}, [currentUser])

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

	useEffect(() => {
		document.getElementById('error').style.visibility = 'hidden'
	}, [])

	function handleSubmit(event) {
		let errorElement = document.getElementById('error')
		event.preventDefault()
		fetch('/api/login?username=' + username + '&password=' + password)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				if (data.error) {
					errorElement.getElementsByTagName('p')[0].innerHTML = data.error
					errorElement.style.visibility = ''
					setTimeout(() => {
						errorElement.style.visibility = 'hidden'
					}, 2000)
				}
				else {
					currentUser = data
					updateCurrentUser()
				}
			})
	}

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
				<div id='buttons'>
					<form.input type='submit' theme={currentUser.theme} />
					<text.a href='/signup' theme={currentUser.theme}>Signup</text.a>
				</div>
			</form.root>
			<div id='error'>
				<button onClick={() => { document.getElementById('error').visibility = 'hidden' }}>
					X
				</button>
				<text.p theme={currentUser.theme}></text.p>
			</div>
		</div>
	)
}