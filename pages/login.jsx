import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import * as form from '../components/styled/Form'
import * as text from '../components/styled/text'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Select } from '../components/select'
import * as tabs from '../components/styled/tabs'
import { Separator } from '../components/styled/separator'
import { io } from 'socket.io-client'

const socket = io()

export default function Login() {
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [className, setClassName] = useState('')
	const [classes, setClasses] = useState(['Classes'])


	useEffect(() => {
		socket.emit('getClasses')

		socket.on('sendClasses', (classes) => {
			setClasses(classes)
		})

		return () => {
			socket.off('sendClasses')
		}
	}, [])

	useEffect(() => {
		socket.on('login', (data) => {
			if (data.error) {
				setError(data.error)
			} else {
				setCurrentUser(data)
			}
		})

		socket.on('signup', (data) => {
			if (data.error) {
				setError(data.error)
			} else {
				setCurrentUser(data)
			}
		})

		return () => {
			socket.off('login')
			socket.off('signup')
		}
	}, [])


	async function handleSubmitLogin(event) {
		event.preventDefault()
		socket.emit('login', username, password)
	}

	async function handleSubmitSignup(event) {
		event.preventDefault()
		console.log(
			username,
			password,
			confirmPassword,
			currentUser.theme,
			className
		)
		socket.emit(
			'signup',
			username,
			password,
			confirmPassword,
			currentUser.theme,
			className
		)
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
			<tabs.root defaultValue="login" orientation="vertical" theme={currentUser.theme}>
				<tabs.list aria-label="tabs example" theme={currentUser.theme}>
					<tabs.trigger value="login" theme={currentUser.theme}>
						Login
					</tabs.trigger>
					<Separator className="separator" decorative orientation="vertical" theme={currentUser.theme} />
					<tabs.trigger value="signup" theme={currentUser.theme}>
						Signup
					</tabs.trigger>
				</tabs.list>
				<tabs.content value="login" theme={currentUser.theme}>
					<Head>
						<title>Login</title>
					</Head>
					<form.root onSubmit={handleSubmitLogin} theme={currentUser.theme}>
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
						<form.input type='submit' theme={currentUser.theme} value="Login" />
					</form.root>
				</tabs.content>
				<tabs.content value="signup" theme={currentUser.theme}>
					<Head>
						<title>Signup</title>
					</Head>
					<form.root
						onSubmit={handleSubmitSignup}
						theme={currentUser.theme}
					>
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
							items={classes}
							name='select'
							onValueChange={(value) => setClassName(value)}
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
				<form.Button theme={currentUser.theme} onClick={() => { document.getElementById('error').visibility = 'hidden' }}>
					X
				</form.Button>
				<text.p theme={currentUser.theme}></text.p>
			</div>
		</div >
	)
}