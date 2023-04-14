import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/styled/form'
import * as text from '../components/styled/text'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useIsMounted } from '../hooks/useIsMounted'
import * as tabs from '../components/styled/tabs'
import { Separator } from '../components/styled/separator'

export default function Login() {
	const mounted = useIsMounted()
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [id, setId] = useState('')

	useEffect(() => {
		if (currentUser.isAuthenticated) {
			Router.push('/')
		}
	}, [currentUser.isAuthenticated])

	async function handleSubmitLogin(event) {
		event.preventDefault()
		console.log(username, password, event)
		const response = await fetch(`/api/login?username=${username}&password=${password}`)
		const data = await response.json()
		if (data.error) {
			setError(data.error)
		} else {
			console.log(data)
			setCurrentUser(data)
		}
	}

	async function handleSubmitSignup(event) {
		event.preventDefault()
		const response = await fetch(`/api/signup?id=${id}&username=${username}&password=${password}&confirmPassword=${confirmPassword}&theme=${currentUser.theme}`)
		const data = await response.json()
		if (data.error) {
			setError(data.error)
		} else {
			console.log(data)
			setCurrentUser(data)
		}
	}

	function setError(error) {
		const errorElement = document.getElementById('error')
		errorElement.getElementsByTagName('p')[0].innerHTML = error
		errorElement.style.visibility = ''
		setTimeout(() => {
			errorElement.style.visibility = 'hidden'
		}, 2000)
	}

	return (
		<div id='login'>
			<tabs.root defaultValue="login" orientation="vertical" theme={mounted && currentUser.theme}>
				<tabs.list aria-label="tabs example" theme={mounted && currentUser.theme}>
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
							onChange={(event) => setUsername(event.target.value)}
							theme={mounted && currentUser.theme}
						/>
						<form.input
							type='password'
							id='password'
							autoComplete='password'
							placeholder='Password'
							value={password}
							onChange={(event) => setPassword(event.target.value)}
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
							onChange={(event) => setId(event.target.value)}
							theme={currentUser.theme}
						/>
						<form.input
							type='text'
							id='username'
							autoComplete='username'
							placeholder='Username'
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							theme={currentUser.theme}
						/>
						<form.input
							type='password'
							id='password'
							autoComplete='password'
							placeholder='Password'
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							theme={currentUser.theme} />
						<form.input
							type='password'
							id='confirmPassword'
							autoComplete='password'
							placeholder='Confirm Password'
							value={confirmPassword}
							onChange={(event) => setConfirmPassword(event.target.value)}
							theme={currentUser.theme} />
						<form.input type='submit' theme={currentUser.theme} value="Signup" />
					</form.root>
				</tabs.content>
			</tabs.root>
			<div id='error' style={{ visibility: 'hidden' }}>
				<form.button theme={mounted && currentUser.theme} onClick={() => { document.getElementById('error').visibility = 'hidden' }}>
					X
				</text.button>
				<text.p theme={mounted && currentUser.theme}></text.p>
			</div>
		</div >
	)
}