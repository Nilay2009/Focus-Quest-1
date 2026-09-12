import { useState, useEffect, useRef } from "react";
import { getPassageForLevel, type Passage } from "./data/passages";
import { gradeSummary, getProgress, saveProgress } from "./lib/auth";
import { saveSession, classifyRetention } from "./lib/sessions";

interface TextAssessmentProps {
  genre: string;
  userId?: string;
  onBack: () => void;
  onFinish: (score: number) => void;
}

const LEVELS = [
  { level: 1, wordTarget: "~300 words", time: 240, timeLabel: "4 min",     color: "#22c55e" },
  { level: 2, wordTarget: "~600 words", time: 300, timeLabel: "5 min",     color: "#00b4d8" },
  { level: 3, wordTarget: "~800 words", time: 390, timeLabel: "6:30",      color: "#6c47ff" },
  { level: 4, wordTarget: "~1,000 words", time: 420, timeLabel: "7 min",   color: "#a855f7" },
  { level: 5, wordTarget: "~1,500 words", time: 480, timeLabel: "8 min",   color: "#f59e0b" },
];

type Phase = "levels" | "reading" | "summary" | "grading" | "result";

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function TextAssessment({ genre, userId, onBack, onFinish }: TextAssessmentProps) {
  const [phase, setPhase]             = useState<Phase>("levels");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [passage, setPassage]         = useState<Passage | null>(null);
  const [progress, setProgress]       = useState<Record<string, number>>({});
  const [loadingProg, setLoadingProg] = useState(true);
  const [timeLeft, setTimeLeft]       = useState(0);
  const [summary, setSummary]         = useState("");
  const [gradeResult, setGradeResult] = useState<{ score: number; feedback: string; passed: boolean; missedPoints: string[] } | null>(null);
  const [gradeError, setGradeError]   = useState<string | null>(null);
  const [readTime, setReadTime]       = useState(0);
  const timerRef                      = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Load progress */
  useEffect(() => {
    if (!userId) { setLoadingProg(false); return; }
    getProgress(userId).then((p) => { setProgress(p); setLoadingProg(false); }).catch(() => setLoadingProg(false));
  }, [userId]);

  /* Countdown during reading */
  useEffect(() => {
    if (phase !== "reading") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("summary");
          return 0;
        }
        return t - 1;
      });
      setReadTime((t) => t + 1);
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const highestPassed = progress[genre] ?? 0;
  const levelCfg = LEVELS[selectedLevel - 1] ?? LEVELS[0];
  const wc = countWords(summary);
  const timePct = passage ? Math.max(0, (timeLeft / levelCfg.time) * 100) : 100;
  const timerColor = timeLeft < 30 ? "#ef4444" : timeLeft < 60 ? "#f59e0b" : levelCfg.color;

  /* ── Start a level ── */
  const startLevel = (level: number) => {
    const p = getPassageForLevel(genre, level);
    if (!p) return;
    setPassage(p);
    setSelectedLevel(level);
    const cfg = LEVELS[level - 1];
    setTimeLeft(cfg.time);
    setReadTime(0);
    setSummary("");
    setGradeResult(null);
    setGradeError(null);
    setPhase("reading");
  };

  /* ── Submit summary for grading ── */
  const handleSubmit = async () => {
    if (!passage || wc < 30) return;
    setPhase("grading");
    setGradeError(null);
    try {
      const result = await gradeSummary(passage.body, summary, userId ?? "", genre, selectedLevel);
      setGradeResult(result);
      if (result.passed) {
        const newProg = { ...progress, [genre]: Math.max(highestPassed, selectedLevel) };
        setProgress(newProg);
        if (userId) await saveProgress(userId, genre, selectedLevel);
      }
      if (userId) {
        saveSession({
          userId,
          date: new Date().toISOString(),
          genre,
          mode: "text",
          level: selectedLevel,
          score: result.score,
          passed: result.passed,
          durationSecs: readTime,
          retention: classifyRetention(result.score, result.missedPoints.length),
          missedPointsCount: result.missedPoints.length,
        });
      }
      onFinish(result.score);
      setPhase("result");
    } catch (e) {
      setGradeError(e instanceof Error ? e.message : "Grading failed. Please try again.");
      setPhase("summary");
    }
  };

  /* ────────────────────────────── LEVEL SELECTOR ── */
  if (phase === "levels") {
    return (
      <div>
        <button onClick={onBack}
          style={{ background: "none", border: "none", color: "#adb5d0", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", fontFamily: "'Raleway',sans-serif", fontWeight: 600, transition: "color 0.15s", padding: 0 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#6c47ff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#adb5d0")}
        >
          ← Back
        </button>

        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#6c47ff10", border: "1px solid #6c47ff25", padding: "0.2rem 0.75rem", borderRadius: 100, marginBottom: "0.75rem" }}>
            <span className="font-display" style={{ fontSize: "0.62rem", fontWeight: 700, color: "#6c47ff", letterSpacing: "0.08em" }}>TEXT ASSESSMENT · {genre.toUpperCase()}</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0f1120", marginBottom: "0.375rem" }}>Choose Your Level</h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.7, maxWidth: 520 }}>
            Complete each level to unlock the next. Read the passage carefully, then write a summary from memory — no peeking back.
          </p>
        </div>

        {loadingProg ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#adb5d0", fontSize: "0.875rem" }}>Loading your progress…</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", maxWidth: 640 }}>
            {LEVELS.map(({ level, wordTarget, timeLabel, color }) => {
              const unlocked = level === 1 || highestPassed >= level - 1;
              const completed = highestPassed >= level;
              const hasPassage = getPassageForLevel(genre, level) !== null;
              const available = unlocked && hasPassage;

              return (
                <div key={level}
                  style={{ background: "#ffffff", border: `1.5px solid ${available ? (completed ? color + "50" : "#e4e6f0") : "#f0f1f8"}`, borderRadius: 14, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", opacity: available ? 1 : 0.55, transition: "all 0.18s", cursor: available ? "pointer" : "not-allowed", boxShadow: available ? "0 2px 12px #0000000a" : "none" }}
                  onClick={() => available && startLevel(level)}
                  onMouseEnter={(e) => { if (available) e.currentTarget.style.borderColor = color; }}
                  onMouseLeave={(e) => { if (available) e.currentTarget.style.borderColor = completed ? color + "50" : "#e4e6f0"; }}
                >
                  {/* Level badge */}
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: available ? `${color}18` : "#f0f1f8", border: `1.5px solid ${available ? color + "40" : "#e4e6f0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {completed ? (
                      <span style={{ fontSize: "1.1rem" }}>✓</span>
                    ) : !unlocked ? (
                      <span style={{ fontSize: "1rem" }}>🔒</span>
                    ) : (
                      <span className="font-mono-data" style={{ fontSize: "0.9rem", fontWeight: 700, color }}>{level}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
                      <span className="font-display" style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f1120" }}>Level {level}</span>
                      {completed && (
                        <span style={{ background: color + "18", border: `1px solid ${color}40`, color, fontSize: "0.6rem", fontFamily: "'Raleway',sans-serif", fontWeight: 700, letterSpacing: "0.06em", padding: "0.1rem 0.5rem", borderRadius: 100 }}>COMPLETED</span>
                      )}
                      {!unlocked && (
                        <span style={{ background: "#f0f1f8", border: "1px solid #e4e6f0", color: "#adb5d0", fontSize: "0.6rem", fontFamily: "'Raleway',sans-serif", fontWeight: 700, letterSpacing: "0.06em", padding: "0.1rem 0.5rem", borderRadius: 100 }}>LOCKED</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "1.25rem" }}>
                      <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{wordTarget}</span>
                      <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>⏱ {timeLabel}</span>
                    </div>
                  </div>

                  {available && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "#adb5d0", flexShrink: 0 }}>
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Info callout */}
        <div style={{ background: "linear-gradient(135deg,#6c47ff08,#00b4d806)", border: "1px solid #6c47ff18", borderRadius: 10, padding: "1rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "flex-start", marginTop: "2rem", maxWidth: 640 }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: "#6c47ff" }}>How scoring works:</strong> After reading, you write a summary from memory (minimum 30 words). An AI grades your summary on accuracy, coverage, and completeness. Score <strong style={{ color: "#0f1120" }}>60 or above</strong> passes the level and unlocks the next one.
          </p>
        </div>
      </div>
    );
  }

  /* ────────────────────────────── READING PHASE ── */
  if (phase === "reading" && passage) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: levelCfg.color + "12", border: `1px solid ${levelCfg.color}30`, padding: "0.2rem 0.75rem", borderRadius: 100, marginBottom: "0.5rem" }}>
              <span className="font-display" style={{ fontSize: "0.62rem", fontWeight: 700, color: levelCfg.color, letterSpacing: "0.08em" }}>LEVEL {selectedLevel} · {genre.toUpperCase()}</span>
            </div>
            <h1 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0f1120", marginBottom: "0.125rem" }}>{passage.title}</h1>
            <p style={{ fontSize: "0.82rem", color: "#adb5d0" }}>{passage.subtitle}</p>
          </div>

          {/* Timer ring */}
          <div style={{ display: "flex", gap: "0.875rem", flexShrink: 0 }}>
            <div style={{ background: "#f8f9ff", border: `1.5px solid ${timerColor}40`, borderRadius: 12, padding: "0.75rem 1.125rem", textAlign: "center", minWidth: 80, transition: "border-color 0.5s" }}>
              <div className="font-mono-data" style={{ fontSize: "1.25rem", color: timerColor, fontWeight: 700, transition: "color 0.5s" }}>{fmt(timeLeft)}</div>
              <div className="font-display" style={{ fontSize: "0.52rem", color: "#adb5d0", fontWeight: 700, letterSpacing: "0.08em" }}>REMAINING</div>
            </div>
            <div style={{ background: "#f8f9ff", border: "1px solid #e4e6f0", borderRadius: 12, padding: "0.75rem 1.125rem", textAlign: "center", minWidth: 72 }}>
              <div className="font-mono-data" style={{ fontSize: "1.25rem", color: "#0f1120", fontWeight: 700 }}>{passage.body.split(/\s+/).length}</div>
              <div className="font-display" style={{ fontSize: "0.52rem", color: "#adb5d0", fontWeight: 700, letterSpacing: "0.08em" }}>WORDS</div>
            </div>
          </div>
        </div>

        {/* Time bar */}
        <div style={{ height: 4, background: "#f0f1f8", borderRadius: 4, marginBottom: "1.5rem", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${timePct}%`, background: `linear-gradient(90deg, ${timerColor}, ${timerColor}aa)`, borderRadius: 4, transition: "width 1s linear, background 0.5s" }} />
        </div>

        {/* Passage */}
        <div
          style={{ background: "#ffffff", border: "1px solid #e4e6f0", borderRadius: 16, padding: "2.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 20px #6c47ff06", maxHeight: 480, overflowY: "auto", userSelect: "none", WebkitUserSelect: "none" }}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {passage.body.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontSize: "1rem", lineHeight: 1.9, color: "#1e2240", marginBottom: i < passage.body.split("\n\n").length - 1 ? "1.25rem" : 0, fontFamily: "'Inter', sans-serif" }}>
              {para}
            </p>
          ))}
        </div>

        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "0.875rem 1.25rem", display: "flex", gap: "0.625rem", alignItems: "flex-start", marginBottom: "1.75rem" }}>
          <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: "0.78rem", color: "#92400e", lineHeight: 1.6, margin: 0 }}>
            Read carefully — you will not be able to refer back to this passage when writing your summary. Focus on the key facts, main arguments, and important details.
          </p>
        </div>

        <button className="btn-primary" style={{ padding: "0.9rem 2.5rem", fontSize: "0.875rem" }}
          onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("summary"); }}
        >
          Done Reading — Write Summary →
        </button>
      </div>
    );
  }

  /* ────────────────────────────── SUMMARY PHASE ── */
  if (phase === "summary" && passage) {
    const canSubmit = wc >= 30;

    return (
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#a855f712", border: "1px solid #a855f730", padding: "0.2rem 0.75rem", borderRadius: 100, marginBottom: "0.5rem" }}>
              <span className="font-display" style={{ fontSize: "0.62rem", fontWeight: 700, color: "#a855f7", letterSpacing: "0.08em" }}>WRITE YOUR SUMMARY</span>
            </div>
            <h1 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0f1120", marginBottom: "0.125rem" }}>{passage.title}</h1>
            <p style={{ fontSize: "0.82rem", color: "#adb5d0" }}>Level {selectedLevel} · {genre}</p>
          </div>
          <div style={{ background: "#f8f9ff", border: "1px solid #e4e6f0", borderRadius: 12, padding: "0.75rem 1.125rem", textAlign: "center" }}>
            <div className="font-mono-data" style={{ fontSize: "1.1rem", color: "#6c47ff", fontWeight: 700 }}>{fmt(readTime)}</div>
            <div className="font-display" style={{ fontSize: "0.52rem", color: "#adb5d0", fontWeight: 700, letterSpacing: "0.08em" }}>READ TIME</div>
          </div>
        </div>

        <div style={{ background: "#f8f9ff", border: "1px solid #e4e6f0", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.625rem" }}>
          <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>📝</span>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.65, margin: 0 }}>
            The passage is no longer visible. Write a summary from memory covering the main ideas, key facts, and important details. <strong style={{ color: "#0f1120" }}>Minimum 30 words.</strong> Your summary is graded on accuracy, coverage, and completeness.
          </p>
        </div>

        {gradeError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.25rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem" }}>⚠️</span>
            <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>{gradeError}</span>
          </div>
        )}

        <div style={{ position: "relative", marginBottom: "1.25rem" }}>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write your summary here from memory…"
            rows={10}
            style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", lineHeight: 1.75, color: "#1e2240", border: `1.5px solid ${canSubmit ? "#6c47ff50" : "#e4e6f0"}`, borderRadius: 12, resize: "vertical", outline: "none", fontFamily: "'Inter', sans-serif", background: "#ffffff", boxSizing: "border-box", transition: "border-color 0.2s", boxShadow: canSubmit ? "0 0 0 3px #6c47ff10" : "none" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#6c47ff"; e.currentTarget.style.boxShadow = "0 0 0 3px #6c47ff12"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = canSubmit ? "#6c47ff50" : "#e4e6f0"; e.currentTarget.style.boxShadow = canSubmit ? "0 0 0 3px #6c47ff10" : "none"; }}
          />
          {/* Word count badge */}
          <div style={{ position: "absolute", bottom: 12, right: 14, background: canSubmit ? "#6c47ff" : "#f0f1f8", color: canSubmit ? "#ffffff" : "#adb5d0", borderRadius: 100, padding: "0.2rem 0.625rem", fontSize: "0.7rem", fontFamily: "'Raleway',sans-serif", fontWeight: 700, transition: "all 0.2s" }}>
            {wc} / 30+ words
          </div>
        </div>

        {/* Progress bar towards 30 words */}
        <div style={{ height: 3, background: "#f0f1f8", borderRadius: 3, marginBottom: "1.75rem", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(100, (wc / 30) * 100)}%`, background: canSubmit ? "linear-gradient(90deg,#6c47ff,#00b4d8)" : "#adb5d040", borderRadius: 3, transition: "width 0.2s" }} />
        </div>

        <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ padding: "0.9rem 2.5rem", opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? "pointer" : "not-allowed" }} onClick={handleSubmit} disabled={!canSubmit}>
            Submit for AI Grading →
          </button>
          <button className="btn-ghost" style={{ padding: "0.9rem 1.5rem" }} onClick={() => setPhase("levels")}>
            Back to Levels
          </button>
        </div>
      </div>
    );
  }

  /* ────────────────────────────── GRADING PHASE ── */
  if (phase === "grading") {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#6c47ff15,#00b4d810)", border: "2px solid #6c47ff30", margin: "0 auto 2rem", display: "flex", alignItems: "center", justifyContent: "center", animation: "spin 1.5s linear infinite" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="11" stroke="#6c47ff30" strokeWidth="2" />
            <path d="M14 3a11 11 0 0 1 11 11" stroke="#6c47ff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.5rem" }}>AI is Grading Your Summary</h2>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.65 }}>Comparing your summary against the passage…<br />This usually takes under 5 seconds.</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ────────────────────────────── RESULT PHASE ── */
  if (phase === "result" && gradeResult && passage) {
    const { score, feedback, passed, missedPoints } = gradeResult;
    const nextLevel = selectedLevel + 1;
    const hasNext = nextLevel <= 5 && getPassageForLevel(genre, nextLevel) !== null;
    const resultColor = score >= 80 ? "#22c55e" : score >= 60 ? "#6c47ff" : "#ef4444";
    const resultLabel = score >= 80 ? "Excellent Retention" : score >= 60 ? "Good Summary" : "Keep Practicing";

    return (
      <div style={{ maxWidth: 640 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#6c47ff10", border: "1px solid #6c47ff25", padding: "0.2rem 0.75rem", borderRadius: 100, marginBottom: "1.25rem" }}>
          <span className="font-display" style={{ fontSize: "0.62rem", fontWeight: 700, color: "#6c47ff", letterSpacing: "0.08em" }}>SESSION COMPLETE</span>
        </div>

        <h1 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0f1120", marginBottom: "0.25rem" }}>Results</h1>
        <p style={{ fontSize: "0.85rem", color: "#adb5d0", marginBottom: "2.5rem" }}>{passage.title} · Level {selectedLevel}</p>

        {/* Score ring */}
        <div style={{ background: "#ffffff", border: "1px solid #e4e6f0", borderRadius: 20, padding: "2.5rem", marginBottom: "1.5rem", textAlign: "center", boxShadow: "0 4px 24px #6c47ff08" }}>
          <div style={{ width: 148, height: 148, borderRadius: "50%", margin: "0 auto 1.75rem", background: `conic-gradient(${resultColor} 0% ${score}%, #f0f1f8 ${score}% 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 32px ${resultColor}25` }}>
            <div style={{ width: 116, height: 116, borderRadius: "50%", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span className="font-mono-data" style={{ fontSize: "2.25rem", color: resultColor, fontWeight: 700, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: "0.65rem", color: "#adb5d0", marginTop: "0.125rem" }}>/ 100</span>
            </div>
          </div>

          {/* Pass / Fail badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: passed ? "#f0fdf4" : "#fef2f2", border: `1px solid ${passed ? "#22c55e40" : "#ef444440"}`, padding: "0.375rem 1rem", borderRadius: 100, marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.85rem" }}>{passed ? "✓" : "✗"}</span>
            <span className="font-display" style={{ fontSize: "0.72rem", fontWeight: 700, color: passed ? "#16a34a" : "#dc2626", letterSpacing: "0.05em" }}>
              {passed ? "LEVEL PASSED" : "NOT PASSED YET"}
            </span>
          </div>

          <h2 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.75rem" }}>{resultLabel}</h2>

          {/* AI Feedback */}
          <div style={{ background: "linear-gradient(135deg,#6c47ff06,#00b4d804)", border: "1px solid #6c47ff18", borderRadius: 10, padding: "1rem 1.25rem", textAlign: "left", marginBottom: "1.5rem" }}>
            <div className="font-display" style={{ fontSize: "0.62rem", color: "#6c47ff", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "0.5rem" }}>AI FEEDBACK</div>
            <p style={{ fontSize: "0.875rem", color: "#1e2240", lineHeight: 1.75, margin: 0 }}>{feedback}</p>
          </div>

          {/* Missed points */}
          {missedPoints.length > 0 && (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "1.125rem 1.25rem", textAlign: "left", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
                <span style={{ fontSize: "0.9rem" }}>📌</span>
                <span className="font-display" style={{ fontSize: "0.62rem", color: "#b45309", fontWeight: 700, letterSpacing: "0.08em" }}>KEY POINTS YOU MISSED</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {missedPoints.map((point, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fde68a", border: "1px solid #f59e0b40", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: "0.55rem", color: "#92400e", fontFamily: "'Raleway',sans-serif", fontWeight: 800 }}>{i + 1}</span>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "#78350f", lineHeight: 1.65, margin: 0 }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats row */}
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", paddingTop: "1.25rem", borderTop: "1px solid #f0f1f8" }}>
            <div>
              <div className="font-mono-data" style={{ fontSize: "1.1rem", color: "#6c47ff", fontWeight: 700 }}>{fmt(readTime)}</div>
              <div className="font-display" style={{ fontSize: "0.55rem", color: "#adb5d0", fontWeight: 700, letterSpacing: "0.08em" }}>READ TIME</div>
            </div>
            <div>
              <div className="font-mono-data" style={{ fontSize: "1.1rem", color: resultColor, fontWeight: 700 }}>{score}%</div>
              <div className="font-display" style={{ fontSize: "0.55rem", color: "#adb5d0", fontWeight: 700, letterSpacing: "0.08em" }}>SCORE</div>
            </div>
            <div>
              <div className="font-mono-data" style={{ fontSize: "1.1rem", color: passed ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{passed ? "PASS" : "FAIL"}</div>
              <div className="font-display" style={{ fontSize: "0.55rem", color: "#adb5d0", fontWeight: 700, letterSpacing: "0.08em" }}>RESULT</div>
            </div>
          </div>
        </div>

        {/* Level unlocked banner */}
        {passed && hasNext && (
          <div style={{ background: "linear-gradient(135deg,#22c55e12,#00b4d808)", border: "1px solid #22c55e30", borderRadius: 12, padding: "1rem 1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🔓</span>
            <div>
              <div className="font-display" style={{ fontSize: "0.72rem", color: "#16a34a", fontWeight: 700, letterSpacing: "0.05em" }}>LEVEL UNLOCKED</div>
              <div style={{ fontSize: "0.875rem", color: "#0f1120", fontWeight: 600 }}>Level {nextLevel} is now available — {LEVELS[nextLevel - 1]?.wordTarget}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
          {passed && hasNext ? (
            <button className="btn-primary" style={{ padding: "0.875rem 2rem" }} onClick={() => startLevel(nextLevel)}>
              Start Level {nextLevel} →
            </button>
          ) : !passed ? (
            <button className="btn-primary" style={{ padding: "0.875rem 2rem" }} onClick={() => startLevel(selectedLevel)}>
              Retry Level {selectedLevel}
            </button>
          ) : null}
          <button className="btn-ghost" style={{ padding: "0.875rem 2rem" }} onClick={() => setPhase("levels")}>
            Back to Levels
          </button>
          <button className="btn-ghost" style={{ padding: "0.875rem 2rem" }} onClick={onBack}>
            Choose Genre
          </button>
        </div>
      </div>
    );
  }

  return null;
}
