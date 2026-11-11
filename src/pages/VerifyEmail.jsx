import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import AuthLayout from '../components/AuthLayout'
import { Button, Card, ErrorBox, Field, NoticeBox, icons } from '../components/ui'

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyEmail, resendOtp } = useAuth()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyEmail(email, otp)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    setError('')
    setNotice('')
    setResending(true)
    try {
      const res = await resendOtp(email)
      setNotice(res.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6-digit code sent to your email">
      <Card className="p-6 sm:p-8 shadow-lg shadow-gray-200/60 dark:shadow-black/30">
        <ErrorBox error={error} />
        {notice && <div className="mb-4"><NoticeBox>{notice}</NoticeBox></div>}
        <form onSubmit={submit}>
        <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} icon={icons.mail} />
        <Field label="Verification code" required value={otp} onChange={(e) => setOtp(e.target.value)}
          placeholder="123456" inputMode="numeric" autoComplete="one-time-code" icon={icons.shield} />
        <Button type="submit" className="w-full !py-3 mt-1" disabled={loading}>
          {loading ? 'Verifying…' : 'Verify'}
        </Button>
        </form>
        <div className="flex justify-between mt-6 text-sm">
          <button onClick={resend} disabled={resending || !email}
            className="text-brand-600 font-semibold hover:text-brand-500 disabled:opacity-50">
            {resending ? 'Sending…' : 'Resend code'}
          </button>
          <button onClick={() => navigate('/login')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Back to login
          </button>
        </div>
      </Card>
    </AuthLayout>
  )
}
