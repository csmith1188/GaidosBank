import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { Table } from '../components/table'
import * as text from '../components/styled/text'
import { useIsMounted } from '../hooks/useIsMounted'
import Head from 'next/head'
import * as tabs from '../components/styled/tabs'

export default function Admin() {

	return (
		<tabs.root defaultValue="tab1" orientation="vertical">
			<tabs.list aria-label="tabs example">
				<tabs.trigger value="tab1">One</tabs.trigger>
				<tabs.trigger value="tab2">Two</tabs.trigger>
				<tabs.trigger value="tab3">Three</tabs.trigger>
			</tabs.list>
			<tabs.content value="tab1">Tab one content</tabs.content>
			<tabs.content value="tab2">Tab two content</tabs.content>
			<tabs.content value="tab3">Tab three content</tabs.content>
		</tabs.root>
	)
}