import React, { FC, useCallback } from "react";
import { useAuth } from "@/features/partner/auth/AuthContext";
import { PartnerAuth } from "@/features/partner/components/PartnerAuth";
import { LeadsDashboard } from "./components/LeadsDashboard";

export const LeadsPage: FC = () => {
  const { isAuthenticated } = useAuth();

  const handleLoginSuccess = useCallback(() => {
    console.log("Login successful, rendering leads dashboard.");
  }, []);

  return (
    <div className="leads-container">
      {isAuthenticated ? (
        <LeadsDashboard />
      ) : (
        <PartnerAuth onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};
