import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { Table } from '../components/table'
import * as text from '../components/styled/text'
import { useIsMounted } from '../hooks/useIsMounted'
import Head from 'next/head'
import { Select } from '../components/select'

export default function Home() {
	const mounted = useIsMounted()
	const currentUser = useAtomValue(currentUserAtom)
	const [leaderBoard, setLeaderBoard] = useState([])

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [currentUser.isAuthenticated])


	useEffect(() => {
		const fetchLeaderBoard = async (leaderBoard) => {
			try {
				const response = await fetch('/api/getUsers')
				const data = await response.json()
				let leaderBoard = data.sort((a, b) => { return b.balance - a.balance })
				leaderBoard = data.map((user, index) => ({
					...user,
					rank: index + 1
				}))
				console.log(leaderBoard)

				setLeaderBoard(leaderBoard)
			} catch (error) {
				throw error
			}
		}
		fetchLeaderBoard()
		const interval = setInterval(fetchLeaderBoard, 1000)
		return () => clearInterval(interval)
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
			<Head>
				<title>Home</title>
			</Head>
			{mounted ? (
				<text.p theme={currentUser.theme}>
					Welcome back, {currentUser ? currentUser.username : ''}!<br />
					You have ${currentUser ? currentUser.balance : ''} in your Balance
				</text.p>
			) : ''}
			<Table columns={columns} data={leaderBoard} id='leaderBoardTable' limit={10} />
		</div >
	)
}