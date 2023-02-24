import NavBar from './navBar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom, DebugAtoms } from '../atoms'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

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
        <button onClick={toggleTheme}>Toggle theme</button>
      </DebugAtoms>
    </>
  )
}