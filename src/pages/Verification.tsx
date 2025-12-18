import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Camera, AlertTriangle, Sparkles, Shield, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhoneFrame from '@/components/PhoneFrame';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col pt-12 pb-8 px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => navigate('/tracking')}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold font-display text-foreground">Digital Manifest</h1>
              <p className="text-sm text-muted-foreground">Verify your items</p>
            </div>
            <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-foreground" />
            </div>
          </div>

          {/* Progress */}
          <div className="bg-card rounded-xl p-4 shadow-card mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Verification Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {verifiedItems}/{deliveredCount} <span className="text-sm font-normal text-muted-foreground">items</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-semibold text-accent">
                  {verifiedItems === deliveredCount ? 'Complete!' : 'In Progress'}
                </p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full gradient-accent rounded-full transition-all duration-500"
                style={{ width: `${(verifiedItems / deliveredCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Blockchain Badge */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4 flex items-center gap-3">
            <QrCode className="w-8 h-8 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Immutable Record</p>
              <p className="text-xs text-muted-foreground">
                Hash: 0x7f4e...3c21 • Block #4,521,889
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {items.map((item, i) => (
              <div 
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  item.verified 
                    ? 'bg-accent/10 border border-accent/20' 
                    : item.status === 'delivered'
                      ? 'bg-card shadow-card'
                      : 'bg-muted/50'
                }`}
              >
                {item.verified ? (
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
                ) : item.status === 'delivered' ? (
                  <button 
                    onClick={handleVerify}
                    className="w-6 h-6 rounded-full border-2 border-muted-foreground flex-shrink-0 hover:border-primary transition-colors"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  </div>
                )}
                <div className="flex-1">
                  <p className={`font-medium ${item.verified ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.room}</p>
                </div>
                {item.status === 'delivered' && !item.verified && (
                  <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                {item.status === 'pending' && (
                  <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Damage Report */}
          <div className="mt-4 p-3 bg-card rounded-xl shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Report Damage?</p>
              <p className="text-xs text-muted-foreground">AI will compare with pre-move photos</p>
            </div>
            <Button variant="outline" size="sm">
              Report
            </Button>
          </div>

          <Button 
            onClick={() => navigate('/complete')}
            disabled={verifiedItems < deliveredCount}
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
          >
            {verifiedItems < deliveredCount ? `Verify ${deliveredCount - verifiedItems} more items` : 'Complete Move'}
          </Button>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default Verification;
