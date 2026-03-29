"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowRight, Target, Bot, BarChart3, Users, Zap, Shield,
  CheckCircle2, Star, ChevronRight, Play, Globe, Clock, Layers, Hexagon,
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

  const features = [
    { icon: Bot, title: "AI Task Generation", desc: "Custom assessments tailored to any role" },
    { icon: BarChart3, title: "Smart Analysis", desc: "AI-powered scoring and feedback" },
    { icon: Users, title: "Team Collaboration", desc: "Share and evaluate together" },
    { icon: Globe, title: "Brand Voice", desc: "Reflects your company culture" },
    { icon: Shield, title: "Secure & Compliant", desc: "Enterprise-grade security" },
    { icon: Clock, title: "Save Time", desc: "Automate repetitive tasks" },
  ];

  const steps = [
    { num: "01", title: "Define Your Brand", desc: "Tell us about your company and role. Our AI learns your unique voice." },
    { num: "02", title: "Generate Tasks", desc: "AI creates custom assessments with multiple sections. Customize as needed." },
    { num: "03", title: "Assess Candidates", desc: "Share links, collect responses, get AI-powered recommendations." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
        
        {/* Gradient mesh */}
        <div className="absolute inset-0 mesh-bg" />
        
        {/* Floating shapes */}
        <div className="absolute top-32 left-[10%] w-20 h-20 shape-circle animate-float opacity-60" />
        <div className="absolute top-48 right-[15%] w-16 h-16 shape-ring animate-float-slow" />
        <div className="absolute top-[40%] left-[5%] w-12 h-12 shape-square animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[60%] right-[8%] w-24 h-24 shape-circle animate-float-slow opacity-40" />
        <div className="absolute bottom-[20%] left-[20%] w-14 h-14 shape-ring animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Glow orbs */}
        <div className="orb orb-primary w-[500px] h-[500px] -top-48 left-1/4 animate-pulse-glow" />
        <div className="orb orb-secondary w-[400px] h-[400px] top-1/3 -right-32 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="orb orb-primary w-[300px] h-[300px] bottom-20 left-10 animate-pulse-glow opacity-40" style={{ animationDelay: '3s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl gradient-animated flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">TalentSpark</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button className="rounded-xl h-10 px-5 btn-primary">
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
                    <Button className="rounded-xl h-10 px-5 btn-primary">Get started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-fade-up">
              <span className="tag">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                AI-Powered Recruitment Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mt-8 mb-6 animate-fade-up delay-100">
              Hire smarter with
              <br />
              <span className="text-gradient">AI-crafted</span> assessments
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-up delay-200">
              Create tailored recruitment tasks that capture your brand voice and find the perfect candidates.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
              <Link href="/generate">
                <Button size="lg" className="h-14 px-8 text-base rounded-2xl btn-primary group">
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Create your first task
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-2xl border-border/80 hover:border-primary/40 hover:bg-primary/5 transition-all">
                <Play className="w-5 h-5 mr-2" />
                Watch demo
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-14 animate-fade-up delay-400">
              {[
                "No credit card required",
                "5 free tasks/month",
                "Cancel anytime",
              ].map((text) => (
                <span key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Bento */}
          <div className="mt-24 bento-grid animate-fade-up delay-500">
            {[
              { value: "10K+", label: "Tasks Created", span: "bento-sm" },
              { value: "50K+", label: "Candidates Assessed", span: "bento-sm" },
              { value: "96%", label: "Success Rate", span: "bento-sm" },
            ].map((stat, i) => (
              <div key={i} className={`${stat.span} card-glow p-8 group`}>
                <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="tag animate-fade-up">Features</span>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-6 mb-4 animate-fade-up delay-100">
              Everything you need to
              <br />
              <span className="text-gradient">hire better</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="card-glow p-8 group animate-fade-up"
                style={{ animationDelay: `${(i + 2) * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 icon-glow group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative py-32 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <span className="tag animate-fade-up">How it works</span>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-6 mb-4 animate-fade-up delay-100">
              Three simple steps
            </h2>
          </div>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="card-glow p-8 flex gap-8 items-start group animate-fade-up"
                style={{ animationDelay: `${(i + 2) * 100}ms` }}
              >
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center animate-fade-up delay-500">
            <Link href="/generate">
              <Button size="lg" className="h-14 px-10 text-base rounded-2xl btn-primary">
                Start creating now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="tag animate-fade-up">Pricing</span>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-6 mb-4 animate-fade-up delay-100">
              Simple, <span className="text-gradient">transparent</span> pricing
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-up delay-200">Start free, upgrade when you need</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="card-glow p-8 animate-fade-up delay-200">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-8">Perfect for trying out TalentSpark</p>
              <ul className="space-y-4 mb-8">
                {["5 tasks per month", "Basic AI generation", "Email support", "7-day history"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button variant="outline" className="w-full h-12 rounded-xl text-base">
                  Get started free
                </Button>
              </Link>
            </div>

            {/* Professional */}
            <div className="pricing-featured card-glow p-8 animate-fade-up delay-300 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="gradient-animated text-white text-sm font-medium px-5 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-primary/30">
                  <Star className="w-4 h-4" />
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 pt-4">Professional</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-8">For growing recruitment teams</p>
              <ul className="space-y-4 mb-8">
                {["Unlimited tasks", "Advanced AI analysis", "Team collaboration", "Custom branding", "Priority support", "Analytics dashboard"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button className="w-full h-12 rounded-xl text-base btn-primary">
                  Start free trial
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="card-glow p-8 animate-fade-up delay-400">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold">Custom</span>
              </div>
              <p className="text-muted-foreground mb-8">For large organizations</p>
              <ul className="space-y-4 mb-8">
                {["Everything in Pro", "Custom integrations", "Dedicated manager", "SSO & security", "SLA guarantees", "Volume discounts"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />
                    {f}
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

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card-glow p-16 text-center relative overflow-hidden animate-fade-up">
            {/* Background decoration */}
            <div className="absolute inset-0 mesh-bg opacity-50" />
            <div className="absolute top-0 right-0 w-64 h-64 shape-circle opacity-30" />
            <div className="absolute bottom-0 left-0 w-48 h-48 shape-ring opacity-20" />
            
            <div className="relative">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Ready to transform your hiring?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
                Join hundreds of companies using TalentSpark to find exceptional candidates.
              </p>
              <Link href="/login">
                <Button size="lg" className="h-14 px-10 text-base rounded-2xl btn-primary">
                  Get started for free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-animated flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">TalentSpark</span>
          </Link>
          
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
          
          <p className="text-sm text-muted-foreground">2025 TalentSpark. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
