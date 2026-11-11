const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

let accessToken = localStorage.getItem('accessToken')
let refreshToken = localStorage.getItem('refreshToken')

export function setTokens(access, refresh) {
  accessToken = access
  refreshToken = refresh
  if (access) localStorage.setItem('accessToken', access)
  else localStorage.removeItem('accessToken')
  if (refresh) localStorage.setItem('refreshToken', refresh)
  else localStorage.removeItem('refreshToken')
}

export function getRefreshToken() {
  return refreshToken
}

export function clearTokens() {
  setTokens(null, null)
}

async function tryRefresh() {
  if (!refreshToken) return false
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return false
    const data = await res.json()
    setTokens(data.token, data.refreshToken)
    return true
  } catch {
    return false
  }
}

export async function api(path, { method = 'GET', body, formData, auth = true, retry = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && accessToken) headers['Authorization'] = `Bearer ${accessToken}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: formData ? formData : body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && auth && retry && (await tryRefresh())) {
    return api(path, { method, body, formData, auth, retry: false })
  }
  if (res.status === 401 && auth) {
    clearTokens()
    window.dispatchEvent(new Event('auth:logout'))
  }

  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export async function fetchBlob(path) {
  const headers = {}
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
  const res = await fetch(`${BASE_URL}${path}`, { headers })
  if (!res.ok) return null
  return res.blob()
}

export const authApi = {
  register: (data) => api('/api/auth/register', { method: 'POST', body: data, auth: false }),
  verifyEmail: (data) => api('/api/auth/verify-email', { method: 'POST', body: data, auth: false }),
  resendOtp: (email) => api('/api/auth/resend-otp', { method: 'POST', body: { email }, auth: false }),
  login: (data) => api('/api/auth/login', { method: 'POST', body: data, auth: false }),
  refresh: (refreshToken) =>
    api('/api/auth/refresh', { method: 'POST', body: { refreshToken }, auth: false }),
  logout: (refreshToken) =>
    api('/api/auth/logout', { method: 'POST', body: { refreshToken }, auth: false }).catch(() => {}),
}

export const userApi = {
  me: () => api('/api/users/me'),
  update: (data) => api('/api/users/me', { method: 'PUT', body: data }),
  changePassword: (data) => api('/api/users/me/password', { method: 'PUT', body: data }),
  uploadAvatar: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api('/api/users/me/avatar', { method: 'POST', formData: fd })
  },
  deleteAvatar: () => api('/api/users/me/avatar', { method: 'DELETE' }),
  avatarUrl: (userId) => `${BASE_URL}/api/users/${userId}/avatar`,
}

export const providerApi = {
  search: (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
    return api(`/api/providers${q ? `?${q}` : ''}`)
  },
  myProfile: () => api('/api/providers/me/profile'),
  saveProfile: (data) => api('/api/providers/me/profile', { method: 'POST', body: data }),
  updateProfile: (data) => api('/api/providers/me/profile', { method: 'PUT', body: data }),
  reviews: (userId) => api(`/api/providers/${userId}/reviews`),
}

export const errandApi = {
  create: (data) => api('/api/errands', { method: 'POST', body: data }),
  mine: () => api('/api/errands/mine'),
  get: (id) => api(`/api/errands/${id}`),
  accept: (id) => api(`/api/errands/${id}/accept`, { method: 'POST' }),
  reject: (id) => api(`/api/errands/${id}/reject`, { method: 'POST' }),
  start: (id) => api(`/api/errands/${id}/start`, { method: 'POST' }),
  complete: (id) => api(`/api/errands/${id}/complete`, { method: 'POST' }),
  cancel: (id) => api(`/api/errands/${id}/cancel`, { method: 'POST' }),
  review: (id, data) => api(`/api/errands/${id}/review`, { method: 'POST', body: data }),
}

export const disputeApi = {
  raise: (data) => api('/api/disputes', { method: 'POST', body: data }),
  mine: () => api('/api/disputes/mine'),
  get: (id) => api(`/api/disputes/${id}`),
}

export const kycApi = {
  submit: (data) => api('/api/kyc/submit', { method: 'POST', body: data }),
  me: () => api('/api/kyc/me'),
}

export const adminApi = {
  users: (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
    return api(`/api/admin/users${q ? `?${q}` : ''}`)
  },
  createUser: (data) => api('/api/admin/users', { method: 'POST', body: data }),
  updateUser: (id, data) => api(`/api/admin/users/${id}`, { method: 'PATCH', body: data }),
  deleteUser: (id) => api(`/api/admin/users/${id}`, { method: 'DELETE' }),
  disputes: (status) => api(`/api/admin/disputes${status ? `?status=${status}` : ''}`),
  updateDispute: (id, data) => api(`/api/admin/disputes/${id}`, { method: 'PATCH', body: data }),
  kyc: (status) => api(`/api/admin/kyc${status ? `?status=${status}` : ''}`),
  reviewKyc: (id, data) => api(`/api/admin/kyc/${id}`, { method: 'PATCH', body: data }),
}
