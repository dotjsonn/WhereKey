import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-sm font-medium leading-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-secondary text-secondary-foreground',
        available: 'border-transparent bg-success-subtle text-success',
        mine: 'border-transparent bg-borrowed-subtle text-borrowed',
        outline: 'border-border bg-transparent text-muted-foreground'
      }
    },
    defaultVariants: { variant: 'default' }
  }
)

function Badge({ className, variant, ...props }) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { Badge }
