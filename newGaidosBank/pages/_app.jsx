import React from 'react'
import NavBar from './navBar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'

import { useAtomsDevtools } from 'jotai/devtools'
const AtomsDevtools = (({ children }) => {
  useAtomsDevtools("atoms");
  return children;
})

export default function App({ Component, pageProps }) {
  let [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  fetch('/api/getCurrentUser')
    .then(response => response.json())
    .then(data => {
      currentUser.balance = data.balance
      currentUser.username = data.username
      currentUser.id = data.id
      currentUser.permissions = data.permissions
      currentUser.theme = data.theme
      setCurrentUser(currentUser)
      changeTheme()
    })

  // fetch('/isAuthenticated')
  //   .then(response => response.json())
  //   .then(data => {
  //     currentUser.isAuthenticated = data
  //   })

  function changeTheme() {
    console.log(currentUser.theme);
    if (currentUser.theme === 'dark') {
      document.body.style.backgroundColor = 'rgb(20, 20, 20)'
    } else {
      document.body.style.backgroundColor = 'rgb(255, 255, 255)'
    }
  }

  function toggleTheme() {
    console.log(currentUser.theme);
    if (currentUser.theme === 'dark') currentUser.theme = 'light'
    else if (currentUser.theme === 'light') currentUser.theme = 'dark'
    setCurrentUser(currentUser)
    console.log(currentUser.theme);
    changeTheme()
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('load', changeTheme())
  }
  return (
    <>
      <AtomsDevtools>
        <NavBar></NavBar >
        <Component {...pageProps} />
        <button onClick={toggleTheme}>Toggle theme</button>
      </AtomsDevtools>
    </>
  )
}