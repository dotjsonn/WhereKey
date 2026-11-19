import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function PageState({ title, description, onRetry, retrying = false }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 px-6 py-12 text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
        {onRetry && (
          <Button type="button" variant="outline" onClick={onRetry} disabled={retrying} className="mt-3">
            {retrying ? 'Loading...' : 'Try again'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default PageState
