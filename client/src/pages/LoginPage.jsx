import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import authService from '../services/auth'
import AuthLayout from '@/components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginPage({ onLogin }) {
  const [data, setData] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await authService.login(data)
      const user = await authService.getMe()
      onLogin(user)
      toast.success('Logged in')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not log in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Log in"
      footer={
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
            Register
          </Link>
        </p>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={data.email}
            onChange={({ target }) => setData({ ...data, email: target.value })}
            disabled={submitting}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={data.password}
            onChange={({ target }) => setData({ ...data, password: target.value })}
            disabled={submitting}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
          {submitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
