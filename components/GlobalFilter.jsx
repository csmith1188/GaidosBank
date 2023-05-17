import { useState } from 'react'
import * as form from './styled/form'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'

export const GlobalFilter = ({ filter, setFilter }) => {
	var currentUser = useAtomValue(currentUserAtom)

	return (
		<form.label theme={currentUser.theme}>
			Search:{' '}
			<form.input
				value={filter || ''}
				onChange={event => {
					setFilter(event.target.value)
				}}
				theme={currentUser.theme}
			/>
		</form.label>
	)
}