import WebLayout from "@/components/layout/WebLayout";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { usePartnerNotification } from "../hooks/usePartnerNotification";

interface PartnerAuthProps {
  onLoginSuccess?: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const PartnerAuth: FC<PartnerAuthProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showError, showSuccess } = usePartnerNotification();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    console.log("PartnerAuth: onSubmit called. Form valid:", isValid);

    const result = await login({ email: data.email, password: data.password });

    if (result.success) {
      console.log("PartnerAuth: Login successful, emitting onLoginSuccess.");
      showSuccess("Login successful!");
      onLoginSuccess?.();
    } else {
      showError(result.error || "Login failed. Please check your credentials.");
      console.error("PartnerAuth: Login failed with error:", result.error);
    }
    setIsLoading(false);
  };

  return (
    <WebLayout>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-background p-10 shadow-lg text-center">
          <h2 className="mb-5 text-2xl font-bold text-primary">Partner Login</h2>
          <p className="mb-6 text-muted-foreground">
            Please log in to access the video survey dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={cn({ "border-destructive focus-visible:ring-destructive": errors.email && touchedFields.email })}
              />
              {errors.email && touchedFields.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={cn("pr-10", { "border-destructive focus-visible:ring-destructive": errors.password && touchedFields.password })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && touchedFields.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={!isValid || isLoading}>
              {isLoading && (
                <span
                  className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Login
            </Button>
          </form>
        </div>
      </div>
    </WebLayout>
  );
};
