import { useState } from "react";
import {Link, useNavigate} from "react-router"
import authService from '../services/auth'

function LoginPage ({ onLogin }) {
  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await authService.login(data)

      const user = await authService.getMe()
      onLogin(user)

      navigate('/dashboard', { replace: true })
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label> Email
            <input type="email" value={data.email} onChange={({target}) => setData({ ...data, email: target.value })}  />
          </label>
        </div>
        <div>
          <label> Password
            <input type="password" value={data.password} onChange={({target}) => setData({ ...data, password: target.value })} />
          </label>
        </div>

        {error && <p role="alert">{error}</p>}
        <button type="submit">Login</button>

        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
} 

export default LoginPage