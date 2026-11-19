import { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { toast } from 'sonner'
import authService from '../services/auth'
import Brand from '@/components/Brand'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function SidebarLayout({ onLogout }) {
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)

    try {
      await authService.logout()
      toast.success('Logged out')
      onLogout()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not log out. Please try again.')
    } finally {
      setLoggingOut(false)
    }
  }

  const linkClassName = ({ isActive }) => cn(
    'flex min-h-14 flex-1 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring md:min-h-11 md:flex-none md:justify-start',
    isActive
      ? 'bg-accent text-accent-foreground'
      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
  )

  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-x-0 bottom-0 z-30 border-t bg-card md:inset-y-0 md:right-auto md:w-60 md:border-t-0 md:border-r">
        <div className="flex h-full items-center gap-1 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:flex-col md:items-stretch md:gap-0 md:p-4 md:pt-6">
          <Brand className="hidden px-2 pb-7 md:flex" />

          <nav className="flex flex-[2] gap-1 md:flex-none md:flex-col" aria-label="Main navigation">
            <NavLink to="/dashboard" end className={linkClassName}>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/history" className={linkClassName}>
              <span>History</span>
            </NavLink>
          </nav>

          <Button
            type="button"
            variant="ghost"
            className="h-auto min-h-14 flex-1 px-3 py-2 font-medium text-muted-foreground md:mt-auto md:min-h-11 md:flex-none md:justify-start"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </Button>
        </div>
      </aside>

      <main className="min-w-0 pb-28 md:pb-0 md:pl-60">
        <div className="mx-auto max-w-[1180px] px-4 py-6 md:px-10 md:py-9">
          <Brand className="mb-7 md:hidden" />
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default SidebarLayout
