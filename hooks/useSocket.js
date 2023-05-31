import { useEffect } from 'react'
import { io } from 'socket.io-client'

export default function useSocket(url) {
	useEffect(() => {
		const socket = io()
		socket.emit('hi')
		console.log('connected')
		// Add any custom event listeners or handlers here

		return () => {
			socket.disconnect()
		}
	}, [url])
}