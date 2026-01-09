import React from 'react';
import { MapPin, CheckCircle2 } from 'lucide-react';

const TrackingScreenshot = () => {
  return (
    <div className="p-4 bg-background h-full">
      <h2 className="text-lg font-semibold mb-4">Move Day Tracking</h2>
      <div className="relative mb-4">
        <div className="h-2 bg-muted rounded-full">
          <div className="h-full bg-primary rounded-full w-3/4" />
        </div>
        <MapPin className="absolute -left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
        <p className="absolute -left-1 top-full text-xs">Origin</p>
        <div className="absolute left-3/4 -translate-x-1/2 top-1/2 -translate-y-1/2 text-lg">🚚</div>
        <MapPin className="absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <p className="absolute -right-1 top-full text-xs">Destination</p>
      </div>
      <div className="space-y-2 text-sm mt-8">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <p>Crew Assigned</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <p>On the Way</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <p>Arrived at Origin</p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CheckCircle2 className="w-4 h-4" />
          <div>
            <p>Packing in Progress</p>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-muted-foreground/20 rounded-full">
                <div className="w-1/2 h-full bg-accent rounded-full" />
              </div>
              <p className="text-xs">50%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Your Crew</h3>
        <div className="flex gap-2">
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="w-8 h-8 mx-auto bg-background rounded-full flex items-center justify-center text-lg mb-1">
              👨‍🔧
            </div>
            <p className="text-xs font-medium">Rajesh</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="w-8 h-8 mx-auto bg-background rounded-full flex items-center justify-center text-lg mb-1">
              👷
            </div>
            <p className="text-xs font-medium">Suresh</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="w-8 h-8 mx-auto bg-background rounded-full flex items-center justify-center text-lg mb-1">
              🚚
            </div>
            <p className="text-xs font-medium">Vijay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingScreenshot;
