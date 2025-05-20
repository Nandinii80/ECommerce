import React, { useEffect } from 'react'
import { UseAppContext } from '../context/AppContext'
import { useLocation } from 'react-router-dom'

const Loading = () => {
  const { navigate } = UseAppContext()
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const nextUrl = query.get('next')

  useEffect(() => {
    if (nextUrl) {
      const timeoutId = setTimeout(() => {
        navigate(`/${nextUrl}`)
      }, 5000)

      return () => clearTimeout(timeoutId)
    }
  }, [nextUrl, navigate])

  return (
    <div className='flex flex-col justify-center items-center h-screen gap-4'>
      <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary'></div>
      <p className='text-gray-600'>Loading, please wait...</p>
    </div>
  )
}

export default Loading
