import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp, Fuel, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhoneFrame from '@/components/PhoneFrame';

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
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col pt-12 pb-8 px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/inventory')}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold font-display text-foreground">Your Quote</h1>
              <p className="text-sm text-muted-foreground">AI-calculated pricing</p>
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-10 rounded-full blur-3xl" />
            {calculating ? (
              <div className="py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-muted-foreground">Calculating best price...</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-2">Total Estimate</p>
                <p className="text-5xl font-bold font-display gradient-text mb-2">
                  ₹{price.toLocaleString()}
                </p>
                <p className="text-sm text-accent font-medium">
                  ✓ 15% lower than market average
                </p>
              </>
            )}
          </div>

          {/* Price Breakdown */}
          {!calculating && (
            <>
              <div className="bg-card rounded-xl p-4 shadow-card mb-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Dynamic Pricing Factors
                </h3>
                <div className="space-y-3">
                  {priceFactors.map((factor, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <factor.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{factor.label}</span>
                      </div>
                      <span className="font-medium text-foreground">{factor.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-card rounded-xl p-4 shadow-card">
                <h3 className="font-semibold text-foreground mb-3">What's Included</h3>
                <div className="space-y-2">
                  {included.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button 
            onClick={() => navigate('/schedule')}
            disabled={calculating}
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
          >
            {calculating ? 'Please wait...' : 'Book This Move'}
          </Button>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default Quote;
