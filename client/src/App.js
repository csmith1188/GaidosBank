import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/home'
import NavBar from './pages/navBar'
import Login from './pages/login'
import UserSettings from './pages/userSettings'
import './App.css'


export default function App() {
	const [currentUser, setCurrentUser] = useState([{}])

	useEffect(() => {
		fetch('/getCurrentUser')
			.then(response => response.json())
			.then(data => {
				setCurrentUser(data)
			})
	}, [])

	const [isAuthenticated, setIsAuthenticated] = useState([{}])

	useEffect(() => {
		fetch('/isAuthenticated')
			.then(response => response.json())
			.then(data => {
				setIsAuthenticated(data)
			})
	}, [])

	let theme
	if (currentUser.theme === 1) {
		theme = 'dark'
		document.body.style.backgroundColor = 'rgb(20, 20, 20)'
	} else {
		theme = 'light'
		document.body.style.backgroundColor = 'rgb(255, 255, 255)'
	}

	document.body.setAttribute('theme', theme)

	function resize() {
		let nav = document.getElementById('nav')
		let firstList = document.getElementsByClassName('list')[0]
		let secondList = document.getElementsByClassName('list')[1]
		let title = document.getElementById('title')
		title.style.fontSize = (nav.clientHeight - nav.style.borderBottomWidth) / 2 + 'px'
	}

	useEffect(() => {
		window.addEventListener('load', resize)
		window.addEventListener('resize', resize)
	})

	function toggleTheme() {
		if (theme === 'dark') theme = 'light'
		else if (theme === 'light') theme = 'dark'
		console.log(theme);
		document.body.setAttribute('theme', theme)
	}

	return (
		<>
			<NavBar />
			<Router>
				<Routes>
					<Route
						path='/'
						element={isAuthenticated ? <Home /> : <Navigate to='/login' />}
					/>
					{/* <Route path='/makeTransaction' element={isAuthenticated ? <MakeTransaction /> : <Navigate to='/login' />} /> */}
					{/* <Route path='/viewTransaction' element={isAuthenticated ? <ViewTransaction /> : <Navigate to='/login' />} /> */}
					{/* <Route path='/debug' element={isAuthenticated ? <Debug /> : <Navigate to='/login'/>} /> */}
					<Route
						path='/userSettings'
						element={isAuthenticated ? <UserSettings /> : <Navigate to='/login' />}
					/>
					<Route path='/login' element={<Login />} />
				</Routes>
			</Router>
			<button onClick={toggleTheme}>Toggle Theme</button>
		</>
	)
}
