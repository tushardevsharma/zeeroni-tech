import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Camera, AlertTriangle, Shield, QrCode, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WebLayout from '@/components/layout/WebLayout';

const Verification = () => {
  const navigate = useNavigate();
  const [verifiedCount, setVerifiedCount] = useState(0);

  const items = [
    { name: '3-Seater Sofa', room: 'Living Room', status: 'delivered', verified: verifiedCount > 0 },
    { name: 'LED TV 55"', room: 'Living Room', status: 'delivered', verified: verifiedCount > 1 },
    { name: 'Bookshelf (Oak)', room: 'Study', status: 'delivered', verified: verifiedCount > 2 },
    { name: 'Grand Piano', room: 'Living Room', status: 'delivered', verified: verifiedCount > 3 },
    { name: 'Wine Collection', room: 'Dining', status: 'delivered', verified: verifiedCount > 4 },
    { name: 'Dining Table Set', room: 'Dining', status: 'pending', verified: false },
  ];

  const handleVerify = () => {
    if (verifiedCount < 5) {
      setVerifiedCount(prev => prev + 1);
    }
  };

  const deliveredCount = items.filter(i => i.status === 'delivered').length;
  const verifiedItems = items.filter(i => i.verified).length;

  return (
    <WebLayout className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <button 
              onClick={() => navigate('/tracking')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              Digital Manifest
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Verify each item as it's delivered
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center shadow-soft">
            <Shield className="w-7 h-7 text-accent-foreground" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress & Blockchain */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Verification Progress</p>
                  <p className="text-3xl font-bold text-foreground">
                    {verifiedItems}/{deliveredCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={`font-semibold ${verifiedItems === deliveredCount ? 'text-accent' : 'text-primary'}`}>
                    {verifiedItems === deliveredCount ? 'Complete!' : 'In Progress'}
                  </p>
                </div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-accent rounded-full transition-all duration-500"
                  style={{ width: `${(verifiedItems / deliveredCount) * 100}%` }}
                />
              </div>
            </div>

            {/* Blockchain Badge */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <QrCode className="w-10 h-10 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Immutable Record</p>
                  <p className="text-sm text-muted-foreground">Blockchain verified</p>
                </div>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <p className="text-sm font-mono text-foreground break-all">
                  0x7f4e8b2c...3c21a9f5
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Block #4,521,889 • Immutable & Tamper-proof
              </p>
            </div>

            {/* Damage Report */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Report Damage?</p>
                  <p className="text-sm text-muted-foreground">We'll compare with pre-move photos</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Report an Issue
              </Button>
            </div>
          </div>

          {/* Items List */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold text-foreground text-lg mb-4">
                Items Checklist
              </h3>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div 
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      item.verified 
                        ? 'bg-accent/10 border border-accent/20' 
                        : item.status === 'delivered'
                          ? 'bg-muted hover:bg-muted/80'
                          : 'bg-muted/50 opacity-60'
                    }`}
                  >
                    {item.verified ? (
                      <CheckCircle2 className="w-7 h-7 text-accent flex-shrink-0" />
                    ) : item.status === 'delivered' ? (
                      <button 
                        onClick={handleVerify}
                        className="w-7 h-7 rounded-full border-2 border-muted-foreground flex-shrink-0 hover:border-primary hover:bg-primary/10 transition-colors"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${item.verified ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.room}</p>
                    </div>
                    {item.status === 'delivered' && !item.verified && (
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Camera className="w-4 h-4" />
                        Photo
                      </Button>
                    )}
                    {item.status === 'pending' && (
                      <span className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <Button 
            onClick={() => navigate('/complete')}
            disabled={verifiedItems < deliveredCount}
            size="lg"
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {verifiedItems < deliveredCount ? `Verify ${deliveredCount - verifiedItems} more items` : 'Complete Move'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </WebLayout>
  );
};

export default Verification;
