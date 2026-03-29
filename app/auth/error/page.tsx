import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-semibold mb-3">Authentication Error</h1>
        <p className="text-muted-foreground mb-8">
          Something went wrong during the authentication process. 
          Please try again or contact support if the problem persists.
        </p>
        
        <div className="flex flex-col gap-3">
          <Link href="/login">
            <Button className="w-full h-12 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full h-12 rounded-xl">
              Go to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
