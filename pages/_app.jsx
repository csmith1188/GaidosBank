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
          if (data == false) {
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

  useEffect(() => {
    setInterval(() => {
      if (currentUser.isAuthenticated) {
        fetch('/api/getCurrentUser')
          .then(response => response.json())
          .then(data => {
            if (currentUser.username !== data.username) currentUser.username = data.username
            else data.username = null
            if (currentUser.id !== data.id) currentUser.id = data.id
            else data.id = null
            if (currentUser.balance !== data.balance) currentUser.balance = data.balance
            else data.balance = null
            if (currentUser.permissions !== data.permissions) currentUser.permissions = data.permissions
            else data.permissions = null
            if (currentUser.theme !== data.theme) currentUser.theme = data.theme
            else data.theme = null
            if (
              data.username ||
              data.id ||
              data.balance ||
              data.permissions ||
              data.theme
            ) updateCurrentUser()
          })
      }
    }, 1000)
  }, [])

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