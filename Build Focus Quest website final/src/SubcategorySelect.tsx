import type { VideoCategory, VideoTopic, VideoNode } from "./data/videos";

interface SubcategorySelectProps {
  node: VideoCategory;
  breadcrumb: string[];
  selectedLevel: number;
  onSelect: (child: VideoNode) => void;
  onBack: () => void;
}

export default function SubcategorySelect({ node, breadcrumb, selectedLevel, onSelect, onBack }: SubcategorySelectProps) {
  return (
    <div style={{ maxWidth: 860 }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{ background:"none", border:"none", color:"#adb5d0", fontSize:"0.85rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"2rem", fontFamily:"'Raleway',sans-serif", fontWeight:600, transition:"color 0.15s", padding:0 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#a855f7")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#adb5d0")}
      >
        ← Back
      </button>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"1rem", flexWrap:"wrap" }}>
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
              <span style={{ fontSize:"0.75rem", color:"#adb5d0", fontFamily:"'Raleway',sans-serif", fontWeight:600 }}>{crumb}</span>
              {i < breadcrumb.length - 1 && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 2l4 3-4 3" stroke="#c4c9de" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <div style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", background:"#a855f710", border:"1px solid #a855f725", padding:"0.2rem 0.75rem", borderRadius:100, marginBottom:"1rem" }}>
        <span className="font-display" style={{ fontSize:"0.62rem", fontWeight:700, color:"#a855f7", letterSpacing:"0.08em" }}>VIDEO · {node.label.toUpperCase()}</span>
      </div>

      <h1 className="font-display" style={{ fontSize:"clamp(1.3rem,3vw,1.8rem)", fontWeight:900, color:"#0f1120", marginBottom:"0.5rem" }}>{node.label}</h1>
      <p style={{ fontSize:"0.88rem", color:"#6b7280", marginBottom:"2rem", lineHeight:1.7 }}>
        {node.children.some((c) => c.kind === "topic")
          ? `Select a topic below to watch the Level ${selectedLevel} video for it.`
          : "Select a subcategory to drill down."}
      </p>

      {/* Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:"1.1rem" }}>
        {node.children.map((child) => {
          const isTopic   = child.kind === "topic";
          const topic     = isTopic ? child as VideoTopic : null;
          const levelVid  = topic?.videos.find((v) => v.level === selectedLevel);
          const isWatched = levelVid ? !!localStorage.getItem(`fq_vid_${levelVid.youtubeId}`) : false;

          return (
            <button
              key={child.id}
              onClick={() => onSelect(child)}
              style={{
                background: "#ffffff",
                border: "1.5px solid #e4e6f0",
                borderRadius: 16,
                padding: 0,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a855f750"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 32px #a855f714"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e6f0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* Color stripe */}
              <div style={{ height: 4, background: child.kind === "category" ? (child as VideoCategory).grad : "linear-gradient(135deg,#a855f7,#6c47ff)" }} />

              <div style={{ padding:"1.25rem", display:"flex", flexDirection:"column", flex:1, gap:"0.75rem" }}>
                {/* Icon */}
                <div style={{ width:44, height:44, borderRadius:12, background:child.kind === "category" ? (child as VideoCategory).grad : "linear-gradient(135deg,#a855f7,#6c47ff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.25rem", boxShadow:"0 4px 12px #6c47ff18", flexShrink:0 }}>
                  {child.icon}
                </div>

                <div style={{ flex:1 }}>
                  <h3 className="font-display" style={{ fontSize:"0.92rem", fontWeight:800, color:"#0f1120", marginBottom:"0.35rem", lineHeight:1.3 }}>
                    {child.label}
                  </h3>
                  {isTopic && levelVid && (
                    <p style={{ fontSize:"0.73rem", color:"#6b7280", lineHeight:1.6, margin:"0 0 0.35rem" }}>
                      {levelVid.title}
                    </p>
                  )}
                </div>

                {/* Badges */}
                <div style={{ display:"flex", alignItems:"center", gap:"0.375rem", flexWrap:"wrap" }}>
                  {isTopic && levelVid ? (
                    <>
                      <span style={{ fontSize:"0.6rem", background:"#a855f712", color:"#a855f7", fontFamily:"'Raleway',sans-serif", fontWeight:700, padding:"0.15rem 0.5rem", borderRadius:100, display:"flex", alignItems:"center", gap:"0.25rem" }}>
                        🎬 {levelVid.duration}
                      </span>
                      {isWatched && (
                        <span style={{ fontSize:"0.6rem", background:"#22c55e12", color:"#22c55e", fontFamily:"'Raleway',sans-serif", fontWeight:700, padding:"0.15rem 0.5rem", borderRadius:100 }}>
                          ✓ Watched
                        </span>
                      )}
                    </>
                  ) : (
                    <span style={{ fontSize:"0.6rem", background:"#6c47ff12", color:"#6c47ff", fontFamily:"'Raleway',sans-serif", fontWeight:700, padding:"0.15rem 0.5rem", borderRadius:100 }}>
                      {(child as VideoCategory).children.length} topics →
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
