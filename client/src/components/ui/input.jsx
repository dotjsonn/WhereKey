import { cn } from '@/lib/utils'

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn('flex h-12 w-full min-w-0 rounded-lg border border-input bg-card px-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive', className)}
      {...props}
    />
  )
}

export { Input }
