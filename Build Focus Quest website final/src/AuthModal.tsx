import { useState } from "react";
import { signUp, logIn, type AuthUser } from "./lib/auth";

interface AuthModalProps {
  mode: "login" | "signup";
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2l12 12M6.7 6.8A2 2 0 0 0 9.3 9.2M4.2 4.3C2.5 5.4 1 8 1 8s2.5 5 7 5c1.4 0 2.7-.4 3.8-1M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.7 1.4-1.8 2.6" />
    </svg>
  );
}

export default function AuthModal({ mode: initialMode, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode]         = useState(initialMode);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = mode === "signup"
      ? await signUp(name.trim(), email.trim(), password)
      : await logIn(email.trim(), password);
    setLoading(false);
    if (result.error) setError(result.error);
    else if (result.user) onSuccess(result.user);
  };

  const switchMode = (m: "login" | "signup") => { setMode(m); setError(null); };

  const featureList = [
    { icon: "⚡", label: "Attention & focus assessment" },
    { icon: "📚", label: "5-level reading challenges" },
    { icon: "🤖", label: "AI-powered summary grading" },
    { icon: "📈", label: "Progress tracked across sessions" },
  ];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ backdropFilter: "blur(8px)", background: "#0f112055" }}
    >
      {/* Card */}
      <div
        className="fade-in-up"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          width: "100%",
          maxWidth: 800,
          margin: "1rem",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 40px 120px #6c47ff22, 0 8px 40px #00000014",
          background: "#ffffff",
        }}
      >
        {/* ── LEFT: Branding panel ── */}
        <div
          style={{
            background: "linear-gradient(150deg,#6c47ff 0%,#a855f7 60%,#00b4d8 100%)",
            padding: "3rem 2.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* decorative circles */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 220, height: 220, borderRadius: "50%", background: "#ffffff0c", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -50, left: -50, width: 180, height: 180, borderRadius: "50%", background: "#ffffff07", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "2.5rem" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "#ffffff20", border: "1px solid #ffffff30", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="3" fill="#fff" />
                  <path d="M9 1v2M9 15v2M1 9h2M15 9h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 2" />
                </svg>
              </div>
              <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
                <span style={{ fontFamily: "'Raleway',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#ffffff", letterSpacing: "0.01em" }}>FocusQuest</span>
                <span style={{ fontSize:"0.48rem", color:"#ffffff70", fontFamily:"'Raleway',sans-serif", fontWeight:700, letterSpacing:"0.1em", marginTop:"0.15rem" }}>BY THE ELITES</span>
              </div>
            </div>

            <h2 style={{ fontFamily: "'Raleway',sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#ffffff", lineHeight: 1.22, marginBottom: "0.9rem", letterSpacing: "-0.01em" }}>
              {mode === "signup" ? "Begin your cognitive journey." : "Welcome back to your quest."}
            </h2>
            <p style={{ fontSize: "0.83rem", color: "#ffffffaa", lineHeight: 1.75, marginBottom: "2.25rem" }}>
              {mode === "signup"
                ? "Track progress, unlock levels, and sharpen your mind every day."
                : "Your progress is waiting. Log in to pick up right where you left off."}
            </p>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {featureList.map((f) => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "#ffffff18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "#ffffffcc", lineHeight: 1.4 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: "0.7rem", color: "#ffffff50", position: "relative", zIndex: 1, marginTop: "2rem" }}>
            Train smarter. Think sharper.
          </p>
        </div>

        {/* ── RIGHT: Form panel ── */}
        <div style={{ padding: "2.75rem 2.25rem", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#adb5d0", padding: "0.3rem", borderRadius: 6, transition: "color 0.15s, background 0.15s", display: "flex", alignItems: "center" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#0f1120"; e.currentTarget.style.background = "#f0f1f8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#adb5d0"; e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
          </button>

          {/* Mode tabs */}
          <div style={{ display: "flex", background: "#f0f1f8", borderRadius: 10, padding: 3, marginBottom: "1.875rem" }}>
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  fontSize: "0.72rem",
                  fontFamily: "'Raleway',sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 7,
                  transition: "all 0.2s",
                  background: mode === m ? "linear-gradient(135deg,#6c47ff,#a855f7)" : "transparent",
                  color: mode === m ? "#ffffff" : "#6b7280",
                  boxShadow: mode === m ? "0 2px 12px #6c47ff28" : "none",
                }}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <h3 style={{ fontFamily: "'Raleway',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#0f1120", marginBottom: "0.25rem" }}>
            {mode === "login" ? "Sign in to your account" : "Create your free account"}
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "1.75rem", lineHeight: 1.5 }}>
            {mode === "login" ? "Enter your credentials to continue." : "Takes 30 seconds — no card required."}
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>

            {mode === "signup" && (
              <div>
                <label style={{ display: "block", fontFamily: "'Raleway',sans-serif", fontSize: "0.66rem", color: "#6b7280", letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.35rem" }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#c4c9de", pointerEvents: "none", display: "flex" }}>
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7.5" cy="5" r="2.5" /><path d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" /></svg>
                  </span>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ paddingLeft: "2.1rem" }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: "block", fontFamily: "'Raleway',sans-serif", fontSize: "0.66rem", color: "#6b7280", letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.35rem" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#c4c9de", pointerEvents: "none", display: "flex" }}>
                  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="13" height="9" rx="1.5" /><path d="M1 5l6.5 4.5L14 5" /></svg>
                </span>
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: "2.1rem" }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <label style={{ fontFamily: "'Raleway',sans-serif", fontSize: "0.66rem", color: "#6b7280", letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 700 }}>Password</label>
                {mode === "login" && (
                  <button type="button" style={{ background: "none", border: "none", fontSize: "0.72rem", color: "#6c47ff", cursor: "pointer", fontFamily: "'Raleway',sans-serif", fontWeight: 600 }}>Forgot?</button>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#c4c9de", pointerEvents: "none", display: "flex" }}>
                  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="6.5" width="9" height="7" rx="1" /><path d="M5 6.5V5a2.5 2.5 0 0 1 5 0v1.5" /></svg>
                </span>
                <input
                  className="input-field"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ paddingLeft: "2.1rem", paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#adb5d0", display: "flex", alignItems: "center", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#6c47ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#adb5d0")}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {mode === "signup" && (
                <p style={{ fontSize: "0.7rem", color: "#c4c9de", marginTop: "0.3rem" }}>Minimum 6 characters.</p>
              )}
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.6rem 0.85rem", display: "flex", alignItems: "flex-start", gap: "0.45rem" }}>
                <span style={{ flexShrink: 0, fontSize: "0.85rem", marginTop: "0.05rem" }}>⚠️</span>
                <span style={{ fontSize: "0.78rem", color: "#dc2626", lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg,#6c47ff,#a855f7)",
                color: "#ffffff",
                fontFamily: "'Raleway',sans-serif",
                fontWeight: 800,
                fontSize: "0.85rem",
                letterSpacing: "0.025em",
                padding: "0.875rem",
                border: "none",
                borderRadius: 10,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.72 : 1,
                boxShadow: "0 4px 20px #6c47ff28",
                transition: "box-shadow 0.2s, transform 0.15s",
                marginTop: "0.25rem",
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.boxShadow = "0 8px 30px #6c47ff38"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px #6c47ff28"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {loading
                ? (mode === "login" ? "Signing in…" : "Creating account…")
                : (mode === "login" ? "Log In →" : "Create Account →")}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.76rem", color: "#adb5d0", marginTop: "1.5rem", fontFamily: "'Inter',sans-serif" }}>
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              style={{ background: "none", border: "none", color: "#6c47ff", cursor: "pointer", fontSize: "0.76rem", fontFamily: "'Raleway',sans-serif", fontWeight: 700 }}
            >
              {mode === "login" ? "Sign up free" : "Log in"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 580px) {
          .auth-hide-panel { display: none !important; }
          .auth-form-panel { border-radius: 24px !important; }
        }
      `}</style>
    </div>
  );
}
