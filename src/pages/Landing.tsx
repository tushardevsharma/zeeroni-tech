import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhoneFrame from '@/components/PhoneFrame';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col pt-12 pb-8 px-6">
          {/* Hero Section */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                <Package className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold font-display text-foreground mb-4 leading-tight">
                Moving Made
                <span className="gradient-text block">Intelligent</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                AI-powered relocation that gives you peace of mind. No surveyors, no surprises.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card">
                <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Inventory Scan</h3>
                  <p className="text-sm text-muted-foreground">Point your camera, get instant quotes</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">100% Transparent</h3>
                  <p className="text-sm text-muted-foreground">Track every item, every mile</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Trusted by 50,000+ happy movers
            </p>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default Landing;
