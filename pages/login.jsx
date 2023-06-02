import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/styled/form'
import * as text from '../components/styled/text'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Select } from '../components/select'
import { useIsMounted } from '../hooks/useIsMounted'
import * as tabs from '../components/styled/tabs'
import { Separator } from '../components/styled/separator'
import { io } from 'socket.io-client'

export default function Login() {
	const mounted = useIsMounted()
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
	const [id, setId] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [className, setClassName] = useState('')
	const [classes, setClasses] = useState(['Classes'])

	const socket = io()

	useEffect(() => {
		socket.emit('getClasses')

		socket.on('sendClasses', (classes) => {
			// if (classes) {
			console.log(classes)
			setClasses([
				'Classes',
				...classes
			])
			setTimeout(() => {
				console.log(classes)
			}, 1000)
			// }
		})
	}, [])

	useEffect(() => {
		if (currentUser.isAuthenticated) {
			Router.push('/')
		}
	}, [currentUser.isAuthenticated])

	async function handleSubmitLogin(event) {
		event.preventDefault()
		const response = await fetch(`/api/login?username=${username}&password=${password}`)
		const data = await response.json()
		if (data.error) {
			setError(data.error)
		} else {
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

	// useEffect(() => {
	// 	async function getClasses() {
	// 		const response = await fetch(`/api/getClasses`)
	// 		const data = await response.json()
	// 		setClasses([
	// 			'Classes',
	// 			...data
	// 		])
	// 	}
	// 	getClasses()
	// 	const interval = setInterval(getClasses, 1000)
	// 	return () => clearInterval(interval)
	// }, [])

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
						<Select
							className='select'
							items={classes}
							defaultValue={'Classes'}
							onChange={(event) => setClassName(event.target.value)}
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
				</form.button>
				<text.p theme={mounted && currentUser.theme}></text.p>
			</div>
			<form.button
				theme={currentUser.theme}
				onClick={() => {
					console.log('emit')
					socket.emit('getClasses')
				}}
			>
				hi
			</form.button>
		</div >
	)
}