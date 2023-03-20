import NavBar from '../components/navBar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom, DebugAtoms } from '../atoms'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  useEffect(() => {
    if (!window.location.hash) {
      window.location = window.location + '#loaded'
      fetch('/api/isAuthenticated')
        .then(response => response.json())
        .then(data => {
          if (!data) {
            fetch('/api/logout')
              .then(response => response.json())
              .then(data => {
                setCurrentUser({
                  theme: 'light',
                  isAuthenticated: false,
                  transactions: [],
                  balance: 0
                })
                updateCurrentUser()
              })
              .catch(error => { throw error })
          }
        })
        .catch(error => { throw error })
    }
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

  useEffect(() => {
    window.addEventListener('load', changeTheme())
  })

  return (
    <>
      <DebugAtoms>
        <NavBar />
        <Component {...pageProps} />
      </DebugAtoms>
    </>
  )
}