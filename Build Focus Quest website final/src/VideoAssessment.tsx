import { useState, useEffect } from "react";
import { getVideoTree, hasVideoTree, VIDEO_LEVELS } from "./data/videos";
import type { VideoCategory, VideoTopic, VideoNode, LevelVideo } from "./data/videos";
import SubcategorySelect from "./SubcategorySelect";
import VideoPlayer from "./VideoPlayer";
import { getVideoProgress, saveVideoProgress } from "./lib/auth";
import { saveSession } from "./lib/sessions";

interface VideoAssessmentProps {
  genre: string;
  userId?: string;
  onBack: () => void;
}

type Phase = "levels" | "browse" | "playing";

interface NavFrame { node: VideoCategory; label: string; }

const LEVEL_COLORS = ["#22c55e", "#00b4d8", "#6c47ff", "#a855f7", "#f59e0b"];

export default function VideoAssessment({ genre, userId, onBack }: VideoAssessmentProps) {
  const tree    = getVideoTree(genre);
  const hasTree = hasVideoTree(genre);

  const [phase, setPhase]           = useState<Phase>("levels");
  const [selectedLevel, setLevel]   = useState(1);
  const [stack, setStack]           = useState<NavFrame[]>([]);
  const [playing, setPlaying]       = useState<LevelVideo | null>(null);
  const [topicLabel, setTopicLabel] = useState("");
  const [progress, setProgress]     = useState<Record<string, number>>({});
  const [loadingProg, setLoadingProg] = useState(true);

  const genreLabel = genre.charAt(0).toUpperCase() + genre.slice(1);

  useEffect(() => {
    if (userId) setProgress(getVideoProgress(userId));
    setLoadingProg(false);
  }, [userId]);

  const highestPassed = progress[genre] ?? 0;

  const handleLevelSelect = (lvl: number) => {
    setLevel(lvl);
    setStack([]);
    setPhase("browse");
  };

  const handleNodeSelect = (child: VideoNode) => {
    if (child.kind === "category") {
      setStack((prev) => [...prev, { node: child, label: child.label }]);
    } else {
      const topic = child as VideoTopic;
      const vid   = topic.videos.find((v) => v.level === selectedLevel);
      if (vid) {
        setTopicLabel(topic.label);
        setPlaying(vid);
        setPhase("playing");
      }
    }
  };

  const handleBrowseBack = () => {
    if (stack.length === 0) setPhase("levels");
    else setStack((prev) => prev.slice(0, -1));
  };

  const handleVideoComplete = (watchedSecs: number) => {
    if (userId) {
      saveVideoProgress(userId, genre, selectedLevel);
      setProgress(getVideoProgress(userId));
      saveSession({
        userId,
        date: new Date().toISOString(),
        genre,
        mode: "video",
        level: selectedLevel,
        score: 100,
        passed: true,
        durationSecs: watchedSecs,
        retention: "remembered",
        missedPointsCount: 0,
      });
    }
    setPlaying(null);
    setPhase("levels");
  };

  /* ── No tree for this genre ── */
  if (!hasTree) return (
    <div style={{ maxWidth: 640 }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#adb5d0", fontSize:"0.85rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"2rem", fontFamily:"'Raleway',sans-serif", fontWeight:600, padding:0 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#a855f7")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#adb5d0")}
      >← Back</button>
      <div style={{ borderRadius:16, overflow:"hidden", background:"#f0f1f8", border:"1.5px solid #e4e6f0", marginBottom:"1.5rem", position:"relative", aspectRatio:"16/9", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#a855f7,#6c47ff)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.25rem", boxShadow:"0 8px 28px #a855f740" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 6l16 8-16 8V6z" fill="#fff"/></svg>
        </div>
        <h3 className="font-display" style={{ fontSize:"1rem", fontWeight:800, color:"#0f1120", marginBottom:"0.5rem" }}>Videos Coming Soon</h3>
        <p style={{ fontSize:"0.82rem", color:"#adb5d0", maxWidth:320, textAlign:"center", lineHeight:1.65 }}>Curated {genreLabel} videos are being reviewed. Try the Text Assessment instead.</p>
      </div>
      <button className="btn-ghost" style={{ padding:"0.875rem 2rem" }} onClick={onBack}>← Switch to Text Assessment</button>
    </div>
  );

  /* ── Video playing ── */
  if (phase === "playing" && playing) return (
    <VideoPlayer
      video={playing}
      level={selectedLevel}
      topicLabel={topicLabel}
      onBack={() => { setPlaying(null); setPhase("browse"); }}
      onComplete={(secs) => handleVideoComplete(secs)}
    />
  );

  /* ── Browse subcategories ── */
  if (phase === "browse") {
    const levelCfg = VIDEO_LEVELS[selectedLevel - 1];
    const currentNode: VideoCategory = stack.length > 0
      ? stack[stack.length - 1].node
      : { kind:"category", id:genre, label:genreLabel, icon:"🎬", grad:"linear-gradient(135deg,#a855f7,#6c47ff)", children:tree };

    const breadcrumb = [genreLabel, ...stack.map((f) => f.label)];

    return (
      <div>
        {/* Level badge strip */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"1.75rem", flexWrap:"wrap" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:`${levelCfg.color}12`, border:`1px solid ${levelCfg.color}35`, padding:"0.35rem 0.9rem", borderRadius:100 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:levelCfg.color }} />
            <span className="font-display" style={{ fontSize:"0.68rem", fontWeight:700, color:levelCfg.color, letterSpacing:"0.07em" }}>LEVEL {selectedLevel} · {levelCfg.duration.toUpperCase()} VIDEOS</span>
          </div>
          <button onClick={() => { setPhase("levels"); setStack([]); }} style={{ background:"none", border:"1px solid #e4e6f0", borderRadius:8, padding:"0.3rem 0.75rem", cursor:"pointer", fontFamily:"'Raleway',sans-serif", fontWeight:600, fontSize:"0.72rem", color:"#6b7280" }}>
            ← Change Level
          </button>
        </div>

        <SubcategorySelect
          node={currentNode}
          breadcrumb={breadcrumb}
          selectedLevel={selectedLevel}
          onSelect={handleNodeSelect}
          onBack={handleBrowseBack}
        />
      </div>
    );
  }

  /* ── Level select ── */
  return (
    <div style={{ maxWidth: 700 }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#adb5d0", fontSize:"0.85rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"2rem", fontFamily:"'Raleway',sans-serif", fontWeight:600, transition:"color 0.15s", padding:0 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#a855f7")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#adb5d0")}
      >← Back</button>

      <div style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", background:"#a855f710", border:"1px solid #a855f725", padding:"0.2rem 0.75rem", borderRadius:100, marginBottom:"1rem" }}>
        <span className="font-display" style={{ fontSize:"0.62rem", fontWeight:700, color:"#a855f7", letterSpacing:"0.08em" }}>🎬 VIDEO ASSESSMENT · {genreLabel.toUpperCase()}</span>
      </div>

      <h1 className="font-display" style={{ fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:900, color:"#0f1120", marginBottom:"0.5rem" }}>Choose Your Level</h1>
      <p style={{ fontSize:"0.9rem", color:"#6b7280", marginBottom:"2.25rem", lineHeight:1.7, maxWidth:500 }}>
        Each level uses longer, more in-depth videos. Complete a level to unlock the next.
      </p>

      {loadingProg ? (
        <div style={{ color:"#adb5d0", fontSize:"0.875rem" }}>Loading progress…</div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
          {VIDEO_LEVELS.map(({ level, label, duration, color, desc }) => {
            const unlocked = level === 1 || highestPassed >= level - 1;
            const passed   = highestPassed >= level;
            const active   = selectedLevel === level;
            return (
              <button
                key={level}
                onClick={() => unlocked && handleLevelSelect(level)}
                disabled={!unlocked}
                style={{
                  background: unlocked ? "#ffffff" : "#f8f9ff",
                  border: `1.5px solid ${active ? color : unlocked ? "#e4e6f0" : "#f0f1f8"}`,
                  borderRadius: 14,
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  cursor: unlocked ? "pointer" : "not-allowed",
                  opacity: unlocked ? 1 : 0.5,
                  transition: "all 0.2s",
                  textAlign: "left",
                  boxShadow: active ? `0 4px 20px ${color}18` : "none",
                }}
                onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 20px ${color}18`; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = unlocked ? "#e4e6f0" : "#f0f1f8"; e.currentTarget.style.boxShadow = "none"; } }}
              >
                {/* Level badge */}
                <div style={{ width:48, height:48, borderRadius:12, background:unlocked ? `${color}15` : "#f0f1f8", border:`2px solid ${unlocked ? color : "#e4e6f0"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {passed ? (
                    <span style={{ fontSize:"1.25rem" }}>✓</span>
                  ) : unlocked ? (
                    <span className="font-display" style={{ fontSize:"1.1rem", fontWeight:900, color }}>{level}</span>
                  ) : (
                    <span style={{ fontSize:"1.1rem" }}>🔒</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.25rem" }}>
                    <span className="font-display" style={{ fontSize:"0.9rem", fontWeight:800, color:"#0f1120" }}>{label}</span>
                    <span style={{ fontSize:"0.68rem", background:`${color}12`, color, fontFamily:"'Raleway',sans-serif", fontWeight:700, padding:"0.15rem 0.5rem", borderRadius:100, border:`1px solid ${color}25` }}>🎬 {duration}</span>
                    {passed && <span style={{ fontSize:"0.68rem", background:"#22c55e12", color:"#22c55e", fontFamily:"'Raleway',sans-serif", fontWeight:700, padding:"0.15rem 0.5rem", borderRadius:100 }}>✓ Passed</span>}
                  </div>
                  <p style={{ fontSize:"0.8rem", color:"#6b7280", margin:0 }}>{desc}</p>
                </div>

                {/* Arrow */}
                {unlocked && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0 }}>
                    <path d="M6 3l5 5-5 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Info strip */}
      <div style={{ marginTop:"2rem", padding:"1rem 1.25rem", background:"linear-gradient(135deg,#a855f708,#6c47ff06)", border:"1px solid #a855f720", borderRadius:12, display:"flex", gap:"0.75rem", alignItems:"flex-start" }}>
        <span style={{ fontSize:"0.9rem", flexShrink:0 }}>🎬</span>
        <p style={{ fontSize:"0.8rem", color:"#6b7280", lineHeight:1.65, margin:0 }}>
          Videos must be watched <strong style={{ color:"#0f1120" }}>in full</strong> — you cannot exit mid-watch and each video can only be viewed once. Pause credits are based on the <strong style={{ color:"#0f1120" }}>17–40 age group attention span</strong>: you earn <strong style={{ color:"#0f1120" }}>1 pause per 8 minutes</strong> of focused watching.
        </p>
      </div>
    </div>
  );
}
