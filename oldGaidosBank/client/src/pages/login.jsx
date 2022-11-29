import React, { } from 'react'
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '../atoms'

function Login() {
	let currentUser = useAtomValue(currentUserAtom);
	setInterval(() => {
		console.log('login', currentUser);
	}, 1000);
	let username, password;

	function handleSubmit(event) {
		event.preventDefault()
		if (username && password) {
			console.log(username, password);
			fetch('/login?username=' + username + '&password=' + password)
				.then(response => {
					console.log(response);
					if (response.status === 200 || response.status === 201) {
						console.log('/login?' + username + '&' + password)
						currentUser.isAuthenticated = true
						window.location.pathname = '/'
					}
				})
				.catch(error => { throw error })
		}
	}
	let color
	if (currentUser.theme) color = 'rgb(255, 255, 255)'
	else color = 'rgb(0, 0, 0)'

	return (
		<div
			style={{
				width: '80%',
				marginLeft: '10%',
				marginBottom: '0px',
				justifyContent: 'center',
				textAlign: 'center',
				color: { color }
			}}
		>
			<form onSubmit={handleSubmit} style={{ marginTop: '2rem', zoom: '250%' }}>
				<label htmlFor=''></label>
				<input
					type='text'
					id='username'
					value={username}
					onChange={(event) => username = event.target.value}
				/>
				<br />
				<input type='text' id='password' value={password} onChange={(event) => password = event.target.value} /><br />
				<input type='submit' />
			</form>
		</div>
	)
}

export default Login
