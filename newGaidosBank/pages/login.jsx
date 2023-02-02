import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import { useRouter } from 'next/router'

export default function Login() {
	var router = useRouter()
	var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

	function updateCurrentUser() {
		setCurrentUser({
			balance: currentUser.balance,
			username: currentUser.username,
			id: currentUser.id,
			permissions: currentUser.permissions,
			theme: currentUser.theme,
			isAuthenticated: currentUser.isAuthenticated
		})
	}

	let username, password

	function changeTheme() {
		if (currentUser.theme === 'dark') {
			document.body.style.backgroundColor = 'rgb(20, 20, 20)'
		} else {
			document.body.style.backgroundColor = 'rgb(255, 255, 255)'
		}
	}

	function handleSubmit(event) {
		event.preventDefault()
		if (username && password) {
			console.log(username, password);
			fetch('/api/login?username=' + username + '&password=' + password)
				.then(response => {
					response.json()
				})
				.then(data => {
					console.log(data);
				})
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