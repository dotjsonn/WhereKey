import { Link } from 'react-router'
import { KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'

function Brand({ className }) {
  return (
    <Link
      to="/dashboard"
      aria-label="WhereKey dashboard"
      className={cn('flex items-center gap-2.5 rounded-lg text-xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <KeyRound className="size-5" aria-hidden="true" />
      </span>
      <span>WhereKey</span>
    </Link>
  )
}

export default Brand
