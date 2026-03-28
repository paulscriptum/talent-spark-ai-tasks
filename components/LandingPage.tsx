"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bot, Target, Users, BarChart3, CheckCircle2, Sparkles, ArrowRight,
  Zap, Shield, Clock, Star, Play,
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Target className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">testask</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button size="sm" className="rounded-lg">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign in</Button>
                  </Link>
                  <Link href="/generate">
                    <Button size="sm" className="rounded-lg">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 text-xs font-medium">
            Trusted by 500+ companies
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-balance">
            Create recruitment tasks
            <br />
            <span className="text-muted-foreground">that find the right talent</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate AI-powered assessments in seconds, analyze candidate responses automatically, and make confident hiring decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/generate">
              <Button size="lg" className="rounded-lg px-6 h-11 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Start for free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-lg px-6 h-11 text-sm font-medium">
              <Play className="w-4 h-4 mr-2" />
              Watch demo
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-16 pt-10 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "10K+", label: "Tasks created" },
                { value: "50K+", label: "Candidates assessed" },
                { value: "96%", label: "Success rate" },
                { value: "4.9", label: "Average rating" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Everything you need to hire better
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful tools designed for modern recruitment teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Bot, title: "AI Generation", desc: "Create custom tasks tailored to your brand voice and requirements" },
              { icon: BarChart3, title: "Smart Analysis", desc: "Get AI-powered scoring and detailed feedback on responses" },
              { icon: Users, title: "Team Collaboration", desc: "Share assessment links and collaborate on evaluations" },
              { icon: Zap, title: "Lightning Fast", desc: "From creation to analysis, everything happens in minutes" },
              { icon: Shield, title: "Brand Aligned", desc: "Tasks that reflect your company culture and values" },
              { icon: Clock, title: "Time Saving", desc: "Automate repetitive tasks and focus on what matters" },
            ].map((feature, i) => (
              <div key={i} className="group p-6 rounded-xl bg-card border border-border/50 hover:border-border transition-colors">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to better hiring
            </p>
          </div>

          <div className="space-y-8">
            {[
              { step: "1", title: "Define your brand", desc: "Tell us about your company, values, and the role you're hiring for. Our AI learns your unique voice and requirements." },
              { step: "2", title: "Generate tasks", desc: "AI creates custom assessment tasks aligned with your brand. Review, edit, and customize as needed." },
              { step: "3", title: "Analyze responses", desc: "Share links with candidates, collect responses, and get AI-powered analysis with scoring and recommendations." },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-medium">
                  {item.step}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/generate">
              <Button size="lg" className="rounded-lg px-8">
                Try it now
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
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Simple pricing
            </h2>
            <p className="text-muted-foreground">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <div className="mb-6">
                <h3 className="font-medium mb-1">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">$0</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">For trying out testask</p>
              </div>
              <ul className="space-y-3 mb-8">
                {["5 tasks per month", "Basic AI generation", "Email support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/generate" className="block">
                <Button variant="outline" className="w-full rounded-lg">Get started</Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-xl bg-card border-2 border-primary relative">
              <div className="absolute -top-3 left-4">
                <Badge className="rounded-full px-3 py-0.5 text-xs">
                  <Star className="w-3 h-3 mr-1" />Popular
                </Badge>
              </div>
              <div className="mb-6">
                <h3 className="font-medium mb-1">Professional</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">$29</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">For growing teams</p>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited tasks", "Advanced AI analysis", "Team collaboration", "Priority support", "Custom branding"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/generate" className="block">
                <Button className="w-full rounded-lg">Start trial</Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <div className="mb-6">
                <h3 className="font-medium mb-1">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">Custom</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">For large organizations</p>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Pro", "Custom integrations", "Dedicated support", "SSO & security", "SLA guarantees"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    {f}
                  </li>
                ))}
              </ul>
              <ContactSalesModal>
                <Button variant="outline" className="w-full rounded-lg">Contact sales</Button>
              </ContactSalesModal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Ready to transform your hiring?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join hundreds of companies using testask to find better candidates faster.
          </p>
          <Link href="/generate">
            <Button size="lg" className="rounded-lg px-8">
              Get started for free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Target className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">testask</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2025 testask. AI-powered recruitment.
          </p>
        </div>
      </footer>
    </div>
  );
}
