import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Clock, Package, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WebLayout from '@/components/layout/WebLayout';

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

  const content = (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <button 
            onClick={() => navigate('/schedule')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            Move Day Tracking
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            December 24, 2024 • 9:00 AM
          </p>
        </div>
        <Button variant="outline" size="lg" className="w-fit">
          <Phone className="w-5 h-5 mr-2" />
          Contact Crew
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Map & Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Simulation */}
          <div className="relative h-64 md:h-80 bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            
            {/* Route Visualization */}
            <div className="absolute inset-8 flex items-center">
              <div className="relative w-full">
                {/* Route line */}
                <div className="absolute top-1/2 left-0 w-full h-2 bg-muted rounded-full -translate-y-1/2">
                  <div 
                    className="h-full gradient-primary rounded-full transition-all duration-1000"
                    style={{ width: `${(status / 4) * 100}%` }}
                  />
                </div>
                
                {/* Origin */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-soft">
                    <MapPin className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Origin</p>
                </div>
                
                {/* Truck */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 text-4xl transition-all duration-1000"
                  style={{ left: `calc(${(status / 4) * 80}% + 20px)` }}
                >
                  🚚
                </div>
                
                {/* Destination */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-soft">
                    <MapPin className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Destination</p>
                </div>
              </div>
            </div>
            
            {/* ETA Badge */}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-soft">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">ETA: {eta} min</span>
            </div>
          </div>

          {/* Status Alert */}
          {status >= 2 && status < 4 && (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <Package className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">
                  {status === 2 ? 'Crew has arrived!' : 'Packing your items...'}
                </p>
                <p className="text-muted-foreground">
                  {status === 2 ? 'Verify them with the QR code on their badges' : '12 of 24 items packed'}
                </p>
              </div>
            </div>
          )}

          {/* Crew */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h3 className="font-semibold text-foreground text-lg mb-4">Your Crew</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {crew.map((member, i) => (
                <div key={i} className="text-center p-4 bg-muted rounded-xl">
                  <div className="w-14 h-14 mx-auto bg-background rounded-full flex items-center justify-center text-3xl mb-3">
                    {member.image}
                  </div>
                  <p className="font-medium text-foreground">{member.name.split(' ')[0]}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <p className="text-sm text-accent mt-1">⭐ {member.rating}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-2xl p-6 shadow-card h-fit">
          <h3 className="font-semibold text-foreground text-lg mb-6">Progress Timeline</h3>
          <div className="space-y-6">
            {timeline.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-accent' : 'bg-muted'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
                    ) : (
                      <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full" />
                    )}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${
                      step.completed ? 'bg-accent' : 'bg-muted'
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8">
        <Button 
          onClick={() => navigate('/verification')}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity"
        >
          View Digital Manifest
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
  
  return (
    <WebLayout className="py-8 md:py-12">
      {content}
    </WebLayout>
  );
};

export default Tracking;
