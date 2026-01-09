import { useToast } from "@/hooks/use-toast";

export const usePartnerNotification = () => {
  const { toast } = useToast();

  const showSuccess = (message: string, duration?: number) => {
    toast({
      description: message,
      variant: "success", // Assuming a 'success' variant exists for styling
      duration: duration || 3000,
    });
  };

  const showError = (message: string, duration?: number) => {
    toast({
      description: message,
      variant: "destructive", // 'destructive' is a common variant for errors in shadcn/ui
      duration: duration || 5000,
    });
  };

  const showInfo = (message: string, duration?: number) => {
    toast({
      description: message,
      variant: "default", // 'default' or a specific 'info' variant if available
      duration: duration || 3000,
    });
  };

  return { showSuccess, showError, showInfo };
};
