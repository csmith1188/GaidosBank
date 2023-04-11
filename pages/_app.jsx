import NavBar from '../components/navBar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom, DebugAtoms } from '../atoms'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/isAuthenticated')
        const data = await response.json()
        console.log(data)
        setCurrentUser(prevUser => ({
          ...prevUser,
          isAuthenticated: data === true
        }))
      } catch (error) {
        throw error
      }
    }
    const intervalId = setInterval(checkAuthentication, 1000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch('/api/getCurrentUser')
        const data = await response.json()
        for (let key of Object.keys(data)) {
          if (currentUser[key] === data[key] || key === 'password') {
            delete data[key]
          }
        }
        if (data)
          setCurrentUser((prevCurrentUserData) => ({
            ...prevCurrentUserData,
            id: data.id ?? currentUser.id,
            username: data.username ?? currentUser.username,
            balance: data.balance ?? currentUser.balance,
            permissions: data.permissions ?? currentUser.permissions,
            theme: data.theme ?? currentUser.theme,
          }))
      } catch (error) {
        throw error
      }
    }
    const intervalId = setInterval(getCurrentUser, 1000)
    return () => clearInterval(intervalId)
  }, [])

  function changeTheme() {
    if (currentUser.theme === 'dark') document.body.style.backgroundColor = 'rgb(20, 20, 20)'
    else document.body.style.backgroundColor = 'rgb(255, 255, 255)'
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