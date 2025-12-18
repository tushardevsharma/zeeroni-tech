import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Package, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhoneFrame from '@/components/PhoneFrame';

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = [
    { day: 'Mon', date: 23, price: '₹24,500' },
    { day: 'Tue', date: 24, price: '₹22,000', discount: true },
    { day: 'Wed', date: 25, price: '₹22,000', discount: true },
    { day: 'Thu', date: 26, price: '₹22,000', discount: true },
    { day: 'Fri', date: 27, price: '₹23,000' },
    { day: 'Sat', date: 28, price: '₹26,500', peak: true },
    { day: 'Sun', date: 29, price: '₹26,500', peak: true },
  ];

  const timeSlots = [
    { time: '6:00 AM', label: 'Early Bird', available: true },
    { time: '9:00 AM', label: 'Morning', available: true },
    { time: '12:00 PM', label: 'Afternoon', available: false },
    { time: '3:00 PM', label: 'Evening', available: true },
  ];

  const packingKit = [
    { item: 'Large Boxes', qty: 20 },
    { item: 'Medium Boxes', qty: 15 },
    { item: 'Bubble Wrap', qty: '5 rolls' },
    { item: 'Tape', qty: '8 rolls' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col pt-12 pb-8 px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/quote')}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold font-display text-foreground">Schedule Move</h1>
              <p className="text-sm text-muted-foreground">Pick your date & time</p>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">December 2024</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dates.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDate(d.date)}
                  className={`flex-shrink-0 w-16 rounded-xl p-3 text-center transition-all ${
                    selectedDate === d.date 
                      ? 'gradient-primary text-primary-foreground shadow-soft' 
                      : 'bg-card shadow-card'
                  }`}
                >
                  <p className={`text-xs ${selectedDate === d.date ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {d.day}
                  </p>
                  <p className="text-xl font-bold my-1">{d.date}</p>
                  <p className={`text-[10px] ${
                    d.discount ? 'text-accent' : d.peak ? 'text-destructive' : 'text-muted-foreground'
                  } ${selectedDate === d.date ? 'text-primary-foreground/70' : ''}`}>
                    {d.discount ? 'Save 10%' : d.peak ? 'Peak' : ''}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">Time Slot</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedTime === slot.time 
                      ? 'gradient-primary text-primary-foreground shadow-soft' 
                      : slot.available 
                        ? 'bg-card shadow-card hover:bg-muted/50' 
                        : 'bg-muted/50 opacity-50'
                  }`}
                >
                  <p className="font-semibold">{slot.time}</p>
                  <p className={`text-xs ${
                    selectedTime === slot.time ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {slot.available ? slot.label : 'Unavailable'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* AI Packing Recommendation */}
          <div className="flex-1 bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">AI Packing Kit</h3>
              <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full ml-auto">
                Recommended
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Based on your inventory scan, we recommend:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {packingKit.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted rounded-lg p-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{item.item}</p>
                    <p className="text-xs text-muted-foreground">{item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 p-2 bg-accent/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span className="text-xs text-foreground">Kit included in your quote</span>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/tracking')}
            disabled={!selectedDate || !selectedTime}
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
          >
            Confirm Booking
          </Button>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default Schedule;
