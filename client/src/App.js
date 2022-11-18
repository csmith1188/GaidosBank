import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home'
import NavBar from './pages/navBar'
import Login from './pages/login'
import UserSettings from './pages/userSettings'
import './App.css'
import { CurrentUserContext, biggerSideContext } from './context'


export default function App() {
	let currentUser = useContext(CurrentUserContext)
	let biggerSide = useContext(biggerSideContext)

	fetch('/getCurrentUser')
		.then(response => response.json())
		.then(data => {
			currentUser = data;
		})

	fetch('/isAuthenticated')
		.then(response => response.json())
		.then(data => {
			currentUser.isAuthenticated = data
		})

	function changeTheme() {
		if (currentUser.theme === 'dark') {
			document.body.style.backgroundColor = 'rgb(20, 20, 20)'
		} else {
			document.body.style.backgroundColor = 'rgb(255, 255, 255)'
		}
	}

	function resize() {
		let nav = document.getElementById('nav')
		let navDivs = nav.getElementsByTagName('div')
		let navList = document.getElementsByClassName('links')
		let firstList = navList[0].parentElement
		let secondList = navList[1].parentElement
		let title = document.getElementById('title')
		let totalWidth = nav.clientWidth

		if (window.innerHeight > window.innerWidth)
			biggerSide = 'height'
		else biggerSide = 'width'

		if (biggerSide === 'width') {
			title.style.fontSize = (nav.clientHeight - nav.style.borderBottomWidth) * 0.75 + 'px'
			totalWidth -= title.clientWidth
			for (let list of navList) {
				list.parentElement.style.width = totalWidth * 0.4 + 'px'
			}
			for (let list of navList) {
				totalWidth -= list.clientWidth
			}
			for (let list of navList) {
				list.parentElement.style.marginLeft = totalWidth / 4 + 'px';
				list.parentElement.style.marginRight = totalWidth / 4 + 'px';
			}
			for (let div of navDivs) {
				div.children[0].style.marginTop = (div.clientHeight - div.children[0].clientHeight) / 2 + 'px'
				div.children[0].style.marginBottom = (div.clientHeight - div.children[0].clientHeight) / 2 + 'px'
			}
		} else console.log('height');
	}

	window.addEventListener('load', changeTheme)
	window.addEventListener('load', resize)
	window.addEventListener('resize', resize)

	function toggleTheme() {
		if (currentUser.theme === 'dark') currentUser.theme = 'light'
		else if (currentUser.theme === 'light') currentUser.theme = 'dark'
		changeTheme()
	}

	return (
		<>
			<NavBar />
			<Router>
				<Routes>
					<Route
						path='/'
						element={currentUser.isAuthenticated ? <Home /> : <Navigate to='/login' />}
					/>
					{/* <Route path='/makeTransaction' element={isAuthenticated ? <MakeTransaction /> : <Navigate to='/login' />} /> */}
					{/* <Route path='/viewTransaction' element={isAuthenticated ? <ViewTransaction /> : <Navigate to='/login' />} /> */}
					{/* <Route path='/debug' element={isAuthenticated ? <Debug /> : <Navigate to='/login'/>} /> */}
					<Route
						path='/userSettings'
						element={currentUser.isAuthenticated ? <UserSettings /> : <Navigate to='/login' />}
					/>
					<Route path='/login' element={!currentUser.isAuthenticated ? <Login /> : <Navigate to='/' />} />
				</Routes>
			</Router>
			<button onClick={toggleTheme}>Toggle theme</button>
		</>
	)
}
