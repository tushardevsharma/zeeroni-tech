import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertTriangle, ChevronRight, Check, Sofa, Tv, Box, Piano, Wine, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WebLayout from '@/components/layout/WebLayout';

const Inventory = () => {
  const navigate = useNavigate();
  const [showQuestion, setShowQuestion] = useState(true);
  const [pianoAnswer, setPianoAnswer] = useState<string | null>(null);

  const items = [
    { name: '3-Seater Sofa', icon: Sofa, volume: '45 ft³', category: 'Living Room', fragile: false },
    { name: 'LED TV 55"', icon: Tv, volume: '8 ft³', category: 'Living Room', fragile: true },
    { name: 'Bookshelf (Oak)', icon: Box, volume: '25 ft³', category: 'Living Room', fragile: false },
    { name: 'Grand Piano', icon: Piano, volume: '80 ft³', category: 'Living Room', fragile: true, special: true },
    { name: 'Wine Collection', icon: Wine, volume: '12 ft³', category: 'Dining', fragile: true, highValue: true },
  ];

  const totalVolume = items.reduce((acc, item) => acc + parseInt(item.volume), 0);
  const fragileCount = items.filter(i => i.fragile).length;
  const specialCount = items.filter(i => i.special || i.highValue).length;

  return (
    <WebLayout showSteps currentStep={2} className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/scan')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
                Your Inventory
              </h1>
              <p className="text-lg text-muted-foreground">
                {items.length} items detected • Review and confirm your inventory
              </p>
            </div>
          </div>
        </div>

        {/* Smart Question Alert */}
        {showQuestion && !pianoAnswer && (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  Quick Question from AI
                </h3>
                <p className="text-muted-foreground mb-4">
                  I detected a Grand Piano in your inventory. Is it located on the ground floor?
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => setPianoAnswer('ground')}
                    className="flex-1 sm:flex-none"
                  >
                    Yes, Ground Floor
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setPianoAnswer('upper')}
                    className="flex-1 sm:flex-none"
                  >
                    No, Upper Floor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {pianoAnswer === 'upper' && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">
                Hydraulic Lift Required
              </h3>
              <p className="text-muted-foreground">
                Special equipment will be arranged for safe piano transport. This is included in your quote.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <p className="text-sm text-muted-foreground mb-1">Total Volume</p>
              <p className="text-3xl font-bold text-primary">{totalVolume} ft³</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <p className="text-sm text-muted-foreground mb-1">Fragile Items</p>
              <p className="text-3xl font-bold text-destructive">{fragileCount}</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <p className="text-sm text-muted-foreground mb-1">Special Handling</p>
              <p className="text-3xl font-bold text-accent">{specialCount}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="font-semibold text-foreground text-lg mb-4">All Items</h3>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-4 p-4 bg-background rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      item.special ? 'gradient-primary' : item.highValue ? 'gradient-accent' : 'bg-muted'
                    }`}>
                      <item.icon className={`w-6 h-6 ${
                        item.special || item.highValue ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">{item.name}</p>
                        {item.fragile && (
                          <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded font-medium">
                            FRAGILE
                          </span>
                        )}
                        {item.highValue && (
                          <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded font-medium">
                            HIGH VALUE
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.category} • {item.volume}</p>
                    </div>
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <Button 
            onClick={() => navigate('/quote')}
            size="lg"
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity"
          >
            Get Instant Quote
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </WebLayout>
  );
};

export default Inventory;
