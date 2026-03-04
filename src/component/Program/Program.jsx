import React, { useRef, useState, useEffect } from "react";
import program_1 from "../../assets/program-1.png";
import program_2 from "../../assets/program-2.png";
import program_3 from "../../assets/program-3.png";
import program_icon_1 from "../../assets/program-icon-1.png";
import program_icon_2 from "../../assets/program-icon-2.png";
import program_icon_3 from "../../assets/program-icon-3.png";

const programsData = [
  {
    img: program_1,
    icon: program_icon_1,
    title: "Graduation",
    subtitle: "Undergraduate Degree",
    duration: "3 – 4 Years",
    courses: "120+ Courses",
    badge: "Most Popular",
    badgeColor: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
    accent: "rgba(59,130,246,0.75)",
    accentSoft: "rgba(59,130,246,0.14)",
    accentSolid: "#3b82f6",
    glow: "rgba(59,130,246,0.35)",
    description: "Build a rock-solid academic foundation across arts, sciences, and engineering with world-renowned faculty.",
    tags: ["Arts & Sciences", "Engineering", "Business"],
    number: "01",
  },
  {
    img: program_2,
    icon: program_icon_2,
    title: "Masters",
    subtitle: "Graduate Degree",
    duration: "1 – 2 Years",
    courses: "80+ Specialisations",
    badge: "High Demand",
    badgeColor: "linear-gradient(135deg,#0369a1,#60a5fa)",
    accent: "rgba(96,165,250,0.75)",
    accentSoft: "rgba(96,165,250,0.14)",
    accentSolid: "#60a5fa",
    glow: "rgba(96,165,250,0.35)",
    description: "Deepen your expertise, lead research initiatives, and emerge as a sought-after specialist in your field.",
    tags: ["Research", "Leadership", "Specialisation"],
    number: "02",
  },
  {
    img: program_3,
    icon: program_icon_3,
    title: "Doctorate",
    subtitle: "Post Graduation",
    duration: "3 – 5 Years",
    courses: "40+ Research Tracks",
    badge: "Fully Funded",
    badgeColor: "linear-gradient(135deg,#1e40af,#93c5fd)",
    accent: "rgba(147,197,253,0.75)",
    accentSoft: "rgba(147,197,253,0.14)",
    accentSolid: "#93c5fd",
    glow: "rgba(147,197,253,0.35)",
    description: "Pioneer breakthroughs, publish globally, and shape the next generation of human knowledge.",
    tags: ["Innovation", "Publication", "Fellowship"],
    number: "03",
  },
];

/* ── Particle canvas ─────────────────────────────────── */
const ParticleField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.4 + .5,
      a: Math.random(),
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.a * .55})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(96,165,250,${(.18 * (1 - dist/90))})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0 }} />;
};

