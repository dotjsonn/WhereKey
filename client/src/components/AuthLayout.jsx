import Brand from '@/components/Brand'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

function AuthLayout({ title, children, footer }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <Card className="w-full max-w-[420px] rounded-2xl">
        <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
          <Brand />
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Borrow shared keys and keep track of returns.
          </p>
          <div className="my-5 h-px bg-border" />
          <h1 className="text-2xl font-semibold leading-snug tracking-tight">{title}</h1>
        </CardHeader>
        <CardContent className="px-6 pt-5 pb-0 sm:px-8">
          {children}
        </CardContent>
        <CardFooter className="justify-center px-6 pt-6 pb-6 text-sm text-muted-foreground sm:px-8 sm:pb-8">
          {footer}
        </CardFooter>
      </Card>
    </main>
  )
}

export default AuthLayout
