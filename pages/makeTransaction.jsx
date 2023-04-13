import { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import * as form from '../components/styled/form'
import * as text from '../components/styled/text'
import Head from 'next/head'

export default function MakeTransaction() {
	const currentUser = useAtomValue(currentUserAtom)
	const [account, setAccount] = useState('')
	const [amount, setAmount] = useState('')

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [currentUser.isAuthenticated])

	useEffect(() => {
		document.getElementById('error').style.visibility = 'hidden'
	}, [])

	function handleSubmit(event) {
		event.preventDefault()
		let errorElement = document.getElementById('error')
		let p = errorElement.getElementsByTagName('p')[0]
		fetch(`/api/makeTransaction?account=${account}&amount=${amount}`)
			.then(response => response.json())
			.then(data => {
				if (data) {
					errorElement.style.visibility = ''
					if (data.error !== 'none') {
						errorElement.className = 'error'
						p.innerHTML = data.error
					} else {
						errorElement.className = 'success'
						p.innerHTML = 'Transaction successful!'
					}
					setTimeout(() => {
						errorElement.style.visibility = 'hidden'
					}, 2000)
				}
			})
	}

	return (
		<div id='makeTransaction'>
			<Head>
				<title>Make Transaction</title>
			</Head>
			<form.root onSubmit={handleSubmit} theme={currentUser.theme}>
				<form.label htmlFor='account' theme={currentUser.theme}>Account</form.label>
				<form.input
					type='text'
					placeholder='Username / ID'
					id='account'
					theme={currentUser.theme}
					value={account}
					onChange={(event) => setAccount(event.target.value)} />
				<form.label htmlFor='amount' theme={currentUser.theme}>Amount</form.label>
				<form.input
					type='number'
					placeholder='Amount'
					id='amount'
					min='1'
					theme={currentUser.theme}
					value={amount}
					onChange={(event) => setAmount(event.target.value)}
					onKeyDown={(event) => {
						if (
							!isNaN(event.key) ||
							event.key.startsWith('Arrow') ||
							event.key === 'End' ||
							event.key === 'Home' ||
							event.key === 'Backspace' ||
							event.key === 'Delete' ||
							(
								event.ctrlKey &&
								(
									event.key === 'a' ||
									event.key === 'c' ||
									event.key === 'v'
								)
							)
						) return event
						else return false
					}}
				/>
				<form.input type='submit' theme={currentUser.theme} />
			</form.root>
			<div id='error'>
				<text.button theme={currentUser.theme} onClick={() => { document.getElementById('error').visibility = 'hidden' }}>
					X
				</text.button>
				<text.p theme={currentUser.theme}></text.p>
			</div>
		</div>
	)
}
