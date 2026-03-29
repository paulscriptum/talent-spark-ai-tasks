"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowRight, Target, Bot, BarChart3, Users, Zap, Shield,
  CheckCircle2, Star, ChevronRight, Play, Globe, Clock, ArrowUpRight,
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
    <div className="min-h-screen bg-background">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-primary/8 via-transparent to-transparent" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-radial from-[hsl(42,80%,60%)]/5 via-transparent to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">TalentSpark</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#process" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button className="rounded-xl h-10 px-5">
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
                    <Button className="rounded-xl h-10 px-5">Get started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Recruitment
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up">
              Hire smarter with{" "}
              <span className="text-primary">AI-crafted</span>
              <br />assessments
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-in-up animation-delay-100">
              Create tailored recruitment tasks that capture your brand voice, 
              evaluate candidates efficiently, and find the perfect fit.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-200">
              <Link href="/generate">
                <Button size="lg" className="h-12 px-6 rounded-xl text-base w-full sm:w-auto">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create your first task
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-6 rounded-xl text-base">
                <Play className="w-4 h-4 mr-2" />
                Watch demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground animate-fade-in-up animation-delay-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                5 free tasks/month
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Cancel anytime
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20 animate-fade-in-up animation-delay-400">
            {[
              { value: "10K+", label: "Tasks Created" },
              { value: "50K+", label: "Candidates Assessed" },
              { value: "96%", label: "Success Rate" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 text-center hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Everything you need to <span className="text-primary">hire better</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful AI tools designed for modern recruitment teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: "AI Task Generation", desc: "Create custom assessments tailored to any role with our advanced AI." },
              { icon: BarChart3, title: "Smart Analysis", desc: "Get AI-powered scoring and detailed feedback on every response." },
              { icon: Users, title: "Team Collaboration", desc: "Share links, collaborate on evaluations, and decide together." },
              { icon: Globe, title: "Brand Consistency", desc: "Every task reflects your company culture and values perfectly." },
              { icon: Shield, title: "Secure & Compliant", desc: "Enterprise-grade security with GDPR compliance built in." },
              { icon: Clock, title: "Save Hours", desc: "Automate repetitive tasks and focus on the best candidates." },
            ].map((feature, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="process" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Three steps to <span className="text-primary">perfect hiring</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { step: "01", title: "Define Your Brand", desc: "Tell us about your company, culture, and the role. Our AI learns your unique voice." },
              { step: "02", title: "Generate & Customize", desc: "AI creates custom tasks with multiple sections. Review and refine until perfect." },
              { step: "03", title: "Assess & Analyze", desc: "Share with candidates, collect responses, and get AI-powered recommendations." },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/generate">
              <Button size="lg" className="h-12 px-8 rounded-xl">
                Start creating now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Simple, <span className="text-primary">transparent</span> pricing
            </h2>
            <p className="text-muted-foreground">Start free, scale when you need</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Perfect for trying TalentSpark</p>
              </div>
              <ul className="space-y-3 mb-8">
                {["5 tasks per month", "Basic AI generation", "Email support", "7-day history"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full h-11 rounded-xl">
                  Get started free
                </Button>
              </Link>
            </div>

            {/* Professional */}
            <div className="p-8 rounded-2xl bg-card border-2 border-primary shadow-xl shadow-primary/10 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-sm font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  Most Popular
                </span>
              </div>
              <div className="mb-6 pt-2">
                <h3 className="text-lg font-semibold mb-1">Professional</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">For growing recruitment teams</p>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited tasks", "Advanced AI analysis", "Team collaboration", "Custom branding", "Priority support", "Analytics dashboard"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block">
                <Button className="w-full h-11 rounded-xl">
                  Start free trial
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">For large organizations</p>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Pro", "Custom integrations", "Dedicated manager", "SSO & security", "SLA guarantees", "Volume discounts"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <ContactSalesModal>
                <Button variant="outline" className="w-full h-11 rounded-xl">
                  Contact sales
                </Button>
              </ContactSalesModal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/5 via-card to-primary/5 border border-border/50">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to transform your hiring?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join hundreds of companies using TalentSpark to find exceptional candidates.
            </p>
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 rounded-xl">
                Get started for free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">TalentSpark</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
          
          <p className="text-sm text-muted-foreground">2025 TalentSpark</p>
        </div>
      </footer>
    </div>
  );
}
