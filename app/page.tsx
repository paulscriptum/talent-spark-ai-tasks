import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  Sparkles, 
  Target, 
  Clock, 
  Users, 
  Shield, 
  ArrowRight,
  CheckCircle2,
  Code,
  Palette,
  PenTool,
  BarChart
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Generate comprehensive assessment tasks in seconds using advanced AI technology.",
  },
  {
    icon: Target,
    title: "Skill-Specific Tasks",
    description: "Create tailored challenges for development, design, writing, and analysis roles.",
  },
  {
    icon: Clock,
    title: "Time-Efficient",
    description: "Save hours of manual task creation with instant AI-generated content.",
  },
  {
    icon: Users,
    title: "Candidate Tracking",
    description: "Collect and review submissions with built-in response management.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your tasks and candidate data are protected with enterprise-grade security.",
  },
  {
    icon: BarChart,
    title: "AI Evaluation",
    description: "Get automated scoring and feedback on candidate submissions.",
  },
]

const categories = [
  { icon: Code, label: "Development", description: "Coding challenges, APIs, algorithms" },
  { icon: Palette, label: "Design", description: "UI/UX, visual design, prototypes" },
  { icon: PenTool, label: "Writing", description: "Content, copywriting, documentation" },
  { icon: BarChart, label: "Analysis", description: "Data analysis, research, reports" },
]

const benefits = [
  "Generate professional tasks in seconds",
  "Customize difficulty levels (Junior to Lead)",
  "Built-in evaluation criteria",
  "Public shareable links for candidates",
  "Track and manage all submissions",
  "AI-powered submission evaluation",
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Talent Spark AI</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Task Generation
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
            Create Better Assessment Tasks with{" "}
            <span className="text-primary">AI</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
            Generate professional, comprehensive assessment tasks for talent evaluation 
            in seconds. From coding challenges to design briefs, create the perfect 
            test for any role.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Start Generating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold">Generate Tasks for Any Role</h2>
            <p className="text-muted-foreground mt-2">
              Tailored assessment tasks for different skill categories
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.label} className="text-center">
                  <CardHeader className="pb-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold">{category.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything You Need for Better Hiring
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Powerful features designed to streamline your talent assessment process
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y bg-muted/30 py-24">
        <div className="container px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Why Choose Talent Spark AI?
              </h2>
              <p className="text-muted-foreground mt-4">
                Join thousands of hiring managers and recruiters who are transforming 
                their talent assessment process with AI-powered task generation.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="inline-block mt-8">
                <Button size="lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Senior React Developer Task</p>
                      <p className="text-sm text-muted-foreground">Generated in 12 seconds</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium">Task Preview</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Build a real-time collaborative document editor with React, 
                      implementing operational transformation for conflict resolution...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge>Senior</Badge>
                    <Badge variant="outline">Development</Badge>
                    <Badge variant="secondary">4-6 hours</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-muted-foreground mt-4">
            Start generating professional assessment tasks in seconds. 
            No credit card required.
          </p>
          <Link href="/auth/sign-up" className="inline-block mt-8">
            <Button size="lg">
              Create Your First Task
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Talent Spark AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with AI to help you find the best talent.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
