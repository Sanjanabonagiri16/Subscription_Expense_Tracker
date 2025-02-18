import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/auth/LoginPage";
import routes from "tempo-routes";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
              </div>
            }
          >
            <>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            </>
          </Suspense>
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
