import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, ArrowRight, Truck, MapPin, Camera, CheckCircle2, Star, FileCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WebLayout from '@/components/layout/WebLayout';
import zeeroniLogo from '@/assets/zeeroni-logo.png';
import { toast } from 'sonner';
import addressScreenshot from '@/assets/screenshots/address.png';
import scanScreenshot from '@/assets/screenshots/scan.png';
import quoteScreenshot from '@/assets/screenshots/quote.png';
import trackingScreenshot from '@/assets/screenshots/tracking.png';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Camera,
      title: 'Intelligent Inventory',
      description: 'Point your camera at any room. Our tech instantly identifies and catalogs every item for accurate quotes.',
    },
    {
      icon: Shield,
      title: '100% Transparent Pricing',
      description: 'No hidden fees, no surprises. See exactly what you\'re paying for with our dynamic pricing breakdown.',
    },
    {
      icon: MapPin,
      title: 'Real-Time Tracking',
      description: 'Follow your belongings from pickup to delivery. Know exactly where everything is, every mile.',
    },
    {
      icon: CheckCircle2,
      title: 'Digital Verification',
      description: 'Verify every item on delivery with our digital manifest. Complete peace of mind guaranteed.',
    },
  ];

  const steps = [
    { number: '01', title: 'Enter Addresses', description: 'Tell us where you\'re moving from and to', screenshot: addressScreenshot },
    { number: '02', title: 'Scan Your Items', description: 'Use intelligent tech to catalog your inventory', screenshot: scanScreenshot },
    { number: '03', title: 'Get Instant Quote', description: 'Receive transparent, competitive pricing', screenshot: quoteScreenshot },
    { number: '04', title: 'Schedule & Track', description: 'Book your move and track in real-time', screenshot: trackingScreenshot },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Moved from Mumbai to Bangalore',
      quote: 'Zeeroni made our interstate move completely stress-free. The intelligent scan was incredibly accurate!',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      role: 'Relocated within Delhi',
      quote: 'Finally, a moving service that\'s actually transparent. No hidden charges, just excellent service.',
      rating: 5,
    },
    {
      name: 'Anita Krishnan',
      role: 'Office relocation',
      quote: 'The real-time tracking gave us complete visibility. Our business was back up in no time.',
      rating: 5,
    },
  ];

  // Phone Mockup Component for screenshots
  const PhoneMockup = ({ screenshot, title }: { screenshot: string; title: string }) => (
    <div className="relative mx-auto w-[200px] sm:w-[220px]">
      {/* Phone Frame */}
      <div className="relative bg-foreground rounded-[2rem] p-2 shadow-2xl">
        {/* Side buttons */}
        <div className="absolute -left-1 top-20 w-1 h-8 bg-foreground rounded-l" />
        <div className="absolute -left-1 top-32 w-1 h-12 bg-foreground rounded-l" />
        <div className="absolute -right-1 top-24 w-1 h-10 bg-foreground rounded-r" />
        
        {/* Screen */}
        <div className="bg-background rounded-[1.75rem] overflow-hidden">
          {/* Status Bar */}
          <div className="bg-foreground px-4 py-1 flex justify-center items-center">
            <div className="w-16 h-4 bg-background/20 rounded-full" />
          </div>
          
          {/* Screenshot */}
          <img 
            src={screenshot} 
            alt={title}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );

  return (
    <WebLayout fullWidth className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-12 lg:py-0">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Hero Content - Text First */}
            <div className="text-center lg:text-left order-1">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Intelligent Moving</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-foreground mb-6 leading-tight">
                Moving Made
                <span className="block gradient-text">Intelligent</span>
              </h1>
            </div>
            
            {/* Hero Visual - Phone Mockup with App Interface - Second on Mobile */}
            <div className="relative order-2 lg:order-2">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl rounded-full scale-150 opacity-50" />
              
              {/* Phone Mockup */}
              <div className="relative mx-auto w-[280px]">
                {/* Phone Frame */}
                <div className="relative bg-foreground rounded-[3rem] p-3 shadow-2xl">
                  {/* Screen */}
                  <div className="bg-background rounded-[2.5rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="bg-muted px-6 py-2 flex justify-between items-center text-xs text-muted-foreground">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
                        <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
                        <div className="w-6 h-2 bg-accent rounded-sm" />
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-4 space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Welcome back</p>
                          <p className="font-semibold text-foreground">Priya's Move</p>
                        </div>
                        <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground font-bold">P</span>
                        </div>
                      </div>
                      
                      {/* Progress Card */}
                      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 text-primary-foreground">
                        <div className="flex items-center gap-2 mb-3">
                          <Truck className="w-5 h-5" />
                          <span className="text-sm font-medium">Move in Progress</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-2xl font-bold">78%</p>
                            <p className="text-xs opacity-80">Complete</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">ETA 2:30 PM</p>
                            <p className="text-xs opacity-80">On Schedule</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted rounded-xl p-3">
                          <Camera className="w-4 h-4 text-primary mb-1" />
                          <p className="text-lg font-bold text-foreground">24</p>
                          <p className="text-xs text-muted-foreground">Items Scanned</p>
                        </div>
                        <div className="bg-muted rounded-xl p-3">
                          <Shield className="w-4 h-4 text-accent mb-1" />
                          <p className="text-lg font-bold text-foreground">100%</p>
                          <p className="text-xs text-muted-foreground">Verified</p>
                        </div>
                      </div>
                      
                      {/* Live Tracking Preview */}
                      <div className="bg-muted rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-foreground">Live Location</span>
                          <span className="text-xs text-accent font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            Live
                          </span>
                        </div>
                        <div className="h-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center px-3">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <div className="flex-1 h-0.5 bg-gradient-to-r from-primary via-accent to-primary/30 mx-1" />
                            <Truck className="w-4 h-4 text-accent" />
                            <div className="flex-1 h-0.5 bg-muted mx-1" />
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-b-2xl" />
              </div>
              
              {/* Floating Tech Badges - Responsive positioning */}
              <div className="absolute -top-2 -left-4 lg:-top-6 lg:-left-12 bg-card border border-border rounded-xl lg:rounded-2xl px-2 py-1.5 lg:px-4 lg:py-3 shadow-card animate-float scale-75 lg:scale-100 origin-top-left">
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Camera className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs font-semibold text-foreground">Smart Scan</p>
                    <p className="text-[8px] lg:text-[10px] text-muted-foreground">Instant inventory</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-12 -right-4 lg:top-20 lg:-right-16 bg-card border border-border rounded-xl lg:rounded-2xl px-2 py-1.5 lg:px-4 lg:py-3 shadow-card animate-float scale-75 lg:scale-100 origin-top-right" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Users className="w-3 h-3 lg:w-4 lg:h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs font-semibold text-foreground">Crew GPS</p>
                    <p className="text-[8px] lg:text-[10px] text-muted-foreground">Real-time tracking</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-24 -left-4 lg:bottom-20 lg:-left-16 bg-card border border-border rounded-xl lg:rounded-2xl px-2 py-1.5 lg:px-4 lg:py-3 shadow-card animate-float scale-75 lg:scale-100 origin-bottom-left" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs font-semibold text-foreground">Digital Manifest</p>
                    <p className="text-[8px] lg:text-[10px] text-muted-foreground">Tamper-proof</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-2 -right-2 lg:-bottom-4 lg:-right-8 bg-gradient-to-r from-accent to-primary text-primary-foreground rounded-xl lg:rounded-2xl px-2 py-1.5 lg:px-4 lg:py-3 shadow-soft scale-75 lg:scale-100 origin-bottom-right">
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-xs lg:text-sm font-semibold">Zero Hassle</span>
                </div>
              </div>
            </div>
            
            {/* Rest of Hero Content - Third on Mobile */}
            <div className="text-center lg:text-left order-3 lg:col-span-1 lg:order-1 lg:row-start-1 lg:mt-0">
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 lg:hidden">
                Smart relocation that gives you peace of mind. No surveyors, no surprises. 
                Just seamless, transparent moving powered by intelligent technology.
              </p>
            </div>
            
            {/* Desktop only description - stays in left column */}
            <div className="hidden lg:block order-1 lg:col-span-1 lg:row-start-1" style={{ marginTop: '12rem' }}>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl">
                Smart relocation that gives you peace of mind. No surveyors, no surprises. 
                Just seamless, transparent moving powered by intelligent technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => toast.info('Coming Soon', { description: 'We\'re launching soon! Stay tuned.' })}
                  size="lg"
                  className="gradient-primary text-lg font-semibold px-8 py-6 shadow-soft"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="text-lg font-semibold px-8 py-6 hover:text-primary-foreground"
                  onClick={() => navigate('/login')}
                >
                  Watch Demo
                </Button>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>50,000+ happy movers</span>
                </div>
              </div>
            </div>
            
            {/* Mobile CTA buttons */}
            <div className="lg:hidden text-center order-4 w-full">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => toast.info('Coming Soon', { description: 'We\'re launching soon! Stay tuned.' })}
                  size="lg"
                  className="gradient-primary text-lg font-semibold px-8 py-6 shadow-soft"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="text-lg font-semibold px-8 py-6 hover:text-primary-foreground"
                  onClick={() => navigate('/login')}
                >
                  Watch Demo
                </Button>
              </div>
              
              <div className="mt-8 flex items-center gap-6 justify-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>50,000+ happy movers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-4">
              Why Choose Zeeroni?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of moving with intelligent technology that puts you in control.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-background rounded-2xl shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to your stress-free move.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Number */}
                <div className="text-5xl font-bold font-display text-primary/20 mb-4">
                  {step.number}
                </div>
                
                {/* Phone Mockup with Screenshot */}
                <div className="mb-6">
                  <PhoneMockup screenshot={step.screenshot} title={step.title} />
                </div>
                
                {/* Text */}
                <h3 className="font-semibold text-foreground text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 left-full w-full z-10">
                    <ArrowRight className="w-6 h-6 text-primary/30 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Limited Time Offer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-4">
              Introductory Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flat rates with no hidden fees. Book now and lock in these special launch prices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* 1BHK */}
            <div className="relative p-8 bg-background rounded-2xl shadow-card border border-border hover:shadow-soft transition-all duration-300">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">1 BHK</h3>
                <p className="text-sm text-muted-foreground mb-6">Perfect for studio apartments</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">₹4,999</span>
                  <span className="text-muted-foreground ml-2 line-through">₹7,999</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Up to 50 items</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Same city move</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Real-time tracking</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Digital manifest</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => toast.info('Coming Soon', { description: "We're launching soon! Stay tuned." })}
                  className="w-full gradient-primary font-semibold"
                >
                  Book Now
                </Button>
              </div>
            </div>
            
            {/* 2BHK - Popular */}
            <div className="relative p-8 bg-background rounded-2xl shadow-soft border-2 border-primary scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">2 BHK</h3>
                <p className="text-sm text-muted-foreground mb-6">Ideal for small families</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">₹7,999</span>
                  <span className="text-muted-foreground ml-2 line-through">₹12,999</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Up to 100 items</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Same city move</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Priority scheduling</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Packing materials included</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Insurance coverage</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => toast.info('Coming Soon', { description: "We're launching soon! Stay tuned." })}
                  className="w-full gradient-primary font-semibold"
                >
                  Book Now
                </Button>
              </div>
            </div>
            
            {/* 3BHK */}
            <div className="relative p-8 bg-background rounded-2xl shadow-card border border-border hover:shadow-soft transition-all duration-300">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">3 BHK</h3>
                <p className="text-sm text-muted-foreground mb-6">Best for larger homes</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">₹11,999</span>
                  <span className="text-muted-foreground ml-2 line-through">₹18,999</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Up to 200 items</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Same city move</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Dedicated move manager</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Full packing service</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Premium insurance</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => toast.info('Coming Soon', { description: "We're launching soon! Stay tuned." })}
                  className="w-full gradient-primary font-semibold"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-4">
              Loved by Thousands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about their Zeeroni experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="p-6 bg-background rounded-2xl shadow-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-4">
              Ready to Move Smarter?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get your instant quote in under 2 minutes. No obligations, no hidden fees.
            </p>
            <Button 
              onClick={() => toast.info('Coming Soon', { description: "We're launching soon! Stay tuned." })}
              size="lg"
              className="gradient-primary text-lg font-semibold px-10 py-6 shadow-soft"
            >
              Start Your Free Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={zeeroniLogo} alt="Zeeroni" className="h-8" />
              <span className="font-display font-bold text-lg text-foreground">Zeeroni</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Zeeroni. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </WebLayout>
  );
};

export default Landing;
