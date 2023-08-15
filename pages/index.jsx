import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import { useEffect, useState } from 'react'
import { Table } from '../components/table'
import * as text from '../components/styled/text'
import Head from 'next/head'
import { io } from 'socket.io-client'

const socket = io()

export default function Home() {
	const currentUser = useAtomValue(currentUserAtom)
	const [leaderBoard, setLeaderBoard] = useState([])


	useEffect(() => {
		socket.emit('getLeaderBoard')

		socket.on('sendLeaderBoard', (leaderBoardData) => {
			setLeaderBoard(Object.values(leaderBoardData))
		})

		return () => {
			socket.off('sendLeaderBoard')
		}
	}, [])

	return (
		<div id='home'>
			<Head>
				<title>Home</title>
			</Head>
			<text.p theme={currentUser.theme}>
				Welcome back, {currentUser ? currentUser.username : ''}!<br />
				You have ${currentUser ? currentUser.balance : ''} in your Balance
			</text.p>
			<Table
				theme={currentUser.theme}
				leaderboard={true}
				columns={[
					{
						header: 'Rank',
						accessorKey: 'rank',
					},
					{
						header: 'Username',
						accessorKey: 'username',
					},
					{
						header: 'Balance',
						accessorKey: 'balance',
					}
				]}
				data={leaderBoard}
				id='leaderBoardTable'
				limit={10}
			/>
		</div >
	)
}