import { useState } from 'react'
import authService from '../services/auth'

function DashboardPage({ onLogout }) {
  const [error, setError] = useState('')

  const handleLogout = async () => {
    setError('')

    try {
      await authService.logout()
      onLogout()
    } catch (error) {
      setError(error.response?.data?.error || 'Logout failed')
    }
  }

  return (
    <div>
      <h1>WhereKey Dashboard</h1>

      {error && <p role="alert">{error}</p>}

      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default DashboardPage