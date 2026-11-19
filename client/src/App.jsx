import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

import authService from './services/auth'
import ProtectedRoute from './components/ProtectedRoute'
import SidebarLayout from './components/SidebarLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import Brand from './components/Brand'
import PageState from './components/PageState'

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
          const message = 'Could not check your session. Please try again.'
          setError(message)
          toast.error(message, { id: 'session-error' })
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <main className="grid min-h-dvh place-items-center px-4">
        <div className="flex flex-col items-center gap-5">
          <Brand />
          <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Checking your session...
          </p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="grid min-h-dvh place-items-center px-4">
        <div className="w-full max-w-md">
          <Brand className="mb-6 justify-center" />
          <PageState
            title="Could not load your session"
            description={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </main>
    )
  }

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
        element={
          <ProtectedRoute user={user}>
            <SidebarLayout onLogout={() => setUser(null)} />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}

export default App
