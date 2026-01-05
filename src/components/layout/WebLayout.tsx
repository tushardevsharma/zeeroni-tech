import React from 'react';
import Header from './Header';
import StepIndicator from './StepIndicator';
import { cn } from '@/lib/utils';

interface WebLayoutProps {
  children: React.ReactNode;
  showSteps?: boolean;
  currentStep?: number;
  className?: string;
  fullWidth?: boolean;
}

const WebLayout: React.FC<WebLayoutProps> = ({
  children,
  showSteps = false,
  currentStep = 0,
  className,
  fullWidth = false,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className={cn("pt-16 md:pt-20", fullWidth ? "" : "container mx-auto px-4 sm:px-6 lg:px-8")}>
        {showSteps && (
          <div className="py-6 md:py-8 max-w-3xl mx-auto">
            <StepIndicator currentStep={currentStep} />
          </div>
        )}
        
        <div className={className}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default WebLayout;
