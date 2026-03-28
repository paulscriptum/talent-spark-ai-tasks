"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot, Target, Users, BarChart, CheckCircle, Sparkles, ArrowRight,
  Zap, Shield, Lightbulb, TrendingUp, ChevronRight, Clock, Star,
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
    { icon: Bot, title: "AI Task Generation", description: "Generate custom recruitment tasks tailored to your brand voice and requirements in seconds.", gradient: "from-amber-500/20 to-orange-500/20" },
    { icon: Target, title: "Smart Analysis", description: "Get AI-powered scoring and detailed feedback on every candidate response automatically.", gradient: "from-emerald-500/20 to-teal-500/20" },
    { icon: Users, title: "Team Collaboration", description: "Share assessment links and collaborate with your team on candidate evaluations seamlessly.", gradient: "from-blue-500/20 to-indigo-500/20" },
    { icon: BarChart, title: "Rich Analytics", description: "Track performance metrics and gain insights with beautiful, actionable visualizations.", gradient: "from-purple-500/20 to-pink-500/20" },
    { icon: Shield, title: "Brand Alignment", description: "Ensure every task reflects your company culture, values, and communication style.", gradient: "from-rose-500/20 to-red-500/20" },
    { icon: Zap, title: "Lightning Speed", description: "From task creation to candidate analysis, everything happens in minutes, not days.", gradient: "from-yellow-500/20 to-amber-500/20" },
  ];

  const stats = [
    { label: "Tasks Generated", value: "10K+", icon: Target },
    { label: "Candidates Assessed", value: "50K+", icon: Users },
    { label: "Companies Trust Us", value: "500+", icon: CheckCircle },
    { label: "Hiring Success Rate", value: "96%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bg-primary rounded-xl p-2 shadow-sm group-hover:shadow-md transition-shadow">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl brand-font">testask</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("features")} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Features</button>
              <button onClick={() => scrollToSection("how-it-works")} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">How It Works</button>
              <button onClick={() => scrollToSection("pricing")} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Pricing</button>
            </nav>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button className="btn-ai-gradient rounded-xl px-5">
                    <span>Dashboard</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login"><Button variant="ghost" className="text-sm font-medium">Sign In</Button></Link>
                  <Link href="/generate">
                    <Button className="btn-ai-gradient rounded-xl px-5">
                      <Sparkles className="h-4 w-4 mr-1.5" />
                      <span>Start Free</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium rounded-full">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />AI-Powered Recruitment
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 brand-font text-balance leading-[1.1]">
              Recruitment tasks that{" "}
              <span className="text-primary">actually work</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto text-balance">
              Create AI-powered assessments in seconds, analyze candidate responses automatically, and make confident hiring decisions backed by data.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/generate">
                <Button size="lg" className="btn-ai-gradient text-base px-8 h-12 rounded-xl">
                  <Bot className="h-5 w-5 mr-2" />Start Creating for Free
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-base px-8 h-12 rounded-xl border-border/60 hover:bg-accent/50">
                  <span>See How It Works</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/40 bg-card/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent text-foreground border-border/40 px-3 py-1 text-xs font-medium rounded-full">Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 brand-font text-balance">
              Everything you need to hire smarter
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools designed to streamline your entire recruitment workflow, from task creation to final decision.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="glass-card group overflow-hidden">
                <CardHeader className="p-6 pb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-card/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent text-foreground border-border/40 px-3 py-1 text-xs font-medium rounded-full">How It Works</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 brand-font text-balance">
              Three steps to better hiring
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From defining your requirements to analyzing responses, we&apos;ve simplified the entire process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", icon: Lightbulb, title: "Define Your Brand", description: "Tell us about your company, values, and the role you're hiring for. Our AI learns your unique voice." },
              { step: "02", icon: Sparkles, title: "Generate Tasks", description: "AI creates custom assessment tasks aligned with your brand and requirements in seconds." },
              { step: "03", icon: BarChart, title: "Analyze & Decide", description: "Share links with candidates, collect responses, and get AI-powered analysis and scoring." },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="glass-card p-8 h-full">
                  <div className="text-5xl font-bold text-primary/20 mb-4 brand-font">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="h-8 w-8 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent text-foreground border-border/40 px-3 py-1 text-xs font-medium rounded-full">Pricing</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 brand-font text-balance">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees, cancel anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="glass-card relative flex flex-col">
              <CardHeader className="p-8 pb-6">
                <CardTitle className="text-xl font-semibold">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-3">Perfect for trying out testask</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                <ul className="space-y-3 flex-grow">
                  {["5 tasks per month", "Basic AI generation", "Email support", "7-day response history"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/generate" className="w-full block">
                    <Button variant="outline" className="w-full rounded-xl h-11">Get Started</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Professional */}
            <Card className="glass-card relative flex flex-col border-primary/30 shadow-lg shadow-primary/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full shadow-sm">
                  <Star className="h-3 w-3 mr-1" />Most Popular
                </Badge>
              </div>
              <CardHeader className="p-8 pb-6">
                <CardTitle className="text-xl font-semibold">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-3">For growing teams and HR departments</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                <ul className="space-y-3 flex-grow">
                  {["Unlimited tasks", "Advanced AI analysis", "Team collaboration", "Priority support", "Custom branding", "API access"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/generate" className="w-full block">
                    <Button className="w-full btn-ai-gradient rounded-xl h-11">Start 14-day Trial</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="glass-card relative flex flex-col">
              <CardHeader className="p-8 pb-6">
                <CardTitle className="text-xl font-semibold">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <CardDescription className="mt-3">For large organizations with specific needs</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                <ul className="space-y-3 flex-grow">
                  {["Everything in Professional", "Dedicated success manager", "Custom integrations", "SSO & advanced security", "SLA guarantees", "On-premise option"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <ContactSalesModal>
                    <Button variant="outline" className="w-full rounded-xl h-11">Contact Sales</Button>
                  </ContactSalesModal>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card/30 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="glass-card p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6 brand-font text-balance">
                Ready to transform your hiring?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                Join hundreds of companies using testask to find better candidates faster. Start creating AI-powered assessments today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/generate">
                  <Button size="lg" className="btn-ai-gradient text-base px-8 h-12 rounded-xl">
                    <Sparkles className="h-5 w-5 mr-2" />Start for Free
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="text-base px-8 h-12 rounded-xl border-border/60">
                    <Clock className="h-5 w-5 mr-2" />Book a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-primary rounded-xl p-2">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl brand-font">testask</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 testask. AI-powered recruitment platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
