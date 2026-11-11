import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import AuthLayout from '../components/AuthLayout'
import { Button, Card, ErrorBox, Field, icons } from '../components/ui'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <Card className="p-6 sm:p-8 shadow-lg shadow-gray-200/60 dark:shadow-black/30">
        <ErrorBox error={error} />
        <form onSubmit={submit}>
        <Field label="Email" type="email" required placeholder="you@example.com" autoComplete="email"
          icon={icons.mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Field label="Password" type="password" required placeholder="••••••••" autoComplete="current-password"
          icon={icons.lock} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" className="w-full !py-3 mt-1" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-400">
          No account? <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-500">Create one</Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
