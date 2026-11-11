import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import AuthLayout from '../components/AuthLayout'
import { Button, Card, ErrorBox, Field, icons } from '../components/ui'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/verify-email', { state: { email: form.email } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <AuthLayout title="Create account" subtitle="We'll email you a verification code">
      <Card className="p-6 sm:p-8 shadow-lg shadow-gray-200/60 dark:shadow-black/30">
        <ErrorBox error={error} />
        <form onSubmit={submit}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" required placeholder="Jane" autoComplete="given-name" icon={icons.user}
            value={form.firstName} onChange={set('firstName')} className="!mb-0" />
          <Field label="Last name" required placeholder="Mwangi" autoComplete="family-name" icon={icons.user}
            value={form.lastName} onChange={set('lastName')} className="!mb-0" />
        </div>
        <div className="h-4" />
        <Field label="Email" type="email" required placeholder="you@example.com" autoComplete="email" icon={icons.mail}
          value={form.email} onChange={set('email')} />
        <Field label="Phone (optional)" type="tel" placeholder="07XX XXX XXX" autoComplete="tel" icon={icons.phone}
          value={form.phone} onChange={set('phone')} />
        <Field label="Password (min 8 chars)" type="password" required minLength={8} placeholder="••••••••"
          autoComplete="new-password" icon={icons.lock} value={form.password} onChange={set('password')} />
        <Button type="submit" className="w-full !py-3 mt-1" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </Button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-400">
          Have an account? <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-500">Sign in</Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
