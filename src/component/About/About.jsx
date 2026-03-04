import React, { useRef, useState, useEffect } from "react";
import about_img from "../../assets/about.png";
import play_icon from "../../assets/play-icon.png";

/* ── Animated counter ── */
const Counter = ({ end, suffix = "", label, icon }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true; obs.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 1800, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setCount(Math.floor(eased * end));
        if (p < 1) requestAnimationFrame(tick); else setCount(end);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return (
    <div ref={ref} className="abt-stat">
      <span className="abt-stat-icon">{icon}</span>
      <span className="abt-stat-num">{count.toLocaleString()}<em>{suffix}</em></span>
      <span className="abt-stat-label">{label}</span>
    </div>
  );
};

/* ── Marquee strip ── */
const AbtMarquee = () => {
  const items = ["QS World Top 50", "130+ Years", "42,000 Alumni", "98% Employment", "180 Programs", "40+ Countries", "$2.4B Endowment", "Nobel Laureates"];
  const doubled = [...items, ...items];
  return (
    <div className="abt-marquee-wrap">
      <div className="abt-marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="abt-marquee-item">
            <span className="abt-marquee-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Tab content ── */
const tabs = [
  {
    id: "mission",
    label: "Mission",
    icon: "◎",
    content: "We exist to cultivate curious minds and principled leaders — graduates who don't just adapt to the world, but reshape it. Every program, every lab, every mentor is chosen with that singular purpose.",
  },
  {
    id: "vision",
    label: "Vision",
    icon: "◈",
    content: "To be the world's most impactful university by 2035 — measured not in rankings alone, but in the breakthroughs our alumni create, the communities they uplift, and the futures they build.",
  },
  {
    id: "values",
    label: "Values",
    icon: "◇",
    content: "Integrity, curiosity, inclusion and excellence. These aren't aspirations — they are our daily operating principles, woven into every course, partnership, and campus interaction.",
  },
];

/* ── Main component ── */
const About = ({ setPlayState }) => {
  const imgRef    = useRef(null);
  const [tilt,    setTilt]    = useState({ x: 0, y: 0 });
  const [glare,   setGlare]   = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [reveal,  setReveal]  = useState(false);
  const [activeTab, setActiveTab] = useState("mission");
  const [isMobile, setIsMobile]   = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setReveal(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    const el = document.getElementById("about");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const onMouseMove = (e) => {
    if (isMobile) return;
    const card = imgRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top)  / height;
    setTilt({ x: (y - 0.5) * -13, y: (x - 0.5) * 13 });
    setGlare({ x: x * 100, y: y * 100 });
  };
  const onMouseLeave = () => { setTilt({ x: 0, y: 0 }); setHovered(false); };

  return (
    <section id="about" className="abt-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

        /* ── Section ── */
        .abt-section {
          position: relative; width: 100%;
          padding: clamp(64px, 10vw, 116px) 0 0;
          background:
            radial-gradient(ellipse 65% 45% at 5%  15%, rgba(29,78,216,0.07)  0%, transparent 65%),
            radial-gradient(ellipse 55% 40% at 95% 85%, rgba(37,99,235,0.06)  0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 55% 50%, rgba(96,165,250,0.04) 0%, transparent 70%),
            linear-gradient(160deg, #020b18 0%, #041220 40%, #061a30 70%, #030e1e 100%);
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
        }
        .abt-section::before {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(96,165,250,.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,.022) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        /* Noise */
        .abt-section::after {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.024;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* ── Inner grid ── */
        .abt-inner {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
          padding: 0 clamp(16px, 5vw, 72px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(36px, 6vw, 88px);
          align-items: center;
        }
        @media (max-width: 820px) {
          .abt-inner {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .abt-img-col  { order: 2; }
          .abt-text-col { order: 1; }
        }

        /* ══ IMAGE COL ══ */
        .abt-img-col {
          position: relative;
        }
        .abt-img-col::before {
          content: ''; position: absolute; inset: -18px; border-radius: 28px;
          background: linear-gradient(135deg, rgba(59,130,246,0.11) 0%, rgba(96,165,250,0.05) 50%, transparent 100%);
          border: 1px solid rgba(96,165,250,0.1); z-index: 0; pointer-events: none;
        }
        .abt-corner { position: absolute; width: 26px; height: 26px; z-index: 3; pointer-events: none; }
        .abt-corner-tl { top:-5px; left:-5px;   border-top:2.5px solid #3b82f6; border-left:2.5px solid #3b82f6; border-radius:4px 0 0 0; }
        .abt-corner-tr { top:-5px; right:-5px;  border-top:2.5px solid #3b82f6; border-right:2.5px solid #3b82f6; border-radius:0 4px 0 0; }
        .abt-corner-bl { bottom:-5px; left:-5px;  border-bottom:2.5px solid #3b82f6; border-left:2.5px solid #3b82f6; border-radius:0 0 0 4px; }
        .abt-corner-br { bottom:-5px; right:-5px; border-bottom:2.5px solid #3b82f6; border-right:2.5px solid #3b82f6; border-radius:0 0 4px 0; }

        /* 3D card */
        .abt-card {
          position: relative; z-index: 1; border-radius: 22px; overflow: hidden;
          transform-style: preserve-3d; will-change: transform; cursor: pointer;
          box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(96,165,250,0.1);
        }
        .abt-photo {
          width: 100%; height: auto; display: block;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .abt-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(2,11,24,0.65) 0%, rgba(4,18,40,0.22) 50%, transparent 100%);
          z-index: 1;
        }
        .abt-glare       { position: absolute; inset: 0; z-index: 2; pointer-events: none; border-radius: 22px; }
        .abt-glow-border { position: absolute; inset: 0; z-index: 3; border-radius: 22px; pointer-events: none; transition: box-shadow .35s ease, opacity .35s ease; }

        /* Play btn */
        .abt-play { position: absolute; inset: 0; z-index: 4; display: flex; align-items: center; justify-content: center; }
        .abt-play-btn {
          position: relative; width: 70px; height: 70px; border-radius: 50%;
          background: rgba(255,255,255,0.92);
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
          transition: transform .35s cubic-bezier(0.34,1.56,0.64,1), box-shadow .35s ease;
        }
        .abt-play-btn:hover { transform: scale(1.12); box-shadow: 0 12px 44px rgba(0,0,0,0.4), 0 0 0 12px rgba(59,130,246,0.14); }
        .abt-play-btn img { width: 24px; margin-left: 4px; }
        .abt-pulse { position: absolute; inset: -8px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.32); animation: abtPulse 2.2s ease-out infinite; }
        .abt-pulse-2 { inset: -16px; animation-delay: 0.55s; }
        @keyframes abtPulse { 0%{transform:scale(0.92);opacity:.7} 100%{transform:scale(1.3);opacity:0} }

        /* Floating badges */
        .abt-float-badge {
          position: absolute; bottom: 22px; left: -20px; z-index: 5;
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; border-radius: 14px;
          background: rgba(4,18,48,0.9); border: 1px solid rgba(96,165,250,0.2);
          backdrop-filter: blur(18px); box-shadow: 0 8px 32px rgba(0,0,0,0.45);
          animation: abtFloat 3.5s ease-in-out infinite;
        }
        .abt-float-badge-2 {
          position: absolute; top: 22px; right: -16px; z-index: 5;
          padding: 9px 14px; border-radius: 12px;
          background: rgba(4,18,48,0.9); border: 1px solid rgba(96,165,250,0.18);
          backdrop-filter: blur(18px); box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: abtFloat 4s ease-in-out infinite reverse;
        }
        .abt-float-badge-3 {
          position: absolute; top: 50%; right: -16px; z-index: 5;
          transform: translateY(-50%);
          padding: 9px 14px; border-radius: 12px;
          background: rgba(4,18,48,0.9); border: 1px solid rgba(96,165,250,0.15);
          backdrop-filter: blur(18px); box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: abtFloat 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        @keyframes abtFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .abt-float-badge-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg,#1d4ed8,#3b82f6);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .abt-float-text strong { display:block; font-size:12.5px; font-weight:700; color:#eff6ff; }
        .abt-float-text span   { font-size:9.5px; color:rgba(147,197,253,0.6); letter-spacing:.04em; }

        @media (max-width: 820px) {
          .abt-float-badge   { left: 8px;  bottom: 14px; }
          .abt-float-badge-2 { right: 8px; top: 14px; }
          .abt-float-badge-3 { display: none; }
          .abt-img-col::before { inset: -8px; }
        }

        /* ══ TEXT COL ══ */
        .abt-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 100px;
          background: rgba(59,130,246,0.1); border: 1px solid rgba(96,165,250,0.25);
          font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
          color: #93c5fd; margin-bottom: 18px;
        }
        .abt-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:#3b82f6; box-shadow:0 0 6px #3b82f6; animation:abtDot 2s ease-in-out infinite; }
        @keyframes abtDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }

        /* Title — no underline on anything */
        .abt-title, .abt-title *, .abt-title-accent {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.75rem, 3.8vw, 2.9rem);
          font-weight: 900; line-height: 1.08;
          letter-spacing: -0.025em; color: #eff6ff;
          margin-bottom: 18px;
          text-decoration: none !important;
        }
        .abt-title-accent {
          background: linear-gradient(135deg, #60a5fa, #93c5fd, #bfdbfe);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          font-size: inherit; font-weight: inherit; line-height: inherit;
          text-decoration: none !important;
        }

        .abt-body {
          font-size: clamp(13px, 1.5vw, 15px);
          color: rgba(191,219,254,0.6); line-height: 1.85;
          font-weight: 300; margin-bottom: 10px;
        }
        .abt-body strong { color: #bfdbfe; font-weight: 600; }

        /* Stats */
        .abt-stats {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 10px; margin: 24px 0 26px;
        }
        @media (max-width: 480px) { .abt-stats { grid-template-columns: repeat(3,1fr); gap: 7px; } }

        .abt-stat {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 14px 10px; border-radius: 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(96,165,250,0.12);
          backdrop-filter: blur(10px); text-align: center;
          transition: border-color .3s ease, transform .3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .abt-stat:hover { border-color: rgba(96,165,250,0.35); transform: translateY(-3px); }
        .abt-stat-icon  { font-size: 1.1rem; margin-bottom: 2px; }
        .abt-stat-num   { font-family:'Syne',sans-serif; font-size:clamp(1.2rem,2.2vw,1.55rem); font-weight:900; color:#eff6ff; letter-spacing:-0.02em; line-height:1; }
        .abt-stat-num em { font-style:normal; color:#60a5fa; font-size:0.9em; }
        .abt-stat-label  { font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:.11em; color:rgba(147,197,253,0.48); margin-top:1px; }

        /* Tabs */
        .abt-tabs { margin-bottom: 24px; }
        .abt-tab-nav {
          display: flex; gap: 4px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(96,165,250,0.1);
          border-radius: 12px; padding: 4px; margin-bottom: 16px;
        }
        .abt-tab-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 12px; border-radius: 9px; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 600;
          letter-spacing: .04em; background: transparent;
          color: rgba(147,197,253,0.5);
          transition: all .25s ease;
        }
        .abt-tab-btn.active {
          background: rgba(29,78,216,0.3); color: #bfdbfe;
          box-shadow: 0 2px 8px rgba(29,78,216,0.25);
        }
        .abt-tab-content {
          font-size: 13.5px; color: rgba(191,219,254,0.62);
          line-height: 1.8; font-weight: 300;
          padding: 14px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.025); border: 1px solid rgba(96,165,250,0.08);
          min-height: 80px;
          animation: abtTabIn .3s ease both;
        }
        @keyframes abtTabIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }

        /* Feature list */
        .abt-features { display: flex; flex-direction: column; gap: 9px; margin-bottom: 28px; }
        .abt-feature  { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(191,219,254,0.68); }
        .abt-feature-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; background:#3b82f6; box-shadow:0 0 7px rgba(59,130,246,0.6); }

        /* CTA row */
        .abt-cta-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .abt-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px; border-radius: 100px;
          background: linear-gradient(135deg,#1d4ed8,#2563eb);
          border: 1px solid rgba(96,165,250,0.3);
          color: #fff; font-size: 13.5px; font-weight: 700; letter-spacing: .04em;
          cursor: pointer; font-family: 'Outfit', sans-serif;
          position: relative; overflow: hidden;
          transition: transform .3s cubic-bezier(0.34,1.56,0.64,1), box-shadow .3s ease;
          text-decoration: none;
        }
        .abt-btn-primary:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 12px 32px rgba(37,99,235,0.5); }
        .abt-btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: rgba(147,197,253,0.65);
          cursor: pointer; letter-spacing: .03em;
          transition: color .2s ease; background: none; border: none;
          font-family: 'Outfit', sans-serif;
        }
        .abt-btn-ghost:hover { color: #93c5fd; }
        .abt-btn-ghost svg { transition: transform .25s ease; }
        .abt-btn-ghost:hover svg { transform: translateX(4px); }

        /* Marquee */
        .abt-marquee-wrap {
          position: relative; z-index: 1;
          margin-top: clamp(48px, 7vw, 80px);
          overflow: hidden;
          border-top: 1px solid rgba(96,165,250,0.1);
          border-bottom: 1px solid rgba(96,165,250,0.1);
          background: rgba(2,11,24,0.5);
          backdrop-filter: blur(8px);
          padding: 12px 0;
        }
        .abt-marquee-track {
          display: flex; width: max-content;
          animation: abtMarquee 28s linear infinite;
        }
        @keyframes abtMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .abt-marquee-item {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 0 28px;
          font-family: 'Outfit', sans-serif; font-size: 11px;
          font-weight: 500; letter-spacing: .16em; text-transform: uppercase;
          color: rgba(147,197,253,0.48); white-space: nowrap;
        }
        .abt-marquee-dot { width:4px; height:4px; border-radius:50%; background:rgba(96,165,250,0.45); flex-shrink:0; }

        /* ── Reveal animations ── */
        .abt-reveal-left  { opacity:0; transform:translateX(-32px); transition:opacity .8s cubic-bezier(0.22,1,0.36,1),transform .8s cubic-bezier(0.22,1,0.36,1); }
        .abt-reveal-right { opacity:0; transform:translateX(32px);  transition:opacity .8s cubic-bezier(0.22,1,0.36,1) .12s,transform .8s cubic-bezier(0.22,1,0.36,1) .12s; }
        .abt-revealed { opacity:1 !important; transform:none !important; }

        /* ── Mobile tweaks ── */
        @media (max-width: 640px) {
          .abt-cta-row   { flex-direction: column; align-items: flex-start; gap: 10px; }
          .abt-btn-primary { width: 100%; justify-content: center; }
          .abt-tab-btn span.abt-tab-icon { display: none; }
          .abt-float-badge-2 { display: none; }
        }
      `}</style>

      <div className="abt-inner">

        {/* ══ IMAGE COL ══ */}
        <div className={`abt-img-col abt-reveal-left ${reveal ? "abt-revealed" : ""}`}>
          <div className="abt-corner abt-corner-tl" />
          <div className="abt-corner abt-corner-tr" />
          <div className="abt-corner abt-corner-bl" />
          <div className="abt-corner abt-corner-br" />

          <div
            ref={imgRef}
            className="abt-card"
            onMouseMove={onMouseMove}
            onMouseEnter={() => !isMobile && setHovered(true)}
            onMouseLeave={onMouseLeave}
            style={{
              transform: !isMobile && hovered
                ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02,1.02,1.02)`
                : "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)",
              transition: hovered ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <img
              className="abt-photo"
              src={about_img}
              alt="University Campus"
              style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
            />
            <div className="abt-card-overlay" />

            {!isMobile && hovered && (
              <div className="abt-glare" style={{ background:`radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.11) 0%, transparent 60%)` }} />
            )}
            <div className="abt-glow-border" style={{ opacity: hovered ? 1 : 0, boxShadow:"inset 0 0 0 1.5px rgba(96,165,250,0.5), 0 0 40px rgba(59,130,246,0.14)" }} />

            <div className="abt-play">
              <div className="abt-play-btn" onClick={() => setPlayState(true)}>
                <div className="abt-pulse" />
                <div className="abt-pulse abt-pulse-2" />
                <img src={play_icon} alt="Play campus video" />
              </div>
            </div>
          </div>

          {/* Badge bottom-left */}
          <div className="abt-float-badge">
            <div className="abt-float-badge-icon">🏆</div>
            <div className="abt-float-text">
              <strong>QS World Top 50</strong>
              <span>Global University Ranking</span>
            </div>
          </div>

          {/* Badge top-right */}
          <div className="abt-float-badge-2">
            <div className="abt-float-text">
              <strong>98% Employment</strong>
              <span>Within 6 months</span>
            </div>
          </div>

          {/* Badge mid-right */}
          <div className="abt-float-badge-3">
            <div className="abt-float-text">
              <strong>$2.4B Endowment</strong>
              <span>Research funding</span>
            </div>
          </div>
        </div>

        {/* ══ TEXT COL ══ */}
        <div className={`abt-text-col abt-reveal-right ${reveal ? "abt-revealed" : ""}`}>

          <div className="abt-eyebrow">
            <span className="abt-eyebrow-dot" />
            About Us
          </div>

          <h2 className="abt-title">
            World-Class Education,<br />
            <span className="abt-title-accent">Global Impact</span>
          </h2>

          <p className="abt-body">
            A <strong>transformative academic experience</strong> built on 130 years of
            excellence. We combine cutting-edge research, personalised mentorship, and
            global industry connections to prepare the leaders of tomorrow.
          </p>

          {/* Stats */}
          <div className="abt-stats">
            <Counter end={130}   suffix="+" label="Years"     icon="🏛️" />
            <Counter end={42000} suffix="+" label="Alumni"    icon="🌍" />
            <Counter end={180}   suffix="+" label="Programs"  icon="📚" />
          </div>

          {/* Tabs — Mission / Vision / Values */}
          <div className="abt-tabs">
            <div className="abt-tab-nav">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`abt-tab-btn${activeTab === t.id ? " active" : ""}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <span className="abt-tab-icon">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
            <div key={activeTab} className="abt-tab-content">
              {tabs.find(t => t.id === activeTab)?.content}
            </div>
          </div>

          {/* Feature list */}
          <div className="abt-features">
            {[
              "World-class faculty from 40+ countries",
              "State-of-the-art research laboratories",
              "Full scholarships & financial aid available",
              "Global exchange programs across 80 universities",
            ].map(f => (
              <div key={f} className="abt-feature">
                <span className="abt-feature-dot" />
                {f}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="abt-cta-row">
            <a href="#programs" className="abt-btn-primary">
              Explore Programs
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M7 3l3.5 3.5L7 10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <button className="abt-btn-ghost" onClick={() => setPlayState && setPlayState(true)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight:2 }}>
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                <polygon points="5.5,4.5 10,7 5.5,9.5" fill="currentColor"/>
              </svg>
              Watch Our Story
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M7 3l3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Marquee strip at bottom */}
      <AbtMarquee />
    </section>
  );
};

export default About;