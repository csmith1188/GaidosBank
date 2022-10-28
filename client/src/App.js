import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
	if (currentUser.theme == 1) {
		document.body.style.backgroundColor = 'rgb(20, 20, 20)'
	} else {
		document.body.style.backgroundColor = 'rgb(255, 255, 255)'
	}
	return (
		<>
			<NavBar />
			<Router>
				<Routes>
					<Route path='/' element={<Home />} />
					{/* <Route path='/makeTransaction' element={<MakeTransaction />} /> */}
					{/* <Route path='/viewTransaction' element={<ViewTransaction />} /> */}
					{/* <Route path='/debug' element={<Debug />} /> */}
					<Route path='/userSettings' element={<UserSettings />} />
					<Route path='/login' element={<Login />} />
					{/* <Route path='/logout' element={<Logout />} /> */}
				</Routes>
			</Router>
		</>
	)
}
