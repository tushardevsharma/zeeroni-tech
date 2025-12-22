import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PhoneFrame from '@/components/PhoneFrame';

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col pt-12 pb-8 px-6">
          {/* Header */}
          <button 
            onClick={() => navigate('/login')}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center mb-6 shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <h1 className="text-2xl font-bold font-display text-foreground mb-2">
            Where are you moving?
          </h1>
          <p className="text-muted-foreground mb-6">
            Smart auto-fill for building details
          </p>

          <div className="flex-1 space-y-4">
            {/* Origin */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
              <Input
                placeholder="From: Origin address"
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  setShowPredictions(e.target.value.length > 2);
                }}
                className="h-14 pl-10 pr-4 text-base bg-card border-border"
              />
            </div>

            {/* Destination */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent" />
              <Input
                placeholder="To: Destination address"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-14 pl-10 pr-4 text-base bg-card border-border"
              />
            </div>

            {/* AI Predictions */}
            {showPredictions && (
              <div className="bg-card rounded-xl shadow-card overflow-hidden">
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
                    className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                  >
                    <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{pred.address}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        <span>{pred.floor}</span>
                        <span>•</span>
                        <span>Lift: {pred.elevator}</span>
                        <span>•</span>
                        <span>Parking: {pred.parking}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}

            {/* Selected Address Details */}
            {origin && !showPredictions && (
              <div className="bg-card rounded-xl p-4 shadow-card">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Detected building info
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Floor</p>
                    <p className="font-semibold text-foreground">3rd</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Elevator</p>
                    <p className="font-semibold text-accent">Yes</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Parking</p>
                    <p className="font-semibold text-foreground">Street</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button 
            onClick={() => navigate('/scan')}
            disabled={!origin || !destination}
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50 mt-6"
          >
            Continue to Smart Scan
          </Button>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default AddressInput;
