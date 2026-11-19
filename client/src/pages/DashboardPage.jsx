import { useEffect, useState } from 'react'
import { LoaderCircle, LockKeyhole, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import checkoutService from '../services/checkout'
import PageState from '@/components/PageState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function DashboardPage() {
  const [keys, setKeys] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [pendingKeyId, setPendingKeyId] = useState(null)
  const processing = pendingKeyId !== null

  useEffect(() => {
    let active = true

    checkoutService.getKeys()
      .then(data => {
        if (active) setKeys(data)
      })
      .catch(error => {
        if (active) {
          const message = error.response?.data?.error || 'Could not load the keys.'
          setError(message)
          toast.error(message, { id: 'keys-load-error' })
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const refreshKeys = async () => {
    try {
      const updatedKeys = await checkoutService.getKeys()
      setKeys(updatedKeys)
      setError('')
    } catch (error) {
      const message = error.response?.data?.error || 'Could not refresh the key list.'
      setError(message)
      toast.error(message, { id: 'keys-load-error' })
    }
  }

  const handleRetry = async () => {
    setLoading(true)
    await refreshKeys()
    setLoading(false)
  }

  const handleBorrow = async (key) => {
    setPendingKeyId(key.id)

    try {
      await checkoutService.create(key.id)
      toast.success('Key borrowed', { description: key.name })
      await refreshKeys()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not borrow this key.')
      if (error.response?.status === 409) await refreshKeys()
    } finally {
      setPendingKeyId(null)
    }
  }

  const handleReturn = async (key) => {
    setPendingKeyId(key.id)

    try {
      await checkoutService.returnKey(key.checkoutId)
      toast.success('Key returned', { description: key.name })
      await refreshKeys()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not return this key.')
      if (error.response?.status === 409) await refreshKeys()
    } finally {
      setPendingKeyId(null)
    }
  }

  return (
    <section aria-labelledby="dashboard-title">
      <header className="mb-6 space-y-1.5">
        <h1 id="dashboard-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">View shared keys and manage your checkouts.</p>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
          <p className="sr-only" role="status">Loading keys...</p>
          {[0, 1, 2, 3, 4, 5].map(item => (
            <Card key={item} aria-hidden="true">
              <CardHeader className="gap-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent className="space-y-5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </CardContent>
              <CardFooter className="border-t py-4">
                <Skeleton className="h-11 w-full rounded-lg" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <PageState title="Could not load the keys" description={error} onRetry={handleRetry} />
      ) : keys.length === 0 ? (
        <PageState title="No keys added yet" description="Shared keys will appear here when they are added." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {keys.map(key => (
            <Card key={key.id} className="h-full overflow-hidden">
              <CardHeader className="gap-2 pb-4">
                <CardTitle className="text-lg">{key.name}</CardTitle>
                <p className="font-mono text-sm text-muted-foreground">{key.code}</p>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{key.location}</span>
                </p>

                {key.status === 'available'
                  ? <Badge variant="available">Available</Badge>
                  : key.isBorrowedByMe
                    ? <Badge variant="mine">Borrowed by you</Badge>
                    : <Badge>Borrowed by another user</Badge>}
              </CardContent>

              <CardFooter className="mt-auto border-t py-4">
                {key.status === 'available' ? (
                  <Button type="button" className="w-full" onClick={() => handleBorrow(key)} disabled={processing}>
                    {pendingKeyId === key.id && <LoaderCircle className="animate-spin" aria-hidden="true" />}
                    {pendingKeyId === key.id ? 'Borrowing...' : 'Borrow'}
                  </Button>
                ) : key.isBorrowedByMe ? (
                  <Button type="button" variant="outline" className="w-full" onClick={() => handleReturn(key)} disabled={processing}>
                    {pendingKeyId === key.id && <LoaderCircle className="animate-spin" aria-hidden="true" />}
                    {pendingKeyId === key.id ? 'Returning...' : 'Return'}
                  </Button>
                ) : (
                  <Button type="button" variant="outline" className="w-full text-muted-foreground" disabled>
                    <LockKeyhole aria-hidden="true" />
                    Unavailable
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

export default DashboardPage
