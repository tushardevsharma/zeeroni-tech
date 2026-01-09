import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AuthProvider } from "./features/partner/auth/AuthContext"; // Import AuthProvider
import { PartnerPage } from "./features/partner/PartnerPage";     // Import PartnerPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider> {/* Wrap with AuthProvider */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/partner" element={<PartnerPage />} /> {/* New Partner Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
