import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/styled/form'
import * as text from '../components/styled/text'
import { useEffect } from 'react'
import Head from 'next/head'
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
			<Head>
				<title>Login</title>
			</Head>
			<form.root onSubmit={handleSubmit} theme={mounted && currentUser.theme}>
				<form.input
					type='text'
					id='username'
					autoComplete='username'
					placeholder='Username'
					value={username}
					onChange={(event) => username = event.target.value}
					theme={mounted && currentUser.theme}
				/>
				<form.input
					type='password'
					id='password'
					autoComplete='password'
					placeholder='Password'
					value={password}
					onChange={(event) => password = event.target.value}
					theme={mounted && currentUser.theme} />
				<div id='buttons'>
					<form.input type='submit' theme={mounted && currentUser.theme} />
					<text.a href='/signup' theme={mounted && currentUser.theme}>Signup</text.a>
				</div>
			</form.root>
			<div id='error'>
				<text.button theme={mounted && currentUser.theme} onClick={() => { document.getElementById('error').visibility = 'hidden' }}>
					X
				</text.button>
				<text.p theme={mounted && currentUser.theme}></text.p>
			</div>
		</div>
	)
}