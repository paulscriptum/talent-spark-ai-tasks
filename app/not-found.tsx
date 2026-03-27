import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="inline-block mt-8">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
