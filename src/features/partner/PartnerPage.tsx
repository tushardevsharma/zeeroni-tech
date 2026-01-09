import React, { FC, useCallback } from "react";
import { useAuth } from "./auth/AuthContext";
import { PartnerAuth } from "./components/PartnerAuth";
import { PartnerDashboard } from "./components/PartnerDashboard";

export const PartnerPage: FC = () => {
  const { isAuthenticated } = useAuth();
  console.log("PartnerPage: isAuthenticated =", isAuthenticated);

  const handleLoginSuccess = useCallback(() => {
    // Optionally, perform any actions needed after successful login
    // For now, simply re-render will show the dashboard as isAuthenticated will be true
    console.log("Login successful, rendering dashboard.");
  }, []);

  return (
    <div className="partner-container">
      {isAuthenticated ? (
        <PartnerDashboard />
      ) : (
        <PartnerAuth onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};
