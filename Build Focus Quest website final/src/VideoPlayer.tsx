import { useEffect, useRef, useState, useCallback } from "react";
import type { LevelVideo } from "./data/videos";
import { analyzeVideoSummary, type VideoAnalysisResult } from "./lib/auth";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const LEVEL_COLORS = ["#22c55e", "#00b4d8", "#6c47ff", "#a855f7", "#f59e0b"];

function pauseWindow(level: number): number {
  if (level === 1) return 60;
  if (level === 5) return 180;
  return 120;
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

interface VideoPlayerProps {
  video: LevelVideo;
  level?: number;
  topicLabel?: string;
  onBack: () => void;
  onComplete: (watchedSecs: number) => void;
}

type Phase = "pre" | "active" | "done";

export default function VideoPlayer({ video, level = 1, topicLabel = "", onBack, onComplete }: VideoPlayerProps) {
  const levelColor         = LEVEL_COLORS[(level - 1) % LEVEL_COLORS.length];
  const playerContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef          = useRef<any>(null);
  const intervalRef        = useRef<ReturnType<typeof setInterval> | null>(null);

  const watchedSecsRef = useRef(0);
  const pauseCountRef  = useRef(0);
  const isPlayingRef   = useRef(false);
  const phaseRef       = useRef<Phase>("pre");

  const [phase, setPhase]             = useState<Phase>("pre");
  const [alreadyWatched, setAlreadyWatched] = useState(false);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [watchedSecs, setWatchedSecs] = useState(0);
  const [pauseCount, setPauseCount]   = useState(0);
  const [exitBlocked, setExitBlocked] = useState(false);
  const [exitWarning, setExitWarning] = useState(false);
  const [blockedMsg, setBlockedMsg]   = useState("");
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Actual duration read from YouTube API
  const [actualDuration, setActualDuration] = useState(video.duration);
  const [actualDurationSecs, setActualDurationSecs] = useState(video.durationSecs);

  // Summary box state
  const [summary, setSummary]             = useState("");
  const [summarySubmitted, setSummarySubmitted] = useState(false);
  const [aiAnalyzing, setAiAnalyzing]     = useState(false);
  const [aiResult, setAiResult]           = useState<VideoAnalysisResult | null>(null);
  const [showScorecard, setShowScorecard] = useState(false);

  // Sync refs
  useEffect(() => { watchedSecsRef.current = watchedSecs; }, [watchedSecs]);
  useEffect(() => { pauseCountRef.current  = pauseCount; }, [pauseCount]);
  useEffect(() => { isPlayingRef.current   = isPlaying; }, [isPlaying]);
  useEffect(() => { phaseRef.current       = phase; }, [phase]);

  useEffect(() => {
    if (localStorage.getItem(`fq_vid_${video.youtubeId}`)) setAlreadyWatched(true);
  }, [video.youtubeId]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setWatchedSecs((s) => { watchedSecsRef.current = s + 1; return s + 1; });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const markWatched = useCallback(() => {
    localStorage.setItem(`fq_vid_${video.youtubeId}`, "1");
  }, [video.youtubeId]);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlayingRef.current) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, []);

  const onPlayerStateChange = useCallback((event: { data: number }) => {
    const { data } = event;

    if (data === 1) {
      setPhase("active");
      setIsPlaying(true);
      setExitBlocked(true);
      setBlockedMsg("");
      startTimer();
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }

    if (data === 2) {
      stopTimer();
      setIsPlaying(false);
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

      if (phaseRef.current !== "active") return;

      const elapsed = watchedSecsRef.current;
      const window  = pauseWindow(level);
      const allowed = Math.floor(elapsed / window);
      const used    = pauseCountRef.current;

      if (used >= allowed) {
        const ruleText = level === 1 ? "1 pause per minute" : level === 5 ? "1 pause per 3 minutes" : "1 pause per 2 minutes";
        const msg = allowed === 0
          ? `No pause credits yet — this level allows ${ruleText} of focused watching.`
          : "Pause limit reached for this interval. Video will resume.";
        setBlockedMsg(msg);
        setTimeout(() => {
          try { playerRef.current?.playVideo(); } catch {/* */}
          setBlockedMsg("");
        }, 2000);
      } else {
        setPauseCount((c) => { pauseCountRef.current = c + 1; return c + 1; });
      }
    }

    if (data === 0) {
      stopTimer();
      setIsPlaying(false);
      setExitBlocked(false);
      setPhase("done");
      setShowControls(false);
      markWatched();
    }
  }, [startTimer, stopTimer, markWatched, level]);

  const handlePlayPause = useCallback(() => {
    showControlsTemporarily();
    if (isPlayingRef.current) {
      try { playerRef.current?.pauseVideo(); } catch {/* */}
    } else {
      try { playerRef.current?.playVideo(); } catch {/* */}
    }
  }, [showControlsTemporarily]);

  useEffect(() => {
    if (alreadyWatched) return;

    const initPlayer = () => {
      if (!playerContainerRef.current) return;
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: video.youtubeId,
        width: "100%",
        height: "100%",
        playerVars: {
          controls: 0, disablekb: 1, rel: 0, modestbranding: 1,
          fs: 0, iv_load_policy: 3, playsinline: 1, enablejsapi: 1,
        },
        events: {
          onReady: (e: { target: any }) => {
            playerRef.current = e.target;
            // Read actual duration from YouTube
            const secs = Math.round(e.target.getDuration());
            if (secs > 0) {
              setActualDurationSecs(secs);
              setActualDuration(fmtTime(secs));
            }
          },
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.getElementById("yt-api-script")) {
        const tag = document.createElement("script");
        tag.id = "yt-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      stopTimer();
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      try { playerRef.current?.destroy(); } catch {/* */}
    };
  }, [video.youtubeId, alreadyWatched, onPlayerStateChange, stopTimer]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (exitBlocked) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [exitBlocked]);

  const allowedPauses   = Math.floor(watchedSecs / pauseWindow(level));
  const pausesRemaining = Math.max(0, allowedPauses - pauseCount);

  /* ── Already watched ── */
  if (alreadyWatched) return (
    <div style={{ maxWidth: 640 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#adb5d0", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", fontFamily: "'Raleway',sans-serif", fontWeight: 600, padding: 0 }}>← Back</button>
      <div style={{ background: "#faf5ff", border: "1.5px solid #a855f730", borderRadius: 20, padding: "3rem 2rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
        <h2 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.75rem" }}>Already Watched</h2>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.75, maxWidth: 380, margin: "0 auto 2rem" }}>
          <strong style={{ color: "#0f1120" }}>{video.title}</strong> has been watched and cannot be replayed.
        </p>
        <button className="btn-ghost" style={{ padding: "0.75rem 2rem" }} onClick={onBack}>← Choose Another Topic</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 780 }}>
      {/* Back */}
      <button
        onClick={() => exitBlocked ? setExitWarning(true) : onBack()}
        style={{ background: "none", border: "none", color: exitBlocked ? "#c4c9de" : "#adb5d0", fontSize: "0.85rem", cursor: exitBlocked ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", fontFamily: "'Raleway',sans-serif", fontWeight: 600, padding: 0 }}
        onMouseEnter={(e) => { if (!exitBlocked) e.currentTarget.style.color = "#a855f7"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = exitBlocked ? "#c4c9de" : "#adb5d0"; }}
      >
        ← Back {exitBlocked && <span style={{ fontSize: "0.72rem", color: "#ef4444" }}>· Locked during playback</span>}
      </button>

      {/* Header badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: `${levelColor}12`, border: `1px solid ${levelColor}35`, padding: "0.2rem 0.75rem", borderRadius: 100 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: levelColor }} />
          <span className="font-display" style={{ fontSize: "0.62rem", fontWeight: 700, color: levelColor, letterSpacing: "0.08em" }}>
            LEVEL {level} · {actualDuration}
          </span>
        </div>
        {topicLabel && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#a855f710", border: "1px solid #a855f725", padding: "0.2rem 0.75rem", borderRadius: 100 }}>
            <span className="font-display" style={{ fontSize: "0.62rem", fontWeight: 700, color: "#a855f7", letterSpacing: "0.08em" }}>🎬 {topicLabel.toUpperCase()}</span>
          </div>
        )}
      </div>

      <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f1120", marginBottom: "0.4rem" }}>{video.title}</h1>
      <p style={{ fontSize: "0.84rem", color: "#6b7280", marginBottom: "1.5rem", lineHeight: 1.7 }}>{video.description}</p>

      {/* Rules */}
      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {[
          { icon: "🚫", text: "Can't exit mid-watch" },
          { icon: "⏸️", text: level === 1 ? "1 pause per minute" : level === 5 ? "1 pause per 3 min" : "1 pause per 2 min" },
          { icon: "🎯", text: "One-time watch only" },
          { icon: "📝", text: "Summary required after" },
        ].map((r) => (
          <div key={r.text} style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "#faf5ff", border: "1px solid #a855f720", borderRadius: 8, padding: "0.35rem 0.75rem" }}>
            <span style={{ fontSize: "0.8rem" }}>{r.icon}</span>
            <span style={{ fontSize: "0.72rem", color: "#6b7280", fontFamily: "'Raleway',sans-serif", fontWeight: 600 }}>{r.text}</span>
          </div>
        ))}
      </div>

      {/* Blocked toast */}
      {blockedMsg && (
        <div style={{ background: "#fef3c7", border: "1px solid #f59e0b40", borderRadius: 10, padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <span style={{ fontSize: "0.8rem", color: "#92400e", lineHeight: 1.55 }}>{blockedMsg}</span>
        </div>
      )}

      {/* Exit warning */}
      {exitWarning && (
        <div style={{ position: "fixed", inset: 0, background: "#0f112070", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ background: "#ffffff", borderRadius: 18, padding: "2.5rem", maxWidth: 400, width: "90%", boxShadow: "0 24px 60px #00000020", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚫</div>
            <h3 className="font-display" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.625rem" }}>Can't Exit During Playback</h3>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Exiting now marks this video as watched. You won't be able to replay it. Continue anyway?
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button className="btn-ghost" style={{ padding: "0.625rem 1.5rem" }} onClick={() => setExitWarning(false)}>Keep Watching</button>
              <button
                style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 9, padding: "0.625rem 1.5rem", cursor: "pointer", fontFamily: "'Raleway',sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                onClick={() => { markWatched(); stopTimer(); onBack(); }}
              >Exit Anyway</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Video container ── */}
      <div
        style={{ position: "relative", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", background: "#000", border: "2px solid #e4e6f0", boxShadow: "0 8px 32px #00000018" }}
        onMouseMove={showControlsTemporarily}
        onTouchStart={showControlsTemporarily}
      >
        <div ref={playerContainerRef} style={{ width: "100%", height: "100%" }} />

        {/* Click-block overlay */}
        {phase === "active" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10 }} onContextMenu={(e) => e.preventDefault()} />
        )}

        {/* Custom controls overlay */}
        {phase === "active" && (
          <div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
              background: "linear-gradient(transparent, rgba(0,0,0,0.78))",
              padding: "2.5rem 1.25rem 0.875rem",
              display: "flex", alignItems: "center", gap: "0.875rem",
              opacity: showControls ? 1 : 0,
              transition: "opacity 0.4s",
              pointerEvents: showControls ? "auto" : "none",
            }}
          >
            <button
              onClick={handlePlayPause}
              style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.3)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.15s", padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.30)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="2" width="4" height="12" rx="1.5" fill="#fff"/>
                  <rect x="9" y="2" width="4" height="12" rx="1.5" fill="#fff"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2.5l10 5.5-10 5.5V2.5z" fill="#fff"/>
                </svg>
              )}
            </button>

            <span className="font-mono-data" style={{ color: "#ffffffcc", fontSize: "0.82rem", minWidth: 40 }}>
              {fmtTime(watchedSecs)}
            </span>
            <span className="font-mono-data" style={{ color: "#ffffff50", fontSize: "0.75rem" }}>/ {actualDuration}</span>

            <div style={{ flex: 1 }} />

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "0.25rem 0.65rem", border: "1px solid rgba(255,255,255,0.18)" }}>
              <span style={{ fontSize: "0.7rem" }}>⏸️</span>
              <span style={{ fontSize: "0.7rem", color: pausesRemaining > 0 ? "#86efac" : "#fca5a5", fontFamily: "'Raleway',sans-serif", fontWeight: 700 }}>
                {pausesRemaining > 0 ? `${pausesRemaining} pause${pausesRemaining > 1 ? "s" : ""} left` : "No pauses left"}
              </span>
            </div>
          </div>
        )}

        {/* Pre-play overlay */}
        {phase === "pre" && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1a0e3a,#0f1120)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
            <div
              style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#a855f7,#6c47ff)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", boxShadow: "0 8px 32px #a855f750", cursor: "pointer", transition: "transform 0.2s" }}
              onClick={() => { try { playerRef.current?.playVideo(); } catch {/* */} }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 5l18 9-18 9V5z" fill="#fff"/></svg>
            </div>
            <h3 className="font-display" style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.375rem" }}>{video.title}</h3>
            <p style={{ fontSize: "0.78rem", color: "#ffffff70", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
              Click to begin · {actualDuration} · You cannot exit until finished.
            </p>
          </div>
        )}

        {/* Done overlay — locked screen inside player */}
        {phase === "done" && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#0d1a0d,#0f1120)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
            <h3 className="font-display" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.4rem" }}>Video Complete</h3>
            <p style={{ fontSize: "0.8rem", color: "#ffffff70", textAlign: "center", maxWidth: 260, lineHeight: 1.6 }}>
              Write your summary below to unlock navigation.
            </p>
          </div>
        )}
      </div>

      {/* ── Scorecard popup modal ── */}
      {showScorecard && aiResult && (
        <ScorecardModal result={aiResult} videoTitle={video.title} onClose={() => setShowScorecard(false)} onBack={onBack} />
      )}

      {/* Stats bar */}
      {phase === "active" && (
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.875rem", flexWrap: "wrap" }}>
          <Stat label="Watch Time"       value={fmtTime(watchedSecs)} color="#6c47ff" />
          <Stat label="Pauses Used"      value={`${pauseCount}`}      color="#a855f7" />
          <Stat label="Pauses Left"      value={`${pausesRemaining}`} color={pausesRemaining === 0 ? "#ef4444" : "#22c55e"} />
          <Stat label="Next Unlock In"   value={fmtTime(Math.max(0, (pauseCount + 1) * pauseWindow(level) - watchedSecs))} color="#00b4d8" />
        </div>
      )}

      {/* ── Summary box — appears after video ends ── */}
      {phase === "done" && (
        <div style={{ marginTop: "1.5rem", background: "#ffffff", border: "2px solid #6c47ff30", borderRadius: 16, padding: "1.75rem", boxShadow: "0 4px 24px #6c47ff10" }}>
          {!summarySubmitted ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6c47ff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "1rem" }}>📝</span>
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f1120" }}>Write Your Summary</div>
                  <div style={{ fontSize: "0.72rem", color: "#adb5d0" }}>Summarise what you just watched in your own words</div>
                </div>
              </div>

              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={`Summarise "${video.title}" in your own words. Cover the key ideas, main argument, and anything that surprised you...`}
                style={{
                  width: "100%", minHeight: 130, resize: "vertical",
                  border: "1.5px solid #e4e6f0", borderRadius: 10, padding: "0.875rem 1rem",
                  fontSize: "0.875rem", color: "#0f1120", lineHeight: 1.7,
                  fontFamily: "'Inter',sans-serif", outline: "none", boxSizing: "border-box",
                  background: "#f8f9ff", transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6c47ff")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e6f0")}
              />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.72rem", color: summary.trim().length < 30 ? "#f59e0b" : "#22c55e", fontFamily: "'Raleway',sans-serif", fontWeight: 700 }}>
                  {summary.trim().length < 30
                    ? `${Math.max(0, 30 - summary.trim().length)} more characters needed`
                    : `✓ ${summary.trim().length} characters`}
                </span>
                <div style={{ display: "flex", gap: "0.625rem" }}>
                  <button
                    className="btn-ghost"
                    style={{ padding: "0.625rem 1.25rem", fontSize: "0.8rem" }}
                    onClick={onBack}
                  >
                    Skip & Exit
                  </button>
                  <button
                    style={{
                      background: summary.trim().length >= 30 ? "linear-gradient(135deg,#6c47ff,#a855f7)" : "#e4e6f0",
                      color: summary.trim().length >= 30 ? "#fff" : "#adb5d0",
                      border: "none", borderRadius: 9, padding: "0.625rem 1.5rem",
                      cursor: summary.trim().length >= 30 ? "pointer" : "not-allowed",
                      fontFamily: "'Raleway',sans-serif", fontWeight: 800, fontSize: "0.85rem",
                      transition: "all 0.2s",
                    }}
                    disabled={summary.trim().length < 30}
                    onClick={async () => {
                      setSummarySubmitted(true);
                      onComplete(watchedSecs);
                      setAiAnalyzing(true);
                      try {
                        const result = await analyzeVideoSummary(video.title, topicLabel, summary);
                        setAiResult(result);
                        setShowScorecard(true);
                      } catch {
                        setAiResult({ similarity: 0, feedback: "Analysis unavailable. Please try again later.", coveredPoints: [], missingPoints: [] });
                        setShowScorecard(true);
                      } finally {
                        setAiAnalyzing(false);
                      }
                    }}
                  >
                    Submit Summary →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              {aiAnalyzing ? (
                <>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎉</div>
                  <h3 className="font-display" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.5rem" }}>Summary Submitted!</h3>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: "#f0edff", border: "1.5px solid #6c47ff30", borderRadius: 12, padding: "0.875rem 1.5rem", marginBottom: "1.25rem" }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
                      <circle cx="10" cy="10" r="8" stroke="#6c47ff40" strokeWidth="2.5" fill="none"/>
                      <path d="M10 2a8 8 0 0 1 8 8" stroke="#6c47ff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    </svg>
                    <span className="font-display" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#6c47ff" }}>AI is analysing your summary…</span>
                  </div>
                  <div><button className="btn-ghost" style={{ padding: "0.625rem 1.5rem" }} onClick={onBack}>← Back to Topics</button></div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎉</div>
                  <h3 className="font-display" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.5rem" }}>Summary Submitted!</h3>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.75, marginBottom: "1.25rem" }}>
                    Your summary has been recorded and analysed by AI.
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <button className="btn-ghost" style={{ padding: "0.75rem 1.5rem" }} onClick={onBack}>← Back to Topics</button>
                    {aiResult && (
                      <button
                        style={{ background: "linear-gradient(135deg,#6c47ff,#a855f7)", color: "#fff", border: "none", borderRadius: 9, padding: "0.75rem 1.75rem", cursor: "pointer", fontFamily: "'Raleway',sans-serif", fontWeight: 800, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
                        onClick={() => setShowScorecard(true)}
                      >
                        <span>📊</span> View Scorecard
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e4e6f0", borderRadius: 10, padding: "0.6rem 1rem", minWidth: 110 }}>
      <div style={{ fontSize: "0.58rem", color: "#adb5d0", fontFamily: "'Raleway',sans-serif", fontWeight: 700, letterSpacing: "0.07em", marginBottom: "0.15rem" }}>{label.toUpperCase()}</div>
      <div className="font-mono-data" style={{ fontSize: "0.95rem", fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function ScorecardModal({
  result,
  videoTitle,
  onClose,
  onBack,
}: {
  result: VideoAnalysisResult;
  videoTitle: string;
  onClose: () => void;
  onBack: () => void;
}) {
  const { similarity, feedback, coveredPoints, missingPoints } = result;
  const color = similarity >= 75 ? "#22c55e" : similarity >= 50 ? "#f59e0b" : "#ef4444";
  const bgColor = similarity >= 75 ? "#f0fdf4" : similarity >= 50 ? "#fffbeb" : "#fef2f2";
  const borderColor = similarity >= 75 ? "#22c55e30" : similarity >= 50 ? "#f59e0b30" : "#ef444430";
  const label = similarity >= 75 ? "Excellent" : similarity >= 50 ? "Good Effort" : "Needs Work";
  const emoji = similarity >= 75 ? "🏆" : similarity >= 50 ? "📚" : "💡";

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (similarity / 100) * circumference;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15,17,32,0.72)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: "1rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#ffffff", borderRadius: 24, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", position: "relative" }}>
        {/* Header band */}
        <div style={{ background: `linear-gradient(135deg, #6c47ff, #a855f7)`, borderRadius: "24px 24px 0 0", padding: "1.75rem 2rem 1.5rem", position: "relative" }}>
          <button
            onClick={onClose}
            style={{ position: "absolute", top: "1rem", right: "1rem", width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem", lineHeight: 1 }}
          >×</button>
          <div style={{ fontSize: "0.65rem", fontFamily: "'Raleway',sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", marginBottom: "0.375rem" }}>AI SCORECARD</div>
          <h2 className="font-display" style={{ fontSize: "1.1rem", fontWeight: 900, color: "#ffffff", margin: 0, lineHeight: 1.4, maxWidth: "calc(100% - 2.5rem)" }}>{videoTitle}</h2>
        </div>

        <div style={{ padding: "1.75rem 2rem" }}>
          {/* Score row */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.75rem", marginBottom: "1.5rem", background: bgColor, border: `2px solid ${borderColor}`, borderRadius: 16, padding: "1.25rem 1.5rem" }}>
            {/* Circular gauge */}
            <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke={`${color}25`} strokeWidth="10"/>
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={color} strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className="font-mono-data" style={{ fontSize: "1.8rem", fontWeight: 900, color, lineHeight: 1 }}>{similarity}</div>
                <div style={{ fontSize: "0.6rem", color: "#adb5d0", fontFamily: "'Raleway',sans-serif", fontWeight: 700, letterSpacing: "0.08em" }}>/ 100</div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 20, padding: "0.25rem 0.875rem", marginBottom: "0.625rem" }}>
                <span style={{ fontSize: "0.9rem" }}>{emoji}</span>
                <span className="font-display" style={{ fontSize: "0.72rem", fontWeight: 800, color, letterSpacing: "0.07em" }}>{label.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "#374151", lineHeight: 1.75, margin: 0 }}>{feedback}</p>
            </div>
          </div>

          {/* Covered points */}
          {coveredPoints.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.65rem" }}>✓</span>
                </div>
                <span className="font-display" style={{ fontSize: "0.72rem", fontWeight: 800, color: "#15803d", letterSpacing: "0.06em" }}>POINTS YOU COVERED</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {coveredPoints.map((pt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "0.5rem 0.75rem" }}>
                    <span style={{ color: "#22c55e", fontSize: "0.8rem", flexShrink: 0, marginTop: "0.05rem" }}>✓</span>
                    <span style={{ fontSize: "0.82rem", color: "#166534", lineHeight: 1.55 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing points */}
          {missingPoints.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.65rem" }}>✗</span>
                </div>
                <span className="font-display" style={{ fontSize: "0.72rem", fontWeight: 800, color: "#b91c1c", letterSpacing: "0.06em" }}>POINTS YOU MISSED</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {missingPoints.map((pt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.5rem 0.75rem" }}>
                    <span style={{ color: "#ef4444", fontSize: "0.8rem", flexShrink: 0, marginTop: "0.05rem" }}>✗</span>
                    <span style={{ fontSize: "0.82rem", color: "#7f1d1d", lineHeight: 1.55 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Score bar */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
              <span style={{ fontSize: "0.68rem", color: "#adb5d0", fontFamily: "'Raleway',sans-serif", fontWeight: 700, letterSpacing: "0.06em" }}>COVERAGE</span>
              <span className="font-mono-data" style={{ fontSize: "0.72rem", color, fontWeight: 700 }}>{similarity}%</span>
            </div>
            <div style={{ height: 8, background: "#f0f1f8", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${similarity}%`, background: `linear-gradient(90deg, ${color}99, ${color})`, borderRadius: 4, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
              <span style={{ fontSize: "0.6rem", color: "#ef444480", fontFamily: "'Raleway',sans-serif", fontWeight: 600 }}>0</span>
              <span style={{ fontSize: "0.6rem", color: "#f59e0b80", fontFamily: "'Raleway',sans-serif", fontWeight: 600 }}>50</span>
              <span style={{ fontSize: "0.6rem", color: "#22c55e80", fontFamily: "'Raleway',sans-serif", fontWeight: 600 }}>100</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button className="btn-ghost" style={{ padding: "0.75rem 1.25rem" }} onClick={onClose}>Close</button>
            <button
              style={{ background: "linear-gradient(135deg,#6c47ff,#a855f7)", color: "#fff", border: "none", borderRadius: 9, padding: "0.75rem 1.75rem", cursor: "pointer", fontFamily: "'Raleway',sans-serif", fontWeight: 800, fontSize: "0.85rem" }}
              onClick={() => { onClose(); onBack(); }}
            >
              ← Back to Topics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
