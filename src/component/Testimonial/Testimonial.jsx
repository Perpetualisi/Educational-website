import React, { useState, useEffect, useRef } from "react";
import user_1 from "../../assets/user-1.png";
import user_2 from "../../assets/user-2.png";
import user_3 from "../../assets/user-3.png";
import user_4 from "../../assets/user-4.png";

const testimonials = [
  {
    id: 1,
    name: "Emma Williams",
    university: "Edusity University, USA",
    role: "BSc Computer Science, Class of 2023",
    image: user_1,
    rating: 5,
    tag: "Technology",
    tagColor: "#60a5fa",
    highlight: "creativity and critical thinking",
    review: "Edusity University has given me the tools to excel in my career. The faculty is incredibly supportive, and the learning environment encourages creativity and critical thinking.",
  },
  {
    id: 2,
    name: "James Anderson",
    university: "Edusity University, USA",
    role: "MBA Graduate, Class of 2022",
    image: user_2,
    rating: 5,
    tag: "Business",
    tagColor: "#a78bfa",
    highlight: "world-class education",
    review: "Studying at Edusity has been life-changing. The university provides world-class education, hands-on experience, and a network of brilliant minds that I carry with me every day.",
  },
  {
    id: 3,
    name: "Sophia Johnson",
    university: "Edusity University, USA",
    role: "MSc Data Science, Class of 2024",
    image: user_3,
    rating: 5,
    tag: "Data Science",
    tagColor: "#34d399",
    highlight: "confidence and deep expertise",
    review: "The academic programs at Edusity are rigorous yet rewarding. The university ensures that every student graduates with confidence and deep expertise in their chosen field.",
  },
  {
    id: 4,
    name: "Ethan Brown",
    university: "Edusity University, USA",
    role: "PhD Engineering, Class of 2023",
    image: user_4,
    rating: 5,
    tag: "Engineering",
    tagColor: "#f59e0b",
    highlight: "innovation and real-world application",
    review: "At Edusity, learning goes beyond textbooks. The emphasis on innovation and real-world application has accelerated my professional growth beyond what I imagined possible.",
  },
];

/* ── Star rating ── */
const StarRating = ({ count }) => (
  <div style={{ display:"flex", gap:3, justifyContent:"center", marginBottom:16 }}>
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="15" height="15" viewBox="0 0 14 14" fill="none"
        style={{ animation:`starPop .4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.07}s both` }}>
        <path
          d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z"
          fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.4"
        />
      </svg>
    ))}
  </div>
);

/* ── Progress bar ── */
const ProgressBar = ({ duration, running, key: k }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(0);
    if (!running) return;
    const t = setTimeout(() => setWidth(100), 60);
    return () => clearTimeout(t);
  }, [k, running]);
  return (
    <div style={{ width:"100%", height:2, background:"rgba(96,165,250,0.1)", borderRadius:2, overflow:"hidden", marginBottom:24 }}>
      <div style={{
        height:"100%", borderRadius:2,
        background:"linear-gradient(90deg,#1d4ed8,#60a5fa)",
        width:`${width}%`,
        transition: running ? `width ${duration}ms linear` : "none",
        boxShadow:"0 0 6px rgba(59,130,246,0.5)",
      }} />
    </div>
  );
};

/* ── Swipe hook ── */
const useSwipe = (onLeft, onRight) => {
  const startX = useRef(null);
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 45) { dx < 0 ? onLeft() : onRight(); }
    startX.current = null;
  };
  return { onTouchStart, onTouchEnd };
};

