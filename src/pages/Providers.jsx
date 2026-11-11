import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { providerApi } from '../api'
import Avatar from '../components/Avatar'
import { Button, Card, ErrorBox, Field, SelectField, Spinner } from '../components/ui'

const COUNTIES = ['Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',"Murang'a",'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot']

export default function Providers() {
  const navigate = useNavigate()
  const [county, setCounty] = useState('')
  const [city, setCity] = useState('')
  const [providers, setProviders] = useState(null)
  const [error, setError] = useState('')

  const search = async (e) => {
    e?.preventDefault()
    setError('')
    try {
      setProviders(await providerApi.search({ county, city }))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => { search() }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Find errand providers</h1>
      <Card className="mb-6">
        <form onSubmit={search} className="grid sm:grid-cols-3 gap-3 items-end">
          <SelectField label="County" value={county} onChange={(e) => setCounty(e.target.value)}>
            <option value="">All counties</option>
            {COUNTIES.map((c) => <option key={c}>{c}</option>)}
          </SelectField>
          <Field label="City / Town" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Westlands" />
          <div className="flex items-end"><Button type="submit" className="w-full sm:w-auto">Search</Button></div>
        </form>
      </Card>
      <ErrorBox error={error} />
      {providers === null ? <Spinner /> : providers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No providers found. Try a different area.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <Avatar userId={p.userId} />
                <div>
                  <p className="font-semibold">{p.firstName} {p.lastName}</p>
                  <p className="text-xs text-gray-500">{p.city}, {p.county}</p>
                </div>
              </div>
              {p.services && <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{p.services}</p>}
              {p.bio && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{p.bio}</p>}
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold text-brand-600">KES {Number(p.baseFee).toLocaleString()}</span>
                <Button onClick={() => navigate(`/providers/${p.userId}`)}>View</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
