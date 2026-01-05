import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, Sparkles, Wifi, Wrench, Shield, ArrowRight, Home, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WebLayout from '@/components/layout/WebLayout';

const Complete = () => {
  const navigate = useNavigate();

  const services = [
    { 
      icon: Wifi, 
      title: 'Internet Providers', 
      desc: 'Top 3 ISPs in your area',
      action: 'Compare Plans'
    },
    { 
      icon: Wrench, 
      title: 'TV Mounting', 
      desc: 'Professional installation',
      action: 'Book Now'
    },
    { 
      icon: Shield, 
      title: 'Home Insurance', 
      desc: 'Protect your new home',
      action: 'Get Quote'
    },
  ];

  return (
    <WebLayout className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 gradient-accent rounded-full flex items-center justify-center shadow-glow animate-pulse-slow">
            <CheckCircle2 className="w-12 h-12 text-accent-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">
            Move Complete! 🎉
          </h1>
          <p className="text-xl text-muted-foreground">
            All 24 items delivered safely to your new home
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Summary Card */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h3 className="font-semibold text-foreground text-xl mb-6">Move Summary</h3>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-3xl font-bold text-foreground">₹22,000</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">You Saved</p>
                <p className="text-3xl font-bold text-accent">₹2,500</p>
              </div>
            </div>
            
            <div className="h-px bg-border my-6" />
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice Number</span>
                <span className="font-medium text-foreground">#MOV-2024-7832</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Move Date</span>
                <span className="font-medium text-foreground">December 24, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items Moved</span>
                <span className="font-medium text-foreground">24 items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distance</span>
                <span className="font-medium text-foreground">15 km</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Rating Card */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h3 className="font-semibold text-foreground text-xl mb-6">Rate Your Experience</h3>
            
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  className="p-2 hover:scale-110 transition-transform"
                >
                  <Star className="w-10 h-10 text-accent fill-accent" />
                </button>
              ))}
            </div>
            
            <p className="text-center text-muted-foreground mb-6">
              Tap a star to rate • Your feedback helps us improve
            </p>
            
            <textarea 
              placeholder="Tell us about your experience (optional)..."
              className="w-full p-4 bg-muted rounded-xl border-0 resize-none h-24 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            />
            
            <Button className="w-full mt-4 gradient-primary">
              Submit Review
            </Button>
          </div>
        </div>

        {/* Smart Concierge */}
        <div className="bg-card rounded-2xl p-8 shadow-card mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-foreground text-xl">Smart Concierge</h3>
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              New in Indiranagar
            </span>
          </div>
          
          <p className="text-muted-foreground mb-6">
            We've curated some services that might help you settle into your new home.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            {services.map((service, i) => (
              <button 
                key={i}
                className="flex items-center gap-4 p-5 bg-muted rounded-xl hover:bg-muted/80 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{service.title}</p>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          size="lg"
          className="w-full h-14 text-lg font-semibold"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
      </div>
    </WebLayout>
  );
};

export default Complete;
