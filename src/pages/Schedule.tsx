import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Package, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WebLayout from '@/components/layout/WebLayout';

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
    <WebLayout showSteps currentStep={4} className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/quote')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
            Schedule Your Move
          </h1>
          <p className="text-lg text-muted-foreground">
            Pick your preferred date and time slot
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Date & Time Selection */}
          <div className="space-y-6">
            {/* Date Selection */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground text-lg">December 2024</h3>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {dates.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(d.date)}
                    className={`rounded-xl p-3 text-center transition-all ${
                      selectedDate === d.date 
                        ? 'gradient-primary text-primary-foreground shadow-soft' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <p className={`text-xs ${selectedDate === d.date ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {d.day}
                    </p>
                    <p className="text-xl font-bold my-1">{d.date}</p>
                    {(d.discount || d.peak) && (
                      <p className={`text-[10px] font-medium ${
                        selectedDate === d.date 
                          ? 'text-primary-foreground/70' 
                          : d.discount ? 'text-accent' : 'text-destructive'
                      }`}>
                        {d.discount ? 'Save 10%' : 'Peak'}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground text-lg">Time Slot</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedTime === slot.time 
                        ? 'gradient-primary text-primary-foreground shadow-soft' 
                        : slot.available 
                          ? 'bg-muted hover:bg-muted/80' 
                          : 'bg-muted/50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <p className="font-semibold text-lg">{slot.time}</p>
                    <p className={`text-sm ${
                      selectedTime === slot.time ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {slot.available ? slot.label : 'Unavailable'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Packing Recommendation */}
          <div className="bg-card rounded-2xl p-6 shadow-card h-fit">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground text-lg">Smart Packing Kit</h3>
              <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full ml-auto">
                Recommended
              </span>
            </div>
            <p className="text-muted-foreground mb-6">
              Based on your inventory scan, we recommend the following materials:
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {packingKit.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-muted rounded-xl p-4">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{item.item}</p>
                    <p className="text-sm text-muted-foreground">{item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-xl border border-accent/20">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span className="text-foreground font-medium">Kit included in your quote</span>
            </div>

            {/* Summary */}
            {selectedDate && selectedTime && (
              <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Your Move</p>
                <p className="text-lg font-semibold text-foreground">
                  December {selectedDate}, 2024 at {selectedTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <Button 
            onClick={() => navigate('/tracking')}
            disabled={!selectedDate || !selectedTime}
            size="lg"
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Confirm Booking
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </WebLayout>
  );
};

export default Schedule;
