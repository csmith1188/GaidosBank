import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import * as ToggleGroup from '../components/styled/toggle-group'
import { IconSun, IconMoonStars } from '@tabler/icons'
import { useEffect } from 'react'
import Head from 'next/head'

export default function UserSettings() {
	const currentUser = useAtomValue(currentUserAtom)

	return (
		<div
			style={{
				width: '80%',
				marginLeft: '10%',
				marginBottom: '0px',
				justifyContent: 'center',
				textAlign: 'center',
				color: currentUser.theme
			}}
		>
			<Head>
				<title>User Settings</title>
			</Head>
			<br />
			<ToggleGroup.Root theme={currentUser.theme} type="single" defaultValue='light'>
				<ToggleGroup.Item theme={currentUser.theme} value='light'>
					<IconSun style={{ color: 'rgb(255,200,0)' }} />
				</ToggleGroup.Item>
				<ToggleGroup.Item theme={currentUser.theme} value='dark'>
					<IconMoonStars style={{ color: 'rgb(0,0,255)' }} />
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
	)
}