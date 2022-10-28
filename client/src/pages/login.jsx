import React from 'react'
import {useEffect, useState} from 'react'

function Login() {
	const [currentUser, setCurrentUser] = useState([{}])

	useEffect(() => {
		fetch('/getCurrentUser')
			.then(response => response.json())
			.then(data => {
				setCurrentUser(data)
			})
	}, [])

	const [leaderboard, setleaderboard] = useState([{}])

	useEffect(() => {
		fetch("/getUsers?filter=permissions='user'&sort=balance DESC&limit=10")
			.then(response => response.json())
			.then(data => {
				setleaderboard(data)
			})
	}, [])

	let theme
	if (currentUser.theme == 1) {
		theme = {
			text: 'rgb(255, 255, 255)'
		}
	} else {
		theme = {text: 'rgb(0, 0, 0)'}
	}

	let table = document.getElementsByTagName('table')[0]
	if (table) {
		table.style.border = '0.15rem solid ' + theme.text
		table.style.borderRadius = '1rem'
		table.style.zoom = '300%'
		table.style.marginLeft = 'auto'
		table.style.marginRight = 'auto'
		let thead = table.getElementsByTagName('thead')[0]
		let rows = thead.getElementsByTagName('tr')
		for (let rowNum = 0; rowNum < rows.length; rowNum++) {
			let row = rows[rowNum].getElementsByTagName('th')
			for (let thNum = 0; thNum < row.length; thNum++) {
				let th = row[thNum]
				th.style.paddingLeft = '0.3rem'
				th.style.paddingRight = '0.3rem'
			}
		}
		let tbody = table.getElementsByTagName('tbody')[0]
		rows = tbody.getElementsByTagName('tr')
		for (let rowNum = 0; rowNum < rows.length; rowNum++) {
			let row = rows[rowNum]
			if (rowNum == 0) row.style.backgroundColor = 'rgb(255, 215, 0)'
			if (rowNum == 1) row.style.backgroundColor = 'rgb(192, 192, 192)'
			if (rowNum == 2) row.style.backgroundColor = 'rgb(205, 127, 50)'
		}
	}

	return (
		<div
			style={{
				width: '80%',
				marginLeft: '10%',
				marginBottom: '0px',
				justifyContent: 'center',
				textAlign: 'center',
				color: theme.text
			}}
		></div>
	)
}

export default Login
