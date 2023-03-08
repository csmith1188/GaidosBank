import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/styled/form'
import * as text from '../components/styled/text'
import { useEffect } from 'react'
import Head from 'next/head'

export default function Login() {
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

	let id, username, password, confirmPassword

	useEffect(() => {
		document.getElementById('error').style.visibility = 'hidden'
	}, [])

	function handleSubmit(event) {
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
		<div id='signup'>
			<Head>
				<title>Signup</title>
			</Head>
			<form.root
				onSubmit={handleSubmit}
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
				<div id='buttons'>
					<form.input type='submit' theme={currentUser.theme} />
					<text.a href='/login' theme={currentUser.theme}>Login</text.a>
				</div>
			</form.root>
			<div id='error'>
				<text.button theme={currentUser.theme} onClick={() => { document.getElementById('error').style.visibility = 'hidden' }}>
					X
				</text.button>
				<text.p theme={currentUser.theme}></text.p>
			</div>
		</div>
	)
}