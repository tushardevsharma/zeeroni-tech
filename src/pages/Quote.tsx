import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp, Fuel, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WebLayout from '@/components/layout/WebLayout';

const Quote = () => {
  const navigate = useNavigate();
  const [calculating, setCalculating] = useState(true);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCalculating(false);
      setPrice(24500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const priceFactors = [
    { label: 'Volume (170 ft³)', value: '₹18,000', icon: Sparkles },
    { label: 'Distance (15 km)', value: '₹2,500', icon: TrendingUp },
    { label: 'Fuel Adjustment', value: '₹1,500', icon: Fuel },
    { label: 'Weekend Premium', value: '₹2,500', icon: Calendar },
  ];

  const included = [
    'Packing materials',
    'Professional movers (4)',
    'Transit insurance',
    'Hydraulic lift for piano',
    'Special wine crating',
    'Unpacking assistance',
  ];

  const content = (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/inventory')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
          Your Quote
        </h1>
        <p className="text-lg text-muted-foreground">
          Intelligent pricing based on your inventory and requirements
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Price Display */}
        <div>
          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-card text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 gradient-primary opacity-10 rounded-full blur-3xl" />
            
            {calculating ? (
              <div className="py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-primary-foreground" />
                </div>
                <p className="text-xl text-muted-foreground">Calculating best price...</p>
              </div>
            ) : (
              <>
                <p className="text-lg text-muted-foreground mb-4">Total Estimate</p>
                <p className="text-3xl text-muted-foreground line-through mb-2">
                  ₹{(price * 2).toLocaleString()}
                </p>
                <p className="text-6xl md:text-7xl font-bold font-display gradient-text mb-4">
                  ₹{price.toLocaleString()}
                </p>
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">50% introductory discount applied</span>
                </div>
              </>
            )}
          </div>

          {/* Price Breakdown */}
          {!calculating && (
            <div className="bg-card rounded-2xl p-6 shadow-card mt-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Dynamic Pricing Factors
              </h3>
              <div className="space-y-4">
                {priceFactors.map((factor, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <factor.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">{factor.label}</span>
                    </div>
                    <span className="font-semibold text-foreground">{factor.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* What's Included */}
        <div>
          {!calculating && (
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card h-full">
              <h3 className="font-semibold text-foreground text-xl mb-6">What's Included</h3>
              <div className="space-y-4">
                {included.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Premium Service Guarantee</p>
                <p className="text-foreground font-medium">
                  Your belongings are covered up to ₹10,00,000 in transit insurance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8">
        <Button 
          onClick={() => navigate('/schedule')}
          disabled={calculating}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {calculating ? 'Please wait...' : 'Book This Move'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <WebLayout showSteps currentStep={3} className="py-8 md:py-12">
      {content}
    </WebLayout>
  );
};

export default Quote;
