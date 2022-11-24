import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import NavBar from './pages/navBar';
import Login from './pages/login';
import UserSettings from './pages/userSettings';
import './styles.scss';
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

	window.addEventListener('load', changeTheme)

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
					<Route path='/makeTransaction' element={currentUser.isAuthenticated ? <Home /> : <Navigate to='/login' />} />
					<Route path='/viewTransaction' element={currentUser.isAuthenticated ? <Home /> : <Navigate to='/login' />} />
					<Route path='/debug' element={currentUser.isAuthenticated ? <Home /> : <Navigate to='/login' />} />
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
