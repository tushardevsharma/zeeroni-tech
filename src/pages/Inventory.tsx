import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertTriangle, ChevronRight, Check, Sofa, Tv, Box, Piano, Wine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhoneFrame from '@/components/PhoneFrame';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col pt-14 pb-10 px-7">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => navigate('/scan')}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold font-display text-foreground">Your Inventory</h1>
              <p className="text-sm text-muted-foreground mt-1">{items.length} items detected</p>
            </div>
          </div>

          {/* Smart Question */}
          {showQuestion && !pianoAnswer && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-4">
                    I detected a Grand Piano. Is it on the ground floor?
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setPianoAnswer('ground')}
                      className="flex-1"
                    >
                      Yes, Ground Floor
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => setPianoAnswer('upper')}
                      className="flex-1"
                    >
                      No, Upper Floor
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {pianoAnswer === 'upper' && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm">Hydraulic lift required</p>
                <p className="text-xs text-muted-foreground mt-1">Special equipment will be arranged</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl p-4 text-center shadow-card">
              <p className="text-2xl font-bold text-primary">{totalVolume}</p>
              <p className="text-xs text-muted-foreground mt-1">Total ft³</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center shadow-card">
              <p className="text-2xl font-bold text-destructive">{fragileCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Fragile</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center shadow-card">
              <p className="text-2xl font-bold text-accent">{specialCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Special</p>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {items.map((item, i) => (
              <div 
                key={i}
                className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  item.special ? 'gradient-primary' : item.highValue ? 'gradient-accent' : 'bg-muted'
                }`}>
                  <item.icon className={`w-5 h-5 ${
                    item.special || item.highValue ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground">{item.name}</p>
                    {item.fragile && (
                      <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-medium">
                        FRAGILE
                      </span>
                    )}
                    {item.highValue && (
                      <span className="text-[10px] bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded font-medium">
                        HIGH VALUE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.category} • {item.volume}</p>
                </div>
                <Check className="w-5 h-5 text-accent" />
              </div>
            ))}
          </div>

          <Button 
            onClick={() => navigate('/quote')}
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity mt-6"
          >
            Get Instant Quote
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default Inventory;
