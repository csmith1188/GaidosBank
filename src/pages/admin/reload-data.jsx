import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../../atoms'
import { useEffect, useState } from 'react'
import { Table } from '../../components/table'
import * as Form from '../../components/styled/form'
import Head from 'next/head'
import { A } from '../../components/styled/text'
import * as Tabs from '../../components/styled/tabs'
import { Separator } from '../../components/styled/separator'
import { io } from 'socket.io-client'
import { sortingFns } from '@tanstack/react-table'
import * as Text from '../../components/styled/text'

const socket = io()

export default function Admin() {
	const currentUser = useAtomValue(currentUserAtom)

	return (
		<div id='reloadData' className='admin'>
			<Form.Button
				theme={currentUser.theme}
				onClick={() => {
					if (currentUser.permissions === 'admin') socket.emit('reloadData')
				}}
				style={{
					fontSize: '3.5rem'
				}}
			>
				Reload Data
			</Form.Button>
		</div >
	)
}