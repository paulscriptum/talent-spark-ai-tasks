"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowRight, Target, Bot, BarChart3, Users, Zap, Shield,
  CheckCircle2, Star, ChevronRight, Play, Globe, Clock,
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

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Decorative background */}
      <div className="fixed inset-0 hero-gradient pointer-events-none" />
      
      {/* Floating decorations */}
      <div className="fixed top-20 right-[15%] w-72 h-72 bg-accent/5 rounded-full blur-3xl float" />
      <div className="fixed bottom-40 left-[10%] w-96 h-96 bg-[hsl(42,90%,55%)]/5 rounded-full blur-3xl float-delay-2" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Target className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">TalentSpark</span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button className="rounded-xl h-10 px-5 btn-primary-glow">
                    Dashboard
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-sm h-10">Sign in</Button>
                  </Link>
                  <Link href="/login">
                    <Button className="rounded-xl h-10 px-5 btn-primary-glow">
                      Get started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 tag mb-8 animate-reveal">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Recruitment Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 animate-reveal delay-100">
              <span className="block">Hire smarter with</span>
              <span className="block text-primary mt-2">AI-crafted assessments</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-reveal delay-200">
              Create tailored recruitment tasks that capture your brand voice, 
              evaluate candidates efficiently, and find the perfect fit every time.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-reveal delay-300">
              <Link href="/generate">
                <Button size="lg" className="h-12 px-8 text-base rounded-xl shadow-lg shadow-primary/25">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create your first task
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-xl border-border hover:bg-card">
                <Play className="w-5 h-5 mr-2" />
                Watch demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm animate-reveal delay-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>5 free tasks per month</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto animate-reveal delay-500">
            {[
              { value: "10K+", label: "Tasks Created", icon: Sparkles },
              { value: "50K+", label: "Candidates Assessed", icon: Users },
              { value: "96%", label: "Success Rate", icon: Target },
              { value: "4.9/5", label: "User Rating", icon: Star },
            ].map((stat, i) => (
              <div key={i} className="card-premium p-6 text-center group">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <stat.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="stat-value text-3xl lg:text-4xl mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-8 section-warm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="tag mb-4 mx-auto w-fit">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Features
            </div>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              Everything you need to
              <span className="text-primary"> hire better</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools designed for modern recruitment teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: "AI Task Generation", desc: "Create custom assessments tailored to any role with our advanced AI that understands your brand voice and requirements.", color: "accent" },
              { icon: BarChart3, title: "Smart Response Analysis", desc: "Get AI-powered scoring, detailed feedback, and insights on every candidate response automatically.", color: "terracotta" },
              { icon: Users, title: "Team Collaboration", desc: "Share assessment links, collaborate on evaluations, and make hiring decisions together.", color: "gold" },
              { icon: Globe, title: "Brand Consistency", desc: "Every task reflects your company culture, values, and communication style perfectly.", color: "sage" },
              { icon: Shield, title: "Secure & Compliant", desc: "Enterprise-grade security with GDPR compliance and data protection built in.", color: "rust" },
              { icon: Clock, title: "Save Hours Weekly", desc: "Automate repetitive tasks and focus on connecting with the best candidates.", color: "accent" },
            ].map((feature, i) => (
              <div key={i} className="feature-card group">
                <div className="icon-wrap">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="tag mb-4 mx-auto w-fit">
              <Target className="w-3.5 h-3.5 mr-1.5" />
              Process
            </div>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              Three steps to
              <span className="text-primary"> perfect hiring</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { step: "01", title: "Define Your Brand", desc: "Tell us about your company, culture, and the role. Our AI learns your unique voice and requirements to create perfectly aligned assessments." },
              { step: "02", title: "Generate & Customize", desc: "AI creates custom tasks with multiple sections. Review, edit, and refine until everything matches your vision exactly." },
              { step: "03", title: "Assess & Analyze", desc: "Share links with candidates, collect responses, and get AI-powered analysis with detailed scoring and hiring recommendations." },
            ].map((item, i) => (
              <div key={i} className="card-premium p-8 flex gap-8 items-start">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-[hsl(42,90%,55%)]/10 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gradient">{item.step}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/generate">
              <Button size="lg" className="h-12 px-8 text-base rounded-xl shadow-lg shadow-primary/25">
                Start creating now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 lg:px-8 section-warm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="tag mb-4 mx-auto w-fit">
              <Star className="w-3.5 h-3.5 mr-1.5" />
              Pricing
            </div>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              Simple, <span className="text-primary">transparent</span> pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, scale when you need
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Starter */}
            <div className="card-premium p-8">
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-semibold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">Perfect for trying TalentSpark</p>
              </div>
              <ul className="space-y-4 mb-8">
                {["5 tasks per month", "Basic AI generation", "Email support", "7-day history"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full h-12 rounded-xl text-base">
                  Get started free
                </Button>
              </Link>
            </div>

            {/* Professional - Featured */}
            <div className="card-glow pricing-featured p-8 pt-10 relative mt-6 lg:mt-0">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg shadow-primary/25 whitespace-nowrap">
                  <Star className="w-3.5 h-3.5" />
                  Most Popular
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Professional</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-semibold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">For growing recruitment teams</p>
              </div>
              <ul className="space-y-4 mb-8">
                {["Unlimited tasks", "Advanced AI analysis", "Team collaboration", "Custom branding", "Priority support", "Analytics dashboard"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block">
                <Button className="w-full h-12 rounded-xl text-base">
                  Start free trial
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="card-premium p-8">
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-semibold">Custom</span>
                </div>
                <p className="text-muted-foreground">For large organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                {["Everything in Pro", "Custom integrations", "Dedicated success manager", "SSO & advanced security", "SLA guarantees", "Volume discounts"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <ContactSalesModal>
                <Button variant="outline" className="w-full h-12 rounded-xl text-base">
                  Contact sales
                </Button>
              </ContactSalesModal>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card-glow p-12 lg:p-16 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 mesh-gradient opacity-50" />
            
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Ready to transform your hiring process?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join hundreds of companies using TalentSpark to find exceptional candidates faster.
              </p>
              <Link href="/login">
                <Button size="lg" className="h-12 px-10 text-base rounded-xl shadow-lg shadow-primary/25">
                  Get started for free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Target className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">TalentSpark</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              2025 TalentSpark. AI-powered recruitment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
