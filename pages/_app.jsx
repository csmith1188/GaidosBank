import NavBar from '../components/navBar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom, DebugAtoms } from '../atoms'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const response = await fetch('/api/isAuthenticated')
        const data = await response.json()
        if (data) {
          setCurrentUser(prevUser => ({
            ...prevUser,
            isAuthenticated: data === true
          }))
        } else {
          const response = await fetch('/api/logout')
          const data = await response.json()
          try {
            setCurrentUser({
              theme: currentUser.theme,
              isAuthenticated: false,
            })
          } catch (error) {
            throw error
          }
        }
      } catch (error) {
        throw error
      }
    }
    const interval = setInterval(checkAuthentication, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const response = await fetch('/api/getCurrentUser')
        const data = await response.json()
        for (let key of Object.keys(data)) {
          if (currentUser[key] === data[key] || key === 'password') {
            delete data[key]
          }
        }
        if (data) {
          setCurrentUser((prevCurrentUserData) => ({
            ...prevCurrentUserData,
            id: data.id ?? currentUser.id,
            username: data.username ?? currentUser.username,
            balance: data.balance ?? currentUser.balance,
            permissions: data.permissions ?? currentUser.permissions,
            theme: data.theme ?? currentUser.theme,
          }))
        }
      } catch (error) {
        throw error
      }
    }

    const interval = setInterval(getCurrentUser, 1000)
    return () => clearInterval(interval)
  }, [])

  function changeTheme() {
    if (currentUser.theme === 'dark') document.body.style.backgroundColor = 'rgb(20, 20, 20)'
    else document.body.style.backgroundColor = 'rgb(255, 255, 255)'
  }

  useEffect(() => {
    window.addEventListener('load', changeTheme())
  }, [])

  return (
    <>
      <DebugAtoms>
        <NavBar />
        <Component {...pageProps} />
      </DebugAtoms>
    </>
  )
}