import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/form'
import * as text from '../components/text'

export default function Login() {
	var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

	if (typeof window !== 'undefined' && currentUser.isAuthenticated) {
		Router.push('/')
	}

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

	function handleSubmit(event) {
		event.preventDefault()
		fetch('/api/signup?id=' + id + 'username=' + username + '&password=' + password + '&confirmPassword=' + confirmPassword + '&theme=' + currentUser.theme)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				currentUser = data
				updateCurrentUser()
				console.log(data);
				setTimeout(() => {
					Router.push('/')
				}, 10000);
			})
	}
	let theme

	return (
		<div id='login'>
			<form.root onSubmit={handleSubmit} theme={currentUser.theme}>
				<form.label htmlFor='' theme={currentUser.theme}></form.label>
				{/* <form.input
					type='text'
					id='id'
					placeholder='Id'
					value={id}
					onChange={(event) => id = event.target.value}
					theme={currentUser.theme}
				/> */}
				<form.input
					type='text'
					id='username'
					placeholder='Username'
					value={username}
					onChange={(event) => username = event.target.value}
					theme={currentUser.theme}
				/>
				<form.input
					type='text'
					id='password'
					placeholder='Password'
					value={password}
					onChange={(event) => password = event.target.value}
					theme={currentUser.theme} />
				<form.input
					type='text'
					id='confirmPassword'
					placeholder='Confirm Password'
					value={confirmPassword}
					onChange={(event) => confirmPassword = event.target.value}
					theme={currentUser.theme} />
				<div>
					<form.input type='submit' theme={currentUser.theme} />
					<text.a href='/login' theme={currentUser.theme}>Login</text.a>
				</div>
			</form.root>
		</div>
	)
}