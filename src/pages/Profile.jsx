import { useEffect, useRef, useState } from 'react'
import { userApi } from '../api'
import { useAuth } from '../auth'
import Avatar from '../components/Avatar'
import { Button, Card, ErrorBox, Field } from '../components/ui'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' })
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [avatarKey, setAvatarKey] = useState(0)
  const fileRef = useRef()

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' })
  }, [user])

  const save = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    try {
      await userApi.update(form)
      await refreshUser()
      setNotice('Profile updated')
    } catch (err) {
      setError(err.message)
    }
  }

  const upload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    try {
      await userApi.uploadAvatar(file)
      setAvatarKey((k) => k + 1)
      setNotice('Profile picture updated')
    } catch (err) {
      setError(err.message)
    }
  }

  const changePw = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    try {
      await userApi.changePassword(pw)
      setPw({ currentPassword: '', newPassword: '' })
      setNotice('Password changed')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <ErrorBox error={error} />
      {notice && <div className="p-3 rounded-md bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 text-sm">{notice}</div>}

      <Card>
        <div className="flex items-center gap-4 mb-4">
          <Avatar key={avatarKey} userId={user?.id} className="w-20 h-20 rounded-full object-cover bg-gray-200 dark:bg-gray-800" />
          <div>
            <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={upload} />
            <Button variant="secondary" className="mt-2" onClick={() => fileRef.current.click()}>Change photo</Button>
          </div>
        </div>
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-x-4">
          <Field label="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <Field label="Last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <div className="sm:col-span-2">
            <Field label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <Button type="submit">Save profile</Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Change password</h2>
        <form onSubmit={changePw} className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Current password" type="password" required value={pw.currentPassword}
            onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
          <Field label="New password" type="password" required minLength={8} value={pw.newPassword}
            onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          <Button type="submit">Update password</Button>
        </form>
      </Card>
    </div>
  )
}
