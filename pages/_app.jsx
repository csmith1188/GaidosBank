import NavBar from './navBar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom, DebugAtoms } from '../atoms'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  useEffect(() => {
    fetch('/api/isAuthenticated')
      .then(response => response.json())
      .then(data => {
        if (!data) {
          fetch('/api/logout')
            .then(response => response.json())
            .then(data => {
              currentUser = {
                theme: currentUser.theme,
                isAuthenticated: false,
                transactions: [],
                balance: 0
              }
              updateCurrentUser()
            })
            .catch(error => { throw error })
        }
      })
      .catch(error => { throw error })
  })

  function updateCurrentUser() {
    setCurrentUser({
      balance: currentUser.balance,
      username: currentUser.username,
      id: currentUser.id,
      permissions: currentUser.permissions,
      theme: currentUser.theme,
      isAuthenticated: currentUser.isAuthenticated,
      transactions: currentUser.transactions
    })
  }

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
    updateCurrentUser()
    changeTheme()
  }

  useEffect(() => {
    window.addEventListener('load', changeTheme())
  })

  return (
    <>
      <DebugAtoms>
        <NavBar></NavBar >
        <Component {...pageProps} />
      </DebugAtoms>
    </>
  )
}