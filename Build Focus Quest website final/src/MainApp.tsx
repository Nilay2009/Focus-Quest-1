import { useState, useEffect } from "react";
import GenresPage from "./GenresPage";
import ProgressPage from "./ProgressPage";
import { type AuthUser, clearSession, initials } from "./lib/auth";
import { getSessions, type SessionRecord } from "./lib/sessions";

type Page = "dashboard" | "assessment" | "progress" | "profile";

interface MainAppProps { user: AuthUser; onLogout: () => void; onHome: () => void; }

/* ── Sidebar ── */
function Sidebar({ page, setPage, onLogout, collapsed, setCollapsed, locked, isDark }: {
  page: Page; setPage: (p: Page) => void; onLogout: () => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
  locked: boolean; isDark: boolean;
}) {
  const items: { id: Page; label: string; icon: string }[] = [
    { id: "dashboard",  label: "Dashboard",  icon: "◈" },
    { id: "assessment", label: "Assessment", icon: "◎" },
    { id: "progress",   label: "Progress",   icon: "◐" },
    { id: "profile",    label: "Profile",    icon: "◉" },
  ];
  return (
    <aside style={{ width: collapsed ? 60 : 220, minHeight: "100vh", background: "var(--bg-sidebar)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, transition: "width 0.2s, background 0.25s, border-color 0.25s", overflow: "hidden" }}>
      {/* Logo row */}
      <div style={{ padding: collapsed ? "1rem 0" : "1.25rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,#6c47ff,#00b4d8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="3" fill="#fff" />
                <path d="M9 1v2M9 15v2M1 9h2M15 9h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>
            </div>
            <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
              <span className="font-display" style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text)", whiteSpace: "nowrap" }}>
                Focus<span style={{ background: "linear-gradient(135deg,#6c47ff,#00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Quest</span>
              </span>
              <span style={{ fontSize:"0.48rem", color:"#adb5d0", fontFamily:"'Raleway',sans-serif", fontWeight:700, letterSpacing:"0.08em", marginTop:"0.15rem" }}>BY THE ELITES</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,#6c47ff,#00b4d8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="3" fill="#fff" />
              <path d="M9 1v2M9 15v2M1 9h2M15 9h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", color: "#adb5d0", cursor: "pointer", padding: "0.25rem", marginLeft: collapsed ? 0 : "auto" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 4h12M1 7h12M1 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>

      <nav style={{ flex: 1, padding: "1rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {items.map((item) => {
          const isActive  = page === item.id;
          const isBlocked = locked;
          return (
            <button
              key={item.id}
              onClick={() => { if (!isBlocked) setPage(item.id); }}
              className={`sidebar-item ${isActive ? "active" : ""}`}
              style={{ justifyContent: collapsed ? "center" : "flex-start", opacity: isBlocked ? 0.35 : 1, cursor: isBlocked ? "not-allowed" : "pointer" }}
              title={isBlocked ? "Complete your session first" : (collapsed ? item.label : undefined)}
            >
              <span style={{ fontSize: "1.05rem", flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isBlocked && <span style={{ marginLeft: "auto", fontSize: "0.6rem" }}>🔒</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "0.75rem 0.5rem", borderTop: "1px solid var(--border)" }}>
        <button onClick={onLogout} className="sidebar-item" style={{ color: "#adb5d0" }} title={collapsed ? "Log Out" : undefined}>
          <span style={{ fontSize: "1.05rem" }}>⎋</span>
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ── Section label ── */
function SectionLabel({ children, color = "#6c47ff" }: { children: string; color?: string }) {
  return (
    <div style={{ display: "inline-block", background: color + "12", border: `1px solid ${color}30`, padding: "0.2rem 0.75rem", borderRadius: 100, marginBottom: "0.5rem" }}>
      <span className="font-display" style={{ fontSize: "0.62rem", color, letterSpacing: "0.1em", fontWeight: 700 }}>{children}</span>
    </div>
  );
}

/* ── Relative time helper ── */
function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

const GENRE_ICONS: Record<string, string> = {
  history:"🏛", science:"🔬", mathematics:"📐", philosophy:"💭",
  technology:"💻", literature:"📖", psychology:"🧠", default:"📚",
};

/* ════════════ DASHBOARD ════════════ */
function DashboardPage({ onStartLearning, onGoAssessment, userId, isDark }: { onStartLearning: () => void; onGoAssessment: () => void; userId: string; isDark: boolean }) {
  const card  = { background: "var(--bg-card)", border: "1px solid var(--border)" } as const;
  const text  = { color: "var(--text)" } as const;
  const sub   = { color: "var(--text-sub)" } as const;
  const faint = { color: "var(--text-faint)" } as const;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86_400_000);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });

  const [recentSessions, setRecentSessions] = useState<SessionRecord[]>([]);
  const [allSessions, setAllSessions] = useState<SessionRecord[]>([]);
  const [attentionScore, setAttentionScore] = useState<number | null>(null);

  useEffect(() => {
    const load = () => {
      const all = getSessions(userId);
      setAllSessions(all);
      setRecentSessions(all.slice(-5).reverse());
      const saved = loadAttentionResult(userId);
      setAttentionScore(saved ? saved.score : null);
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, [userId]);

  // Derive cognitive profile stats from real session data + attention assessment
  const cognitiveStats = (() => {
    const hasData = allSessions.length > 0 || attentionScore !== null;
    if (!hasData) {
      return [
        { skill: "Sustained Attention",   val: 0, color: "#6c47ff" },
        { skill: "Working Memory",         val: 0, color: "#a855f7" },
        { skill: "Processing Speed",       val: 0, color: "#00b4d8" },
        { skill: "Cognitive Flexibility",  val: 0, color: "#f59e0b" },
      ];
    }
    const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    const textSessions  = allSessions.filter((s) => s.mode === "text");
    const videoSessions = allSessions.filter((s) => s.mode === "video");
    const fallbackScore = attentionScore ?? 0;
    const avgScore = allSessions.length ? avg(allSessions.map((s) => s.score)) : fallbackScore;
    const textAvg  = textSessions.length  ? avg(textSessions.map((s) => s.score))  : avgScore;
    const videoAvg = videoSessions.length ? avg(videoSessions.map((s) => s.score)) : avgScore;

    // Sustained Attention: blend attention assessment (60%) with text session avg (40%) when both exist
    const sustainedVal = (() => {
      if (attentionScore !== null && textSessions.length > 0)
        return Math.round(attentionScore * 0.6 + textAvg * 0.4);
      if (attentionScore !== null) return attentionScore;
      return textAvg;
    })();

    const passRate = allSessions.length
      ? Math.round((allSessions.filter((s) => s.passed).length / allSessions.length) * 100)
      : Math.round(sustainedVal * 0.7);
    const genreCount = new Set(allSessions.map((s) => s.genre)).size;
    const flexVal = Math.min(100, Math.round((genreCount / 5) * 60 + passRate * 0.4));
    return [
      { skill: "Sustained Attention",  val: Math.min(100, sustainedVal),                              color: "#6c47ff" },
      { skill: "Working Memory",       val: Math.min(100, Math.round((sustainedVal + videoAvg) / 2 * 0.95)), color: "#a855f7" },
      { skill: "Processing Speed",     val: Math.min(100, videoAvg),                                  color: "#00b4d8" },
      { skill: "Cognitive Flexibility",val: Math.min(100, flexVal),                                   color: "#f59e0b" },
    ];
  })();

  // Weekly bar chart from real session scores (last 7 days)
  const weeklyData = (() => {
    const msDay = 86_400_000;
    const now   = Date.now();
    return Array.from({ length: 7 }, (_, i) => {
      const dayStart = new Date(now - (6 - i) * msDay);
      const dayStr   = dayStart.toISOString().slice(0, 10);
      const daySessions = allSessions.filter((s) => s.date.slice(0, 10) === dayStr);
      return daySessions.length
        ? Math.round(daySessions.reduce((a, s) => a + s.score, 0) / daySessions.length)
        : 0;
    });
  })();

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 900, ...text, marginBottom: "0.25rem" }}>Focus Dashboard</h1>
        <p style={{ fontSize: "0.85rem", ...faint }}>Saturday, September 12, 2026</p>
      </div>

      {/* Primary action cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }} className="action-grid">
        <button onClick={onStartLearning}
          style={{ background: "linear-gradient(135deg,#6c47ff,#00b4d8)", border: "none", borderRadius: 14, padding: "1.5rem", cursor: "pointer", textAlign: "left", boxShadow: "0 8px 32px #6c47ff25", transition: "transform 0.15s, box-shadow 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px #6c47ff30"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px #6c47ff25"; }}
        >
          <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>📚</div>
          <div className="font-display" style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.25rem" }}>Start Learning</div>
          <div style={{ fontSize: "0.8rem", color: "#ffffff90" }}>Pick a genre and begin your session</div>
        </button>

        <button onClick={onGoAssessment}
          style={{ ...card, borderWidth: "1.5px", borderStyle: "solid", borderRadius: 14, padding: "1.5rem", cursor: "pointer", textAlign: "left", transition: "border-color 0.2s, transform 0.15s, box-shadow 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6c47ff"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px #6c47ff12"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>◎</div>
          <div className="font-display" style={{ fontSize: "1.05rem", fontWeight: 800, ...text, marginBottom: "0.25rem" }}>Take Assessment</div>
          <div style={{ fontSize: "0.8rem", ...faint }}>Measure your attention baseline</div>
        </button>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }} className="charts-grid">
        {/* Bar chart */}
        <div style={{ ...card, borderRadius: 14, padding: "1.5rem", boxShadow: "0 2px 12px #6c47ff06" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h3 className="font-display" style={{ fontSize: "0.8rem", fontWeight: 800, ...text }}>Weekly Focus Trend</h3>
            <span style={{ fontSize: "0.72rem", ...faint }}>Last 7 days</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: 100 }}>
            {weeklyData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem" }}>
                <div style={{ width: "100%", borderRadius: "4px 4px 0 0", height: v > 0 ? `${v}%` : "3px", background: v > 0 ? (i === weeklyData.length - 1 ? "linear-gradient(180deg,#6c47ff,#00b4d8)" : isDark ? "#2a2d4a" : "#eef0fb") : "var(--border)", boxShadow: v > 0 && i === weeklyData.length - 1 ? "0 4px 16px #6c47ff30" : "none" }} />
                <span style={{ fontSize: "0.55rem", color: "#adb5d0" }}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill bars */}
        <div style={{ ...card, borderRadius: 14, padding: "1.5rem", boxShadow: "0 2px 12px #6c47ff06" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 className="font-display" style={{ fontSize: "0.8rem", fontWeight: 800, ...text }}>Cognitive Profile</h3>
            {attentionScore !== null && (
              <span style={{ fontSize: "0.6rem", fontFamily: "'Raleway',sans-serif", fontWeight: 700, padding: "0.2rem 0.625rem", background: "#6c47ff12", color: "#6c47ff", borderRadius: 100, border: "1px solid #6c47ff25" }}>
                ◎ Attn {attentionScore}
              </span>
            )}
          </div>
          {allSessions.length === 0 && attentionScore === null && (
            <p style={{ fontSize: "0.75rem", ...faint, marginBottom: "0.75rem", lineHeight: 1.6 }}>
              Complete an assessment to unlock your cognitive profile.
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {cognitiveStats.map((s) => (
              <div key={s.skill}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.78rem", ...sub }}>{s.skill}</span>
                  <span className="font-mono-data" style={{ fontSize: "0.78rem", color: s.color, fontWeight: 600 }}>{s.val}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${s.val}%`, background: `linear-gradient(90deg,${s.color}70,${s.color})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent sessions */}
      <div style={{ ...card, borderRadius: 14, padding: "1.5rem", boxShadow: "0 2px 12px #6c47ff06" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
          <h3 className="font-display" style={{ fontSize: "0.8rem", fontWeight: 800, ...text }}>Recent Sessions</h3>
          {recentSessions.length > 0 && (
            <span style={{ fontSize:"0.68rem", ...faint, fontFamily:"'Raleway',sans-serif" }}>Last {recentSessions.length} session{recentSessions.length > 1 ? "s" : ""}</span>
          )}
        </div>

        {recentSessions.length === 0 ? (
          <div style={{ padding:"2rem 0", textAlign:"center" }}>
            <div style={{ fontSize:"2rem", marginBottom:"0.75rem" }}>📭</div>
            <p style={{ fontSize:"0.82rem", ...faint, lineHeight:1.65 }}>No sessions yet — start learning to see your activity here.</p>
          </div>
        ) : (
          recentSessions.map((s, i) => {
            const genreKey  = s.genre.toLowerCase();
            const icon      = GENRE_ICONS[genreKey] ?? GENRE_ICONS.default;
            const isVideo   = s.mode === "video";
            const modeColor = isVideo ? "#a855f7" : "#6c47ff";
            const scoreCl   = s.score >= 85 ? "#22c55e" : s.score >= 65 ? "#f59e0b" : "#ef4444";
            const genreLabel = s.genre.charAt(0).toUpperCase() + s.genre.slice(1);
            const dur = s.durationSecs >= 60
              ? `${Math.floor(s.durationSecs / 60)}m ${s.durationSecs % 60}s`
              : `${s.durationSecs}s`;
            return (
              <div key={s.id} style={{ display:"flex", alignItems:"center", gap:"0.875rem", padding:"0.875rem 0", borderBottom: i < recentSessions.length - 1 ? "1px solid var(--border-lt)" : "none" }}>
                {/* Genre icon */}
                <div style={{ width:42, height:42, borderRadius:11, background:`${modeColor}10`, border:`1.5px solid ${modeColor}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0 }}>
                  {icon}
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.25rem", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"0.875rem", ...text, fontWeight:700, fontFamily:"'Raleway',sans-serif" }}>{genreLabel}</span>
                    <span style={{ fontSize:"0.6rem", padding:"0.15rem 0.55rem", borderRadius:6, background:`${modeColor}12`, color:modeColor, fontFamily:"'Raleway',sans-serif", fontWeight:700, border:`1px solid ${modeColor}20`, flexShrink:0 }}>
                      {isVideo ? "▶ Video" : "≡ Text"} · Lv {s.level}
                    </span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                    <span style={{ fontSize:"0.7rem", ...faint }}>⏱ {dur}</span>
                    <span style={{ fontSize:"0.7rem", ...faint }}>·</span>
                    <span style={{ fontSize:"0.7rem", ...faint }}>🕐 {relTime(s.date)}</span>
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div className="font-mono-data" style={{ fontSize:"1.15rem", fontWeight:700, color:scoreCl, lineHeight:1 }}>{s.score}</div>
                  <div style={{ fontSize:"0.58rem", color:"#adb5d0", fontFamily:"'Raleway',sans-serif", fontWeight:700, letterSpacing:"0.06em", marginTop:2 }}>{s.passed ? "PASSED" : "MISSED"}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`@media(max-width:640px){.charts-grid,.action-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

/* ── Attention assessment persistence ── */
const ATTN_KEY = (uid: string) => `fq_attention_v1_${uid}`;

function saveAttentionResult(userId: string, score: number, answers: number[]) {
  localStorage.setItem(ATTN_KEY(userId), JSON.stringify({ score, answers, date: new Date().toISOString() }));
}

function loadAttentionResult(userId: string): { score: number; answers: number[]; date: string } | null {
  try { return JSON.parse(localStorage.getItem(ATTN_KEY(userId)) ?? "null"); }
  catch { return null; }
}

/* ════════════ ASSESSMENT ════════════ */
function AssessmentPage({ onSessionChange, userId }: { onSessionChange: (locked: boolean) => void; userId: string }) {
  const saved = loadAttentionResult(userId);
  const [phase, setPhase]       = useState<"intro" | "test" | "result">(saved ? "result" : "intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers]   = useState<number[]>(saved?.answers ?? []);

  const questions = [
    { q: "You are reading an article and a notification appears on screen. What typically happens next?", options: ["I ignore it completely and keep reading", "I glance at it, then return within seconds", "I check it and lose a few minutes", "I get fully sidetracked and forget what I was reading"] },
    { q: "How long can you typically read dense, complex text before your mind starts wandering?", options: ["30 minutes or more without difficulty", "15–30 minutes before needing a break", "5–15 minutes before losing focus", "Under 5 minutes — my mind drifts quickly"] },
    { q: "When you listen to a long lecture or podcast, how much do you retain afterwards?", options: ["Nearly everything — I can recall specifics", "The main ideas and most key points", "A few highlights but miss a lot of detail", "Very little — I drift and miss large sections"] },
    { q: "After a 2-hour work session, how often do you feel you were truly focused the entire time?", options: ["Almost always — I maintain deep focus", "Often — with only minor distractions", "Sometimes — I drift frequently", "Rarely — I struggle to stay on task"] },
    { q: "How easily can you enter a state of deep, uninterrupted focus (flow) when working?", options: ["Very easily — I enter flow most sessions", "Fairly easily with the right conditions", "It takes a lot of effort and rarely lasts", "I almost never experience deep flow states"] },
    { q: "When you're in a meeting or group discussion, you tend to:", options: ["Stay fully engaged and contribute actively", "Follow along well with occasional drift", "Drift often and miss parts of the discussion", "Struggle to follow — my attention wanders constantly"] },
    { q: "You are given a list of 8 items to memorize. After 2 minutes, how many can you recall?", options: ["7–8 items without much effort", "5–6 items reliably", "3–4 items most of the time", "1–2 items — my short-term memory feels weak"] },
    { q: "How do you typically respond when a task requires sustained effort for more than 30 minutes?", options: ["I work through it comfortably", "I push through with some mental fatigue", "I need regular breaks to stay on track", "I avoid or significantly postpone such tasks"] },
    { q: "When you finish reading a chapter or section of a book, how well can you summarize what you read?", options: ["Very well — I can explain key ideas in detail", "Fairly well — I get the main points", "Partially — I remember some parts vaguely", "Poorly — I often realize I absorbed very little"] },
  ];

  const handleAnswer = (i: number) => {
    const next = [...answers, i];
    setAnswers(next);
    if (currentQ + 1 >= questions.length) {
      onSessionChange(false);
      const finalScore = Math.round((next.reduce((a, b) => a + (3 - b), 0) / (next.length * 3)) * 100);
      saveAttentionResult(userId, finalScore, next);
      window.dispatchEvent(new Event("storage"));
      setPhase("result");
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const reset = () => {
    onSessionChange(false);
    localStorage.removeItem(ATTN_KEY(userId));
    window.dispatchEvent(new Event("storage"));
    setPhase("intro");
    setCurrentQ(0);
    setAnswers([]);
  };

  const score = answers.length ? Math.round((answers.reduce((a, b) => a + (3 - b), 0) / (answers.length * 3)) * 100) : 0;
  const label = score >= 75 ? "Strong Focus Baseline" : score >= 50 ? "Developing Attention" : "Focus Training Needed";
  const desc  = score >= 75 ? "Your attention span is above average. Targeted training will push you toward elite-level cognitive performance." : score >= 50 ? "Solid foundation with clear growth areas. Our adaptive system will accelerate your progress." : "Significant room to grow — FocusQuest will build a personalized path calibrated to your current level.";

  if (phase === "intro") return (
    <div>
      <h1 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0f1120", marginBottom: "0.25rem" }}>Attention Assessment</h1>
      <p style={{ fontSize: "0.85rem", color: "#adb5d0", marginBottom: "2.5rem" }}>Establish your cognitive baseline before training.</p>
      <div className="assessment-card" style={{ maxWidth: 600 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#6c47ff,#00b4d8)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", fontSize: "1.5rem", boxShadow: "0 8px 24px #6c47ff30" }}>◎</div>
        <h2 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.75rem" }}>Attention Span Assessment</h2>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.8, marginBottom: "2rem" }}>
          9 carefully designed questions assessing your sustained attention, working memory, distractibility, and retention. Results calibrate your personalized training program.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          {[{ label: "Questions", val: "9" }, { label: "Duration", val: "~5 min" }, { label: "Domains", val: "4" }].map((s) => (
            <div key={s.label} style={{ background: "linear-gradient(135deg,#6c47ff08,#00b4d806)", border: "1px solid #e4e6f0", borderRadius: 10, padding: "0.875rem", textAlign: "center" }}>
              <div className="font-mono-data" style={{ fontSize: "1.25rem", color: "#6c47ff", fontWeight: 700 }}>{s.val}</div>
              <div className="font-display" style={{ fontSize: "0.6rem", color: "#adb5d0", letterSpacing: "0.08em", marginTop: 2, fontWeight: 700 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ padding: "0.875rem 2rem" }} onClick={() => { onSessionChange(true); setPhase("test"); }}>Start Assessment →</button>
      </div>
    </div>
  );

  if (phase === "test") return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0f1120", marginBottom: "0.25rem" }}>Attention Assessment</h1>
          <p style={{ fontSize: "0.85rem", color: "#adb5d0" }}>Question {currentQ + 1} of {questions.length}</p>
        </div>
        <button onClick={reset} className="btn-ghost" style={{ padding: "0.375rem 0.875rem", fontSize: "0.75rem" }}>Cancel</button>
      </div>
      <div className="progress-bar" style={{ marginBottom: "2.5rem", maxWidth: 600 }}>
        <div className="progress-bar-fill" style={{ width: `${(currentQ / questions.length) * 100}%` }} />
      </div>
      <div className="assessment-card fade-in-up" style={{ maxWidth: 600 }} key={currentQ}>
        <SectionLabel color="#6c47ff">{`QUESTION ${currentQ + 1} / ${questions.length}`}</SectionLabel>
        <h2 style={{ fontSize: "1.05rem", color: "#0f1120", lineHeight: 1.65, margin: "1rem 0 1.75rem", fontWeight: 600 }}>{questions[currentQ].q}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {questions[currentQ].options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)}
              style={{ background: "#f8f9ff", border: "1.5px solid #e4e6f0", borderRadius: 10, padding: "0.875rem 1.25rem", color: "#0f1120", fontSize: "0.9rem", textAlign: "left", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "0.875rem", fontFamily: "'Inter',sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6c47ff"; e.currentTarget.style.background = "#6c47ff08"; e.currentTarget.style.boxShadow = "0 4px 16px #6c47ff12"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e6f0"; e.currentTarget.style.background = "#f8f9ff"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6c47ff12,#00b4d808)", border: "1px solid #e4e6f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.72rem", color: "#6c47ff", fontFamily: "'Raleway',sans-serif", fontWeight: 800 }}>
                {String.fromCharCode(65 + i)}
              </div>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const savedResult = loadAttentionResult(userId);
  const resultDate  = savedResult?.date
    ? new Date(savedResult.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0f1120", marginBottom: "0.25rem" }}>Assessment Results</h1>
      <p style={{ fontSize: "0.85rem", color: "#adb5d0", marginBottom: "2.5rem" }}>
        {resultDate ? `Last taken ${resultDate} · Your cognitive baseline is saved.` : "Your cognitive baseline has been established."}
      </p>
      <div style={{ maxWidth: 600 }}>
        <div className="assessment-card" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: 130, height: 130, borderRadius: "50%", margin: "0 auto 1.5rem", background: `conic-gradient(#6c47ff 0% ${score}%, #f0f1f8 ${score}% 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px #6c47ff20" }}>
            <div style={{ width: 104, height: 104, borderRadius: "50%", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span className="font-mono-data" style={{ fontSize: "1.85rem", color: "#6c47ff", fontWeight: 700 }}>{score}</span>
              <span style={{ fontSize: "0.62rem", color: "#adb5d0" }}>/ 100</span>
            </div>
          </div>
          <h2 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.5rem" }}>{label}</h2>
          <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.75 }}>{desc}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Sustained Attention", val: Math.min(100, score + 7), color: "#6c47ff" },
            { label: "Distractibility Risk", val: Math.max(10, 100 - score + 5), color: "#a855f7" },
            { label: "Retention Rate",       val: Math.min(100, score + 4), color: "#22c55e" },
            { label: "Focus Depth",          val: Math.min(100, Math.max(10, score - 5)), color: "#f59e0b" },
          ].map((m) => (
            <div key={m.label} className="stat-card">
              <div className="font-display" style={{ fontSize: "0.6rem", color: "#adb5d0", letterSpacing: "0.08em", marginBottom: "0.5rem", fontWeight: 700 }}>{m.label.toUpperCase()}</div>
              <div className="font-mono-data" style={{ fontSize: "1.5rem", color: m.color, fontWeight: 700 }}>{m.val}</div>
              <div className="progress-bar" style={{ marginTop: "0.5rem" }}>
                <div className="progress-bar-fill" style={{ width: `${m.val}%`, background: `linear-gradient(90deg,${m.color}70,${m.color})` }} />
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ padding: "0.875rem", width: "100%" }} onClick={reset}>Retake Assessment</button>
      </div>
    </div>
  );
}

/* ════════════ PROFILE ════════════ */
function ProfilePage({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio]   = useState("Optimizing for peak cognitive performance.");

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0f1120", marginBottom: "0.25rem" }}>Neural Profile</h1>
      <p style={{ fontSize: "0.85rem", color: "#adb5d0", marginBottom: "2.5rem" }}>Your identity and training preferences.</p>

      <div style={{ background: "#ffffff", border: "1px solid #e4e6f0", borderRadius: 14, padding: "2rem", marginBottom: "1.5rem", maxWidth: 560, boxShadow: "0 2px 16px #6c47ff06" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#6c47ff,#00b4d8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 8px 24px #6c47ff30", fontFamily: "'Raleway',sans-serif" }}>{initials(user.name)}</div>
          <div style={{ flex: 1 }}>
            {editing ? <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: "0.5rem", fontSize: "1rem", fontWeight: 700 }} />
                     : <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f1120", marginBottom: "0.25rem" }}>{name}</div>}
            {editing ? <input className="input-field" value={bio} onChange={(e) => setBio(e.target.value)} style={{ fontSize: "0.85rem" }} />
                     : <div style={{ fontSize: "0.85rem", color: "#adb5d0" }}>{bio}</div>}
          </div>
          <button onClick={() => setEditing(!editing)} className="btn-ghost" style={{ padding: "0.375rem 0.875rem" }}>{editing ? "Save" : "Edit"}</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
          {[{ label: "Member Since", val: new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) }].map((s) => (
            <div key={s.label} style={{ background: "linear-gradient(135deg,#6c47ff08,#00b4d806)", border: "1px solid #e4e6f0", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
              <div className="font-mono-data" style={{ fontSize: "0.9rem", color: "#6c47ff", fontWeight: 700, marginBottom: 2 }}>{s.val}</div>
              <div className="font-display" style={{ fontSize: "0.55rem", color: "#adb5d0", letterSpacing: "0.08em", fontWeight: 700 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {[
        { title: "Account Settings", items: [{ label: "Email", val: user.email }] },
      ].map((section) => (
        <div key={section.title} style={{ background: "#ffffff", border: "1px solid #e4e6f0", borderRadius: 14, padding: "1.5rem", marginBottom: "1.25rem", maxWidth: 560, boxShadow: "0 2px 12px #6c47ff06" }}>
          <h3 className="font-display" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#adb5d0", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>{section.title.toUpperCase()}</h3>
          {section.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: i < section.items.length - 1 ? "1px solid #f0f1f8" : "none" }}>
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{item.label}</span>
              <span style={{ fontSize: "0.875rem", color: "#0f1120", fontWeight: 600 }}>{item.val}</span>
            </div>
          ))}
        </div>
      ))}

      <button onClick={onLogout}
        style={{ background: "none", border: "1.5px solid #fecaca", color: "#ef4444aa", padding: "0.625rem 1.5rem", borderRadius: 8, cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.04em", transition: "all 0.2s", fontFamily: "'Raleway',sans-serif", fontWeight: 700 }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "#fef2f2"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.color = "#ef4444aa"; e.currentTarget.style.background = "none"; }}
      >
        Log Out
      </button>
    </div>
  );
}

/* ════════════ APP SHELL ════════════ */
export default function MainApp({ user, onLogout, onHome }: MainAppProps) {
  const [page, setPage]               = useState<Page>("dashboard");
  const [showGenres, setShowGenres]   = useState(false);
  const [collapsed, setCollapsed]     = useState(false);
  const [sessionLocked, setLocked]    = useState(false);
  const [isDark, setIsDark]           = useState(() => localStorage.getItem("fq_theme") === "dark");
  const userInitials                  = initials(user.name);

  const toggleDark = () => {
    setIsDark((d) => {
      const next = !d;
      localStorage.setItem("fq_theme", next ? "dark" : "light");
      return next;
    });
  };

  const shell = (children: React.ReactNode) => (
    <div data-dark={isDark ? "true" : undefined} style={{ display: "flex", minHeight: "100vh", background: "var(--bg-page)", transition: "background 0.25s, color 0.25s" }}>
      <div className="desktop-sidebar">
        <Sidebar page={page} setPage={(p) => { setShowGenres(false); setPage(p); }} onLogout={onLogout} collapsed={collapsed} setCollapsed={setCollapsed} locked={sessionLocked} isDark={isDark} />
      </div>

      <main style={{ flex:1, padding:"2rem", overflowY:"auto", minWidth:0 }} className="main-content">
        {/* Top bar */}
        <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", marginBottom:"2rem", gap:"0.875rem" }}>

          {/* Dark / Light toggle */}
          <button
            onClick={toggleDark}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{ display:"flex", alignItems:"center", gap:"0.4rem", background: isDark ? "#1c1f35" : "#f0f1f8", border:`1px solid ${isDark ? "#2e3358" : "#e4e6f0"}`, borderRadius:20, padding:"0.3rem 0.75rem", cursor:"pointer", transition:"all 0.2s", flexShrink:0 }}
          >
            <span style={{ fontSize:"0.85rem", lineHeight:1 }}>{isDark ? "☀️" : "🌙"}</span>
            <span style={{ fontSize:"0.62rem", fontFamily:"'Raleway',sans-serif", fontWeight:700, color: isDark ? "#a78bfa" : "#6b7280", letterSpacing:"0.06em" }}>
              {isDark ? "LIGHT" : "DARK"}
            </span>
          </button>

          <div style={{ width:1, height:20, background:"var(--border)" }} />

          <button
            onClick={onHome}
            style={{ display:"flex", alignItems:"center", gap:"0.4rem", background:"none", border:"1px solid var(--border)", borderRadius:8, padding:"0.375rem 0.875rem", cursor:"pointer", color:"var(--text-sub)", fontFamily:"'Raleway',sans-serif", fontWeight:700, fontSize:"0.75rem", transition:"all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6c47ff50"; e.currentTarget.style.color = "#6c47ff"; e.currentTarget.style.background = "#6c47ff08"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-sub)"; e.currentTarget.style.background = "none"; }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 6.5L6.5 1 12 6.5"/><path d="M2.5 5v6.5h3V8h2v3.5h3V5"/>
            </svg>
            Home
          </button>
          <div style={{ width:1, height:20, background:"var(--border)" }} />
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
            <span style={{ fontSize:"0.85rem", color:"var(--text-sub)", fontFamily:"'Raleway',sans-serif" }}>
              Hi, <strong style={{ color:"var(--text)", fontWeight:700 }}>{user.name.split(" ")[0]}</strong>
            </span>
          </div>
          <div style={{ width:1, height:20, background:"var(--border)" }} />
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:"#f0fdf4", border:"1px solid #bbf7d0", padding:"0.375rem 0.75rem", borderRadius:100 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e80" }} />
            <span className="font-display" style={{ fontSize:"0.6rem", color:"#16a34a", letterSpacing:"0.08em", fontWeight:700 }}>ACTIVE</span>
          </div>
          <div
            title={user.name}
            style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#6c47ff,#00b4d8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:"'Raleway',sans-serif", boxShadow:"0 4px 12px #6c47ff30", flexShrink:0 }}
            onClick={() => { setShowGenres(false); setPage("profile"); }}
          >
            {initials(user.name)}
          </div>
        </div>
        {children}
      </main>

      <style>{`.desktop-sidebar{display:flex;}@media(max-width:768px){.desktop-sidebar{display:none!important;}.main-content{padding:1.25rem 1rem!important;}}`}</style>
    </div>
  );

  if (showGenres) return shell(
    <GenresPage
      onBack={() => { setLocked(false); setShowGenres(false); }}
      userId={user.id}
      onSessionChange={setLocked}
    />
  );

  return shell(
    <>
      {page === "dashboard"  && <DashboardPage onStartLearning={() => setShowGenres(true)} onGoAssessment={() => setPage("assessment")} userId={user.id} isDark={isDark} />}
      {page === "assessment" && <AssessmentPage onSessionChange={setLocked} userId={user.id} />}
      {page === "progress"   && <ProgressPage user={user} />}
      {page === "profile"    && <ProfilePage user={user} onLogout={onLogout} />}
    </>
  );
}
