import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AddressInput from "./pages/AddressInput";
import AIScan from "./pages/AIScan";
import Inventory from "./pages/Inventory";
import Quote from "./pages/Quote";
import Schedule from "./pages/Schedule";
import Tracking from "./pages/Tracking";
import Verification from "./pages/Verification";
import Complete from "./pages/Complete";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./features/partner/auth/AuthContext";
import { PartnerPage } from "./features/partner/PartnerPage";
import { LeadsPage } from "./features/leads/LeadsPage";
import { MovesPage } from "./features/moves/MovesPage";

const queryClient = new QueryClient();

const RedirectHandler = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.redirect) {
      navigate(sessionStorage.redirect);
      sessionStorage.clear();
    }
  }, [navigate]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RedirectHandler />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/address" element={<AddressInput />} />
            <Route path="/scan" element={<AIScan />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/complete" element={<Complete />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/moves/*" element={<MovesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
