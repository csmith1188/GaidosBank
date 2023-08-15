import NavBar from '../components/navBar'
import '../styles/styles.scss'
import { useAtom } from 'jotai'
import { currentUserAtom } from '../atoms'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { Provider } from 'jotai'
import { DevTools } from 'jotai-devtools'
import { useRouter } from 'next/router'

const socket = io()

export default function App({ Component, pageProps }) {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  const router = useRouter()

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Successfully connected!')
      const storedUser = JSON.parse(sessionStorage.getItem('currentUser'))
      setCurrentUser({
        username: null,
        balance: null,
        permissions: null,
        class: null,
        theme: storedUser ? storedUser.theme : currentUser.theme,
        isAuthenticated: false,
      })
      router.push('/login')
    })

    return () => {
      socket.off('connect')
    }
  }, [])

  useEffect(() => {
    if (
      JSON.stringify(currentUser) == sessionStorage.getItem('currentUser')
    ) {
      if (
        currentUser.isAuthenticated
      ) {
        if (router.pathname === '/login')
          router.push('/')
        else if (
          router.pathname === '/admin' &&
          currentUser.permissions !== 'admin'
        )
          router.push('/')
      }
      else if (
        router.pathname !== '/login'
      )
        router.push('/login')
    }
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