import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductRegistration from "./pages/ProductRegistration";
import DataStorage from "./pages/DataStorage";
import Verification from "./pages/Verification";
import TransactionHistory from "./pages/TransactionHistory";
import WalletIntegration from "./pages/WalletIntegration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product-registration" element={<ProductRegistration />} />
          <Route path="/storage" element={<DataStorage />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/wallet" element={<WalletIntegration />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
