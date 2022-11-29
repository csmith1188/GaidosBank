import React from 'react'
import { useAtomValue } from 'jotai';
import { currentUserAtom, leaderBoardAtom } from '../atoms'

function Home() {
	let currentUser = useAtomValue(currentUserAtom)
	let leaderBoard = useAtomValue(leaderBoardAtom)

	console.log(currentUser);
	if (!currentUser.isAuthenticated)
		setTimeout(() => {
			window.location.pathname = '/login'
		}, 5000);

	fetch('/getUsers?filter={permissions=user}&sort={balance:DESC}&limit=10')
		.then(response => response.json())
		.then(data => {
			for (let user of data) {
				leaderBoard.push(user)
			}
		})
	console.log(leaderBoard);

	let theme
	if (currentUser.theme === 'dark') {
		theme = {
			text: 'rgb(255, 255, 255)'
		}
	} else {
		theme = { text: 'rgb(0, 0, 0)' }
	}

	let table = document.getElementsByTagName('table')[0]
	if (table) {
		table.style.border = '0.15rem solid ' + theme.text
		table.style.borderRadius = '1rem'
		table.style.zoom = '300%'
		table.style.marginLeft = 'auto'
		table.style.marginRight = 'auto'
		let thead = table.getElementsByTagName('thead')[0]
		let rows = thead.getElementsByTagName('tr')
		for (let rowNum = 0; rowNum < rows.length; rowNum++) {
			let row = rows[rowNum].getElementsByTagName('th')
			for (let thNum = 0; thNum < row.length; thNum++) {
				let th = row[thNum]
				th.style.paddingLeft = '0.3rem'
				th.style.paddingRight = '0.3rem'
			}
		}
		let tbody = table.getElementsByTagName('tbody')[0]
		rows = tbody.getElementsByTagName('tr')
		for (let rowNum = 0; rowNum < rows.length; rowNum++) {
			let row = rows[rowNum]
			if (rowNum === 0) row.style.backgroundColor = 'rgb(255, 215, 0)'
			if (rowNum === 1) row.style.backgroundColor = 'rgb(192, 192, 192)'
			if (rowNum === 2) row.style.backgroundColor = 'rgb(205, 127, 50)'
		}
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
			<p
				style={{
					marginLeft: 'auto',
					marginRight: 'auto',
					fontSize: '25px',
					fontWeight: 'bold'
				}}
			>
				Welcome back, {currentUser.username}!<br />
				You have ${currentUser.balance} in your Balance
			</p>
			<p
				style={{
					backgroundColor: 'rgb(255, 215, 0)',
					padding: '0.5%',
					borderStyle: 'solid',
					borderColor: theme.text,
					borderWidth: '5%',
					borderRadius: '50px',
					width: '20%',
					marginLeft: 'auto',
					marginRight: 'auto',
					fontSize: '1.75rem',
					fontWeight: 'bold'
				}}
			>
				Leader Board
			</p>
			<table
				style={{ borderSpacing: 0 }}
			// style={{
			// 	borderWidth: '0.1rem',
			// 	borderStyle: 'solid',
			// 	borderColor: theme.text
			// }}
			>
				<thead
					style={{
						fontSize: '1.25rem',
						fontWeight: 'bold'
					}}
				>
					<tr>
						<th scope='col'>Rank</th>
						<th scope='col'>Username</th>
						<th scope='col'>Balance</th>
					</tr>
				</thead>
				<tbody
					style={{
						fontSize: '0.7rem',
						fontWeight: 'bold'
					}}
				>
					{leaderBoard.map(user => {
						return (
							<tr>
								<td>{leaderBoard.indexOf(user) + 1}</td>
								<td>{user.username}</td>
								<td>{user.balance}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default Home
