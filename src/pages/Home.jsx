import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { Button, Card } from '../components/ui'

export default function Home() {
  const { user } = useAuth()
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Book trusted errand providers <span className="text-brand-600">across Kenya</span>
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Find providers in your county and city, book errands at a fair fee, and resolve any
        issues through our dispute system.
      </p>
      {user ? (
        <div className="flex gap-3 justify-center">
          <Link to="/providers"><Button>Find Providers</Button></Link>
          <Link to="/errands"><Button variant="secondary">My Errands</Button></Link>
        </div>
      ) : (
        <div className="flex gap-3 justify-center">
          <Link to="/register"><Button>Get started</Button></Link>
          <Link to="/login"><Button variant="secondary">Sign in</Button></Link>
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-4 mt-16 text-left">
        {[
          ['Search by location', 'Filter providers by county and city across all 47 Kenyan counties.'],
          ['Transparent fees', 'See the provider\u2019s base fee upfront before you book.'],
          ['Dispute resolution', 'Either party can raise a dispute; admins review and resolve it fairly.'],
        ].map(([t, d]) => (
          <Card key={t}>
            <h3 className="font-semibold mb-1 text-brand-700 dark:text-brand-400">{t}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{d}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
