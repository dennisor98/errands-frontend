import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { disputeApi, errandApi } from '../api'
import { useAuth } from '../auth'
import { Button, Card, ErrorBox, Field, SelectField, Spinner, StatusBadge } from '../components/ui'

export default function MyErrands() {
  const { user } = useAuth()
  const [errands, setErrands] = useState(null)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [reviewFor, setReviewFor] = useState(null)
  const [disputeFor, setDisputeFor] = useState(null)

  const load = async () => {
    try {
      setErrands(await errandApi.mine())
    } catch (err) {
      setError(err.message)
    }
  }
  useEffect(() => { load() }, [])

  const act = async (fn) => {
    setActionError('')
    try {
      await fn()
      await load()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const isRequester = (e) => e.requesterId === user?.id
  const isProvider = (e) => e.providerId === user?.id

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My errands</h1>
      <ErrorBox error={error || actionError} />
      {errands === null ? <Spinner /> : errands.length === 0 ? (
        <Card><p className="text-gray-500 dark:text-gray-400">No errands yet. <Link to="/providers" className="text-brand-600">Find a provider</Link> to get started.</p></Card>
      ) : (
        <div className="space-y-4">
          {errands.map((e) => (
            <Card key={e.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={e.status} />
                    <span className="text-xs text-gray-500">
                      {isRequester(e) ? 'You booked' : 'You provide'} · KES {Number(e.fee || 0).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-medium">{e.origin} → {e.destination}</p>
                  {e.description && <p className="text-sm text-gray-500 dark:text-gray-400">{e.description}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(e.scheduledAt).toLocaleString()} · with {isRequester(e) ? e.providerName : e.requesterName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isProvider(e) && e.status === 'REQUESTED' && (
                    <>
                      <Button onClick={() => act(() => errandApi.accept(e.id))}>Accept</Button>
                      <Button variant="secondary" onClick={() => act(() => errandApi.reject(e.id))}>Reject</Button>
                    </>
                  )}
                  {isProvider(e) && e.status === 'ACCEPTED' && (
                    <Button onClick={() => act(() => errandApi.start(e.id))}>Start</Button>
                  )}
                  {isProvider(e) && e.status === 'IN_PROGRESS' && (
                    <Button onClick={() => act(() => errandApi.complete(e.id))}>Mark complete</Button>
                  )}
                  {(e.status === 'REQUESTED' || e.status === 'ACCEPTED') && (
                    <Button variant="secondary" onClick={() => act(() => errandApi.cancel(e.id))}>Cancel</Button>
                  )}
                  {e.status === 'COMPLETED' && (
                    <Button variant="secondary" onClick={() => setReviewFor(e)}>Review</Button>
                  )}
                  {e.status !== 'CANCELLED' && e.status !== 'DISPUTED' && (
                    <Button variant="danger" onClick={() => setDisputeFor(e)}>Dispute</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {reviewFor && <ReviewModal errand={reviewFor} onClose={() => setReviewFor(null)} onDone={async () => { setReviewFor(null); await load() }} />}
      {disputeFor && <DisputeModal errand={disputeFor} onClose={() => setDisputeFor(null)} onDone={async () => { setDisputeFor(null); await load() }} />}
    </div>
  )
}

function ReviewModal({ errand, onClose, onDone }) {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await errandApi.review(errand.id, { rating: Number(rating), review })
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Leave a review" onClose={onClose}>
      <ErrorBox error={error} />
      <form onSubmit={submit}>
        <SelectField label="Rating (1-5)" value={rating} onChange={(e) => setRating(e.target.value)}>
          {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{'★'.repeat(r)}</option>)}
        </SelectField>
        <Field label="Review" required value={review} onChange={(e) => setReview(e.target.value)} />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting…' : 'Submit review'}</Button>
      </form>
    </Modal>
  )
}

function DisputeModal({ errand, onClose, onDone }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await disputeApi.raise({ errandId: errand.id, reason })
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Raise a dispute" onClose={onClose}>
      <ErrorBox error={error} />
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Disputing: {errand.origin} → {errand.destination}
      </p>
      <form onSubmit={submit}>
        <Field label="Reason" required value={reason} onChange={(e) => setReason(e.target.value)}
          placeholder="Describe what went wrong…" />
        <Button type="submit" variant="danger" className="w-full" disabled={loading}>{loading ? 'Submitting…' : 'Submit dispute'}</Button>
      </form>
    </Modal>
  )
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
