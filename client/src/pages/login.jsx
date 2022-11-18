import React, { useContext } from 'react'
import { CurrentUserContext } from '../context'


function Login() {
	let currentUser = useContext(CurrentUserContext);
	let username, password;

	function handleSubmit(event) {
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
