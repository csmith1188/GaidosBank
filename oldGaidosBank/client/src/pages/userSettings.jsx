import React from 'react'
import { useEffect, useState } from 'react'
import * as ToggleGroup from '../components/toggleGroup'
import { IconSun, IconMoonStars } from '@tabler/icons'

function UserSettings() {
	const [currentUser, setCurrentUser] = useState([{}])

	useEffect(() => {
		fetch('/getCurrentUser')
			.then(response => response.json())
			.then(data => {
				setCurrentUser(data)
			})
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

export default UserSettings