/* ── Tilt card ───────────────────────────────────────── */
const TiltCard = ({ program, index, isMobile }) => {
  const cardRef   = useRef(null);
  const [tilt,    setTilt]    = useState({ x: 0, y: 0 });
  const [glare,   setGlare]   = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [active,  setActive]  = useState(false); // mobile tap

  const onMouseMove = (e) => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top)  / height;
    setTilt({ x: (y - 0.5) * -16, y: (x - 0.5) * 16 });
    setGlare({ x: x * 100, y: y * 100 });
  };

  const isRevealed = isMobile ? active : hovered;

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => { setTilt({ x:0, y:0 }); setHovered(false); }}
      onClick={() => isMobile && setActive(a => !a)}
      className="prog-card-wrap"
      style={{ animationDelay: `${index * 0.13}s` }}
    >
      {/* Card number */}
      <div className="prog-card-num">{program.number}</div>

      <div
        className="prog-card"
        style={{
          transform: !isMobile && hovered
            ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.035,1.035,1.035)`
            : "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)",
          transition: hovered
            ? "transform 0.1s ease-out"
            : "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: isRevealed
            ? `0 28px 64px ${program.glow}, 0 0 0 1.5px ${program.accentSolid}40`
            : "0 8px 32px rgba(0,0,0,0.35)",
        }}
      >
        {/* BG image */}
        <div className="prog-img" style={{ transform: isRevealed ? "scale(1.09)" : "scale(1)", transition:"transform 0.65s cubic-bezier(0.22,1,0.36,1)" }}>
          <img src={program.img} alt={program.title} />
        </div>

        {/* Base gradient */}
        <div className="prog-base-overlay" />

        {/* Colour tint overlay on hover */}
        <div className="prog-tint" style={{
          background: `linear-gradient(160deg, ${program.accentSoft} 0%, rgba(2,11,28,0.7) 100%)`,
          opacity: isRevealed ? 1 : 0,
          transition: "opacity 0.4s ease",
        }} />

        {/* Glare */}
        {!isMobile && hovered && (
          <div className="prog-glare" style={{ background:`radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.12) 0%, transparent 65%)` }} />
        )}

        {/* Glow border */}
        <div className="prog-border-glow" style={{
          opacity: isRevealed ? 1 : 0,
          boxShadow: `inset 0 0 0 1.5px ${program.accentSolid}60`,
        }} />

        {/* Badge */}
        <div className="prog-badge" style={{ background: program.badgeColor }}>
          {program.badge}
        </div>

        {/* Mobile tap hint */}
        {isMobile && !active && (
          <div className="prog-tap-hint">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Tap to explore
          </div>
        )}

        {/* Default label */}
        <div className="prog-label-default" style={{ opacity: isRevealed ? 0 : 1, transform: isRevealed ? "translateY(10px)" : "none", transition:"opacity .3s ease, transform .3s ease" }}>
          <div className="prog-label-pill" style={{ background: program.accentSoft, borderColor: program.accentSolid }}>
            <span className="prog-label-dot" style={{ background: program.accentSolid }} />
            {program.subtitle}
          </div>
          <p className="prog-label-title">{program.title}</p>
        </div>

        {/* Hover / tap reveal panel */}
        <div className="prog-hover-panel" style={{ opacity: isRevealed ? 1 : 0, transform: isRevealed ? "translateY(0)" : "translateY(22px)", transition:"opacity .35s ease, transform .35s cubic-bezier(0.22,1,0.36,1)" }}>
          <div className="prog-icon-wrap" style={{
            background: program.accentSoft,
            border: `1px solid ${program.accentSolid}50`,
            transform: isRevealed ? "scale(1) translateY(0)" : "scale(0.8) translateY(10px)",
            transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.06s",
          }}>
            <img src={program.icon} alt="" />
          </div>

          <h3 className="prog-hover-title">{program.title}</h3>
          <p className="prog-hover-sub">{program.subtitle}</p>
          <p className="prog-hover-desc">{program.description}</p>

          {/* Tags row */}
          <div className="prog-inline-tags">
            {program.tags.map(t => (
              <span key={t} className="prog-inline-tag" style={{ borderColor: `${program.accentSolid}40`, color: program.accentSolid }}>
                {t}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="prog-stats">
            <div className="prog-stat">
              <span className="prog-stat-num" style={{ color: program.accentSolid }}>{program.duration}</span>
              <span className="prog-stat-label">Duration</span>
            </div>
            <div className="prog-stat-divider" />
            <div className="prog-stat">
              <span className="prog-stat-num" style={{ color: program.accentSolid }}>{program.courses}</span>
              <span className="prog-stat-label">Available</span>
            </div>
          </div>

          {/* CTA */}
          <button className="prog-cta" style={{ background: program.badgeColor, boxShadow: `0 6px 20px ${program.glow}` }}>
            Explore Program
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Counter badge ───────────────────────────────────── */
const CountUp = ({ end, suffix, label }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true; obs.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 1600, 1);
        setVal(Math.floor((1 - Math.pow(1-p, 3)) * end));
        if (p < 1) requestAnimationFrame(tick); else setVal(end);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return (
    <div ref={ref} className="prog-counter">
      <span className="prog-counter-num">{val.toLocaleString()}{suffix}</span>
      <span className="prog-counter-label">{label}</span>
    </div>
  );
};

/* ── Main ────────────────────────────────────────────── */
const Program = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="programs" className="prog-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

        /* ── Section shell ── */
        .prog-section {
          position: relative;
          width: 100%;
          padding: clamp(64px, 10vw, 116px) 0 clamp(64px, 8vw, 96px);
          background:
            radial-gradient(ellipse 70% 40% at 10% 20%, rgba(29,78,216,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 60% 35% at 90% 80%, rgba(37,99,235,0.07) 0%, transparent 65%),
            linear-gradient(160deg, #020b18 0%, #041220 40%, #061a30 70%, #030e1e 100%);
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }
        .prog-section::before {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(96,165,250,.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,.022) 1px, transparent 1px);
          background-size: 58px 58px;
        }
        /* Noise grain */
        .prog-section::after {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* ── Header ── */
        .prog-header {
          position: relative; z-index: 1;
          text-align: center;
          margin-bottom: clamp(36px, 6vw, 68px);
          padding: 0 clamp(16px, 5vw, 72px);
        }
        .prog-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 15px; border-radius: 100px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(96,165,250,0.22);
          font-size: 10px; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          color: #93c5fd; margin-bottom: 22px;
        }
        .prog-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #3b82f6; box-shadow: 0 0 6px #3b82f6;
          animation: progDot 2s ease-in-out infinite;
        }
        @keyframes progDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.65)} }

        .prog-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.85rem, 4.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: #eff6ff;
          margin-bottom: 16px;
          text-decoration: none !important;
        }
        .prog-title em,
        .prog-title span,
        .prog-title * {
          text-decoration: none !important;
        }
        .prog-title-accent {
          background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #bfdbfe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none !important;
        }
        .prog-subtitle {
          font-size: clamp(13px, 1.5vw, 15.5px);
          color: rgba(191,219,254,0.55);
          font-weight: 300;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.85;
        }
        .prog-divider {
          width: 56px; height: 2px;
          background: linear-gradient(90deg, #1d4ed8, #60a5fa, #bfdbfe);
          border-radius: 2px;
          margin: 22px auto 0;
          box-shadow: 0 0 14px rgba(59,130,246,.45);
        }

        /* ── Counters ── */
        .prog-counters {
          position: relative; z-index: 1;
          display: flex; justify-content: center;
          flex-wrap: wrap; gap: clamp(12px,3vw,28px);
          padding: 0 clamp(16px, 5vw, 72px);
          margin-bottom: clamp(36px, 6vw, 60px);
        }
        .prog-counter {
          display: flex; flex-direction: column; align-items: center;
          padding: 14px 22px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(96,165,250,0.12);
          backdrop-filter: blur(10px);
          min-width: 110px;
          transition: border-color .3s ease, transform .3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .prog-counter:hover { border-color: rgba(96,165,250,0.35); transform: translateY(-3px); }
        .prog-counter-num {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.3rem, 2.5vw, 1.75rem);
          font-weight: 900; color: #fff; line-height: 1;
        }
        .prog-counter-label {
          font-size: 10px; font-weight: 500;
          letter-spacing: .14em; text-transform: uppercase;
          color: rgba(147,197,253,0.5); margin-top: 4px;
        }

        /* ── Grid ── */
        .prog-grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(14px, 2.5vw, 26px);
          padding: 0 clamp(16px, 5vw, 72px);
          max-width: 1280px;
          margin: 0 auto;
        }
        @media (max-width: 920px) {
          .prog-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .prog-grid { grid-template-columns: 1fr; gap: 16px; }
        }

        /* ── Card wrap ── */
        .prog-card-wrap {
          position: relative;
          opacity: 0;
          animation: progCardIn 0.72s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes progCardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .prog-card-num {
          position: absolute;
          top: -14px; left: 18px;
          z-index: 10;
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem; font-weight: 900;
          letter-spacing: .18em; text-transform: uppercase;
          color: rgba(96,165,250,0.4);
          pointer-events: none;
        }

        /* ── Card ── */
        .prog-card {
          position: relative;
          width: 100%;
          height: clamp(340px, 42vw, 470px);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transform-style: preserve-3d;
          will-change: transform;
          transition: box-shadow 0.4s ease;
        }
        @media (max-width: 560px) { .prog-card { height: 340px; } }

        .prog-img { position: absolute; inset: 0; will-change: transform; }
        .prog-img img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }

        .prog-base-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(2,11,24,0.95) 0%, rgba(4,18,32,0.55) 45%, rgba(4,18,32,0.18) 100%);
        }
        .prog-tint { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .prog-glare { position: absolute; inset: 0; z-index: 2; pointer-events: none; border-radius: 20px; }
        .prog-border-glow { position: absolute; inset: 0; border-radius: 20px; z-index: 3; pointer-events: none; transition: opacity 0.35s ease; }

        .prog-badge {
          position: absolute; top: 14px; left: 14px; z-index: 5;
          padding: 4px 11px; border-radius: 100px;
          font-size: 9.5px; font-weight: 700;
          letter-spacing: .13em; text-transform: uppercase;
          color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.4);
        }

        .prog-tap-hint {
          position: absolute; bottom: 18px; right: 16px; z-index: 5;
          display: flex; align-items: center; gap: 5px;
          font-size: 10px; color: rgba(255,255,255,0.45);
          letter-spacing: .08em;
        }

        /* Default label */
        .prog-label-default {
          position: absolute; bottom: 0; left: 0; right: 0;
          z-index: 4; padding: 24px 20px 20px;
        }
        .prog-label-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 100px; border: 1px solid;
          font-size: 9.5px; font-weight: 600;
          letter-spacing: .1em; text-transform: uppercase;
          color: rgba(255,255,255,.72); margin-bottom: 7px;
        }
        .prog-label-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }
        .prog-label-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.15rem, 2vw, 1.35rem);
          font-weight: 800; color: #fff; letter-spacing: -0.02em;
        }

        /* Hover panel */
        .prog-hover-panel {
          position: absolute; inset: 0; z-index: 5;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 22px 20px; text-align: center;
          background: linear-gradient(160deg, rgba(4,16,44,0.88), rgba(2,10,28,0.94));
          backdrop-filter: blur(6px);
        }
        .prog-icon-wrap {
          width: 52px; height: 52px; border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px;
        }
        .prog-icon-wrap img { width: 28px; height: 28px; object-fit: contain; filter: brightness(0) invert(1); }

        .prog-hover-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.2rem, 2.2vw, 1.4rem);
          font-weight: 900; color: #fff; letter-spacing: -0.02em; margin-bottom: 2px;
        }
        .prog-hover-sub {
          font-size: 10px; font-weight: 600;
          letter-spacing: .13em; text-transform: uppercase;
          color: rgba(147,197,253,.6); margin-bottom: 10px;
        }
        .prog-hover-desc {
          font-size: 12.5px; font-weight: 300;
          color: rgba(191,219,254,.6); line-height: 1.75;
          margin-bottom: 12px; max-width: 230px;
        }

        /* Inline tags */
        .prog-inline-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; margin-bottom: 13px; }
        .prog-inline-tag {
          padding: 2px 9px; border-radius: 100px;
          font-size: 9px; font-weight: 600;
          letter-spacing: .1em; text-transform: uppercase;
          border: 1px solid; background: transparent;
        }

        /* Stats */
        .prog-stats { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .prog-stat  { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .prog-stat-num   { font-size: 12.5px; font-weight: 700; }
        .prog-stat-label { font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: rgba(147,197,253,.48); }
        .prog-stat-divider { width: 1px; height: 26px; background: rgba(96,165,250,.18); }

        /* CTA button */
        .prog-cta {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 20px; border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: 12px; font-weight: 600;
          letter-spacing: .06em; color: #fff;
          border: none; cursor: pointer;
          transition: transform .3s cubic-bezier(0.34,1.56,0.64,1), box-shadow .3s ease;
        }
        .prog-cta:hover { transform: translateY(-2px) scale(1.04); }

        /* ── Tags strip ── */
        .prog-tags {
          position: relative; z-index: 1;
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 8px;
          padding: clamp(36px, 5vw, 56px) clamp(16px, 5vw, 72px) 0;
          max-width: 1280px; margin: 0 auto;
        }
        .prog-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 13px; border-radius: 100px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(96,165,250,.14);
          font-size: 10.5px; font-weight: 500;
          color: rgba(191,219,254,.5);
          transition: all .25s ease; cursor: default;
        }
        .prog-tag:hover {
          background: rgba(59,130,246,.1);
          border-color: rgba(96,165,250,.32);
          color: #bfdbfe; transform: translateY(-2px);
        }
        .prog-tag-dot { width: 4px; height: 4px; border-radius: 50%; background: #3b82f6; opacity: .65; }

        /* ── Comparison table ── */
        .prog-compare {
          position: relative; z-index: 1;
          margin: clamp(40px,6vw,64px) auto 0;
          max-width: 860px;
          padding: 0 clamp(16px, 5vw, 72px);
        }
        .prog-compare-label {
          text-align: center;
          font-size: 10px; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          color: rgba(147,197,253,0.4); margin-bottom: 18px;
        }
        .prog-compare-table {
          width: 100%; border-collapse: separate; border-spacing: 0;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(96,165,250,0.12);
          border-radius: 16px; overflow: hidden;
        }
        .prog-compare-table th {
          padding: 12px 16px;
          font-family: 'Syne', sans-serif;
          font-size: 11px; font-weight: 800;
          letter-spacing: .1em; text-transform: uppercase;
          color: rgba(147,197,253,0.7);
          background: rgba(29,78,216,0.07);
          border-bottom: 1px solid rgba(96,165,250,0.1);
          text-align: left;
        }
        .prog-compare-table th:first-child { border-radius: 16px 0 0 0; }
        .prog-compare-table th:last-child  { border-radius: 0 16px 0 0; }
        .prog-compare-table td {
          padding: 11px 16px;
          font-size: 12.5px; color: rgba(191,219,254,0.65);
          border-bottom: 1px solid rgba(96,165,250,0.06);
        }
        .prog-compare-table tr:last-child td { border-bottom: none; }
        .prog-compare-table tr:hover td { background: rgba(59,130,246,0.04); color: rgba(191,219,254,0.85); }
        .prog-compare-dot {
          display: inline-block; width: 7px; height: 7px; border-radius: 50%;
          background: #3b82f6; box-shadow: 0 0 6px #3b82f6;
        }
        @media (max-width: 560px) {
          .prog-compare { display: none; }
          .prog-counters { gap: 8px; }
          .prog-counter  { min-width: 80px; padding: 11px 14px; }
          .prog-counter-num { font-size: 1.2rem; }
        }
      `}</style>

      {/* Particle background */}
      <ParticleField />

      {/* Header */}
      <div className="prog-header">
        <div className="prog-eyebrow">
          <span className="prog-eyebrow-dot" />
          Academic Pathways
        </div>
        <h2 className="prog-title">
          Choose Your{" "}
          <span className="prog-title-accent">Academic Journey</span>
        </h2>
        <p className="prog-subtitle">
          Three distinct pathways — each engineered to take you further, faster, and with lasting impact.
        </p>
        <div className="prog-divider" />
      </div>

      {/* Animated counters */}
      <div className="prog-counters">
        <CountUp end={240}   suffix="+"  label="Programs" />
        <CountUp end={12000} suffix="+"  label="Students" />
        <CountUp end={98}    suffix="%"  label="Employment" />
        <CountUp end={45}    suffix=""   label="Countries" />
      </div>

      {/* Cards */}
      <div className="prog-grid">
        {programsData.map((program, index) => (
          <TiltCard key={index} program={program} index={index} isMobile={isMobile} />
        ))}
      </div>

      {/* Tags */}
      <div className="prog-tags">
        {["Accredited Programs","Global Faculty","Scholarship Available","Flexible Schedule","Industry Partnerships","Research Opportunities","Exchange Programs","Career Placement"].map(tag => (
          <div key={tag} className="prog-tag">
            <span className="prog-tag-dot" />
            {tag}
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="prog-compare">
        <p className="prog-compare-label">Quick Comparison</p>
        <table className="prog-compare-table">
          <thead>
            <tr>
              <th>Program</th>
              <th>Duration</th>
              <th>Courses</th>
              <th>Scholarship</th>
              <th>Research</th>
            </tr>
          </thead>
          <tbody>
            {programsData.map((p) => (
              <tr key={p.title}>
                <td style={{ fontWeight:600, color:"rgba(224,242,254,0.85)", fontFamily:"'Syne',sans-serif", fontSize:13 }}>{p.title}</td>
                <td>{p.duration}</td>
                <td>{p.courses}</td>
                <td>{p.title === "Doctorate" ? <span className="prog-compare-dot" /> : "Merit-based"}</td>
                <td>{p.title !== "Graduation" ? <span className="prog-compare-dot" /> : "Optional"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Program;