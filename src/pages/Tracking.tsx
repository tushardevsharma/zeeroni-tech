import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageSquare, Navigation, Clock, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhoneFrame from '@/components/PhoneFrame';

const Tracking = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(0);
  const [eta, setEta] = useState(45);

  const crew = [
    { name: 'Rajesh Kumar', role: 'Team Lead', rating: 4.9, image: '👨‍🔧' },
    { name: 'Suresh Yadav', role: 'Mover', rating: 4.8, image: '👷' },
    { name: 'Amit Singh', role: 'Mover', rating: 4.7, image: '👷' },
    { name: 'Vijay Sharma', role: 'Driver', rating: 4.9, image: '🚚' },
  ];

  const timeline = [
    { label: 'Crew Assigned', time: '7:30 AM', completed: true },
    { label: 'On the Way', time: '8:15 AM', completed: true },
    { label: 'Arrived at Origin', time: '9:00 AM', completed: status >= 2 },
    { label: 'Packing in Progress', time: '9:30 AM', completed: status >= 3 },
    { label: 'Loaded & Departing', time: '11:00 AM', completed: status >= 4 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => (prev < 4 ? prev + 1 : prev));
      setEta(prev => Math.max(0, prev - 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col pt-12 pb-8 px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => navigate('/schedule')}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold font-display text-foreground">Move Day</h1>
              <p className="text-sm text-muted-foreground">Dec 24 • 9:00 AM</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Map Simulation */}
          <div className="relative h-40 bg-card rounded-2xl shadow-card mb-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Route line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-muted rounded-full">
                  <div 
                    className="h-full gradient-primary rounded-full transition-all duration-1000"
                    style={{ width: `${(status / 4) * 100}%` }}
                  />
                </div>
                {/* Origin */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                </div>
                {/* Truck */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 text-2xl transition-all duration-1000"
                  style={{ left: `${(status / 4) * 80}%` }}
                >
                  🚚
                </div>
                {/* Destination */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                </div>
              </div>
            </div>
            {/* ETA Badge */}
            <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 shadow-soft">
              <Clock className="w-3 h-3 text-primary" />
              <span className="text-sm font-medium text-foreground">ETA: {eta} min</span>
            </div>
          </div>

          {/* Crew */}
          <div className="bg-card rounded-xl p-4 shadow-card mb-4">
            <h3 className="font-semibold text-foreground mb-3">Your Crew</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {crew.map((member, i) => (
                <div key={i} className="flex-shrink-0 text-center w-16">
                  <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center text-2xl mb-1">
                    {member.image}
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">{member.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-muted-foreground">{member.role}</p>
                  <p className="text-[10px] text-accent">⭐ {member.rating}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 bg-card rounded-xl p-4 shadow-card">
            <h3 className="font-semibold text-foreground mb-3">Progress</h3>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-accent' : 'bg-muted'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
                    ) : (
                      <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alert */}
          {status >= 2 && status < 4 && (
            <div className="mt-4 bg-accent/10 border border-accent/20 rounded-xl p-3 flex items-center gap-3">
              <Package className="w-5 h-5 text-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {status === 2 ? 'Crew has arrived!' : status === 3 ? 'Packing your items...' : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  {status === 2 ? 'Verify them with the QR code' : status === 3 ? '12 of 24 items packed' : ''}
                </p>
              </div>
            </div>
          )}

          <Button 
            onClick={() => navigate('/verification')}
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity mt-4"
          >
            View Digital Manifest
          </Button>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default Tracking;
