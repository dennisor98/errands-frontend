import { useEffect, useState } from 'react'
import { adminApi } from '../api'
import { Button, Card, ErrorBox, Field, SelectField, Spinner, StatusBadge, selectCls } from '../components/ui'
import { Modal } from './MyErrands'

const TABS = [
  { id: 'users', label: 'Users' },
  { id: 'kyc', label: 'KYC Review' },
  { id: 'disputes', label: 'Disputes' },
]

export default function Admin() {
  const [tab, setTab] = useState('users')
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${tab === t.id
              ? 'bg-brand-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'users' && <UsersTab />}
      {tab === 'kyc' && <KycTab />}
      {tab === 'disputes' && <DisputesTab />}
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const load = async () => {
    try { setUsers(await adminApi.users()) } catch (e) { setError(e.message) }
  }
  useEffect(() => { load() }, [])

  const toggleActive = async (u) => {
    try { await adminApi.updateUser(u.id, { active: !u.active }); await load() } catch (e) { setError(e.message) }
  }
  const setRole = async (u, role) => {
    try { await adminApi.updateUser(u.id, { role }); await load() } catch (e) { setError(e.message) }
  }
  const remove = async (u) => {
    if (!confirm(`Delete ${u.email}?`)) return
    try { await adminApi.deleteUser(u.id); await load() } catch (e) { setError(e.message) }
  }

  if (users === null) return <Spinner />
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <ErrorBox error={error} />
        <Button onClick={() => setShowCreate(true)}>+ New user</Button>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-left">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th>
              <th className="p-3">Active</th><th className="p-3">Verified</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-3">{u.firstName} {u.lastName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select value={u.role} onChange={(e) => setRole(u, e.target.value)}
                    className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => toggleActive(u)}
                    className={`px-2 py-0.5 rounded text-xs font-medium ${u.active ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}`}>
                    {u.active ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="p-3">{u.emailVerified ? '✓' : '—'}</td>
                <td className="p-3"><Button variant="danger" onClick={() => remove(u)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onDone={async () => { setShowCreate(false); await load() }} />}
    </div>
  )
}

function CreateUserModal({ onClose, onDone }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'USER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await adminApi.createUser({ ...form, phone: form.phone || null })
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal title="Create user" onClose={onClose}>
      <ErrorBox error={error} />
      <form onSubmit={submit} className="grid grid-cols-2 gap-x-3">
        <Field label="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <Field label="Last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <div className="col-span-2"><Field label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="col-span-2"><Field label="Password" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        <Field label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <SelectField label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="col-span-1">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </SelectField>
        <div className="col-span-2"><Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating…' : 'Create'}</Button></div>
      </form>
    </Modal>
  )
}

function KycTab() {
  const [items, setItems] = useState(null)
  const [status, setStatus] = useState('PENDING')
  const [error, setError] = useState('')
  const [reviewFor, setReviewFor] = useState(null)

  const load = async () => {
    try { setItems(await adminApi.kyc(status)) } catch (e) { setError(e.message) }
  }
  useEffect(() => { load() }, [status])

  if (items === null) return <Spinner />
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${selectCls} !w-auto`}>
          {['PENDING', 'APPROVED', 'REJECTED', ''].map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
        </select>
        <ErrorBox error={error} />
      </div>
      <div className="space-y-3">
        {items.length === 0 && <Card><p className="text-gray-500">No submissions</p></Card>}
        {items.map((k) => (
          <Card key={k.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">User {k.userId?.slice(0, 8)}…</p>
              <p className="text-sm text-gray-500">{k.idType} · {k.idNumber}{k.documentUrl ? ` · ${k.documentUrl}` : ''}</p>
              {k.reviewNotes && <p className="text-xs text-gray-400">Notes: {k.reviewNotes}</p>}
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={k.status} />
              {k.status === 'PENDING' && <Button onClick={() => setReviewFor(k)}>Review</Button>}
            </div>
          </Card>
        ))}
      </div>
      {reviewFor && <KycReviewModal kyc={reviewFor} onClose={() => setReviewFor(null)} onDone={async () => { setReviewFor(null); await load() }} />}
    </div>
  )
}

function KycReviewModal({ kyc, onClose, onDone }) {
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const review = async (status) => {
    setError('')
    try {
      await adminApi.reviewKyc(kyc.id, { status, reviewNotes: notes || null })
      onDone()
    } catch (e) {
      setError(e.message)
    }
  }
  return (
    <Modal title="Review KYC submission" onClose={onClose}>
      <ErrorBox error={error} />
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{kyc.idType}: {kyc.idNumber}</p>
      <Field label="Review notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex gap-2">
        <Button className="flex-1" onClick={() => review('APPROVED')}>Approve</Button>
        <Button variant="danger" className="flex-1" onClick={() => review('REJECTED')}>Reject</Button>
      </div>
    </Modal>
  )
}

function DisputesTab() {
  const [items, setItems] = useState(null)
  const [status, setStatus] = useState('OPEN')
  const [error, setError] = useState('')
  const [reviewFor, setReviewFor] = useState(null)

  const load = async () => {
    try { setItems(await adminApi.disputes(status)) } catch (e) { setError(e.message) }
  }
  useEffect(() => { load() }, [status])

  if (items === null) return <Spinner />
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${selectCls} !w-auto`}>
          {['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED', ''].map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
        </select>
        <ErrorBox error={error} />
      </div>
      <div className="space-y-3">
        {items.length === 0 && <Card><p className="text-gray-500">No disputes</p></Card>}
        {items.map((d) => (
          <Card key={d.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">Errand {d.errandId?.slice(0, 8)}…</p>
              <p className="text-sm text-gray-500">{d.reason}</p>
              {d.resolution && <p className="text-xs text-gray-400">Resolution: {d.resolution}</p>}
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={d.status} />
              <Button variant="secondary" onClick={() => setReviewFor(d)}>Resolve</Button>
            </div>
          </Card>
        ))}
      </div>
      {reviewFor && <DisputeReviewModal dispute={reviewFor} onClose={() => setReviewFor(null)} onDone={async () => { setReviewFor(null); await load() }} />}
    </div>
  )
}

function DisputeReviewModal({ dispute, onClose, onDone }) {
  const [status, setStatus] = useState('UNDER_REVIEW')
  const [resolution, setResolution] = useState('')
  const [error, setError] = useState('')
  const submit = async () => {
    setError('')
    try {
      await adminApi.updateDispute(dispute.id, { status, resolution: resolution || null })
      onDone()
    } catch (e) {
      setError(e.message)
    }
  }
  return (
    <Modal title="Resolve dispute" onClose={onClose}>
      <ErrorBox error={error} />
      <SelectField label="New status" value={status} onChange={(e) => setStatus(e.target.value)}>
        {['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'].map((s) => <option key={s}>{s}</option>)}
      </SelectField>
      <Field label="Resolution notes" value={resolution} onChange={(e) => setResolution(e.target.value)} />
      <Button className="w-full" onClick={submit}>Save</Button>
    </Modal>
  )
}
