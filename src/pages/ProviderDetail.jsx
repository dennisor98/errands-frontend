import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { errandApi, providerApi } from '../api'
import Avatar from '../components/Avatar'
import { useAuth } from '../auth'
import { Button, Card, ErrorBox, Field, Spinner } from '../components/ui'

export default function ProviderDetail() {
  const { userId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [provider, setProvider] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')
  const [booking, setBooking] = useState(false)
  const [form, setForm] = useState({ origin: '', destination: '', description: '', scheduledAt: '', fee: '' })

  useEffect(() => {
    ;(async () => {
      try {
        const all = await providerApi.search({})
        const found = all.find((p) => p.userId === userId)
        setProvider(found || null)
        setReviews(await providerApi.reviews(userId).catch(() => []))
        if (found) setForm((f) => ({ ...f, fee: found.baseFee }))
      } catch (err) {
        setError(err.message)
      }
    })()
  }, [userId])

  const book = async (e) => {
    e.preventDefault()
    setError('')
    setBooking(true)
    try {
      const errand = await errandApi.create({
        providerId: userId,
        origin: form.origin,
        destination: form.destination,
        description: form.description || null,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        fee: form.fee ? Number(form.fee) : null,
      })
      navigate('/errands')
    } catch (err) {
      setError(err.message)
    } finally {
      setBooking(false)
    }
  }

  if (provider === null && !error) return <Spinner />
  if (!provider) return <div className="max-w-3xl mx-auto px-4 py-10"><ErrorBox error="Provider not found" /></div>

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
      <div>
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <Avatar userId={userId} className="w-16 h-16 rounded-full object-cover bg-gray-200 dark:bg-gray-800" />
            <div>
              <h1 className="text-xl font-bold">{provider.firstName} {provider.lastName}</h1>
              <p className="text-sm text-gray-500">{provider.city}, {provider.county}</p>
              {avg && <p className="text-sm text-brand-600 font-medium">★ {avg} ({reviews.length} reviews)</p>}
            </div>
          </div>
          {provider.services && <p className="text-sm mb-2"><span className="font-medium">Services:</span> {provider.services}</p>}
          {provider.bio && <p className="text-sm text-gray-600 dark:text-gray-400">{provider.bio}</p>}
          <p className="mt-4 text-lg font-bold text-brand-600">KES {Number(provider.baseFee).toLocaleString()} <span className="text-sm font-normal text-gray-500">base fee</span></p>
        </Card>
        {reviews.length > 0 && (
          <Card className="mt-4">
            <h2 className="font-semibold mb-3">Reviews</h2>
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-100 dark:border-gray-800 py-2 last:border-0">
                <p className="text-sm font-medium">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} <span className="text-gray-500 font-normal">{r.reviewerName}</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{r.review}</p>
              </div>
            ))}
          </Card>
        )}
      </div>
      <Card>
        <h2 className="font-semibold mb-4">Book this provider</h2>
        <ErrorBox error={error} />
        <form onSubmit={book}>
          <Field label="Pickup location" required value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
          <Field label="Destination" required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
          <Field label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Field label="Scheduled date & time" type="datetime-local" required value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
          <Field label="Fee (KES)" type="number" min="0" step="0.01" value={form.fee}
            onChange={(e) => setForm({ ...form, fee: e.target.value })} />
          <Button type="submit" className="w-full" disabled={booking || !user}>
            {booking ? 'Booking…' : user ? 'Request booking' : 'Login to book'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
