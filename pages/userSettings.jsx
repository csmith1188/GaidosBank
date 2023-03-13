import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import * as ToggleGroup from '../components/toggleGroup'
import { IconSun, IconMoonStars } from '@tabler/icons'
import Router from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'

export default function UserSettings() {
	const currentUser = useAtomValue(currentUserAtom)

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [currentUser.isAuthenticated])

	if (currentUser && currentUser.theme) {
		let theme
		if (currentUser.theme === 1) theme = { color: 'dark' }
		else theme = { color: 'light' }

		return (
			<div
				style={{
					width: '80%',
					marginLeft: '10%',
					marginBottom: '0px',
					justifyContent: 'center',
					textAlign: 'center',
					color: theme.color
				}}
			>
				<Head>
					<title>User Settings</title>
				</Head>
				<br />
				<ToggleGroup.root theme={currentUser.theme} type="single" defaultValue='light'>
					<ToggleGroup.item theme={currentUser.theme} value='light'>
						<IconSun style={{ color: 'rgb(255,200,0)' }} />
					</ToggleGroup.item>
					<ToggleGroup.item theme={currentUser.theme} value='dark'>
						<IconMoonStars style={{ color: 'rgb(0,0,255)' }} />
					</ToggleGroup.item>
				</ToggleGroup.root>
			</div>
		)
	}
}