import React, { useContext } from 'react'
import { CurrentUserContext } from '../context'


function Login() {
	let currentUser = useContext(CurrentUserContext);
	let username, password;

	function handleSubmit(event) {
		console.log('submit', username, password);
	}

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
