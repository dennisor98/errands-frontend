import { useEffect, useState } from 'react'
import { fetchBlob } from '../api'

export default function Avatar({ userId, className = 'w-11 h-11 rounded-full object-cover bg-gray-200 dark:bg-gray-800' }) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    let objectUrl = null
    let cancelled = false
    ;(async () => {
      const blob = await fetchBlob(`/api/users/${userId}/avatar`)
      if (!cancelled && blob) {
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      }
    })()
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [userId])

  if (!url) return <div className={className} />
  return <img src={url} alt="" className={className} />
}
