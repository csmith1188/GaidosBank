import NavBar from '../components/navBar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom, DebugAtoms } from '../atoms'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  var [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  useEffect(() => {
    async function updateUser() {
      try {
        let response = await fetch('/api/isAuthenticated')
        let data = await response.json()
        if (currentUser.isAuthenticated !== data) {
          setCurrentUser({
            ...currentUser,
            isAuthenticated: data
          })
        }

        response = await fetch('/api/getCurrentUser')
        data = await response.json()
        for (let key of Object.keys(data)) {
          if (currentUser[key] === data[key]) {
            delete data[key]
          }
        }
        if (Object.keys(data).length !== 0) {
          if (!data.error) {
            setCurrentUser({
              ...currentUser,
              id: data.id ?? currentUser.id,
              username: data.username ?? currentUser.username,
              balance: data.balance ?? currentUser.balance,
              permissions: data.permissions ?? currentUser.permissions,
              theme: data.theme ?? currentUser.theme,
            })
          }
        }
      } catch (error) {
        throw error
      }
    }
    updateUser()
    const interval = setInterval(updateUser, 1000)
    return () => clearInterval(interval)
  }, [])

  // useEffect(() => {
  //   async function getCurrentUser() {
  //     try {
  //       const response = await fetch('/api/getCurrentUser')
  //       const data = await response.json()
  //       for (let key of Object.keys(data)) {
  //         if (currentUser[key] === data[key] || key === 'password') {
  //           delete data[key]
  //         }
  //       }
  //       if (data) {
  //         setCurrentUser({
  //           ...currentUser,
  //           id: data.id ?? currentUser.id,
  //           username: data.username ?? currentUser.username,
  //           balance: data.balance ?? currentUser.balance,
  //           permissions: data.permissions ?? currentUser.permissions,
  //           theme: data.theme ?? currentUser.theme,
  //         }))
  //       }
  //     } catch (error) {
  //       throw error
  //     }
  //   }

  //   const interval = setInterval(getCurrentUser, 1000)
  //   return () => clearInterval(interval)
  // }, [])

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