import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'

import authService from './services/auth'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    authService.getMe()
      .then(currentUser => {
        if (active) setUser(currentUser)
      })
      .catch(error => {
        if (active && error.response?.status !== 401) {
          setError('Could not check your session. Refresh to try again.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <Routes>
      <Route
        path="/login"
        element={ user
          ? <Navigate to="/dashboard" replace />
          : <LoginPage onLogin={setUser} />
        }
      />

      <Route
        path="/register"
        element={ user
          ? <Navigate to="/dashboard" replace />
          : <RegisterPage />
        }
      />

      <Route
        path="/dashboard"
        element={
        <ProtectedRoute user={user}>
          <DashboardPage onLogout={() => setUser(null)} />
        </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}

export default App