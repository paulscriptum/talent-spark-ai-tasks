import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Target, 
  Users, 
  BarChart, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Clock,
  FileText,
  Zap,
  Shield,
  Lightbulb,
  TrendingUp,
  Building,
  Briefcase
} from 'lucide-react';
import ContactSalesModal from '@/components/ContactSalesModal';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const { isLoggedIn } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const features = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI-Powered Generation",
      description: "Create realistic assessment tasks with AI that understands your brand and requirements.",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Analysis",
      description: "Get detailed AI analysis of candidate responses with scoring and actionable feedback.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Seamless Collaboration",
      description: "Share assessment links instantly and collaborate with your team on evaluations.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description: "Track performance metrics and candidate insights with beautiful visualizations.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Brand Consistency",
      description: "Ensure all tasks align with your company values and communication tone.",
      color: "bg-amber-100 text-amber-600"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Generate, share, and analyze assessments in minutes, not hours.",
      color: "bg-red-100 text-red-600"
    }
  ];

  const stats = [
    { label: "Tasks Created", value: "10K+", icon: <Target className="h-5 w-5" /> },
    { label: "Candidates Assessed", value: "50K+", icon: <Users className="h-5 w-5" /> },
    { label: "Companies Using", value: "500+", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Success Rate", value: "96%", icon: <TrendingUp className="h-5 w-5" /> }
  ];

  const useCases = [
    {
      title: "Tech Startups",
      description: "Scale your hiring process with AI-powered technical assessments",
      icon: <Lightbulb className="h-6 w-6" />,
      badge: "Popular"
    },
    {
      title: "Enterprise Teams",
      description: "Standardize recruitment across departments with consistent evaluation",
      icon: <Users className="h-6 w-6" />,
      badge: "Enterprise"
    },
    {
      title: "Creative Agencies",
      description: "Assess creative thinking and brand alignment in candidate responses",
      icon: <Sparkles className="h-6 w-6" />,
      badge: "Creative"
    }
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
            <nav className="hidden md:flex items-center justify-center flex-1 mx-8" style={{ marginLeft: '100px' }}>
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('use-cases')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Use Cases
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Pricing
                </button>
              </div>
            </nav>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/generate">
                    <Button className="btn-ai-gradient">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Recruitment Platform
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 brand-font">
              Create, share and check candidate assessments{' '}
              <br />
              with <span className="text-primary">testask</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed">
              A hiring platform designed to make hiring process easier. Generate smart assessments in seconds, analyze them automatically, and make confident hiring decisions with AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/generate">
                <Button size="lg" className="btn-ai-gradient text-lg px-8 py-4">
                  <Bot className="h-5 w-5 mr-2" />
                  Start with AI
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  View Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 brand-font">
              Not everything powerful has to look complicated
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of recruitment with AI-powered task generation, 
              intelligent analysis, and seamless collaboration.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card btn-hover group">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 brand-font">
              Assessments that stand out start in testask
            </h2>
            <p className="text-xl text-muted-foreground">
              Trusted by companies of all sizes to streamline their recruitment process
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="glass-card btn-hover group relative overflow-hidden">
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform duration-300">
                      {useCase.icon}
                    </div>
                    <Badge variant="outline" className="bg-background/80">
                      {useCase.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base">
                    {useCase.description}
                  </CardDescription>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 brand-font">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your recruitment needs. Start free and scale as you grow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="glass-card relative flex flex-col h-full">
              <CardHeader className="text-center p-8">
                <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">
                  Perfect for individuals and small teams getting started
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Up to 5 tasks per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Basic AI task generation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Basic analytics</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/generate" className="w-full block">
                    <Button variant="outline" className="w-full">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="glass-card relative border-primary/20 flex flex-col h-full">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center p-8">
                <CardTitle className="text-2xl font-bold">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">
                  Ideal for growing teams and HR departments
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Unlimited tasks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Advanced AI analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Custom branding</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/generate" className="w-full block">
                    <Button className="w-full btn-ai-gradient">
                      Start 14-day Free Trial
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="glass-card relative flex flex-col h-full">
              <CardHeader className="text-center p-8">
                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">
                  For large organizations with specific requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Advanced security features</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>SLA guarantees</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>On-premise deployment</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <ContactSalesModal>
                    <Button variant="outline" className="w-full">
                      Contact Sales
                    </Button>
                  </ContactSalesModal>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold tracking-tight mb-6 brand-font">
                Step into the future of recruitment
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join thousands of HR teams and recruiters using testask to turn 
                hiring challenges into successful placements, fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/generate">
                  <Button size="lg" className="btn-ai-gradient text-lg px-8 py-4">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Start for Free
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                    View Dashboard
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary rounded-xl p-2 shadow-sm">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-semibold brand-font">testask</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                AI-powered recruitment task management platform that helps you 
                create, share, and analyze candidate assessments with intelligence.
              </p>
              <div className="text-sm text-muted-foreground">
                © 2025 testask ai. All rights reserved.
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <Link to="/generate" className="block hover:text-foreground transition-colors">Generate Tasks</Link>
                <Link to="/dashboard" className="block hover:text-foreground transition-colors">Dashboard</Link>
                <Link to="/projects" className="block hover:text-foreground transition-colors">Manage Projects</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">About</a>
                <a href="#" className="block hover:text-foreground transition-colors">Careers</a>
                <a href="#" className="block hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 