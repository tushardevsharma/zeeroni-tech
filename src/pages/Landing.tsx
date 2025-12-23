import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhoneFrame from '@/components/PhoneFrame';
import zeeroniLogo from '@/assets/zeeroni-logo.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col pt-14 pb-10 px-7">
          {/* Hero Section */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-10">
              <img src={zeeroniLogo} alt="Zeeroni" className="h-14 mb-4" />
              <p className="text-primary font-semibold text-lg mb-6">Zeeroni</p>
              <h1 className="text-4xl font-bold font-display text-foreground mb-5 leading-tight">
                Moving Made
                <span className="block text-primary">Intelligent</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Smart relocation that gives you peace of mind. No surveyors, no surprises.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 p-5 bg-secondary rounded-xl shadow-card">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base">Smart Inventory Scan</h3>
                  <p className="text-sm text-muted-foreground mt-1">Point your camera, get instant quotes</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-secondary rounded-xl shadow-card">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base">100% Transparent</h3>
                  <p className="text-sm text-muted-foreground mt-1">Track every item, every mile</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity"
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
