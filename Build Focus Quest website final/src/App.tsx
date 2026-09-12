import { useState } from "react";
import Landing from "./Landing";
import AuthModal from "./AuthModal";
import MainApp from "./MainApp";
import { type AuthUser, loadSession, clearSession } from "./lib/auth";

type AppState = "landing" | "app";

export default function App() {
  const [user, setUser]       = useState<AuthUser | null>(() => loadSession());
  const [state, setState]     = useState<AppState>(() => loadSession() ? "app" : "landing");
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  const handleAuth = (mode: "login" | "signup") => setAuthMode(mode);

  const handleAuthSuccess = (authedUser: AuthUser) => {
    setUser(authedUser);
    setAuthMode(null);
    setState("app");
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setState("landing");
  };

  const handleGoHome = () => setState("landing");

  return (
    <>
      {state === "landing" && <Landing onAuth={handleAuth} user={user} onGoApp={() => setState("app")} onLogout={handleLogout} />}
      {state === "app" && user && <MainApp user={user} onLogout={handleLogout} onHome={handleGoHome} />}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}
