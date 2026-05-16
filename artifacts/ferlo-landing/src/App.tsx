import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home } from "@/pages/Home";
import { ThemeProvider } from "@/lib/theme";
import { PopupManager } from "@/components/popups/PopupManager";

const queryClient = new QueryClient();

const AdminApp = lazy(() => import("@/admin/AdminApp"));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Loading admin…
    </div>
  );
}

function PublicSite() {
  return (
    <>
      <Home />
      <PopupManager />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PublicSite />} />
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminApp />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
