import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, AlertCircle } from "lucide-react"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  return (
    <AuthErrorContent searchParams={searchParams} />
  )
}

async function AuthErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams
  const message = params.message || "An error occurred during authentication"

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please try again or contact support if the problem persists.
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <Link href="/auth/login">
              <Button className="w-full">Try again</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
