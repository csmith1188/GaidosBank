import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/styled/form'
import * as text from '../components/styled/text'
import { useEffect } from 'react'
import Head from 'next/head'
import { useIsMounted } from '../hooks/useIsMounted'
import * as tabs from '../components/styled/tabs'
import { Separator } from '../components/styled/separator'

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

	let username, password, confirmPassword, id

	useEffect(() => {
		document.getElementById('error').style.visibility = 'hidden'
	}, [])

	function handleSubmitLogin(event) {
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

	function handleSubmitSignup(event) {
		let errorElement = document.getElementById('error')
		event.preventDefault()
		fetch('/api/signup?id=' + id + '&username=' + username + '&password=' + password + '&confirmPassword=' + confirmPassword + '&theme=' + currentUser.theme)
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
			<tabs.root defaultValue="login" orientation="vertical">
				<tabs.list aria-label="tabs example">
					<tabs.trigger value="login" theme={mounted && currentUser.theme}>
						Login
					</tabs.trigger>
					<Separator className="separator" decorative orientation="vertical" theme={mounted && currentUser.theme} />
					<tabs.trigger value="signup" theme={mounted && currentUser.theme}>
						Signup
					</tabs.trigger>
				</tabs.list>
				<tabs.content value="login" theme={mounted && currentUser.theme}>
					<Head>
						<title>Login</title>
					</Head>
					<form.root onSubmit={handleSubmitLogin} theme={mounted && currentUser.theme}>
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
						<form.input type='submit' theme={mounted && currentUser.theme} value="Login" />
					</form.root>
				</tabs.content>
				<tabs.content value="signup" theme={mounted && currentUser.theme}>
					<Head>
						<title>Signup</title>
					</Head>
					<form.root
						onSubmit={handleSubmitSignup}
						theme={currentUser.theme}
					>
						<form.input
							type='number'
							min='0'
							id='id'
							autoComplete='off'
							placeholder='Id'
							value={id}
							onChange={(event) => id = event.target.value}
							theme={currentUser.theme}
						/>
						<form.input
							type='text'
							id='username'
							autoComplete='username'
							placeholder='Username'
							value={username}
							onChange={(event) => username = event.target.value}
							theme={currentUser.theme}
						/>
						<form.input
							type='password'
							id='password'
							autoComplete='password'
							placeholder='Password'
							value={password}
							onChange={(event) => password = event.target.value}
							theme={currentUser.theme} />
						<form.input
							type='password'
							id='confirmPassword'
							autoComplete='password'
							placeholder='Confirm Password'
							value={confirmPassword}
							onChange={(event) => confirmPassword = event.target.value}
							theme={currentUser.theme} />
						<form.input type='submit' theme={currentUser.theme} value="Signup" />
					</form.root>
				</tabs.content>
			</tabs.root>
			<div id='error'>
				<text.button theme={mounted && currentUser.theme} onClick={() => { document.getElementById('error').visibility = 'hidden' }}>
					X
				</text.button>
				<text.p theme={mounted && currentUser.theme}></text.p>
			</div>
		</div >
	)
}