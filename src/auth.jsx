import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authApi, clearTokens, getRefreshToken, setTokens, userApi } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const onLogout = () => setUser(null)
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!localStorage.getItem('accessToken')) {
        setLoading(false)
        return
      }
      try {
        setUser(await userApi.me())
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password })
    setTokens(res.token, res.refreshToken)
    setUser(res.user)
    return res.user
  }, [])

  const verifyEmail = useCallback(async (email, otp) => {
    const res = await authApi.verifyEmail({ email, otp })
    setTokens(res.token, res.refreshToken)
    setUser(res.user)
    return res.user
  }, [])

  const register = useCallback((data) => authApi.register(data), [])
  const resendOtp = useCallback((email) => authApi.resendOtp(email), [])

  const logout = useCallback(async () => {
    await authApi.logout(getRefreshToken())
    clearTokens()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    setUser(await userApi.me())
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, dark, setDark, login, register, verifyEmail, resendOtp, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
