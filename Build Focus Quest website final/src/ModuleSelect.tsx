interface ModuleSelectProps {
  genre: string;
  genreIcon: string;
  genreGrad: string;
  onSelect: (mode: "text" | "video") => void;
  onBack: () => void;
}

export default function ModuleSelect({ genre, genreIcon, genreGrad, onSelect, onBack }: ModuleSelectProps) {
  return (
    <div>
      {/* Back */}
      <button onClick={onBack}
        style={{ background: "none", border: "none", color: "#adb5d0", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem", fontFamily: "'Raleway',sans-serif", fontWeight: 600, transition: "color 0.15s", padding: 0 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#6c47ff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#adb5d0")}
      >
        ← Back to Library
      </button>

      {/* Genre header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: genreGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", boxShadow: "0 8px 24px #6c47ff20" }}>
          {genreIcon}
        </div>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "linear-gradient(135deg,#6c47ff10,#00b4d808)", border: "1px solid #6c47ff20", padding: "0.2rem 0.75rem", borderRadius: 100, marginBottom: "0.4rem" }}>
            <span className="font-display" style={{ fontSize: "0.62rem", fontWeight: 700, background: genreGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.08em" }}>LEARNING MODULE</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0f1120", letterSpacing: "-0.01em" }}>{genre}</h1>
        </div>
      </div>

      {/* Choose mode */}
      <p style={{ fontSize: "1rem", color: "#6b7280", marginBottom: "2.5rem", lineHeight: 1.7 }}>
        Choose how you want to train your focus today. Each mode tests a different dimension of your cognitive attention.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", maxWidth: 760 }} className="module-grid">

        {/* Text Assessment */}
        <button onClick={() => onSelect("text")}
          style={{ background: "#ffffff", border: "1.5px solid #e4e6f0", borderRadius: 20, padding: "2rem", textAlign: "left", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: "0" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6c47ff"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px #6c47ff14"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e6f0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {/* Top gradient strip */}
          <div style={{ height: 4, background: "linear-gradient(135deg,#6c47ff,#00b4d8)", borderRadius: 100, marginBottom: "1.5rem" }} />

          {/* Icon */}
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#6c47ff15,#00b4d810)", border: "1.5px solid #6c47ff20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1.25rem" }}>
            📄
          </div>

          <h2 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.625rem" }}>Text Assessment</h2>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.75, marginBottom: "1.75rem", flex: 1 }}>
            Read a curated passage from real-world sources on <strong style={{ color: "#0f1120" }}>{genre}</strong>. Then answer comprehension questions to test how much you retained. Trains sustained reading attention and recall.
          </p>

          {/* Meta tags */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {["Reading", "Comprehension", "Recall"].map((tag) => (
              <span key={tag} style={{ fontSize: "0.65rem", fontFamily: "'Raleway',sans-serif", fontWeight: 700, padding: "0.25rem 0.625rem", background: "#f0f1f8", color: "#6b7280", borderRadius: 100, letterSpacing: "0.04em" }}>{tag}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
              {[1,2,3,4,5].map((lvl) => (
                <div key={lvl} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6c47ff,#00b4d8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px #6c47ff30" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#fff", fontFamily: "'Raleway',sans-serif" }}>{lvl}</span>
                  </div>
                </div>
              ))}
              <span className="font-display" style={{ fontSize: "0.58rem", color: "#adb5d0", letterSpacing: "0.08em", fontWeight: 700, marginLeft: "0.5rem" }}>LEVELS</span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6c47ff,#00b4d8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px #6c47ff30" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </button>

        {/* Video Assessment */}
        <button onClick={() => onSelect("video")}
          style={{ background: "#ffffff", border: "1.5px solid #e4e6f0", borderRadius: 20, padding: "2rem", textAlign: "left", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: "0" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a855f7"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px #a855f714"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e6f0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div style={{ height: 4, background: "linear-gradient(135deg,#a855f7,#6c47ff)", borderRadius: 100, marginBottom: "1.5rem" }} />

          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#a855f715,#6c47ff10)", border: "1.5px solid #a855f720", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1.25rem" }}>
            🎬
          </div>

          <h2 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.625rem" }}>Video Assessment</h2>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.75, marginBottom: "1.75rem", flex: 1 }}>
            Watch a short documentary clip on <strong style={{ color: "#0f1120" }}>{genre}</strong> then answer questions without rewinding. Trains auditory attention, visual focus, and listening comprehension under realistic conditions.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {["Listening", "Visual Focus", "Comprehension"].map((tag) => (
              <span key={tag} style={{ fontSize: "0.65rem", fontFamily: "'Raleway',sans-serif", fontWeight: 700, padding: "0.25rem 0.625rem", background: "#faf5ff", color: "#a855f7", borderRadius: 100, letterSpacing: "0.04em" }}>{tag}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
              {[1,2,3,4,5].map((lvl) => (
                <div key={lvl} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#a855f7,#6c47ff)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px #a855f730" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#fff", fontFamily: "'Raleway',sans-serif" }}>{lvl}</span>
                  </div>
                </div>
              ))}
              <span className="font-display" style={{ fontSize: "0.58rem", color: "#adb5d0", letterSpacing: "0.08em", fontWeight: 700, marginLeft: "0.5rem" }}>LEVELS</span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#a855f7,#6c47ff)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px #a855f730" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </button>
      </div>

      {/* Info strip */}
      <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "linear-gradient(135deg,#6c47ff08,#00b4d806)", border: "1px solid #6c47ff18", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: "0.875rem", maxWidth: 760 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg,#6c47ff,#00b4d8)", flexShrink: 0, marginTop: 5, boxShadow: "0 0 8px #6c47ff60" }} />
        <p style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.7 }}>
          Each session uses a <strong style={{ color: "#0f1120" }}>randomized passage</strong> — you will never see the same text twice in a row. Your AI trainer tracks which passage types sharpen your focus most effectively and adapts future sessions accordingly.
        </p>
      </div>

      <style>{`@media(max-width:600px){.module-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
