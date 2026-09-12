import { useState } from "react";
import ModuleSelect from "./ModuleSelect";
import TextAssessment from "./TextAssessment";
import VideoAssessment from "./VideoAssessment";

interface GenresPageProps {
  onBack: () => void;
  userId?: string;
  onSessionChange?: (locked: boolean) => void;
}

const genres = [
  { id: "history",     label: "History",          icon: "🏛️", desc: "Famous battles, revolutions, and the events that shaped civilization.",              grad: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { id: "science",     label: "Science",           icon: "🔬", desc: "Biology, chemistry, physics, and the natural world explained clearly.",               grad: "linear-gradient(135deg,#22c55e,#00b4d8)" },
  { id: "technology",  label: "Technology",        icon: "💻", desc: "Computing, AI, engineering innovations, and the digital frontier.",                   grad: "linear-gradient(135deg,#00b4d8,#6c47ff)" },
  { id: "psychology",  label: "Psychology",        icon: "🧠", desc: "Human behavior, cognition, mental models, and the science of the mind.",              grad: "linear-gradient(135deg,#a855f7,#6c47ff)" },
  { id: "literature",  label: "Literature",        icon: "📖", desc: "Classic and contemporary writing — prose, narrative craft, and great authors.",      grad: "linear-gradient(135deg,#f472b6,#a855f7)" },
  { id: "general",     label: "General Knowledge", icon: "🌐", desc: "Broad trivia, culture, geography, and everything in between.",                        grad: "linear-gradient(135deg,#00b4d8,#22c55e)" },
  { id: "mathematics", label: "Mathematics",       icon: "∑",  desc: "Number theory, logic, patterns, and the language of the universe.",                  grad: "linear-gradient(135deg,#6c47ff,#a855f7)" },
  { id: "philosophy",  label: "Philosophy",        icon: "⚖️", desc: "Ethics, metaphysics, epistemology, and the great questions of existence.",           grad: "linear-gradient(135deg,#e879f9,#6c47ff)" },
  { id: "economics",          label: "Economics",          icon: "📊", desc: "Markets, behavioral economics, financial systems, and decision theory.",              grad: "linear-gradient(135deg,#22c55e,#6c47ff)" },
  { id: "political science",  label: "Political Science",  icon: "🏛️", desc: "Governments, ideologies, international relations, and the structures of political power.", grad: "linear-gradient(135deg,#1d4ed8,#6c47ff)" },
];

type SubPage =
  | { view: "grid" }
  | { view: "module"; genre: typeof genres[0] }
  | { view: "text";   genre: typeof genres[0] }
  | { view: "video";  genre: typeof genres[0] };

export default function GenresPage({ onBack, userId, onSessionChange }: GenresPageProps) {
  const [sub, setSub] = useState<SubPage>({ view: "grid" });
  const [lastScore, setLastScore] = useState<{ score: number } | null>(null);

  const navigate = (next: SubPage) => {
    const locked = next.view === "text" || next.view === "video";
    onSessionChange?.(locked);
    setSub(next);
  };

  /* ── Genre grid ── */
  if (sub.view === "grid") return (
    <div>
      <button onClick={onBack}
        style={{ background: "none", border: "none", color: "#adb5d0", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem", fontFamily: "'Raleway',sans-serif", fontWeight: 600, transition: "color 0.15s", padding: 0 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#6c47ff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#adb5d0")}
      >
        ← Back to Dashboard
      </button>

      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg,#6c47ff12,#00b4d808)", border: "1px solid #6c47ff25", padding: "0.375rem 1rem", borderRadius: 100, marginBottom: "1.25rem" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg,#6c47ff,#00b4d8)", boxShadow: "0 0 8px #6c47ff60" }} />
          <span className="font-display" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", background: "linear-gradient(135deg,#6c47ff,#00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Learning Library</span>
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 900, color: "#0f1120", letterSpacing: "-0.01em", marginBottom: "0.75rem" }}>Choose Your Domain</h1>
        <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.75, maxWidth: 520 }}>
          Select a knowledge domain to train your focus. Each genre offers both <strong style={{ color: "#6c47ff" }}>Text</strong> and <strong style={{ color: "#a855f7" }}>Video</strong> assessment modes.
        </p>
      </div>

      {/* Last session result banner */}
      {lastScore && (
        <div style={{ background: "linear-gradient(135deg,#6c47ff10,#00b4d808)", border: "1px solid #6c47ff25", borderRadius: 12, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "1.25rem" }}>🎯</span>
          <div>
            <div className="font-display" style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6c47ff", letterSpacing: "0.06em" }}>LAST SESSION</div>
            <div style={{ fontSize: "0.875rem", color: "#0f1120", fontWeight: 600 }}>
              You scored <strong style={{ color: lastScore.score >= 80 ? "#22c55e" : lastScore.score >= 60 ? "#6c47ff" : "#ef4444" }}>{lastScore.score}/100</strong> — {lastScore.score >= 60 ? "level passed!" : "keep practicing!"}
            </div>
          </div>
          <button onClick={() => setLastScore(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#adb5d0", cursor: "pointer", fontSize: "0.85rem" }}>✕</button>
        </div>
      )}

      {/* Genre grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: "1.25rem" }}>
        {genres.map((g) => (
          <button key={g.id} onClick={() => navigate({ view: "module", genre: g })}
            style={{ background: "#ffffff", border: "1.5px solid #e4e6f0", borderRadius: 16, padding: 0, textAlign: "left", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", overflow: "hidden" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6c47ff50"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 36px #6c47ff14"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e6f0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ height: 5, background: g.grad }} />
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: g.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", marginBottom: "1rem", boxShadow: "0 4px 14px #6c47ff18" }}>
                {g.icon}
              </div>
              <h3 className="font-display" style={{ fontSize: "1rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.4rem" }}>{g.label}</h3>
              <p style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.7, flex: 1, marginBottom: "1.25rem" }}>{g.desc}</p>
              {/* Mode pills */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.62rem", fontFamily: "'Raleway',sans-serif", fontWeight: 700, padding: "0.2rem 0.625rem", background: "#eef0ff", color: "#6c47ff", borderRadius: 100 }}>📄 Text</span>
                <span style={{ fontSize: "0.62rem", fontFamily: "'Raleway',sans-serif", fontWeight: 700, padding: "0.2rem 0.625rem", background: "#faf5ff", color: "#a855f7", borderRadius: 100 }}>🎬 Video</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: "2.5rem", padding: "1.25rem 1.5rem", background: "linear-gradient(135deg,#6c47ff08,#00b4d806)", border: "1px solid #6c47ff18", borderRadius: 12, display: "flex", gap: "0.875rem", alignItems: "center" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg,#6c47ff,#00b4d8)", flexShrink: 0, boxShadow: "0 0 8px #6c47ff60" }} />
        <p style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.65 }}>
          Every passage is <strong style={{ color: "#0f1120" }}>randomized</strong> from a curated pool — you will never see the same text twice in a row. More genres and passages are added regularly.
        </p>
      </div>
    </div>
  );

  /* ── Module select ── */
  if (sub.view === "module") return (
    <ModuleSelect
      genre={sub.genre.label}
      genreIcon={sub.genre.icon}
      genreGrad={sub.genre.grad}
      onSelect={(mode) => navigate({ view: mode, genre: sub.genre })}
      onBack={() => navigate({ view: "grid" })}
    />
  );

  /* ── Text assessment ── */
  if (sub.view === "text") return (
    <TextAssessment
      genre={sub.genre.label}
      userId={userId}
      onBack={() => navigate({ view: "module", genre: sub.genre })}
      onFinish={(score) => {
        setLastScore({ score });
        navigate({ view: "grid" });
      }}
    />
  );

  /* ── Video assessment ── */
  if (sub.view === "video") return (
    <VideoAssessment
      genre={sub.genre.id}
      userId={userId}
      onBack={() => navigate({ view: "module", genre: sub.genre })}
    />
  );

  return null;
}
