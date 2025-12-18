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
        <div className="h-full flex flex-col">
          {/* Camera View (Simulated) - Takes upper portion */}
          <div className="flex-1 relative rounded-t-[2.5rem] overflow-hidden min-h-[320px]">
            {/* Camera background - simulated view */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
              {/* Simulated room elements */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-6 w-32 h-20 bg-slate-600 rounded-lg" />
                <div className="absolute top-16 right-6 w-16 h-28 bg-slate-500 rounded" />
                <div className="absolute top-44 left-16 w-14 h-16 bg-slate-600 rounded" />
                <div className="absolute bottom-8 right-12 w-10 h-14 bg-slate-500 rounded" />
              </div>
              
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full" style={{
                  backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }} />
              </div>
            </div>
            
            {/* Scan Line */}
            {scanning && (
              <div className="absolute inset-x-6 top-1/3 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-scan shadow-glow" />
            )}
            
            {/* Camera Frame Corners */}
            <div className="absolute inset-6 border-2 border-primary/40 rounded-2xl">
              <div className="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-[3px] border-l-[3px] border-primary rounded-tl-xl" />
              <div className="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-[3px] border-r-[3px] border-primary rounded-tr-xl" />
              <div className="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-[3px] border-l-[3px] border-primary rounded-bl-xl" />
              <div className="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-[3px] border-r-[3px] border-primary rounded-br-xl" />
            </div>

            {/* Detection Boxes */}
            {detectedItems.length > 0 && (
              <div className="absolute top-24 left-8 w-28 h-16 border-2 border-accent rounded-lg animate-pulse bg-accent/10">
                <span className="absolute -top-3 left-2 bg-accent text-accent-foreground text-[10px] px-2 py-1 rounded font-semibold shadow-md whitespace-nowrap">
                  {detectedItems[0]}
                </span>
              </div>
            )}
            {detectedItems.length > 1 && (
              <div className="absolute top-20 right-8 w-16 h-24 border-2 border-primary rounded-lg animate-pulse bg-primary/10">
                <span className="absolute -top-3 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-semibold shadow-md whitespace-nowrap">
                  {detectedItems[1]}
                </span>
              </div>
            )}
            {detectedItems.length > 2 && (
              <div className="absolute top-48 left-14 w-16 h-14 border-2 border-accent rounded-lg animate-pulse bg-accent/10">
                <span className="absolute -top-3 left-1 bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5 rounded font-semibold shadow-md whitespace-nowrap">
                  {detectedItems[2]}
                </span>
              </div>
            )}

            {/* Header overlay */}
            <div className="absolute top-0 inset-x-0 pt-14 px-6 flex items-center justify-between">
              <button 
                onClick={() => navigate('/address')}
                className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-lg">
                <Camera className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {scanning ? 'Scanning...' : 'Scan Complete'}
                </span>
              </div>
              <div className="w-10" />
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="bg-card rounded-t-3xl p-6 shadow-card border-t border-border -mt-6 relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="font-semibold text-foreground text-lg">AI Detection</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Volume</p>
                <p className="font-bold text-primary text-xl">{totalVolume} ft³</p>
              </div>
            </div>

            <div className="space-y-3 max-h-32 overflow-y-auto mb-5">
              {allItems.map((item, i) => {
                const detected = detectedItems.includes(item.name);
                return (
                  <div 
                    key={i}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                      detected ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50 opacity-50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${detected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`flex-1 font-medium text-sm ${detected ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.name}
                    </span>
                    <span className="text-sm text-muted-foreground">{item.volume}</span>
                    {detected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
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
      </PhoneFrame>
    </div>
  );
};

export default AIScan;
