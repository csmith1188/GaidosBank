import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import * as ToggleGroup from '../components/toggleGroup'
import { IconSun, IconMoonStars } from '@tabler/icons'
import Router from 'next/router'
import { useEffect } from 'react'

export default function UserSettings() {
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom)

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [])

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
				<br />
				<ToggleGroup.Root color={theme.color} type="single" defaultValue='light'>
					<ToggleGroup.Item color={theme.color} value='light'>
						<IconSun style={{ color: 'rgb(255,200,0)', height: '1rem', width: '1rem' }} />
					</ToggleGroup.Item>
					<ToggleGroup.Item color={theme.color} value='dark'>
						<IconMoonStars style={{ color: 'rgb(0,0,255)' }} />
					</ToggleGroup.Item>
				</ToggleGroup.Root>
			</div>
		)
	}
}