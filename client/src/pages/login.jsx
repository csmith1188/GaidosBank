import React from 'react'
import { useEffect, useState } from 'react'


function Login() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()
		console.log(username, password);
		if (username && password) {
			fetch('/login?username=' + username + '&password=' + password)
				.then(response => response.json())
				.then(data => {
					console.log('/login?' + username + '&' + password, data);
				})
				.catch(error => { throw error })
		}
	}

	const [currentUser, setCurrentUser] = useState([{}])

	useEffect(() => {
		fetch('/getCurrentUser')
			.then(response => response.json())
			.then(data => {
				setCurrentUser(data)
			})
			.catch(error => { throw error })
	}, [])

	let theme
	if (currentUser.theme === 1) {
		theme = {
			text: 'rgb(255, 255, 255)'
		}
	} else {
		theme = { text: 'rgb(0, 0, 0)' }
	}

	return (
		<div
			style={{
				width: '80%',
				marginLeft: '10%',
				marginBottom: '0px',
				justifyContent: 'center',
				textAlign: 'center',
				color: theme.text
			}}
		>
			<form onSubmit={handleSubmit} style={{ marginTop: '2rem', zoom: '250%' }}>
				<label htmlFor=''></label>
				<input
					type='text'
					id='username'
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				/>
				<br />
				<input type='text' id='password' value={password} onChange={(event) => setPassword(event.target.value)} /><br />
				<input type='submit' />
			</form>
		</div>
	)
}

export default Login
