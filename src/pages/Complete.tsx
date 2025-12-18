import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, Sparkles, Wifi, Wrench, Shield, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhoneFrame from '@/components/PhoneFrame';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col pt-12 pb-8 px-6">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 gradient-accent rounded-full flex items-center justify-center shadow-glow animate-pulse-slow">
              <CheckCircle2 className="w-12 h-12 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display text-foreground mb-2">
              Move Complete! 🎉
            </h1>
            <p className="text-muted-foreground">
              All 24 items delivered safely
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-card rounded-2xl p-5 shadow-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-foreground">₹22,000</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">You Saved</p>
                <p className="text-2xl font-bold text-accent">₹2,500</p>
              </div>
            </div>
            <div className="h-px bg-border my-4" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Invoice #MOV-2024-7832</span>
              <button className="text-primary font-medium">Download</button>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-card rounded-xl p-4 shadow-card mb-6">
            <h3 className="font-semibold text-foreground mb-3">Rate your experience</h3>
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="p-1">
                  <Star className="w-8 h-8 text-accent fill-accent" />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Tap to rate • Your feedback helps us improve
            </p>
          </div>

          {/* AI Concierge */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">AI Concierge</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                New in Indiranagar
              </span>
            </div>
            <div className="space-y-2">
              {services.map((service, i) => (
                <button 
                  key={i}
                  className="w-full flex items-center gap-3 p-3 bg-card rounded-xl shadow-card hover:bg-muted/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{service.title}</p>
                    <p className="text-xs text-muted-foreground">{service.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full h-14 text-lg font-semibold mt-4"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default Complete;
