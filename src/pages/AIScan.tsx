import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Camera, Sparkles, Box, Sofa, Tv, MonitorSpeaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhoneFrame from '@/components/PhoneFrame';

const AIScan = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);

  const allItems = [
    { name: '3-Seater Sofa', icon: Sofa, volume: '45 ft³' },
    { name: 'LED TV 55"', icon: Tv, volume: '8 ft³' },
    { name: 'Bookshelf', icon: Box, volume: '25 ft³' },
    { name: 'Sound System', icon: MonitorSpeaker, volume: '5 ft³' },
  ];

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setDetectedItems(prev => {
          if (prev.length < allItems.length) {
            return [...prev, allItems[prev.length].name];
          }
          setScanning(false);
          return prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  const totalVolume = detectedItems.reduce((acc, item) => {
    const found = allItems.find(i => i.name === item);
    return acc + (found ? parseInt(found.volume) : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col relative">
          {/* Camera View (Simulated) */}
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/90 to-foreground/95 rounded-[2.5rem]">
            {/* Scan Line */}
            {scanning && (
              <div className="absolute inset-x-8 top-1/4 h-1 gradient-accent rounded-full animate-scan opacity-80" />
            )}
            
            {/* Camera Grid */}
            <div className="absolute inset-8 border-2 border-primary/30 rounded-2xl">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
            </div>

            {/* Detection Boxes */}
            {detectedItems.length > 0 && (
              <div className="absolute top-32 left-12 w-32 h-24 border-2 border-accent rounded-lg animate-pulse">
                <span className="absolute -top-3 left-2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded font-medium">
                  {detectedItems[0]}
                </span>
              </div>
            )}
            {detectedItems.length > 1 && (
              <div className="absolute top-48 right-10 w-24 h-32 border-2 border-primary rounded-lg animate-pulse">
                <span className="absolute -top-3 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded font-medium">
                  {detectedItems[1]}
                </span>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="relative z-10 pt-14 px-6 flex items-center justify-between">
            <button 
              onClick={() => navigate('/address')}
              className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center"
            >
              <X className="w-5 h-5 text-background" />
            </button>
            <div className="flex items-center gap-2 bg-background/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Camera className="w-4 h-4 text-background" />
              <span className="text-sm font-medium text-background">
                {scanning ? 'Scanning...' : 'Scan Complete'}
              </span>
            </div>
            <div className="w-10" />
          </div>

          {/* Bottom Panel */}
          <div className="relative z-10 mt-auto">
            <div className="bg-card rounded-t-3xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">AI Detection</h2>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Volume</p>
                  <p className="font-bold text-primary">{totalVolume} ft³</p>
                </div>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                {allItems.map((item, i) => {
                  const detected = detectedItems.includes(item.name);
                  return (
                    <div 
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        detected ? 'bg-primary/10' : 'bg-muted opacity-50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${detected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`flex-1 font-medium ${detected ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.name}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.volume}</span>
                      {detected && (
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      )}
                    </div>
                  );
                })}
              </div>

              <Button 
                onClick={() => navigate('/inventory')}
                disabled={scanning}
                className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {scanning ? 'Detecting Items...' : 'Review Inventory'}
              </Button>
            </div>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default AIScan;
