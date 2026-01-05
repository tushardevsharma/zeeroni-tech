import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  path: string;
}

interface StepIndicatorProps {
  currentStep: number;
  className?: string;
}

const steps: Step[] = [
  { label: 'Address', path: '/address' },
  { label: 'Scan', path: '/scan' },
  { label: 'Inventory', path: '/inventory' },
  { label: 'Quote', path: '/quote' },
  { label: 'Schedule', path: '/schedule' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, className }) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <React.Fragment key={step.path}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                    isCompleted && "gradient-primary text-primary-foreground",
                    isCurrent && "border-2 border-primary text-primary bg-primary/10",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs md:text-sm font-medium hidden sm:block",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 md:mx-4">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full gradient-primary transition-all duration-500",
                        isCompleted ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
