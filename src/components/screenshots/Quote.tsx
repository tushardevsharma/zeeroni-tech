import React from 'react';
import { Sparkles, TrendingUp, Fuel, Calendar } from 'lucide-react';

const QuoteScreenshot = () => {
  return (
    <div className="p-4 bg-background h-full">
      <h2 className="text-lg font-semibold mb-4">Your Quote</h2>
      <div className="text-center mb-4">
        <p className="text-xs text-muted-foreground">Total Estimate</p>
        <p className="text-3xl font-bold text-primary">₹24,500</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Dynamic Pricing Factors
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <p>Volume (170 ft³)</p>
            <p className="font-semibold">₹18,000</p>
          </div>
          <div className="flex justify-between">
            <p>Distance (15 km)</p>
            <p className="font-semibold">₹2,500</p>
          </div>
          <div className="flex justify-between">
            <p>Fuel Adjustment</p>
            <p className="font-semibold">₹1,500</p>
          </div>
          <div className="flex justify-between">
            <p>Weekend Premium</p>
            <p className="font-semibold">₹2,500</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteScreenshot;
