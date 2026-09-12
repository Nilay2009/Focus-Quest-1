import { useRef, useState } from "react";
import TrailerPlayer from "./TrailerPlayer";

interface LandingProps {
  onAuth: (mode: "login" | "signup") => void;
  user?: { name: string; email: string } | null;
  onGoApp?: () => void;
  onLogout?: () => void;
}

export default function Landing({ onAuth, user, onGoApp, onLogout }: LandingProps) {
  const faqRef      = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq]   = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const faqs = [
    { q: "What is Focus Quest?", a: "Focus Quest is an AI-powered cognitive training platform that adapts to your brain's learning patterns. It uses scientifically-validated exercises to measurably improve your attention span, working memory, and information retention over time." },
    { q: "How does FocusQuest work?", a: "Users choose a topic or genre and complete a series of challenges. They watch or read content, answer questions, and recall what they remember. FocusQuest evaluates their performance and adjusts future challenges accordingly." },
    { q: "Is FocusQuest a learning platform?", a: "Not exactly. FocusQuest is designed primarily as a training platform for attention and retention. The content acts as the medium through which these abilities are tested and developed." },
    { q: "How does AI evaluate my performance?", a: "AI analyzes factors such as accuracy, important concepts remembered, understanding, and responses to attention-check questions to generate a performance score and personalized feedback." },
    { q: "Can I choose what I want to learn about?", a: "Yes. Users can choose from different genres or topics, such as History, Philosophy, Science, Literature, Technology, and more." },
  ];

  /* ─── shared section label ─── */
  const Tag = ({ color, children }: { color: string; children: string }) => (
    <div style={{ display: "inline-block", background: color + "12", border: `1px solid ${color}35`, padding: "0.3rem 1rem", borderRadius: 100, marginBottom: "1rem" }}>
      <span className="font-display" style={{ fontSize: "0.7rem", color, letterSpacing: "0.1em", fontWeight: 700 }}>{children}</span>
    </div>
  );

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>

      {/* ══ NAV ══ */}
      <nav style={{ borderBottom: "1px solid #e4e6f0", background: "#ffffffee", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#6c47ff,#00b4d8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="3" fill="#fff" />
                <path d="M9 1v2M9 15v2M1 9h2M15 9h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>
            </div>
            <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
              <span className="font-display" style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f1120" }}>
                Focus<span style={{ background: "linear-gradient(135deg,#6c47ff,#00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Quest</span>
              </span>
              <span style={{ fontSize:"0.52rem", color:"#adb5d0", fontFamily:"'Raleway',sans-serif", fontWeight:700, letterSpacing:"0.1em", marginTop:"0.15rem" }}>BY THE ELITES</span>
            </div>
          </div>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2.25rem" }} className="hidden-mobile">
            <button className="nav-link" onClick={() => scrollTo(featuresRef)}>Features</button>
            <button className="nav-link" onClick={() => scrollTo(faqRef)}>FAQ</button>
          </div>

          {/* Auth buttons / user pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user ? (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", background:"linear-gradient(135deg,#6c47ff0d,#00b4d808)", border:"1px solid #6c47ff22", borderRadius:100, padding:"0.35rem 1rem 0.35rem 0.4rem" }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#6c47ff,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.7rem", fontWeight:800, color:"#fff" }}>
                      {user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden-mobile">
                    <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.78rem", fontWeight:700, color:"#0f1120", lineHeight:1.1 }}>{user.name}</div>
                    <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.62rem", color:"#adb5d0" }}>{user.email}</div>
                  </div>
                </div>
                <button className="btn-primary" style={{ padding:"0.5rem 1.25rem" }} onClick={onGoApp}>Dashboard →</button>
                <button className="btn-ghost" style={{ padding:"0.5rem 1rem", fontSize:"0.8rem" }} onClick={onLogout}>Log Out</button>
              </>
            ) : (
              <>
                <button className="btn-ghost" style={{ padding: "0.5rem 1.25rem" }} onClick={() => onAuth("login")}>Log In</button>
                <button className="btn-primary" style={{ padding: "0.5rem 1.25rem" }} onClick={() => onAuth("signup")}>Sign Up</button>
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer" }} className="show-mobile">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h16M3 11h16M3 16h16"/></svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e4e6f0", display: "flex", flexDirection: "column", gap: "1rem", background: "#fff" }}>
            <button className="nav-link" onClick={() => scrollTo(featuresRef)} style={{ textAlign: "left" }}>Features</button>
            <button className="nav-link" onClick={() => scrollTo(faqRef)} style={{ textAlign: "left" }}>FAQ</button>
          </div>
        )}
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero-gradient grid-bg" style={{ position: "relative", overflow: "hidden", minHeight: "90vh", display: "flex", alignItems: "center" }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: "8%", right: "2%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,#a855f715 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "-4%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,#00b4d812 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", width: "100%", position: "relative", zIndex: 1 }} className="hero-grid">

          {/* Text column */}
          <div className="fade-in-up">
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg,#6c47ff14,#00b4d810)", border: "1px solid #6c47ff25", padding: "0.375rem 1rem", borderRadius: 100, marginBottom: "1.75rem" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg,#6c47ff,#00b4d8)", boxShadow: "0 0 8px #6c47ff60" }} />
              <span className="font-display" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", background: "linear-gradient(135deg,#6c47ff,#00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                AI-Powered Cognitive Training
              </span>
            </div>

            <h1 className="font-display" style={{ fontSize: "clamp(2.1rem,5vw,3.6rem)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.01em", marginBottom: "1.5rem", color: "#0f1120" }}>
              Train Your{" "}
              <span style={{ background: "linear-gradient(135deg,#6c47ff,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Mind</span>,
              <br />Master Your{" "}
              <span style={{ background: "linear-gradient(135deg,#00b4d8,#6c47ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Focus</span>
            </h1>

            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#6b7280", maxWidth: 480, marginBottom: "2.5rem" }}>
              An AI-powered cognitive training platform that sharpens your attention span and supercharges retention through personalized video and text challenges — adapting in real time to your unique cognitive fingerprint.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ padding: "0.9rem 2.25rem", fontSize: "0.875rem" }} onClick={() => onAuth("signup")}>
                Begin Training →
              </button>
              <button className="btn-ghost" style={{ padding: "0.9rem 2.25rem" }} onClick={() => scrollTo(featuresRef)}>
                Learn More
              </button>
            </div>
          </div>

          {/* Visual column */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }} className="hero-image-col">
            <div className="float-anim" style={{ position: "relative", width: "100%", maxWidth: 480 }}>

              {/* Neural network card */}
              <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", border: "1px solid #e4e6f0", boxShadow: "0 24px 80px #6c47ff20, 0 4px 20px #00000010", background: "linear-gradient(160deg,#f5f3ff 0%,#f0f8ff 50%,#f5f3ff 100%)" }}>

                <svg viewBox="0 0 480 400" width="100%" style={{ display: "block" }} aria-label="Neural network visualization">
                  <defs>
                    {/* Radial background glow */}
                    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#6c47ff" stopOpacity="0.10"/>
                      <stop offset="100%" stopColor="#6c47ff" stopOpacity="0"/>
                    </radialGradient>
                    {/* Center node gradient */}
                    <radialGradient id="centerGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#a855f7"/>
                      <stop offset="100%" stopColor="#6c47ff"/>
                    </radialGradient>
                    {/* Cyan node gradient */}
                    <radialGradient id="cyanGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#38d9f5"/>
                      <stop offset="100%" stopColor="#00b4d8"/>
                    </radialGradient>
                    {/* Violet node gradient */}
                    <radialGradient id="violetGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#c084fc"/>
                      <stop offset="100%" stopColor="#a855f7"/>
                    </radialGradient>
                    {/* Glow filter — inner nodes */}
                    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="5" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    {/* Glow filter — center node */}
                    <filter id="glowBig" x="-80%" y="-80%" width="260%" height="260%">
                      <feGaussianBlur stdDeviation="9" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    {/* Glow filter — outer nodes */}
                    <filter id="glowSm" x="-80%" y="-80%" width="260%" height="260%">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>

                  {/* Background ambient glow */}
                  <ellipse cx="240" cy="200" rx="195" ry="185" fill="url(#bgGlow)"/>

                  {/* Concentric dashed orbit rings */}
                  <circle cx="240" cy="200" r="72"  fill="none" stroke="#6c47ff" strokeWidth="0.75" strokeOpacity="0.18" strokeDasharray="5 10"/>
                  <circle cx="240" cy="200" r="118" fill="none" stroke="#6c47ff" strokeWidth="0.6"  strokeOpacity="0.13" strokeDasharray="5 10"/>
                  <circle cx="240" cy="200" r="185" fill="none" stroke="#6c47ff" strokeWidth="0.5"  strokeOpacity="0.08" strokeDasharray="5 10"/>

                  {/* ── EDGES: center → inner ring ── */}
                  {([[240,82],[340,141],[340,259],[240,318],[140,259],[140,141]] as [number,number][]).map(([x,y],i) => (
                    <line key={`ci-${i}`} x1="240" y1="200" x2={x} y2={y} stroke="#6c47ff" strokeWidth="1.25" strokeOpacity="0.28"/>
                  ))}

                  {/* ── EDGES: inner hexagon ── */}
                  {([
                    [[240,82],[340,141]],[[340,141],[340,259]],[[340,259],[240,318]],
                    [[240,318],[140,259]],[[140,259],[140,141]],[[140,141],[240,82]]
                  ] as [[number,number],[number,number]][]).map(([[x1,y1],[x2,y2]],i) => (
                    <line key={`hex-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00b4d8" strokeWidth="1" strokeOpacity="0.22"/>
                  ))}

                  {/* ── EDGES: inner → outer ring ── */}
                  {([
                    [[240,82],[240,18]],[[340,141],[404,106]],[[340,259],[404,294]],
                    [[240,318],[240,382]],[[140,259],[76,294]],[[140,141],[76,106]]
                  ] as [[number,number],[number,number]][]).map(([[x1,y1],[x2,y2]],i) => (
                    <line key={`io-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a855f7" strokeWidth="0.75" strokeOpacity="0.18"/>
                  ))}

                  {/* ── TRAVELING PULSES: center → inner ── */}
                  <circle r="3.5" fill="#6c47ff" style={{filter:"drop-shadow(0 0 5px #6c47ff)"}}>
                    <animateMotion dur="1.8s" begin="0s" repeatCount="indefinite" path="M240,200 L240,82"/>
                    <animate attributeName="opacity" values="0;1;1;0" dur="1.8s" begin="0s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="3.5" fill="#00b4d8" style={{filter:"drop-shadow(0 0 5px #00b4d8)"}}>
                    <animateMotion dur="2.1s" begin="0.7s" repeatCount="indefinite" path="M240,200 L340,259"/>
                    <animate attributeName="opacity" values="0;1;1;0" dur="2.1s" begin="0.7s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="3.5" fill="#a855f7" style={{filter:"drop-shadow(0 0 5px #a855f7)"}}>
                    <animateMotion dur="1.95s" begin="1.35s" repeatCount="indefinite" path="M240,200 L140,259"/>
                    <animate attributeName="opacity" values="0;1;1;0" dur="1.95s" begin="1.35s" repeatCount="indefinite"/>
                  </circle>

                  {/* ── TRAVELING PULSES: inner → outer ── */}
                  <circle r="2.5" fill="#6c47ff" opacity="0.85">
                    <animateMotion dur="1.5s" begin="0.4s" repeatCount="indefinite" path="M340,141 L404,106"/>
                    <animate attributeName="opacity" values="0;0.9;0.9;0" dur="1.5s" begin="0.4s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="2.5" fill="#00b4d8" opacity="0.85">
                    <animateMotion dur="1.6s" begin="1.1s" repeatCount="indefinite" path="M240,318 L240,382"/>
                    <animate attributeName="opacity" values="0;0.9;0.9;0" dur="1.6s" begin="1.1s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="2.5" fill="#a855f7" opacity="0.85">
                    <animateMotion dur="1.45s" begin="0.85s" repeatCount="indefinite" path="M140,141 L76,106"/>
                    <animate attributeName="opacity" values="0;0.9;0.9;0" dur="1.45s" begin="0.85s" repeatCount="indefinite"/>
                  </circle>

                  {/* ── OUTER RING NODES ── */}
                  {([[240,18],[404,106],[404,294],[240,382],[76,294],[76,106]] as [number,number][]).map(([x,y],i) => (
                    <g key={`on-${i}`} filter="url(#glowSm)">
                      <circle cx={x} cy={y} r="9"  fill={i%2===0?"#6c47ff":"#00b4d8"} opacity="0.14"/>
                      <circle cx={x} cy={y} r="5"  fill={i%2===0?"#6c47ff":"#00b4d8"} opacity="0.55"/>
                      <circle cx={x} cy={y} r="2.5" fill="#fff" opacity="0.95"/>
                    </g>
                  ))}

                  {/* ── INNER RING NODES ── */}
                  {([[240,82],[340,141],[340,259],[240,318],[140,259],[140,141]] as [number,number][]).map(([x,y],i) => {
                    const grad = i%3===0?"url(#centerGrad)":i%3===1?"url(#cyanGrad)":"url(#violetGrad)";
                    const gColor = i%3===0?"#6c47ff":i%3===1?"#00b4d8":"#a855f7";
                    return (
                      <g key={`in-${i}`} filter="url(#glow)">
                        <circle cx={x} cy={y} r="18" fill={gColor} opacity="0.12"/>
                        <circle cx={x} cy={y} r="10" fill={grad}/>
                        <circle cx={x} cy={y} r="4.5" fill="#fff" opacity="0.9"/>
                        <circle cx={x} cy={y} r="10" fill="none" stroke="#fff" strokeWidth="1" strokeOpacity="0.3" className="node-pulse"/>
                      </g>
                    );
                  })}

                  {/* ── CENTER HUB ── */}
                  <g filter="url(#glowBig)">
                    <circle cx="240" cy="200" r="48" fill="#6c47ff" opacity="0.10" className="hub-pulse"/>
                    <circle cx="240" cy="200" r="32" fill="#6c47ff" opacity="0.16"/>
                    <circle cx="240" cy="200" r="21" fill="url(#centerGrad)"/>
                    <circle cx="240" cy="200" r="9"  fill="#fff" opacity="0.95"/>
                    <circle cx="240" cy="200" r="21" fill="none" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.25" className="hub-ring"/>
                  </g>

                  {/* ── MICRO LABELS ── */}
                  <g fontFamily="'JetBrains Mono',monospace" fill="#6c47ff" fillOpacity="0.55" fontSize="6.5" letterSpacing="0.5">
                    <text x="248" y="79">ATTN</text>
                    <text x="348" y="138">MEM</text>
                    <text x="348" y="256">RET</text>
                    <text x="88"  y="256">FOCS</text>
                  </g>
                </svg>

                {/* HUD top-left */}
                <div style={{ position: "absolute", top: 16, left: 16, background: "#ffffffee", backdropFilter: "blur(10px)", border: "1px solid #6c47ff20", borderRadius: 10, padding: "0.5rem 0.875rem", boxShadow: "0 4px 16px #6c47ff10" }}>
                  <div className="font-display" style={{ fontSize: "0.58rem", color: "#6c47ff", letterSpacing: "0.1em", fontWeight: 700 }}>NEURAL SYNC</div>
                  <div className="font-mono-data" style={{ fontSize: "1rem", color: "#0f1120", fontWeight: 700 }}>Active</div>
                </div>

                {/* HUD bottom-right */}
                <div style={{ position: "absolute", bottom: 16, right: 16, background: "#ffffffee", backdropFilter: "blur(10px)", border: "1px solid #a855f720", borderRadius: 10, padding: "0.5rem 0.875rem", boxShadow: "0 4px 16px #a855f710" }}>
                  <div className="font-display" style={{ fontSize: "0.58rem", color: "#a855f7", letterSpacing: "0.1em", fontWeight: 700 }}>SESSION</div>
                  <div className="font-mono-data" style={{ fontSize: "1rem", color: "#0f1120", fontWeight: 700 }}>Training</div>
                </div>
              </div>

              {/* Floating pill */}
              <div style={{ position: "absolute", top: -18, right: -18, background: "#ffffff", border: "1px solid #e4e6f0", borderRadius: 12, padding: "0.75rem 1.1rem", boxShadow: "0 8px 28px #6c47ff14" }}>
                <div className="font-display" style={{ fontSize: "0.58rem", color: "#6b7280", letterSpacing: "0.08em", marginBottom: 4 }}>STATUS</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e80" }} />
                  <span className="font-mono-data" style={{ fontSize: "0.78rem", color: "#0f1120", fontWeight: 600 }}>Focus Active</span>
                </div>
              </div>

              {/* Second floating badge — bottom-left */}
              <div style={{ position: "absolute", bottom: -14, left: -14, background: "#ffffff", border: "1px solid #e4e6f0", borderRadius: 12, padding: "0.625rem 1rem", boxShadow: "0 8px 28px #a855f714", display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6c47ff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8.2 4.5L12 5.1L9.25 7.8L9.9 11.6L6.5 9.8L3.1 11.6L3.75 7.8L1 5.1L4.8 4.5L6.5 1Z" fill="#fff" opacity="0.9"/></svg>
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: "0.58rem", color: "#6b7280", letterSpacing: "0.07em" }}>LEVEL UP</div>
                  <div className="font-mono-data" style={{ fontSize: "0.78rem", color: "#0f1120", fontWeight: 700 }}>+12 XP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrailerPlayer />

      {/* ══ FEATURES ══ */}
      <section ref={featuresRef} style={{ padding: "7rem 1.5rem", background: "#f8f9ff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <Tag color="#a855f7">CORE CAPABILITIES</Tag>
            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "#0f1120", letterSpacing: "-0.01em" }}>
              Engineered for Peak Cognition
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#6b7280", maxWidth: 520, margin: "1rem auto 0", lineHeight: 1.75 }}>
              Every feature is designed around one goal: measurable improvement in how your brain processes and retains information.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: "1.5rem" }}>
            {[
              { tag: "Attention Training",  title: "Attention Assessment",  body: "Multi-dimensional baseline assessment mapping your attention span, working memory, and focus thresholds across nine scientifically validated dimensions.", color: "#a855f7" },
              { tag: "Progress Tracking",   title: "Progress Analytics",    body: "Detailed visual tracking of your cognitive gains over time, with per-session reports, streak recognition, and milestone breakdowns.", color: "#00b4d8" },
              { tag: "Adaptive Challenges", title: "Precision Challenges",  body: "Summary writing, video comprehension drills, and level-gated reading tasks — each calibrated to your current ability and scaled as you improve.", color: "#6c47ff" },
              { tag: "Knowledge Domains",   title: "Genre-Based Learning",  body: "Train across History, Science, Technology, Psychology, Literature, and more. Five progressive levels per genre unlock as you master each stage.", color: "#22c55e" },
            ].map((f) => (
              <div key={f.title} className="card-lift" style={{ padding: "1.75rem", borderTop: `3px solid ${f.color}` }}>
                <div style={{ display: "inline-block", background: f.color + "12", border: `1px solid ${f.color}30`, padding: "0.2rem 0.75rem", borderRadius: 100, marginBottom: "1rem" }}>
                  <span className="font-display" style={{ fontSize: "0.62rem", color: f.color, letterSpacing: "0.08em", fontWeight: 700 }}>{f.tag.toUpperCase()}</span>
                </div>
                <h3 className="font-display" style={{ fontSize: "1rem", fontWeight: 800, color: "#0f1120", marginBottom: "0.75rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.75 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section ref={faqRef} style={{ padding: "7rem 1.5rem", background: "#f8f9ff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <Tag color="#00b4d8">FAQ</Tag>
            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: "#0f1120", letterSpacing: "-0.01em" }}>
              Questions & Answers
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: "#ffffff", border: `1.5px solid ${openFaq === i ? "#6c47ff50" : "#e4e6f0"}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s", boxShadow: openFaq === i ? "0 4px 20px #6c47ff10" : "none" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", gap: "1rem" }}>
                  <span className="font-display" style={{ fontSize: "0.9rem", color: "#0f1120", fontWeight: 700 }}>{faq.q}</span>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", border: `1.5px solid ${openFaq === i ? "#6c47ff" : "#e4e6f0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: openFaq === i ? "#6c47ff" : "#adb5d0", transition: "all 0.2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </div>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 1.5rem 1.25rem", borderTop: "1px solid #f0f1f8" }}>
                    <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.8, paddingTop: "1rem" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR TEAM ══ */}
      <section style={{ padding:"7rem 1.5rem", background:"#ffffff" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
            <Tag color="#6c47ff">THE ELITES</Tag>
            <h2 className="font-display" style={{ fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:800, color:"#0f1120", letterSpacing:"-0.01em" }}>
              Our Team
            </h2>
            <p style={{ fontSize:"0.95rem", color:"#6b7280", maxWidth:440, margin:"1rem auto 0", lineHeight:1.75 }}>
              The minds behind FocusQuest — building the future of cognitive training.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:"1.25rem" }}>
            {[
              { name:"Nilay Jaiswal",    initials:"NJ", color:"#6c47ff" },
              { name:"Shivank Banerjee", initials:"SB", color:"#00b4d8" },
              { name:"Mousani Saha",     initials:"MS", color:"#a855f7" },
              { name:"Mehar Kataria",    initials:"MK", color:"#f59e0b" },
            ].map((m) => (
              <div key={m.name} style={{ background:"#f8f9ff", border:`1.5px solid ${m.color}25`, borderRadius:18, padding:"2rem 1.5rem", textAlign:"center", transition:"transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${m.color}18`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
              >
                <div style={{ width:64, height:64, borderRadius:"50%", background:`linear-gradient(135deg,${m.color},${m.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.25rem", boxShadow:`0 8px 24px ${m.color}35` }}>
                  <span style={{ fontFamily:"'Raleway',sans-serif", fontSize:"1.1rem", fontWeight:900, color:"#fff" }}>{m.initials}</span>
                </div>
                <div className="font-display" style={{ fontSize:"1rem", fontWeight:800, color:"#0f1120" }}>{m.name}</div>
                <div style={{ width:32, height:3, borderRadius:100, background:`linear-gradient(90deg,${m.color},${m.color}55)`, margin:"0.75rem auto 0" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop: "1px solid #e4e6f0", padding: "2rem 1.5rem", textAlign: "center", background: "#ffffff" }}>
        <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", lineHeight:1 }}>
          <span className="font-display" style={{ fontSize: "0.95rem", fontWeight: 800, color: "#c8cce0" }}>
            Focus<span style={{ background: "linear-gradient(135deg,#6c47ff,#00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Quest</span>
          </span>
          <span style={{ fontSize:"0.48rem", color:"#d0d4e8", fontFamily:"'Raleway',sans-serif", fontWeight:700, letterSpacing:"0.1em", marginTop:"0.2rem" }}>BY THE ELITES</span>
        </div>
        <p style={{ fontSize: "0.75rem", color: "#d0d4e8", marginTop: "0.5rem" }}>© 2026 FocusQuest. Cognitive Training Platform.</p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-image-col { display: none !important; }
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }

        .hub-pulse {
          animation: hubPulse 3s ease-in-out infinite;
          transform-origin: 240px 200px;
        }
        .hub-ring {
          animation: hubRing 3s ease-in-out infinite;
          transform-origin: 240px 200px;
        }
        .node-pulse {
          animation: nodePulse 2.6s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes hubPulse {
          0%, 100% { r: 48; opacity: 0.10; }
          50%       { r: 56; opacity: 0.06; }
        }
        @keyframes hubRing {
          0%, 100% { transform: scale(1);    opacity: 0.25; }
          50%       { transform: scale(1.18); opacity: 0.08; }
        }
        @keyframes nodePulse {
          0%, 100% { transform: scale(1);    opacity: 0.30; }
          50%       { transform: scale(1.4);  opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}