/* ── Main ── */
const Testimonial = () => {
  const [current,  setCurrent]  = useState(0);
  const [animDir,  setAnimDir]  = useState("next");
  const [animating, setAnim]    = useState(false);
  const [reveal,   setReveal]   = useState(false);
  const [paused,   setPaused]   = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const sectionRef  = useRef(null);
  const intervalRef = useRef(null);
  const DURATION    = 5500;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setReveal(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const startInterval = () => {
    clearInterval(intervalRef.current);
    if (!paused) intervalRef.current = setInterval(() => navigate("next"), DURATION);
  };

  useEffect(() => { startInterval(); return () => clearInterval(intervalRef.current); }, [paused]);

  const navigate = (dir) => {
    if (animating) return;
    setAnimDir(dir);
    setAnim(true);
    setTimeout(() => {
      setCurrent(prev =>
        dir === "next"
          ? (prev + 1) % testimonials.length
          : (prev - 1 + testimonials.length) % testimonials.length
      );
      setAnim(false);
      setTimerKey(k => k + 1);
    }, 320);
    startInterval();
  };

  const goTo = (i) => {
    if (i === current || animating) return;
    setAnimDir(i > current ? "next" : "prev");
    setAnim(true);
    setTimeout(() => { setCurrent(i); setAnim(false); setTimerKey(k => k + 1); }, 320);
    startInterval();
  };

  const swipeHandlers = useSwipe(() => navigate("next"), () => navigate("prev"));
  const t = testimonials[current];

  /* Highlight keyword in review */
  const renderReview = (text, word) => {
    if (!word) return text;
    const parts = text.split(new RegExp(`(${word})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === word.toLowerCase()
        ? <strong key={i} style={{ color:"#bfdbfe", fontWeight:500, fontStyle:"normal" }}>{p}</strong>
        : p
    );
  };

  return (
    <section id="testimonial" ref={sectionRef} className="tsm-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

        @keyframes tsmDot    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }
        @keyframes tsmRing   { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.07);opacity:1} }
        @keyframes starPop   { from{opacity:0;transform:scale(.5) rotate(-20deg)} to{opacity:1;transform:none} }
        @keyframes tsmFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes tsmCardIn { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes quoteFloat { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-10px) rotate(-3deg)} }

        /* ── Section ── */
        .tsm-section {
          position: relative; width: 100%;
          padding: clamp(64px,10vw,116px) 0 clamp(64px,8vw,96px);
          background:
            radial-gradient(ellipse 60% 40% at 15% 20%, rgba(29,78,216,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 55% 35% at 85% 80%, rgba(37,99,235,0.06) 0%, transparent 65%),
            linear-gradient(160deg, #020b18 0%, #041220 40%, #061a30 70%, #030e1e 100%);
          font-family: 'Outfit', sans-serif; overflow: hidden;
        }
        .tsm-section::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(96,165,250,.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,.022) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .tsm-section::after {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* ── Header ── */
        .tsm-header {
          position: relative; z-index: 1; text-align: center;
          padding: 0 clamp(16px,5vw,72px);
          margin-bottom: clamp(36px,5vw,56px);
        }
        .tsm-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 100px;
          background: rgba(59,130,246,0.1); border: 1px solid rgba(96,165,250,0.25);
          font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
          color: #93c5fd; margin-bottom: 18px;
        }
        .tsm-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:#3b82f6; box-shadow:0 0 6px #3b82f6; animation:tsmDot 2s ease-in-out infinite; }

        /* Title — no underline */
        .tsm-title, .tsm-title *, .tsm-title-accent {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem,4.2vw,3.1rem);
          font-weight: 900; line-height: 1.08; letter-spacing: -0.025em;
          color: #eff6ff; margin-bottom: 12px;
          text-decoration: none !important;
        }
        .tsm-title-accent {
          background: linear-gradient(135deg,#60a5fa,#93c5fd,#bfdbfe);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          font-size: inherit; font-weight: inherit;
          text-decoration: none !important;
        }
        .tsm-subtitle {
          font-size: clamp(13px,1.5vw,15px); color: rgba(191,219,254,0.55);
          font-weight: 300; max-width: 440px; margin: 0 auto; line-height: 1.82;
        }

        /* ── Summary bar ── */
        .tsm-summary {
          position: relative; z-index: 1;
          display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;
          padding: 0 clamp(16px,5vw,72px);
          margin-bottom: clamp(28px,4vw,44px);
        }
        .tsm-summary-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(96,165,250,0.12);
          backdrop-filter: blur(10px);
          transition: border-color .3s, transform .3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .tsm-summary-chip:hover { border-color: rgba(96,165,250,0.3); transform: translateY(-2px); }
        .tsm-summary-chip-num {
          font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 900;
          color: #eff6ff; letter-spacing: -0.02em; line-height: 1;
        }
        .tsm-summary-chip-num em { font-style:normal; color:#60a5fa; }
        .tsm-summary-chip-lbl {
          font-size: 9.5px; font-weight: 600; text-transform: uppercase;
          letter-spacing: .12em; color: rgba(147,197,253,0.48);
        }
        .tsm-summary-chip-icon { font-size: 1rem; }

        /* ── Layout ── */
        .tsm-layout {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 0 clamp(16px,5vw,72px);
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: clamp(24px,4vw,52px);
          align-items: start;
        }
        @media (max-width: 820px) {
          .tsm-layout { grid-template-columns: 1fr; }
          .tsm-sidebar { display: none; }
        }

        /* ── Sidebar ── */
        .tsm-sidebar { display: flex; flex-direction: column; gap: 10px; }
        .tsm-sidebar-card {
          padding: 14px 16px; border-radius: 14px;
          background: rgba(255,255,255,0.025); border: 1px solid rgba(96,165,250,0.1);
          cursor: pointer;
          transition: all .28s cubic-bezier(0.34,1.56,0.64,1);
          display: flex; align-items: center; gap: 12px;
        }
        .tsm-sidebar-card:hover { background: rgba(255,255,255,0.045); border-color: rgba(96,165,250,0.25); transform: translateX(3px); }
        .tsm-sidebar-card.active { background: rgba(29,78,216,0.18); border-color: rgba(96,165,250,0.4); box-shadow: 0 4px 16px rgba(29,78,216,0.2); }
        .tsm-sidebar-avatar { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(96,165,250,0.2); flex-shrink: 0; }
        .tsm-sidebar-card.active .tsm-sidebar-avatar { border-color: #3b82f6; }
        .tsm-sidebar-name { font-family:'Syne',sans-serif; font-size: 12.5px; font-weight: 800; color: #eff6ff; line-height:1.2; }
        .tsm-sidebar-role { font-size: 9.5px; font-weight: 600; letter-spacing:.1em; text-transform: uppercase; color: rgba(147,197,253,0.45); margin-top: 2px; }
        .tsm-sidebar-tag {
          margin-left: auto; padding: 2px 8px; border-radius: 100px; font-size: 9px;
          font-weight: 700; letter-spacing: .1em; text-transform: uppercase; flex-shrink: 0;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(191,219,254,0.5);
        }

        /* ── Main card ── */
        .tsm-main { display: flex; flex-direction: column; gap: 22px; }

        .tsm-card {
          width: 100%;
          padding: clamp(28px,5vw,48px) clamp(22px,5vw,48px);
          border-radius: 24px;
          background: rgba(255,255,255,0.038);
          border: 1px solid rgba(96,165,250,0.14);
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06);
          text-align: center; position: relative; overflow: hidden;
          transition: opacity .32s ease, transform .32s cubic-bezier(0.22,1,0.36,1);
          touch-action: pan-y;
        }
        /* Shimmer top */
        .tsm-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,transparent,rgba(96,165,250,0.4),transparent);
          pointer-events: none;
        }
        /* Large quote bg */
        .tsm-card::after {
          content: '"'; position: absolute; top: 12px; right: 22px;
          font-family: 'Syne', serif; font-size: 7rem; font-weight: 900; line-height: 1;
          color: rgba(59,130,246,0.055); pointer-events: none; user-select: none;
          animation: quoteFloat 6s ease-in-out infinite;
        }

        .tsm-card-slide-next-out { opacity: 0; transform: translateX(-36px) scale(0.97); }
        .tsm-card-slide-prev-out { opacity: 0; transform: translateX(36px)  scale(0.97); }

        /* Tag chip */
        .tsm-card-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 100px;
          font-size: 9.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
          border: 1px solid; margin-bottom: 18px;
          animation: tsmCardIn .4s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* Avatar */
        .tsm-avatar-wrap { position: relative; display: inline-block; margin-bottom: 14px; }
        .tsm-avatar {
          width: 78px; height: 78px; border-radius: 50%; object-fit: cover; display: block;
          border: 2.5px solid rgba(96,165,250,0.45);
          box-shadow: 0 0 0 4px rgba(59,130,246,0.12), 0 8px 24px rgba(0,0,0,0.4);
        }
        .tsm-avatar-ring { position:absolute; inset:-6px; border-radius:50%; border:1px solid rgba(96,165,250,0.22); pointer-events:none; animation:tsmRing 3s ease-in-out infinite; }
        .tsm-avatar-badge {
          position: absolute; bottom: -2px; right: -2px;
          width: 22px; height: 22px; border-radius: 50%;
          background: linear-gradient(135deg,#1d4ed8,#3b82f6);
          border: 2px solid rgba(4,18,48,1);
          display: flex; align-items: center; justify-content: center;
        }

        .tsm-name     { font-family:'Syne',sans-serif; font-size:1.15rem; font-weight:800; color:#eff6ff; letter-spacing:-0.015em; margin-bottom:3px; }
        .tsm-role     { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.14em; color:rgba(147,197,253,0.52); margin-bottom:2px; }
        .tsm-univ     { font-size:10.5px; color:rgba(147,197,253,0.38); margin-bottom:16px; letter-spacing:.03em; }
        .tsm-review   {
          font-size: clamp(13.5px,1.6vw,15.5px); color: rgba(219,234,254,0.72);
          line-height: 1.88; font-weight: 300; font-style: italic;
          max-width: 560px; margin: 0 auto; position: relative; z-index: 1;
        }

        /* ── Nav row ── */
        .tsm-nav-row { display:flex; align-items:center; justify-content:center; gap:14px; }
        .tsm-nav-btn {
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(96,165,250,0.2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; backdrop-filter: blur(8px);
          transition: background .25s, border-color .25s, transform .3s cubic-bezier(0.34,1.56,0.64,1), box-shadow .25s;
        }
        .tsm-nav-btn:hover { background:rgba(37,99,235,0.35); border-color:rgba(96,165,250,0.5); transform:scale(1.1); box-shadow:0 6px 20px rgba(37,99,235,0.28); }
        .tsm-nav-btn:active { transform:scale(0.94); }

        /* Pause btn */
        .tsm-pause-btn {
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(96,165,250,0.15);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .25s ease;
        }
        .tsm-pause-btn:hover { background: rgba(37,99,235,0.25); border-color: rgba(96,165,250,0.4); }

        /* Dots */
        .tsm-dots { display:flex; align-items:center; gap:6px; }
        .tsm-dot {
          height: 6px; border-radius: 3px; cursor: pointer; border: none; padding: 0;
          transition: width .35s cubic-bezier(0.34,1.56,0.64,1), background .3s, box-shadow .3s;
        }
        .tsm-dot-inactive { width:6px; background:rgba(96,165,250,0.22); }
        .tsm-dot-active   { width:28px; background:linear-gradient(90deg,#1d4ed8,#60a5fa); box-shadow:0 0 8px rgba(59,130,246,0.45); }

        /* Thumbs */
        .tsm-thumbs { display:flex; align-items:center; justify-content:center; gap:10px; }
        .tsm-thumb {
          width: 38px; height: 38px; border-radius: 50%; object-fit: cover; cursor: pointer;
          transition: transform .3s cubic-bezier(0.34,1.56,0.64,1), border-color .3s, box-shadow .3s, opacity .3s;
          border: 2px solid transparent;
        }
        .tsm-thumb-active   { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.22); transform:scale(1.18); opacity:1; }
        .tsm-thumb-inactive { opacity:.4; filter:grayscale(35%); }
        .tsm-thumb-inactive:hover { opacity:.72; transform:scale(1.08); }

        /* ── Reveal ── */
        .tsm-reveal  { opacity:0; transform:translateY(24px); transition:opacity .8s cubic-bezier(0.22,1,0.36,1),transform .8s cubic-bezier(0.22,1,0.36,1); }
        .tsm-revealed { opacity:1 !important; transform:none !important; }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .tsm-summary { gap: 7px; }
          .tsm-summary-chip { padding: 8px 12px; }
          .tsm-summary-chip-num { font-size: 1rem; }
          .tsm-card { padding: 24px 18px; }
          .tsm-nav-btn { width: 38px; height: 38px; }
        }
      `}</style>

      {/* Header */}
      <div className={`tsm-header tsm-reveal ${reveal ? "tsm-revealed" : ""}`}>
        <div className="tsm-eyebrow">
          <span className="tsm-eyebrow-dot" />
          Student Voices
        </div>
        <h2 className="tsm-title">
          Hear From Our{" "}
          <span className="tsm-title-accent">Graduates</span>
        </h2>
        <p className="tsm-subtitle">
          Thousands of graduates. One shared truth — Edusity changes lives.
        </p>
      </div>

      {/* Summary chips */}
      <div className={`tsm-summary tsm-reveal ${reveal ? "tsm-revealed" : ""}`}
        style={{ transitionDelay:".1s" }}>
        {[
          { icon:"⭐", num:"4.9", suffix:"/5",  lbl:"Average Rating"   },
          { icon:"🎓", num:"42",  suffix:"k+",  lbl:"Graduates"        },
          { icon:"💼", num:"98",  suffix:"%",   lbl:"Employment Rate"  },
          { icon:"🌍", num:"80",  suffix:"+",   lbl:"Countries"        },
        ].map(c => (
          <div key={c.lbl} className="tsm-summary-chip">
            <span className="tsm-summary-chip-icon">{c.icon}</span>
            <div>
              <div className="tsm-summary-chip-num">{c.num}<em>{c.suffix}</em></div>
              <div className="tsm-summary-chip-lbl">{c.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Layout: sidebar + main */}
      <div className={`tsm-layout tsm-reveal ${reveal ? "tsm-revealed" : ""}`}
        style={{ transitionDelay:".18s" }}>

        {/* Sidebar */}
        <div className="tsm-sidebar">
          {testimonials.map((item, i) => (
            <div
              key={item.id}
              className={`tsm-sidebar-card${i === current ? " active" : ""}`}
              onClick={() => goTo(i)}
            >
              <img src={item.image} alt={item.name} className="tsm-sidebar-avatar" />
              <div style={{ minWidth:0 }}>
                <div className="tsm-sidebar-name">{item.name}</div>
                <div className="tsm-sidebar-role">{item.role.split(",")[0]}</div>
              </div>
              <span className="tsm-sidebar-tag" style={ i === current ? { color: item.tagColor, borderColor:`${item.tagColor}40` } : {}}>
                {item.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Main area */}
        <div className="tsm-main">

          {/* Progress bar */}
          <ProgressBar key={timerKey} duration={DURATION} running={!paused} />

          {/* Card */}
          <div
            className={`tsm-card${animating ? (animDir === "next" ? " tsm-card-slide-next-out" : " tsm-card-slide-prev-out") : ""}`}
            {...swipeHandlers}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Tag chip */}
            <div>
              <span key={current} className="tsm-card-tag"
                style={{ color: t.tagColor, borderColor:`${t.tagColor}40`, background:`${t.tagColor}12` }}>
                <span style={{ width:4,height:4,borderRadius:"50%",background:t.tagColor,display:"inline-block" }} />
                {t.tag}
              </span>
            </div>

            {/* Avatar */}
            <div className="tsm-avatar-wrap">
              <div className="tsm-avatar-ring" />
              <img src={t.image} alt={t.name} className="tsm-avatar" />
              <div className="tsm-avatar-badge">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <p className="tsm-name">{t.name}</p>
            <p className="tsm-role">{t.role}</p>
            <p className="tsm-univ">{t.university}</p>

            <StarRating key={current} count={t.rating} />

            <p className="tsm-review">
              "{renderReview(t.review, t.highlight)}"
            </p>
          </div>

          {/* Thumbs */}
          <div className="tsm-thumbs">
            {testimonials.map((item, i) => (
              <img key={item.id} src={item.image} alt={item.name}
                className={`tsm-thumb${i === current ? " tsm-thumb-active" : " tsm-thumb-inactive"}`}
                onClick={() => goTo(i)} />
            ))}
          </div>

          {/* Nav row */}
          <div className="tsm-nav-row">
            <button className="tsm-nav-btn" onClick={() => navigate("prev")} aria-label="Previous">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="rgba(147,197,253,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="tsm-dots">
              {testimonials.map((_, i) => (
                <button key={i}
                  className={`tsm-dot${i === current ? " tsm-dot-active" : " tsm-dot-inactive"}`}
                  onClick={() => goTo(i)} aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>

            {/* Pause / play */}
            <button className="tsm-pause-btn" onClick={() => setPaused(p => !p)} aria-label={paused ? "Play" : "Pause"}>
              {paused
                ? <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><polygon points="1,1 9,6 1,11" fill="rgba(147,197,253,0.7)"/></svg>
                : <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><rect x="1" y="1" width="3" height="10" rx="1" fill="rgba(147,197,253,0.7)"/><rect x="6" y="1" width="3" height="10" rx="1" fill="rgba(147,197,253,0.7)"/></svg>
              }
            </button>

            <div className="tsm-dots" style={{ opacity:0, pointerEvents:"none" }}>
              <div className="tsm-dot tsm-dot-active" />
            </div>

            <button className="tsm-nav-btn" onClick={() => navigate("next")} aria-label="Next">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="rgba(147,197,253,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;