import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Sparkles, Box, Sofa, Tv, MonitorSpeaker, Upload, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WebLayout from '@/components/layout/WebLayout';

const AIScan = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
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

  const startDemo = () => {
    setScanning(true);
    setDetectedItems([]);
  };

  const content = (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/address')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
          AI Inventory Scan
        </h1>
        <p className="text-lg text-muted-foreground">
          Point your camera at each room or upload photos. Our AI will detect and catalog your items.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Camera/Upload Section */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {/* Simulated Camera View */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            {/* Simulated room elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-16 left-8 w-40 h-24 bg-slate-600 rounded-lg" />
              <div className="absolute top-12 right-8 w-20 h-32 bg-slate-500 rounded" />
              <div className="absolute top-40 left-20 w-16 h-20 bg-slate-600 rounded" />
              <div className="absolute bottom-12 right-16 w-12 h-16 bg-slate-500 rounded" />
            </div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full" style={{
                backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }} />
            </div>

            {/* Scan Line */}
            {scanning && (
              <div className="absolute inset-x-8 top-1/3 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-scan shadow-glow" />
            )}

            {/* Detection Boxes */}
            {detectedItems.length > 0 && (
              <div className="absolute top-20 left-12 w-36 h-20 border-2 border-accent rounded-lg animate-pulse bg-accent/10">
                <span className="absolute -top-4 left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded font-semibold shadow-md whitespace-nowrap">
                  {detectedItems[0]}
                </span>
              </div>
            )}
            {detectedItems.length > 1 && (
              <div className="absolute top-16 right-12 w-20 h-28 border-2 border-primary rounded-lg animate-pulse bg-primary/10">
                <span className="absolute -top-4 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-semibold shadow-md whitespace-nowrap">
                  {detectedItems[1]}
                </span>
              </div>
            )}
            {detectedItems.length > 2 && (
              <div className="absolute top-44 left-16 w-20 h-16 border-2 border-accent rounded-lg animate-pulse bg-accent/10">
                <span className="absolute -top-4 left-1 bg-accent text-accent-foreground text-xs px-2 py-1 rounded font-semibold shadow-md whitespace-nowrap">
                  {detectedItems[2]}
                </span>
              </div>
            )}

            {/* Camera Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {scanning ? 'Scanning...' : detectedItems.length > 0 ? 'Scan Complete' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-12"
                onClick={startDemo}
                disabled={scanning}
              >
                <Play className="w-5 h-5 mr-2" />
                {scanning ? 'Scanning...' : 'Start Demo'}
              </Button>
              <Button variant="outline" className="h-12">
                <Upload className="w-5 h-5 mr-2" />
                Upload Photos
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Tip: Scan each room for best results
            </p>
          </div>
        </div>

        {/* Detection Results */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-card rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Smart Detection</h3>
                  <p className="text-sm text-muted-foreground">{detectedItems.length} items found</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-primary">{totalVolume} ft³</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {allItems.map((item, i) => {
                const detected = detectedItems.includes(item.name);
                return (
                  <div 
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      detected ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50 opacity-50'
                    }`}
                  >
                    <item.icon className={`w-6 h-6 ${detected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`flex-1 font-medium ${detected ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.name}
                    </span>
                    <span className="text-muted-foreground">{item.volume}</span>
                    {detected && (
                      <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={() => navigate('/inventory')}
            disabled={scanning || detectedItems.length === 0}
            size="lg"
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {scanning ? 'Detecting Items...' : 'Review Full Inventory'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <WebLayout showSteps currentStep={1} className="py-8 md:py-12">
      {content}
    </WebLayout>
  );
};

export default AIScan;
