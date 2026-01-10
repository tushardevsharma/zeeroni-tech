import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export const usePartnerNotification = () => {
  const { toast } = useToast();

  const showSuccess = useCallback((message: string, duration?: number) => {
    toast({
      description: message,
      variant: "default",
      duration: duration || 3000,
    });
  }, [toast]);

  const showError = useCallback((message: string, duration?: number) => {
    toast({
      description: message,
      variant: "destructive",
      duration: duration || 5000,
    });
  }, [toast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    toast({
      description: message,
      variant: "default",
      duration: duration || 3000,
    });
  }, [toast]);

  return { showSuccess, showError, showInfo };
};
