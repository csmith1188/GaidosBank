import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/form'

export default function MakeTransaction() {
	var currentUser = useAtomValue(currentUserAtom)
	var account, amount

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [currentUser])

	function handleSubmit(event) {
		event.preventDefault()
		if (account && amount) {
			fetch(`/api/makeTransaction?account=${account}&amount=${amount}`)
				.then(response => response.json())
				.then(data => {
					console.log(data)
				})
		}
	}

	return (
		<form.root onSubmit={handleSubmit} theme={currentUser.theme} id='makeTransaction'>
			<form.label for='account' theme={currentUser.theme}>Account</form.label>
			<form.input
				type='text'
				placeholder='Username / ID'
				id='account'
				theme={currentUser.theme}
				onChange={(event) => account = event.target.value} />
			<form.label for='amount' theme={currentUser.theme}>Amount</form.label>
			<form.input
				type='number'
				placeholder='Amount'
				id='amount'
				min='1'
				theme={currentUser.theme}
				onChange={(event) => amount = event.target.value} />
			<form.input type='submit' theme={currentUser.theme} />
		</form.root>
	)
}
