import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { Table } from '../components/table'
import { useIsMounted } from '../hooks/useIsMounted'
import * as text from '../components/text'


export default function Home() {
	const mounted = useIsMounted()

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
		<div id='home'>
			{mounted ? (
				<text.p theme={currentUser.theme}>
					Welcome back, {currentUser ? currentUser.username : ''}!<br />
					You have ${currentUser ? currentUser.balance : ''} in your Balance
				</text.p>
			) : ''}
			<Table columns={columns} data={leaderBoard} id='leaderBoardTable' />
		</div >
	)
}