import React from 'react'
import NavBar from './navBar'
import '../styles/styles.scss'
import { Provider, useAtom } from 'jotai'
import { currentUserAtom, DebugAtoms } from '../atoms'

function MyApp({ Component, pageProps }) {
  let [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  fetch('/api/getCurrentUser')
    .then(response => response.json())
    .then(data => {
      currentUser.balance = data.balance
      currentUser.username = data.username
      currentUser.id = data.id
      currentUser.permissions = data.permissions
      currentUser.theme = data.theme
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
  return <>
    <Provider>
      <DebugAtoms />
      <NavBar></NavBar >
      <Component {...pageProps} />
      <button onClick={toggleTheme}>Toggle theme</button>
    </Provider>
  </>
}

export default MyApp
