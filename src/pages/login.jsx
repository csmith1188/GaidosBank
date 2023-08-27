import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import * as Form from '../components/styled/form'
import * as Text from '../components/styled/text'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Select } from '../components/select'
import * as Tabs from '../components/styled/tabs'
import { Separator } from '../components/styled/separator'
import { io } from 'socket.io-client'
import { useRouter } from 'next/router'

const socket = io()

export default function Login() {
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [className, setClassName] = useState('')
	const [classes, setClasses] = useState(['Classes'])

	const router = useRouter()

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
		socket.on('login', ({ data, error }) => {
			console.log(data, error)
			if (data) setCurrentUser(data)
			if (error) setError(error)
		})

		socket.on('signup', ({ data, error }) => {
			if (data) setCurrentUser(data)
			if (error) setError(error)
		})

		return () => {
			socket.off('login')
			socket.off('signup')
		}
	}, [])

	async function handleSubmitLogin(event) {
		event.preventDefault()
		console.log('login', username, password)
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
		<div id='loginPage'>
			<Tabs.Root defaultValue="login" orientation="vertical" theme={currentUser.theme}>
				<Tabs.List aria-label="Tabs example" theme={currentUser.theme}>
					<Tabs.Trigger value="login" theme={currentUser.theme}>
						Login
					</Tabs.Trigger>
					<Separator className="separator" decorative orientation="vertical" theme={currentUser.theme} />
					<Tabs.Trigger value="signup" theme={currentUser.theme}>
						Signup
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content
					id="login"
					value="login"
					theme={currentUser.theme}
				>
					<Head>
						<title>Login</title>
					</Head>
					<Form.Root onSubmit={handleSubmitLogin} theme={currentUser.theme}>
						<Form.Input
							type='Text'
							id='username'
							autoComplete='username'
							placeholder='Username'
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							theme={currentUser.theme}
						/>
						<Form.Input
							type='password'
							id='password'
							autoComplete='password'
							placeholder='Password'
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							theme={currentUser.theme} />
						<Form.Input type='submit' theme={currentUser.theme} value="Login" />
					</Form.Root>
				</Tabs.Content>
				<Tabs.Content
					id='signup'
					value="signup"
					theme={currentUser.theme}
				>
					<Head>
						<title>Signup</title>
					</Head>
					<Form.Root
						onSubmit={handleSubmitSignup}
						theme={currentUser.theme}
					>
						<Form.Input
							type='Text'
							id='username'
							autoComplete='username'
							placeholder='Username'
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							theme={currentUser.theme}
						/>
						<Form.Input
							type='password'
							id='password'
							autoComplete='password'
							placeholder='Password'
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							theme={currentUser.theme}
						/>
						<Form.Input
							type='password'
							id='confirmPassword'
							autoComplete='password'
							placeholder='Confirm Password'
							value={confirmPassword}
							onChange={(event) => setConfirmPassword(event.target.value)}
							theme={currentUser.theme}
						/>
						<Select
							items={classes}
							name='Select Class'
							onValueChange={(value) => setClassName(value)}
							theme={currentUser.theme}
						/>
						<Form.Input type='submit' theme={currentUser.theme} value="Signup" />
					</Form.Root>
				</Tabs.Content>
			</Tabs.Root>
			<div id='error' className='error' style={{ visibility: 'hidden' }}>
				<Form.Button theme={currentUser.theme} onClick={() => { document.getElementById('error').visibility = 'hidden' }}>
					X
				</Form.Button>
				<Text.P theme={currentUser.theme}></Text.P>
			</div>
		</div >
	)
}