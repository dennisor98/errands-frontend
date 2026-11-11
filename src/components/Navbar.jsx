import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

const linkClass = ({ isActive }) =>
  `block px-3 py-2 rounded-md text-sm font-medium ${
    isActive
      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
      : 'text-gray-700 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400'
  }`

export default function Navbar() {
  const { user, logout, dark, setDark } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = user && (
    <>
      <NavLink to="/providers" onClick={() => setOpen(false)} className={linkClass}>Find Providers</NavLink>
      <NavLink to="/errands" onClick={() => setOpen(false)} className={linkClass}>My Errands</NavLink>
      <NavLink to="/kyc" onClick={() => setOpen(false)} className={linkClass}>KYC</NavLink>
      <NavLink to="/profile" onClick={() => setOpen(false)} className={linkClass}>Profile</NavLink>
      {user.role === 'ADMIN' && (
        <NavLink to="/admin" onClick={() => setOpen(false)} className={linkClass}>Admin</NavLink>
      )}
    </>
  )

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-2 min-w-0">
          <NavLink to="/" className="text-xl font-bold text-brand-600 shrink-0">Errands</NavLink>
          <div className="hidden md:flex gap-1 ml-4">{links}</div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Toggle theme"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400 truncate max-w-[10rem]">
                {user.firstName}
              </span>
              <button
                onClick={async () => { await logout(); navigate('/login') }}
                className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
              Login
            </NavLink>
          )}
          {user && (
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
      {user && open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-2 py-2 flex flex-col gap-1">
          {links}
        </div>
      )}
    </nav>
  )
}
