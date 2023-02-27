import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { Table } from '../components/table'

export default function Home() {
	var currentUser = useAtomValue(currentUserAtom)
	var [leaderBoard, setLeaderBoard] = useState([])

	useEffect(() => {
		if (currentUser && !currentUser.isAuthenticated) {
			Router.push('/login')
		}
	})

	function getLeaderBoard() {
		fetch('/api/getUsers?filter={permissions=user}&sort={balance:DESC}&limit=10')
			.then(response => response.json())
			.then(data => {
				for (let user of data) {
					user.rank = data.indexOf(user) + 1
				}
				setLeaderBoard(data)
			})
	}

	useEffect(() => {
		getLeaderBoard()
		setInterval(() => {
			getLeaderBoard()
		}, 1000)
	}, [])

	let theme
	if (currentUser && currentUser.theme === 'dark') {
		theme = {
			text: 'rgb(255, 255, 255)'
		}
	} else {
		theme = { text: 'rgb(0, 0, 0)' }
	}

	const columns = [
		{
			Header: 'Rank',
			accessor: 'rank',
		},
		{
			Header: 'Username',
			accessor: 'username',
		},
		{
			Header: 'Balance',
			accessor: 'balance',
		}
	]

	return (
		<div
			id='home'
			style={{
				width: '80%',
				marginLeft: '10%',
				marginBottom: '0px',
				justifyContent: 'center',
				textAlign: 'center',
				color: 'white'
			}}
		>
			<p>
				Welcome back, {currentUser ? currentUser.username : ''}!<br />
				You have ${currentUser ? currentUser.balance : ''} in your Balance
			</p>
			<p
				style={{
					backgroundColor: 'rgb(255, 215, 0)',
					padding: '0.5%',
					borderStyle: 'solid',
					borderColor: 'white',
					borderWidth: '5%',
					borderRadius: '50px',
					width: '25%',
					marginLeft: 'auto',
					marginRight: 'auto',
					fontSize: '2rem',
					fontWeight: 'bold'
				}}
			>
				Leader Board
			</p>
			{/* <Table columns={columns} data={leaderBoard} id='leaderBoardTable' noSSR /> */}
		</div >
	)
}