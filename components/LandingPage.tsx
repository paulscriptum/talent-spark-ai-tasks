"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Target,
  Users,
  BarChart,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import ContactSalesModal from "@/components/ContactSalesModal";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user));
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = [
    { icon: Bot, title: "AI-Powered Generation", description: "Create realistic assessment tasks with AI that understands your brand and requirements.", color: "bg-primary/10 text-primary" },
    { icon: Target, title: "Smart Analysis", description: "Get detailed AI analysis of candidate responses with scoring and actionable feedback.", color: "bg-blue-100 text-blue-600" },
    { icon: Users, title: "Seamless Collaboration", description: "Share assessment links instantly and collaborate with your team on evaluations.", color: "bg-green-100 text-green-600" },
    { icon: BarChart, title: "Analytics Dashboard", description: "Track performance metrics and candidate insights with beautiful visualizations.", color: "bg-purple-100 text-purple-600" },
    { icon: Shield, title: "Brand Consistency", description: "Ensure all tasks align with your company values and communication tone.", color: "bg-amber-100 text-amber-600" },
    { icon: Zap, title: "Lightning Fast", description: "Generate, share, and analyze assessments in minutes, not hours.", color: "bg-red-100 text-red-600" },
  ];

  const stats = [
    { label: "Tasks Created", value: "10K+", icon: Target },
    { label: "Candidates Assessed", value: "50K+", icon: Users },
    { label: "Companies Using", value: "500+", icon: CheckCircle },
    { label: "Success Rate", value: "96%", icon: TrendingUp },
  ];

  const useCases = [
    { title: "Tech Startups", description: "Scale your hiring process with AI-powered technical assessments", icon: Lightbulb, badge: "Popular" },
    { title: "Enterprise Teams", description: "Standardize recruitment across departments with consistent evaluation", icon: Users, badge: "Enterprise" },
    { title: "Creative Agencies", description: "Assess creative thinking and brand alignment in candidate responses", icon: Sparkles, badge: "Creative" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-xl p-2 shadow-sm">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-semibold brand-font">testask</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 flex-1 justify-center ml-24">
              <button onClick={() => scrollToSection("features")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Features</button>
              <button onClick={() => scrollToSection("use-cases")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Use Cases</button>
              <button onClick={() => scrollToSection("pricing")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Pricing</button>
            </nav>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Link href="/dashboard"><Button variant="ghost">Dashboard</Button></Link>
              ) : (
                <>
                  <Link href="/login"><Button variant="ghost">Sign In</Button></Link>
                  <Link href="/generate">
                    <Button className="btn-ai-gradient">
                      <Sparkles className="h-4 w-4 mr-2" />Start Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />AI-Powered Recruitment Platform
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 brand-font text-balance">
              Create, share and check candidate assessments{" "}
              <br />with <span className="text-primary">testask</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed">
              A hiring platform designed to make hiring process easier. Generate smart assessments in seconds, analyze them automatically, and make confident hiring decisions with AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/generate">
                <Button size="lg" className="btn-ai-gradient text-lg px-8 py-4">
                  <Bot className="h-5 w-5 mr-2" />Start with AI
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  View Dashboard<ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 brand-font text-balance">Not everything powerful has to look complicated</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Experience the future of recruitment with AI-powered task generation, intelligent analysis, and seamless collaboration.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="glass-card btn-hover group">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 brand-font text-balance">Assessments that stand out start in testask</h2>
            <p className="text-xl text-muted-foreground">Trusted by companies of all sizes to streamline their recruitment process</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((uc, i) => (
              <Card key={i} className="glass-card btn-hover group relative overflow-hidden">
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <uc.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="bg-background/80">{uc.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{uc.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base">{uc.description}</CardDescription>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 brand-font">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Choose the perfect plan for your recruitment needs. Start free and scale as you grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass-card relative flex flex-col h-full">
              <CardHeader className="text-center p-8">
                <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                <div className="mt-4"><span className="text-4xl font-bold">$0</span><span className="text-muted-foreground">/month</span></div>
                <CardDescription className="mt-2">Perfect for individuals and small teams getting started</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                <ul className="space-y-3 flex-grow">
                  {["Up to 5 tasks per month","Basic AI task generation","Email support","Basic analytics"].map((f) => (
                    <li key={f} className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span>{f}</span></li>
                  ))}
                </ul>
                <div className="mt-8"><Link href="/generate" className="w-full block"><Button variant="outline" className="w-full">Get Started Free</Button></Link></div>
              </CardContent>
            </Card>

            <Card className="glass-card relative border-primary/20 flex flex-col h-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center p-8">
                <CardTitle className="text-2xl font-bold">Professional</CardTitle>
                <div className="mt-4"><span className="text-4xl font-bold">$29</span><span className="text-muted-foreground">/month</span></div>
                <CardDescription className="mt-2">Ideal for growing teams and HR departments</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                <ul className="space-y-3 flex-grow">
                  {["Unlimited tasks","Advanced AI analysis","Team collaboration","Priority support","Advanced analytics","Custom branding"].map((f) => (
                    <li key={f} className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span>{f}</span></li>
                  ))}
                </ul>
                <div className="mt-8"><Link href="/generate" className="w-full block"><Button className="w-full btn-ai-gradient">Start 14-day Free Trial</Button></Link></div>
              </CardContent>
            </Card>

            <Card className="glass-card relative flex flex-col h-full">
              <CardHeader className="text-center p-8">
                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                <div className="mt-4"><span className="text-4xl font-bold">Custom</span><span className="text-muted-foreground">/month</span></div>
                <CardDescription className="mt-2">For large organizations with specific requirements</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                <ul className="space-y-3 flex-grow">
                  {["Everything in Professional","Dedicated account manager","Custom integrations","Advanced security features","SLA guarantees","On-premise deployment"].map((f) => (
                    <li key={f} className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span>{f}</span></li>
                  ))}
                </ul>
                <div className="mt-8">
                  <ContactSalesModal><Button variant="outline" className="w-full">Contact Sales</Button></ContactSalesModal>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold tracking-tight mb-6 brand-font text-balance">Step into the future of recruitment</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join thousands of HR teams and recruiters using testask to turn hiring challenges into successful placements, fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/generate">
                  <Button size="lg" className="btn-ai-gradient text-lg px-8 py-4">
                    <Sparkles className="h-5 w-5 mr-2" />Start for Free
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                    View Dashboard<ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-xl p-2">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold brand-font">testask</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 testask. AI-powered recruitment platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
