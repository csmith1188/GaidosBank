import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as Form from '../components/form'

export default function makeTransaction() {
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
		<Form.root onSubmit={handleSubmit} theme={currentUser.theme}>
			<Form.input
				type='text'
				placeholder='Username / id'
				theme={currentUser.theme}
				onChange={(event) => account = event.target.value} />
			<br />
			<Form.input
				type='number'
				placeholder='amount'
				theme={currentUser.theme}
				onChange={(event) => amount = event.target.value} />
			<br />
			<Form.input type='submit' value='Submit' theme={currentUser.theme} />
		</Form.root>
	)
}
