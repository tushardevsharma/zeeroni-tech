import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WebLayout from '@/components/layout/WebLayout';

const AddressInput = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showPredictions, setShowPredictions] = useState(false);

  const predictions = [
    { address: 'Indiranagar, Bangalore', floor: '3rd Floor', elevator: 'Yes', parking: 'Street' },
    { address: 'Koramangala 4th Block', floor: '2nd Floor', elevator: 'No', parking: 'Basement' },
    { address: 'HSR Layout Sector 2', floor: 'Ground', elevator: 'N/A', parking: 'Driveway' },
  ];

  const content = (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
          Where are you moving?
        </h1>
        <p className="text-lg text-muted-foreground">
          Enter your addresses and we'll auto-fill building details with AI.
        </p>
      </div>

      {/* Address Form */}
      <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 mb-6">
        <div className="space-y-6">
          {/* Origin Address */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Moving From
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
              <Input
                placeholder="Enter origin address"
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  setShowPredictions(e.target.value.length > 2);
                }}
                className="h-14 pl-10 pr-4 text-lg bg-background border-border"
              />
            </div>
          </div>

          {/* AI Predictions Dropdown */}
          {showPredictions && (
            <div className="bg-background rounded-xl border border-border overflow-hidden -mt-2">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-primary/5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Smart Predictions</span>
              </div>
              {predictions.map((pred, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setOrigin(pred.address);
                    setShowPredictions(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                >
                  <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{pred.address}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>{pred.floor}</span>
                      <span>•</span>
                      <span>Lift: {pred.elevator}</span>
                      <span>•</span>
                      <span>Parking: {pred.parking}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}

          {/* Destination Address */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Moving To
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent" />
              <Input
                placeholder="Enter destination address"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-14 pl-10 pr-4 text-lg bg-background border-border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detected Building Info */}
      {origin && !showPredictions && (
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Detected Building Information
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Floor</p>
              <p className="text-xl font-bold text-foreground">3rd</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Elevator</p>
              <p className="text-xl font-bold text-accent">Yes</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Parking</p>
              <p className="text-xl font-bold text-foreground">Street</p>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <Button 
        onClick={() => navigate('/scan')}
        disabled={!origin || !destination}
        size="lg"
        className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        Continue to Smart Scan
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );

  return (
    <WebLayout showSteps currentStep={0} className="py-8 md:py-12">
      {content}
    </WebLayout>
  );
};

export default AddressInput;
