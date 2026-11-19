import { cn } from '@/lib/utils'

function Card({ className, ...props }) {
  return <div data-slot="card" className={cn('flex flex-col rounded-xl border bg-card text-card-foreground', className)} {...props} />
}

function CardHeader({ className, ...props }) {
  return <div data-slot="card-header" className={cn('flex flex-col gap-2 p-5', className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return <h2 data-slot="card-title" className={cn('font-semibold leading-snug tracking-tight', className)} {...props} />
}

function CardDescription({ className, ...props }) {
  return <p data-slot="card-description" className={cn('text-sm leading-relaxed text-muted-foreground', className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn('px-5 pb-5', className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return <div data-slot="card-footer" className={cn('flex items-center px-5 pb-5', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
