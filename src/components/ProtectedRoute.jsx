import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'

const ADMIN_EMAIL = 'test@gmail.com'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser)
      } else {
        if (currentUser) {
          await signOut(auth)
        }

        setUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  if (loading) {
    return <div>Checking authentication...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}