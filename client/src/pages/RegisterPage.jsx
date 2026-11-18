import { useState } from "react";
import { Link, useNavigate } from 'react-router'
import authService from '../services/auth'

function RegisterPage () {
  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await authService.register(data)
      navigate('/login', { replace: true })
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
        
        <p>Have an account already? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
} 

export default RegisterPage