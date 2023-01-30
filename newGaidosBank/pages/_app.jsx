import React from 'react'
import NavBar from './navBar'
import '../styles/styles.scss'
// import { useAtom } from 'jotai'
// import { currentUserAtom } from '../atoms'

export default function App({ Component, pageProps }) {
  // let [currentUser, setCurrentUser] = useAtom(currentUserAtom)
  var currentUser = {}
  setInterval(() => {
    if (typeof window !== 'undefined') {
      let localUser = {}
      if (currentUser.balance !== 'undefined') {
        localUser.balance = currentUser.balance
      }
      if (currentUser.username !== 'undefined')
        localUser.username = currentUser.username
      if (currentUser.id !== 'undefined')
        localUser.id = currentUser.id
      if (currentUser.permissions !== 'undefined')
        localUser.permissions = currentUser.permissions
      if (currentUser.theme !== 'undefined')
        localUser.theme = currentUser.theme
      localStorage.setItem('currentUser', JSON.stringify(localUser))

      let sessionUser = {}
      if (currentUser.isAuthenticated !== 'undefined')
        sessionUser.isAuthenticated = currentUser.isAuthenticated
      sessionStorage.setItem('currentUser', JSON.stringify(sessionUser))
    }
  }, 1000);
  fetch('/api/getCurrentUser')
    .then(response => response.json())
    .then(data => {
      currentUser = {
        balance: data.balance,
        username: data.username,
        id: data.id,
        permissions: data.permissions,
        theme: data.theme
      }
      if (!currentUser.isAuthenticated)
        currentUser.isAuthenticated = false
      changeTheme()
    })

  // fetch('/isAuthenticated')
  //   .then(response => response.json())
  //   .then(data => {
  //     currentUser.isAuthenticated = data
  //   })

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

  if (typeof window !== 'undefined') {
    window.addEventListener('load', changeTheme())
  }
  return (
    <>
      <NavBar></NavBar >
      <Component {...pageProps} />
      <button onClick={toggleTheme}>Toggle theme</button>
    </>
  )
}