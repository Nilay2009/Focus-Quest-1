import { useEffect, useRef, useState } from "react";

const PURPLE = "#6c47ff";
const CYAN   = "#00b4d8";
const PINK   = "#a855f7";
const GREEN  = "#22c55e";

/* Each scene: duration in ms, content rendered inside the dark frame */
interface Scene {
  dur: number;
  label: string;
  render: () => React.ReactNode;
}

const TOTAL_MS = 30_000;

const scenes: Scene[] = [
  /* 0 — Opener: brand reveal */
  {
    dur: 4500,
    label: "Brand",
    render: () => (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:"1.25rem", animation:"fadeUp 0.6s ease both" }}>
        <div style={{ width:72, height:72, borderRadius:18, background:"linear-gradient(135deg,#6c47ff,#00b4d8)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 40px #6c47ff60" }}>
          <svg width="36" height="36" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="3" fill="#fff"/>
            <path d="M9 1v2M9 15v2M1 9h2M15 9h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 2"/>
          </svg>
        </div>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.22em", color:"#6c47ff", marginBottom:"0.5rem" }}>INTRODUCING</p>
          <h2 style={{ fontFamily:"'Raleway',sans-serif", fontSize:"clamp(2.2rem,6vw,3.5rem)", fontWeight:900, letterSpacing:"-0.02em", color:"#fff", lineHeight:1 }}>
            Focus<span style={{ background:"linear-gradient(135deg,#6c47ff,#00b4d8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Quest</span>
          </h2>
          <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.58rem", color:"#6c47ff", fontWeight:700, letterSpacing:"0.2em", marginTop:"0.4rem" }}>BY THE ELITES</p>
          <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.85rem", color:"#8890b0", marginTop:"0.5rem", letterSpacing:"0.05em" }}>AI-Powered Cognitive Training</p>
        </div>
      </div>
    ),
  },

  /* 1 — Problem: attention span stat */
  {
    dur: 5000,
    label: "Problem",
    render: () => (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", padding:"0 2rem", textAlign:"center", animation:"fadeUp 0.6s ease both" }}>
        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.2em", color:CYAN, marginBottom:"1rem" }}>THE OPPORTUNITY</p>
        <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:"clamp(3rem,9vw,5.5rem)", fontWeight:900, color:"#fff", lineHeight:1, marginBottom:"0.5rem" }}>
          15–20 <span style={{ fontSize:"clamp(1.5rem,4vw,2.5rem)", color:CYAN }}>min</span>
        </div>
        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"clamp(0.85rem,2.5vw,1.1rem)", color:"#8890b0", maxWidth:420, lineHeight:1.7 }}>
          Average focused attention span for ages 17–40. FocusQuest trains you to own every minute of it.
        </p>
      </div>
    ),
  },

  /* 2 — Solution: how it works */
  {
    dur: 6000,
    label: "Solution",
    render: () => (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", padding:"0 2rem", animation:"fadeUp 0.6s ease both" }}>
        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.2em", color:PURPLE, marginBottom:"1.75rem", textAlign:"center" }}>HOW IT WORKS</p>
        <div style={{ display:"flex", gap:"clamp(1rem,4vw,3rem)", alignItems:"flex-start", flexWrap:"wrap", justifyContent:"center" }}>
          {[
            { icon:"📖", label:"Read or Watch", desc:"Curated content across History, Science & more" },
            { icon:"✍️", label:"Recall & Write", desc:"Summarise what you retained — AI grades you" },
            { icon:"📈", label:"Track & Grow",   desc:"See your focus score rise session by session" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign:"center", maxWidth:140, animation:`fadeUp 0.5s ${i * 0.18}s ease both` }}>
              <div style={{ width:54, height:54, borderRadius:14, background:"#ffffff10", border:"1px solid #ffffff18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", margin:"0 auto 0.75rem" }}>{s.icon}</div>
              <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.78rem", fontWeight:800, color:"#fff", marginBottom:"0.375rem" }}>{s.label}</p>
              <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.68rem", color:"#8890b0", lineHeight:1.55 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* 3 — Feature: adaptive AI */
  {
    dur: 5000,
    label: "AI",
    render: () => (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", padding:"0 2rem", textAlign:"center", animation:"fadeUp 0.6s ease both" }}>
        <div style={{ width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg,${PURPLE}30,${CYAN}20)`, border:`1.5px solid ${PURPLE}40`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.25rem", boxShadow:`0 0 30px ${PURPLE}40` }}>
          <span style={{ fontSize:"1.5rem" }}>🧠</span>
        </div>
        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.2em", color:PURPLE, marginBottom:"0.75rem" }}>ADAPTIVE INTELLIGENCE</p>
        <h3 style={{ fontFamily:"'Raleway',sans-serif", fontSize:"clamp(1.4rem,4vw,2.2rem)", fontWeight:900, color:"#fff", lineHeight:1.2, maxWidth:500, marginBottom:"0.875rem" }}>
          AI That Learns How <em style={{ color:PINK, fontStyle:"normal" }}>You</em> Learn
        </h3>
        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.875rem", color:"#8890b0", maxWidth:400, lineHeight:1.75 }}>
          Every session is scored, analysed, and fed back into your personal cognitive profile — so every challenge is exactly hard enough.
        </p>
      </div>
    ),
  },

  /* 4 — Stats: social proof */
  {
    dur: 5000,
    label: "Stats",
    render: () => (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", padding:"0 2rem", animation:"fadeUp 0.6s ease both" }}>
        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.2em", color:GREEN, marginBottom:"2rem", textAlign:"center" }}>REAL RESULTS</p>
        <div style={{ display:"flex", gap:"clamp(1.5rem,5vw,4rem)", flexWrap:"wrap", justifyContent:"center" }}>
          {[
            { val: 94,  suffix:"%", label:"Report improved retention after 2 weeks",  color:GREEN },
            { val: 3,   suffix:"×", label:"Faster information processing on average",  color:CYAN  },
            { val: 21,  suffix:"d", label:"Average streak for top 10% of users",       color:PINK  },
          ].map((s, i) => (
            <div key={i} style={{ textAlign:"center", animation:`fadeUp 0.5s ${i * 0.2}s ease both` }}>
              <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:"clamp(2.5rem,7vw,4rem)", fontWeight:900, color:s.color, lineHeight:1 }}>
                <CountUp from={0} to={s.val} suffix={s.suffix} />
              </div>
              <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.7rem", color:"#8890b0", maxWidth:130, lineHeight:1.55, marginTop:"0.5rem" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* 5 — CTA: closer */
  {
    dur: 4500,
    label: "CTA",
    render: () => (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:"1rem", animation:"fadeUp 0.6s ease both" }}>
        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.22em", color:"#8890b0" }}>YOUR BRAIN. UPGRADED.</p>
        <h2 style={{ fontFamily:"'Raleway',sans-serif", fontSize:"clamp(1.8rem,5vw,3rem)", fontWeight:900, color:"#fff", textAlign:"center", lineHeight:1.15, maxWidth:520 }}>
          Start Building <span style={{ background:"linear-gradient(135deg,#6c47ff,#00b4d8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Elite Focus</span> Today
        </h2>
        <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem", flexWrap:"wrap", justifyContent:"center" }}>
          {["History","Science","Philosophy","Technology","Mathematics"].map((g) => (
            <span key={g} style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.65rem", fontWeight:700, padding:"0.25rem 0.75rem", borderRadius:100, background:"#ffffff10", border:"1px solid #ffffff18", color:"#b0b8d8", letterSpacing:"0.05em" }}>{g}</span>
          ))}
        </div>
      </div>
    ),
  },
];

/* Precompute cumulative scene start offsets */
const SCENE_STARTS = scenes.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + scenes[i - 1].dur);
  return acc;
}, []);

/* ── Animated counter ── */
function CountUp({ from, to, suffix = "" }: { from: number; to: number; suffix?: string }) {
  const [val, setVal] = useState(from);
  useEffect(() => {
    const dur = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [from, to]);
  return <>{val}{suffix}</>;
}

/* ══ TRAILER PLAYER ══ */
export default function TrailerPlayer() {
  const [playing, setPlaying]   = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [totalElapsed, setTotal] = useState(0);
  const [fading, setFading]     = useState(false);

  /* All mutable loop state lives in refs so the RAF never restarts on re-render */
  const rafRef      = useRef<number>(0);
  const lastTsRef   = useRef<number>(0);
  const totalRef    = useRef<number>(0);   // mirrors totalElapsed but always current
  const playingRef  = useRef<boolean>(false);
  const sceneRef    = useRef<number>(0);
  const fadingRef   = useRef<boolean>(false);

  const totalProgress  = Math.min(totalElapsed / TOTAL_MS, 1);
  const sceneDur       = scenes[sceneIdx].dur;
  const sceneElapsed   = totalElapsed - SCENE_STARTS[sceneIdx];
  const sceneProgress  = Math.min(sceneElapsed / sceneDur, 1);

  /* Single long-lived RAF loop — never torn down while mounted */
  useEffect(() => {
    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (!playingRef.current) return;

      const dt = now - lastTsRef.current;
      lastTsRef.current = now;

      const next = Math.min(totalRef.current + dt, TOTAL_MS);
      totalRef.current = next;
      setTotal(next);

      /* Determine which scene we should be in */
      let idx = SCENE_STARTS.length - 1;
      for (let i = 0; i < SCENE_STARTS.length; i++) {
        if (next < SCENE_STARTS[i] + scenes[i].dur) { idx = i; break; }
      }

      if (idx !== sceneRef.current && !fadingRef.current) {
        fadingRef.current = true;
        setFading(true);
        setTimeout(() => {
          sceneRef.current = idx;
          setSceneIdx(idx);
          fadingRef.current = false;
          setFading(false);
        }, 280);
      }

      if (next >= TOTAL_MS) {
        playingRef.current = false;
        setPlaying(false);
      }
    };
    lastTsRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // runs once — loop never restarts

  const toggle = () => {
    if (!playing && totalProgress >= 1) {
      /* Replay from start */
      totalRef.current = 0;
      sceneRef.current = 0;
      setTotal(0);
      setSceneIdx(0);
    }
    lastTsRef.current = performance.now();
    playingRef.current = !playing;
    setPlaying((p) => !p);
  };

  return (
    <section style={{ padding:"5rem 1.5rem", background:"#0a0b14" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>

        {/* Section label */}
        <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"#6c47ff18", border:"1px solid #6c47ff30", padding:"0.3rem 1rem", borderRadius:100, marginBottom:"1rem" }}>
            <span style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.1em", color:PURPLE }}>WATCH THE TRAILER</span>
          </div>
          <h2 style={{ fontFamily:"'Raleway',sans-serif", fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:900, color:"#fff", letterSpacing:"-0.01em" }}>
            See FocusQuest in Action
          </h2>
        </div>

        {/* Player frame */}
        <div style={{ position:"relative", borderRadius:20, overflow:"hidden", border:"1px solid #ffffff10", boxShadow:"0 32px 80px #00000060, 0 0 0 1px #6c47ff20", aspectRatio:"16/9", background:"#0d0e1c", cursor:"pointer" }}
          onClick={toggle}
        >
          {/* Animated background grid */}
          <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(#6c47ff08 1px,transparent 1px),linear-gradient(90deg,#6c47ff08 1px,transparent 1px)`, backgroundSize:"40px 40px", pointerEvents:"none" }} />

          {/* Ambient glow orbs */}
          <div style={{ position:"absolute", top:"-20%", left:"30%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,#6c47ff18,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"-20%", right:"20%", width:250, height:250, borderRadius:"50%", background:`radial-gradient(circle,${CYAN}12,transparent 70%)`, pointerEvents:"none" }} />

          {/* Scene content */}
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity: fading ? 0 : 1, transition:"opacity 0.35s ease" }}>
            {playing || totalProgress > 0 ? scenes[sceneIdx].render() : (
              /* Poster / idle state */
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"1.5rem", textAlign:"center", padding:"0 2rem" }}>
                <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#6c47ff,#00b4d8)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 50px #6c47ff50" }}>
                  <svg width="30" height="30" viewBox="0 0 28 28" fill="none"><path d="M8 6l16 8-16 8V6z" fill="#fff"/></svg>
                </div>
                <div>
                  <h3 style={{ fontFamily:"'Raleway',sans-serif", fontSize:"clamp(1.2rem,3vw,1.8rem)", fontWeight:900, color:"#fff", marginBottom:"0.375rem" }}>FocusQuest — 30 Second Trailer</h3>
                  <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.82rem", color:"#8890b0" }}>Click to play · No ads · No distractions</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress bar — top */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"#ffffff08" }}>
            <div style={{ height:"100%", background:`linear-gradient(90deg,${PURPLE},${CYAN})`, width:`${totalProgress * 100}%`, transition:"width 0.1s linear", borderRadius:"0 2px 2px 0" }} />
          </div>

          {/* Scene dot indicators */}
          {(playing || totalProgress > 0) && (
            <div style={{ position:"absolute", top:12, left:"50%", transform:"translateX(-50%)", display:"flex", gap:6 }}>
              {scenes.map((_, i) => (
                <div key={i} style={{ width: i === sceneIdx ? 20 : 6, height:6, borderRadius:3, background: i < sceneIdx ? PURPLE : i === sceneIdx ? "#fff" : "#ffffff25", transition:"all 0.3s ease" }} />
              ))}
            </div>
          )}

          {/* Play / Pause overlay button */}
          <div style={{ position:"absolute", bottom:16, right:16, display:"flex", alignItems:"center", gap:8 }}>
            {/* Scene label */}
            {(playing || totalProgress > 0) && (
              <span style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.62rem", fontWeight:700, color:"#8890b0", letterSpacing:"0.08em", opacity: fading ? 0 : 1, transition:"opacity 0.35s" }}>
                {scenes[sceneIdx].label.toUpperCase()}
              </span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); toggle(); }}
              style={{ width:38, height:38, borderRadius:"50%", background:"#ffffffee", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 4px 16px #00000040", flexShrink:0 }}
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="1" width="4" height="12" rx="1.5" fill="#0f1120"/>
                  <rect x="8" y="1" width="4" height="12" rx="1.5" fill="#0f1120"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 2l10 5L3 12V2z" fill="#0f1120"/>
                </svg>
              )}
            </button>
          </div>

          {/* Timer */}
          {(playing || totalProgress > 0) && (
            <div style={{ position:"absolute", bottom:22, left:16, fontFamily:"'JetBrains Mono',monospace", fontSize:"0.65rem", color:"#8890b0" }}>
              {Math.floor(totalElapsed / 1000)}s / 30s
            </div>
          )}

          {/* Scene progress bar — bottom thin stripe */}
          {playing && (
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"#ffffff08" }}>
              <div style={{ height:"100%", background:`${PURPLE}80`, width:`${sceneProgress * 100}%`, transition:"width 0.1s linear" }} />
            </div>
          )}
        </div>

        {/* Caption below */}
        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.75rem", color:"#4a5070", textAlign:"center", marginTop:"1rem" }}>
          A 30-second overview of the FocusQuest training experience
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0);    }
        }
      `}</style>
    </section>
  );
}
