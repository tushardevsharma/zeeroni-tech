import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, ArrowRight, Truck, MapPin, Camera, CheckCircle2, Star, FileCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WebLayout from '@/components/layout/WebLayout';
import zeeroniLogo from '@/assets/zeeroni-logo.png';
import { toast } from 'sonner';

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
    { number: '01', title: 'Enter Addresses', description: 'Tell us where you\'re moving from and to', screenshot: '/screenshots/address.png' },
    { number: '02', title: 'Scan Your Items', description: 'Use intelligent tech to catalog your inventory', screenshot: '/screenshots/scan.png' },
    { number: '03', title: 'Get Instant Quote', description: 'Receive transparent, competitive pricing', screenshot: '/screenshots/quote.png' },
    { number: '04', title: 'Schedule & Track', description: 'Book your move and track in real-time', screenshot: '/screenshots/tracking.png' },
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

  return (
    <WebLayout fullWidth className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Intelligent Moving</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-foreground mb-6 leading-tight">
                Moving Made
                <span className="block gradient-text">Intelligent</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Smart relocation that gives you peace of mind. No surveyors, no surprises. 
                Just seamless, transparent moving powered by intelligent technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
              
              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
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
            
            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative bg-card rounded-3xl shadow-card p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center">
                    <Truck className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Your Move</h3>
                    <p className="text-sm text-muted-foreground">Dec 24, 2024</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-medium text-foreground">Indiranagar, Bangalore</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">To</p>
                      <p className="font-medium text-foreground">HSR Layout, Bangalore</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Quote</p>
                      <p className="text-2xl font-bold gradient-text">₹24,500</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="text-2xl font-bold text-foreground">24</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-soft animate-float">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span className="font-semibold text-sm text-primary-foreground">Smart Scanning...</span>
                </div>
              </div>
              
              <div className="absolute top-1/3 -right-8 bg-accent text-accent-foreground rounded-2xl px-4 py-3 shadow-soft animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold text-sm">Crew Tracking</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-card rounded-2xl px-4 py-3 shadow-card">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Digital Manifest</span>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 -left-8 bg-card rounded-2xl px-4 py-3 shadow-card animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Immutable Record</span>
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
              <div key={index} className="relative">
                <div className="text-6xl font-bold font-display text-primary/10 mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-foreground text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                
                {/* App Screenshot Placeholder */}
                <div className="bg-muted rounded-xl aspect-[9/16] max-w-[180px] mx-auto overflow-hidden shadow-card">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-primary/5 to-primary/10">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 mx-auto mb-2 gradient-primary rounded-xl flex items-center justify-center">
                        {index === 0 && <MapPin className="w-6 h-6 text-primary-foreground" />}
                        {index === 1 && <Camera className="w-6 h-6 text-primary-foreground" />}
                        {index === 2 && <CheckCircle2 className="w-6 h-6 text-primary-foreground" />}
                        {index === 3 && <Truck className="w-6 h-6 text-primary-foreground" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{step.title}</p>
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-primary/30 mx-auto" />
                  </div>
                )}
              </div>
            ))}
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
      <section id="pricing" className="py-20 lg:py-32 relative overflow-hidden">
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
              onClick={() => navigate('/login')}
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
