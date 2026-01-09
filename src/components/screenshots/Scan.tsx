import React from 'react';
import { Sofa, Tv, Box, MonitorSpeaker } from 'lucide-react';

const ScanScreenshot = () => {
  return (
    <div className="p-4 bg-background h-full">
      <h2 className="text-lg font-semibold mb-4">AI Inventory Scan</h2>
      <div className="relative aspect-video bg-slate-800 rounded-lg mb-4">
        <div className="absolute top-4 left-4 w-16 h-10 bg-slate-600 rounded" />
        <div className="absolute top-2 right-2 w-8 h-12 bg-slate-500 rounded" />
        <div className="absolute bottom-4 left-8 w-12 h-8 bg-slate-600 rounded" />
        <div className="absolute bottom-2 right-4 w-10 h-6 bg-slate-500 rounded" />
        <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
          <p className="text-primary font-semibold">Scanning...</p>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Detected Items (4)</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded">
            <Sofa className="w-4 h-4 text-primary" />
            <p className="text-xs">3-Seater Sofa</p>
          </div>
          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded">
            <Tv className="w-4 h-4 text-primary" />
            <p className="text-xs">LED TV 55"</p>
          </div>
          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded">
            <Box className="w-4 h-4 text-primary" />
            <p className="text-xs">Bookshelf</p>
          </div>
          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded">
            <MonitorSpeaker className="w-4 h-4 text-primary" />
            <p className="text-xs">Sound System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanScreenshot;
