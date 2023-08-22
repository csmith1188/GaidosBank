import NavBar from '../components/nav-bar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { DevTools } from 'jotai-devtools'
import { useRouter } from 'next/router'
const socket = io()

export default function App({ Component, pageProps }) {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  const router = useRouter()

  useEffect(() => {
    socket.on('load', (session) => {
      if (!session.username) {
        console.log('load')
        setCurrentUser((previousUser) => {
          return {
            username: null,
            balance: null,
            permissions: null,
            class: null,
            theme: previousUser.theme,
            isAuthenticated: false,
          }
        })
        router.push('/login')
      }
    })

    return () => {
      socket.off('load')
    }
  }, [])

  useEffect(() => {
    if (currentUser.isAuthenticated === null) return
    if (
      currentUser.isAuthenticated
    ) {
      console.log('isAuthenticated')
      if (
        router.pathname === '/login' &&
        currentUser.permissions === 'admin'
      )
        router.push('/admin')
      else if (router.pathname === '/login')
        router.push('/')
      else if (
        router.pathname.startsWith('/admin') &&
        currentUser.permissions !== 'admin'
      )
        router.push('/')
    }
    else if (
      router.pathname !== '/login'
    )
      router.push('/login')

  }, [currentUser.isAuthenticated])

  useEffect(() => {
    if (currentUser.theme === 'dark') document.body.style.backgroundColor = 'rgb(20, 20, 20)'
    else document.body.style.backgroundColor = 'rgb(255, 255, 255)'
  }, [currentUser.theme])

  return (
    <>
      <DevTools />
      <NavBar />
      <Component {...pageProps} />
    </>
  )
}