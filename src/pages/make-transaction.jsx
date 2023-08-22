import { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import * as Form from '../components/styled/form'
import * as Text from '../components/styled/text'
import Head from 'next/head'
import { H1 } from '../components/styled/text'
import { io } from 'socket.io-client'

const socket = io()

export default function MakeTransaction() {
	const currentUser = useAtomValue(currentUserAtom)
	const [account, setAccount] = useState('')
	const [amount, setAmount] = useState('')

	useEffect(() => {
		let errorElement = document.getElementById('error')
		let errorText = errorElement.getElementsByTagName('p')[0]

		socket.on('makeTransaction', ({ error = null } = {}) => {
			errorElement.style.visibility = ''
			if (error) {
				errorElement.className = 'error'
				errorText.innerHTML = error
			} else {
				errorElement.className = 'success'
				errorText.innerHTML = 'Transaction successful!'
			}
			setTimeout(() => {
				errorElement.style.visibility = 'hidden'
			}, 3000)
		})

		return () => {
			socket.off('makeTransaction')
		}
	}, [])

	async function handleSubmit(event) {
		event.preventDefault()
		socket.emit(
			'makeTransaction',
			account !== '' ? account : null,
			amount !== '' ? amount : null
		)
	}

	return (
		<div id='makeTransaction'>
			<Head>
				<title>Make Transaction</title>
			</Head>
			<H1
				theme={currentUser.theme}
				css={{
					marginTop: '2rem',
					marginBottom: '-1rem'
				}}
			>
				Make Transaction
			</H1>
			<Form.Root onSubmit={handleSubmit} theme={currentUser.theme}>
				<Form.Label htmlFor='account' theme={currentUser.theme}>Account</Form.Label>
				<Form.Input
					type='text'
					placeholder='Account'
					id='account'
					theme={currentUser.theme}
					value={account}
					onChange={(event) => setAccount(event.target.value)} />
				<Form.Label htmlFor='amount' theme={currentUser.theme}>Amount</Form.Label>
				<Form.Input
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
				<Form.Input type='submit' theme={currentUser.theme} />
			</Form.Root>
			<div
				id='error'
				style={{
					visibility: 'hidden'
				}}
			>
				<Form.Button theme={currentUser.theme} onClick={() => { document.getElementById('error').visibility = 'hidden' }}>
					X
				</Form.Button>
				<Text.P theme={currentUser.theme}></Text.P>
			</div>
		</div>
	)
}
