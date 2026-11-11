import { useEffect, useState } from 'react'
import { kycApi, providerApi, userApi } from '../api'
import { useAuth } from '../auth'
import { Button, Card, ErrorBox, Field, SelectField, Spinner, StatusBadge } from '../components/ui'

export default function Kyc() {
  const { user, refreshUser } = useAuth()
  const [kyc, setKyc] = useState(undefined)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({ idType: 'NATIONAL_ID', idNumber: '', documentUrl: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      setKyc(await kycApi.me())
    } catch {
      setKyc(null)
    }
    try {
      setProfile(await providerApi.myProfile())
    } catch {
      setProfile(null)
    }
  }
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      setKyc(await kycApi.submit({ ...form, documentUrl: form.documentUrl || null }))
      setNotice('KYC submitted for review')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (kyc === undefined) return <Spinner />

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Identity verification (KYC)</h1>
      <ErrorBox error={error} />
      {notice && <div className="p-3 rounded-md bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 text-sm">{notice}</div>}

      <Card>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Your status</h2>
          {kyc ? <StatusBadge status={kyc.status} /> : <StatusBadge status="NOT_SUBMITTED" />}
        </div>
        {kyc?.reviewNotes && <p className="text-sm text-gray-500 dark:text-gray-400">Reviewer notes: {kyc.reviewNotes}</p>}
        {!kyc && <p className="text-sm text-gray-500 dark:text-gray-400">You must complete KYC before booking errands or receiving bookings as a provider.</p>}
      </Card>

      {(!kyc || kyc.status !== 'APPROVED') && (
        <Card>
          <h2 className="font-semibold mb-4">{kyc ? 'Resubmit details' : 'Submit your details'}</h2>
          <form onSubmit={submit}>
            <SelectField label="ID type" value={form.idType} onChange={(e) => setForm({ ...form, idType: e.target.value })}>
              <option value="NATIONAL_ID">National ID</option>
              <option value="PASSPORT">Passport</option>
              <option value="DRIVING_LICENCE">Driving licence</option>
              <option value="ALIEN_ID">Alien ID</option>
            </SelectField>
            <Field label="ID number" required value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} />
            <Field label="Document URL (optional)" value={form.documentUrl} onChange={(e) => setForm({ ...form, documentUrl: e.target.value })}
              placeholder="https://…" />
            <Button type="submit" disabled={saving}>{saving ? 'Submitting…' : 'Submit for review'}</Button>
          </form>
        </Card>
      )}

      <ProviderSection profile={profile} onSaved={load} />
    </div>
  )
}

function ProviderSection({ profile, onSaved }) {
  const [form, setForm] = useState({ county: '', city: '', bio: '', services: '', baseFee: '', available: true })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        county: profile.county || '', city: profile.city || '', bio: profile.bio || '',
        services: profile.services || '', baseFee: profile.baseFee || '', available: profile.available,
      })
    }
  }, [profile])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const data = { ...form, baseFee: Number(form.baseFee), available: form.available }
      if (profile) await providerApi.updateProfile(data)
      else await providerApi.saveProfile(data)
      setNotice(profile ? 'Provider profile updated' : 'You are now registered as a provider')
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="font-semibold mb-1">Provider profile</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Register here to offer your errand services to customers in your area.
      </p>
      <ErrorBox error={error} />
      {notice && <div className="mb-3 p-3 rounded-md bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 text-sm">{notice}</div>}
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-x-4">
        <Field label="County" required value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })}
          placeholder="e.g. Nairobi" />
        <Field label="City / Town" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
          placeholder="e.g. Westlands" />
        <div className="sm:col-span-2">
          <Field label="Services offered" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })}
            placeholder="e.g. Groceries, Deliveries, Queue services" />
        </div>
        <div className="sm:col-span-2">
          <Field label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <Field label="Base fee (KES)" type="number" min="0" step="0.01" required value={form.baseFee}
          onChange={(e) => setForm({ ...form, baseFee: e.target.value })} />
        <label className="flex items-center gap-2 text-sm mb-3 text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="accent-brand-600 w-4 h-4" />
          Available for bookings
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : profile ? 'Update profile' : 'Register as provider'}</Button>
        </div>
      </form>
    </Card>
  )
}
