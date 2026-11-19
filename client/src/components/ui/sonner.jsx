import { CircleCheck, CircleX, Info, LoaderCircle, TriangleAlert } from 'lucide-react'
import { Toaster as Sonner } from 'sonner'

function Toaster(props) {
  return (
    <Sonner
      theme="system"
      position="top-right"
      richColors
      closeButton
      duration={4500}
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <CircleX className="size-4" />,
        loading: <LoaderCircle className="size-4 animate-spin" />
      }}
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
        '--success-bg': 'var(--success-subtle)',
        '--success-text': 'var(--success)',
        '--success-border': 'var(--border)',
        '--error-bg': 'var(--destructive-subtle)',
        '--error-text': 'var(--destructive)',
        '--error-border': 'var(--border)',
        '--border-radius': 'var(--radius)'
      }}
      toastOptions={{ className: 'font-sans' }}
      {...props}
    />
  )
}

export { Toaster }
