import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Welcome from "./components/Welcome.tsx";
import Auth from "./components/Auth.tsx";
import AppShell from "./components/AppShell.tsx";
import ResetPassword from "./components/ResetPassword.tsx";
import { AuthProvider, useAuth } from "./lib/auth.tsx";

function Gate() {
  const { session, loading, recovery } = useAuth();
  const [authMode, setAuthMode] = useState<"welcome" | "login" | "signup">("welcome");

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas text-stone-400">
        Loading…
      </div>
    );
  }
  if (recovery) return <ResetPassword />;
  if (session) return <AppShell />;
  if (authMode === "welcome") return <Welcome onStart={(m) => setAuthMode(m)} />;
  return <Auth initialMode={authMode} onBack={() => setAuthMode("welcome")} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Gate />
    </AuthProvider>
  </StrictMode>
);