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

  const features = [
    { icon: Bot, title: "AI Task Generation", desc: "Custom assessments tailored to any role" },
    { icon: BarChart3, title: "Smart Analysis", desc: "AI-powered scoring and feedback" },
    { icon: Users, title: "Team Collaboration", desc: "Share and evaluate together" },
    { icon: Globe, title: "Brand Voice", desc: "Reflects your company culture" },
    { icon: Shield, title: "Secure & Compliant", desc: "Enterprise-grade security" },
    { icon: Clock, title: "Save Time", desc: "Automate repetitive tasks" },
  ];

  const steps = [
    { num: "01", title: "Define Your Brand", desc: "Tell us about your company and role" },
    { num: "02", title: "Generate Tasks", desc: "AI creates custom assessments" },
    { num: "03", title: "Assess Candidates", desc: "Share links and collect responses" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background - simplified */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">testask</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button className="rounded-xl h-10 px-5 btn-hover">
                    Dashboard
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-sm h-10 hover:bg-primary/5">Sign in</Button>
                  </Link>
                  <Link href="/login">
                    <Button className="rounded-xl h-10 px-5 btn-hover">Get started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-up">
            <span className="tag">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI-Powered Recruitment
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mt-6 mb-6 animate-fade-up delay-100">
            Hire smarter with
            <br />
            <span className="text-primary">AI-crafted</span> assessments
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto animate-fade-up delay-200">
            Create tailored recruitment tasks that capture your brand voice and find the perfect candidates.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
            <Link href="/generate">
              <Button size="lg" className="h-12 px-8 text-base rounded-xl btn-hover group">
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Create your first task
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
              <Play className="w-5 h-5 mr-2" />
              Watch demo
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 animate-fade-up delay-400">
            {["No credit card required", "5 free tasks/month", "Cancel anytime"].map((text) => (
              <span key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-3 gap-4 animate-fade-up delay-500">
          {[
            { value: "10K+", label: "Tasks Created" },
            { value: "50K+", label: "Candidates Assessed" },
            { value: "96%", label: "Success Rate" },
          ].map((stat, i) => (
            <div key={i} className="card-hover p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="tag animate-fade-up">Features</span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-4 animate-fade-up delay-100">
              Everything you need to <span className="text-primary">hire better</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="card-hover p-6 group animate-fade-up"
                style={{ animationDelay: `${(i + 2) * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="tag animate-fade-up">How it works</span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-4 animate-fade-up delay-100">
              Three simple steps
            </h2>
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className="card-hover p-6 flex gap-6 items-center group animate-fade-up"
                style={{ animationDelay: `${(i + 2) * 100}ms` }}
              >
                <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center animate-fade-up delay-500">
            <Link href="/generate">
              <Button size="lg" className="h-12 px-8 text-base rounded-xl btn-hover">
                Start creating now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="tag animate-fade-up">Pricing</span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-4 animate-fade-up delay-100">
              Simple, <span className="text-primary">transparent</span> pricing
            </h2>
            <p className="text-muted-foreground mt-2 animate-fade-up delay-200">Start free, upgrade when you need</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Starter */}
            <div className="card-hover p-6 animate-fade-up delay-200">
              <h3 className="text-lg font-semibold mb-1">Starter</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">Perfect for trying out</p>
              <ul className="space-y-3 mb-6">
                {["5 tasks per month", "Basic AI generation", "Email support", "7-day history"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button variant="outline" className="w-full h-11 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                  Get started free
                </Button>
              </Link>
            </div>

            {/* Professional */}
            <div className="card-hover p-6 animate-fade-up delay-300 relative border-2 border-primary shadow-lg shadow-primary/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-primary/30">
                  <Star className="w-3.5 h-3.5" />
                  Most Popular
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1 pt-2">Professional</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">For growing teams</p>
              <ul className="space-y-3 mb-6">
                {["Unlimited tasks", "Advanced AI analysis", "Team collaboration", "Custom branding", "Priority support", "Analytics dashboard"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button className="w-full h-11 rounded-xl btn-hover">
                  Start free trial
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="card-hover p-6 animate-fade-up delay-400">
              <h3 className="text-lg font-semibold mb-1">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">For large organizations</p>
              <ul className="space-y-3 mb-6">
                {["Everything in Pro", "Custom integrations", "Dedicated manager", "SSO & security", "SLA guarantees", "Volume discounts"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <ContactSalesModal>
                <Button variant="outline" className="w-full h-11 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                  Contact sales
                </Button>
              </ContactSalesModal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="card-hover p-12 text-center animate-fade-up">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Ready to transform your hiring?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join hundreds of companies using testask to find exceptional candidates.
            </p>
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base rounded-xl btn-hover">
                Get started for free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">testask</span>
          </Link>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
          
          <p className="text-sm text-muted-foreground">2025 testask</p>
        </div>
      </footer>
    </div>
  );
}
