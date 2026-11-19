import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import checkoutService from '../services/checkout'
import PageState from '@/components/PageState'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const formatDate = (value) => new Date(value).toLocaleString(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit'
})

function HistoryPage() {
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    checkoutService.getMyHistory()
      .then(data => {
        if (active) setHistory(data)
      })
      .catch(error => {
        if (active) {
          const message = error.response?.data?.error || 'Could not load your history.'
          setError(message)
          toast.error(message, { id: 'history-load-error' })
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleRetry = async () => {
    setLoading(true)

    try {
      const data = await checkoutService.getMyHistory()
      setHistory(data)
      setError('')
    } catch (error) {
      const message = error.response?.data?.error || 'Could not load your history.'
      setError(message)
      toast.error(message, { id: 'history-load-error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-labelledby="history-title">
      <header className="mb-6 space-y-1.5">
        <h1 id="history-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">My Borrowing History</h1>
        <p className="text-muted-foreground">Your active and returned checkouts.</p>
      </header>

      {loading ? (
        <Card aria-busy="true">
          <CardContent className="space-y-4 py-6">
            <p className="sr-only" role="status">Loading history...</p>
            {[0, 1, 2, 3].map(item => <Skeleton key={item} className="h-12 w-full" />)}
          </CardContent>
        </Card>
      ) : error ? (
        <PageState title="Could not load your history" description={error} onRetry={handleRetry} />
      ) : history.length === 0 ? (
        <PageState title="No borrowing history yet" description="Keys you borrow will appear here." />
      ) : (
        <>
          <Card className="hidden overflow-hidden lg:block">
            <Table className="min-w-[820px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Key name</TableHead>
                  <TableHead>Key code</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Borrowed</TableHead>
                  <TableHead>Returned</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map(checkout => (
                  <TableRow key={checkout.id}>
                    <TableCell className="font-medium">{checkout.name}</TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-muted-foreground">{checkout.code}</TableCell>
                    <TableCell className="text-muted-foreground">{checkout.location}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(checkout.borrowedAt)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {checkout.returnedAt
                        ? formatDate(checkout.returnedAt)
                        : <span className="text-muted-foreground">Not returned yet</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={checkout.returnedAt ? 'outline' : 'mine'}>
                        {checkout.returnedAt ? 'Returned' : 'Active'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="grid gap-4 lg:hidden">
            {history.map(checkout => (
              <Card key={checkout.id}>
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <CardTitle className="text-base">{checkout.name}</CardTitle>
                  <Badge variant={checkout.returnedAt ? 'outline' : 'mine'}>
                    {checkout.returnedAt ? 'Returned' : 'Active'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-sm">
                    <dt className="text-muted-foreground">Key code</dt>
                    <dd className="text-right font-mono">{checkout.code}</dd>
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="text-right">{checkout.location}</dd>
                    <dt className="text-muted-foreground">Borrowed</dt>
                    <dd className="text-right">{formatDate(checkout.borrowedAt)}</dd>
                    <dt className="text-muted-foreground">Returned</dt>
                    <dd className="text-right">
                      {checkout.returnedAt ? formatDate(checkout.returnedAt) : 'Not returned yet'}
                    </dd>
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default HistoryPage
