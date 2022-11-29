import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import NavBar from './pages/navBar';
import Login from './pages/login';
import UserSettings from './pages/userSettings';
import './styles.scss';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from './atoms'


export default function App() {
	let currentUser = useAtomValue(currentUserAtom)
	setInterval(() => {
		console.log('main', currentUser);
	}, 1000);

	fetch('/getCurrentUser')
		.then(response => response.json())
		.then(data => {
			currentUser.balance = data.balance;
			currentUser.theme = data.theme;
			currentUser.username = data.username;
			currentUser.permissions = data.permissions;
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

	function toggleTheme() {
		if (currentUser.theme === 'dark') currentUser.theme = 'light'
		else if (currentUser.theme === 'light') currentUser.theme = 'dark'
		changeTheme()
	}

	window.addEventListener('load', changeTheme)
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
					<Route path='/viewTransactions' element={currentUser.isAuthenticated ? <Home /> : <Navigate to='/login' />} />
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
