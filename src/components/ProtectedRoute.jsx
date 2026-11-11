import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-600">Loading…</div>
  }
  if (!user) return <Navigate to="/login" replace />
  if (admin && user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}
