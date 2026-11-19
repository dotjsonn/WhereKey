import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import authService from '../services/auth'
import AuthLayout from '@/components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function RegisterPage() {
  const [data, setData] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await authService.register(data)
      toast.success('Account created', { description: 'You can log in now.' })
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
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
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={data.password}
            onChange={({ target }) => setData({ ...data, password: target.value })}
            disabled={submitting}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
          {submitting ? 'Creating account...' : 'Register'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
