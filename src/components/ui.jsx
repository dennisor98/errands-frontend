export const inputCls =
  'w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition shadow-sm'

export const inputClsNoIcon =
  'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition shadow-sm'

export const selectCls =
  'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition shadow-sm'

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="text-center py-10 text-brand-600">
      <div className="inline-block w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-2" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}

export function ErrorBox({ error }) {
  if (!error) return null
  return (
    <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <span>{error}</span>
    </div>
  )
}

export function NoticeBox({ children }) {
  return (
    <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 text-sm flex items-start gap-2">
      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{children}</span>
    </div>
  )
}

export function StatusBadge({ status }) {
  const colors = {
    REQUESTED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    ACCEPTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    CANCELLED: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    DISPUTED: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    OPEN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    UNDER_REVIEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    DISMISSED: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  }
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${colors[status] || colors.CANCELLED}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-md shadow-brand-600/20',
    secondary: 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 dark:text-gray-200 dark:border-gray-700',
    danger: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-md shadow-red-600/20',
    ghost: 'text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/30',
  }
  return (
    <button
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function Field({ label, icon, className = '', ...props }) {
  return (
    <label className={`block mb-4 ${className}`}>
      <span className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{label}</span>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={icon ? inputCls : inputClsNoIcon}
          {...props}
        />
      </div>
    </label>
  )
}

export function SelectField({ label, children, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{label}</span>
      <select className={selectCls} {...props}>
        {children}
      </select>
    </label>
  )
}

export const icons = {
  mail: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  lock: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  user: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  phone: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  ),
  key: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
  shield: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
}
