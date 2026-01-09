import React from 'react';
import { MapPin, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AddressScreenshot = () => {
  return (
    <div className="p-4 bg-background h-full">
      <h2 className="text-lg font-semibold mb-4">Where are you moving?</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Moving From</label>
          <div className="relative">
            <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value="Indiranagar, Bangalore" className="pl-8 text-sm" readOnly />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Moving To</label>
          <div className="relative">
            <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Enter destination address" className="pl-8 text-sm" readOnly />
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
        <h3 className="text-xs font-semibold text-primary mb-2">Detected Building Information</h3>
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Floor</p>
            <p className="font-bold">3rd</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Elevator</p>
            <p className="font-bold text-accent">Yes</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Parking</p>
            <p className="font-bold">Street</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressScreenshot;
