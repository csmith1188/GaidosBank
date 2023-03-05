import NavBar from './navBar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom, DebugAtoms } from '../atoms'
import { useEffect, useState } from 'react'
import * as scrollArea from '../components/styled/scrollArea'

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
              // currentUser = {
              //   theme: 'light',
              //   isAuthenticated: false,
              //   transactions: [],
              //   balance: 0
              // }
              setCurrentUser({
                theme: 'light',
                isAuthenticated: false,
                transactions: [],
                balance: 0
              })
              // updateCurrentUser()
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

  const TAGS = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

  return (
    <>
      <DebugAtoms>
        <NavBar></NavBar >
        <Component {...pageProps} />
      </DebugAtoms>
    </>
  )
}