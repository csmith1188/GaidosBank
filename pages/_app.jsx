import NavBar from '../components/navBar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom, DebugAtoms } from '../atoms'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  // useEffect(() => {
  //   async function updateUser() {
  //     try {
  //       let response = await fetch('/api/isAuthenticated')
  //       let data = await response.json()
  //       if (currentUser.isAuthenticated !== data) {
  //         setCurrentUser(previousCurrentUser => {
  //           return {
  //             ...previousCurrentUser,
  //             isAuthenticated: data
  //           }
  //         })
  //       }

  //       response = await fetch('/api/getCurrentUser')
  //       data = await response.json()
  //       if (!data.error) {
  //         for (let key of Object.keys(data)) {
  //           if (currentUser[key] === data[key] || key === 'theme') {
  //             delete data[key]
  //           }
  //         }
  //         if (Object.keys(data).length !== 0) {
  //           setCurrentUser(previousCurrentUser => {
  //             return {
  //               ...previousCurrentUser,
  //               ...data
  //             }
  //           })
  //         }
  //       }
  //     } catch (error) {
  //       throw error
  //     }
  //   }
  //   // updateUser()
  //   // const interval = setInterval(updateUser, 1000)
  //   // return () => clearInterval(interval)
  // }, [])

  useEffect(() => {
    if (currentUser.theme === 'dark') document.body.style.backgroundColor = 'rgb(20, 20, 20)'
    else document.body.style.backgroundColor = 'rgb(255, 255, 255)'
  }, [currentUser.theme])

  return (
    <>
      <DebugAtoms>
        <NavBar />
        <Component {...pageProps} />
      </DebugAtoms>
    </>
  )
}