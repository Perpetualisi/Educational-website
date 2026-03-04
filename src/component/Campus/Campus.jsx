import React, { useState, useRef, useEffect } from "react";
import gallery_1 from "../../assets/gallery-1.png";
import gallery_2 from "../../assets/gallery-2.png";
import gallery_3 from "../../assets/gallery-3.png";
import gallery_4 from "../../assets/gallery-4.png";

const galleryData = [
  { img: gallery_1, label: "Main Auditorium",   tag: "Events & Conferences" },
  { img: gallery_2, label: "Research Library",  tag: "Knowledge Hub"        },
  { img: gallery_3, label: "Innovation Lab",    tag: "Science & Tech"       },
  { img: gallery_4, label: "Campus Gardens",    tag: "Student Life"         },
];

/* ── Single gallery tile with 3D tilt + lightbox trigger ── */
const GalleryTile = ({ item, index, onOpen }) => {
  const tileRef = useRef(null);
  const [tilt,    setTilt]    = useState({ x: 0, y: 0 });
  const [glare,   setGlare]   = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [reveal,  setReveal]  = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setReveal(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (tileRef.current) obs.observe(tileRef.current);
    return () => obs.disconnect();
  }, []);

  const onMouseMove = (e) => {
    const el = tileRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top)  / height;
    setTilt({ x: (y - 0.5) * -14, y: (x - 0.5) * 14 });
    setGlare({ x: x * 100, y: y * 100 });
  };

  return (
    <div
      ref={tileRef}
      className="cmp-tile-wrap"
      style={{
        opacity:    reveal ? 1 : 0,
        transform:  reveal ? "none" : "translateY(28px) scale(0.96)",
        transition: `opacity .7s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s,
                     transform .7s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s`,
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      onClick={() => onOpen(index)}
    >
      <div
        className="cmp-tile"
        style={{
          transform: hovered
            ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03,1.03,1.03)`
            : "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
          transition: hovered ? "transform 0.12s ease-out" : "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Image */}
        <img
          src={item.img}
          alt={item.label}
          className="cmp-tile-img"
          style={{ transform: hovered ? "scale(1.09)" : "scale(1)" }}
        />

        {/* Base overlay */}
        <div className="cmp-tile-base" />

        {/* Glare */}
        {hovered && (
          <div className="cmp-tile-glare" style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%,
              rgba(255,255,255,0.12) 0%, transparent 60%)`,
          }} />
        )}

        {/* Glow border */}
        <div className="cmp-tile-border" style={{
          opacity:    hovered ? 1 : 0,
          boxShadow:  "inset 0 0 0 1.5px rgba(96,165,250,0.6), 0 0 32px rgba(59,130,246,0.15)",
        }} />

        {/* Default label */}
        <div className="cmp-tile-label" style={{
          opacity:   hovered ? 0 : 1,
          transform: hovered ? "translateY(6px)" : "translateY(0)",
        }}>
          <span className="cmp-tile-tag">{item.tag}</span>
          <p className="cmp-tile-name">{item.label}</p>
        </div>

        {/* Hover overlay */}
        <div className="cmp-tile-hover" style={{
          opacity:   hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(16px)",
        }}>
          <div className="cmp-tile-zoom-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="1.8"/>
              <path d="M15.5 15.5L20 20" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M7 10h6M10 7v6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="cmp-tile-hover-label">{item.label}</p>
          <span className="cmp-tile-hover-tag">{item.tag}</span>
        </div>
      </div>
    </div>
  );
};

/* ── Lightbox ── */
const Lightbox = ({ items, active, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft")  onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  if (active === null) return null;
  const item = items[active];

  return (
    <div className="cmp-lb-backdrop" onClick={onClose}>
      <div className="cmp-lb-box" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="cmp-lb-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2l14 14M16 2L2 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Prev */}
        <button className="cmp-lb-nav cmp-lb-prev" onClick={onPrev} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 3L4 9l7 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Image */}
        <img src={item.img} alt={item.label} className="cmp-lb-img" />

        {/* Next */}
        <button className="cmp-lb-nav cmp-lb-next" onClick={onNext} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 3l7 6-7 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Caption */}
        <div className="cmp-lb-caption">
          <span className="cmp-lb-caption-tag">{item.tag}</span>
          <p className="cmp-lb-caption-label">{item.label}</p>
          <p className="cmp-lb-counter">{active + 1} / {items.length}</p>
        </div>

        {/* Dot indicators */}
        <div className="cmp-lb-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`cmp-lb-dot ${i === active ? "cmp-lb-dot-active" : ""}`}
              onClick={() => {}}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main section ── */
const Campus = () => {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const openLightbox  = (i) => { setLightboxIdx(i); document.body.style.overflow = "hidden"; };
  const closeLightbox = ()  => { setLightboxIdx(null); document.body.style.overflow = ""; };
  const prevImg = () => setLightboxIdx((i) => (i - 1 + galleryData.length) % galleryData.length);
  const nextImg = () => setLightboxIdx((i) => (i + 1) % galleryData.length);

  return (
    <section id="campus" className="cmp-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

        /* ── Section ── */
        .cmp-section {
          position: relative; width: 100%;
          padding: clamp(72px,10vw,120px) 0;
          background:
            radial-gradient(ellipse 65% 40% at 90% 10%, rgba(29,78,216,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 55% 35% at 5%  90%, rgba(37,99,235,0.06) 0%, transparent 65%),
            linear-gradient(160deg, #020b18 0%, #041220 40%, #061a30 70%, #030e1e 100%);
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
        }
        .cmp-section::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(96,165,250,.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,.022) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── Header ── */
        .cmp-header {
          position: relative; z-index: 1;
          text-align: center;
          padding: 0 clamp(16px,5vw,72px);
          margin-bottom: clamp(40px,6vw,64px);
        }
        .cmp-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 100px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(96,165,250,0.25);
          font-size: 10px; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          color: #93c5fd; margin-bottom: 20px;
        }
        .cmp-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #3b82f6; box-shadow: 0 0 6px #3b82f6;
          animation: cmpDot 2s ease-in-out infinite;
        }
        @keyframes cmpDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

        .cmp-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          font-weight: 900; line-height: 1.08;
          letter-spacing: -0.025em; color: #eff6ff;
          margin-bottom: 14px;
        }
        .cmp-title-accent {
          background: linear-gradient(135deg, #60a5fa, #93c5fd, #bfdbfe);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cmp-subtitle {
          font-size: clamp(13.5px,1.5vw,15.5px);
          color: rgba(191,219,254,0.6); font-weight: 300;
          max-width: 480px; margin: 0 auto; line-height: 1.8;
        }

        /* ── Grid ── */
        .cmp-grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(12px, 2vw, 20px);
          padding: 0 clamp(16px,5vw,72px);
          max-width: 1280px; margin: 0 auto;
        }
        @media (max-width: 900px) { .cmp-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 500px) { .cmp-grid { grid-template-columns: 1fr; } }

        /* ── Tile wrapper ── */
        .cmp-tile-wrap {
          cursor: pointer;
          transform-style: preserve-3d;
        }

        /* ── Tile ── */
        .cmp-tile {
          position: relative;
          width: 100%; aspect-ratio: 3/4;
          border-radius: 18px; overflow: hidden;
          transform-style: preserve-3d;
          will-change: transform;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(96,165,250,0.08);
        }
        @media (max-width: 900px) { .cmp-tile { aspect-ratio: 1/1; } }

        .cmp-tile-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .cmp-tile-base {
          position: absolute; inset: 0;
          background: linear-gradient(to top,
            rgba(2,11,24,0.88) 0%,
            rgba(4,18,32,0.45) 50%,
            rgba(4,18,32,0.12) 100%);
          z-index: 1;
        }
        .cmp-tile-glare {
          position: absolute; inset: 0; z-index: 2;
          pointer-events: none; border-radius: 18px;
        }
        .cmp-tile-border {
          position: absolute; inset: 0; z-index: 3;
          border-radius: 18px; pointer-events: none;
          transition: opacity .35s ease, box-shadow .35s ease;
        }

        /* Default label */
        .cmp-tile-label {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 4;
          padding: 20px 18px 18px;
          transition: opacity .3s ease, transform .3s ease;
        }
        .cmp-tile-tag {
          display: inline-block;
          padding: 2px 9px; border-radius: 100px;
          font-size: 9px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          background: rgba(59,130,246,0.2);
          border: 1px solid rgba(96,165,250,0.3);
          color: #93c5fd; margin-bottom: 6px;
        }
        .cmp-tile-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; font-weight: 800;
          color: #fff; letter-spacing: -0.015em; line-height: 1.2;
        }

        /* Hover overlay */
        .cmp-tile-hover {
          position: absolute; inset: 0; z-index: 5;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 6px;
          background: linear-gradient(160deg, rgba(4,18,48,0.78), rgba(2,11,30,0.90));
          backdrop-filter: blur(3px);
          transition: opacity .3s ease, transform .35s cubic-bezier(0.22,1,0.36,1);
          text-align: center; padding: 20px;
        }
        .cmp-tile-zoom-icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(59,130,246,0.18);
          border: 1.5px solid rgba(96,165,250,0.45);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 10px;
          box-shadow: 0 0 20px rgba(59,130,246,0.2);
          transition: transform .3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cmp-tile-wrap:hover .cmp-tile-zoom-icon { transform: scale(1.1); }
        .cmp-tile-hover-label {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 800;
          color: #fff; letter-spacing: -0.015em;
        }
        .cmp-tile-hover-tag {
          font-size: 10px; font-weight: 600;
          letter-spacing: .1em; text-transform: uppercase;
          color: rgba(147,197,253,0.6);
        }

        /* ── Stats strip ── */
        .cmp-stats {
          position: relative; z-index: 1;
          display: flex; justify-content: center;
          flex-wrap: wrap; gap: 12px;
          padding: clamp(36px,5vw,56px) clamp(16px,5vw,72px) 0;
          max-width: 1280px; margin: 0 auto;
        }
        .cmp-stat-card {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 22px; border-radius: 14px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(96,165,250,0.12);
          backdrop-filter: blur(10px);
          transition: border-color .3s ease, transform .3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cmp-stat-card:hover {
          border-color: rgba(96,165,250,0.32);
          transform: translateY(-3px);
        }
        .cmp-stat-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(29,78,216,0.4), rgba(59,130,246,0.25));
          border: 1px solid rgba(96,165,250,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .cmp-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 1.25rem; font-weight: 900;
          color: #eff6ff; letter-spacing: -0.02em; line-height: 1;
        }
        .cmp-stat-num em { font-style: normal; color: #60a5fa; }
        .cmp-stat-lbl {
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .1em;
          color: rgba(147,197,253,0.5);
        }

        /* ── Lightbox ── */
        .cmp-lb-backdrop {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(2,8,20,0.92);
          backdrop-filter: blur(18px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: cmpLbIn .3s ease;
        }
        @keyframes cmpLbIn { from{opacity:0} to{opacity:1} }

        .cmp-lb-box {
          position: relative;
          max-width: 900px; width: 100%;
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(96,165,250,0.15);
          animation: cmpLbBoxIn .35s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes cmpLbBoxIn { from{transform:scale(.93);opacity:0} to{transform:none;opacity:1} }

        .cmp-lb-img {
          width: 100%; max-height: 75vh;
          object-fit: cover; display: block;
        }

        .cmp-lb-close {
          position: absolute; top: 14px; right: 14px; z-index: 10;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(4,18,48,0.85); border: 1px solid rgba(96,165,250,0.25);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; backdrop-filter: blur(8px);
          transition: background .2s ease, transform .2s ease;
        }
        .cmp-lb-close:hover { background: rgba(37,99,235,0.5); transform: scale(1.08); }

        .cmp-lb-nav {
          position: absolute; top: 50%; z-index: 10;
          transform: translateY(-50%);
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(4,18,48,0.85); border: 1px solid rgba(96,165,250,0.25);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; backdrop-filter: blur(8px);
          transition: background .2s ease, transform .2s ease;
        }
        .cmp-lb-nav:hover { background: rgba(37,99,235,0.5); transform: translateY(-50%) scale(1.08); }
        .cmp-lb-prev { left: 14px; }
        .cmp-lb-next { right: 14px; }

        .cmp-lb-caption {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 10;
          padding: 20px 24px 16px;
          background: linear-gradient(to top, rgba(2,11,24,0.95), transparent);
          display: flex; align-items: flex-end; justify-content: space-between; gap: 12px;
        }
        .cmp-lb-caption-tag {
          display: inline-block;
          font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
          color: #93c5fd; margin-bottom: 4px; display: block;
        }
        .cmp-lb-caption-label {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem; font-weight: 800; color: #fff;
        }
        .cmp-lb-counter {
          font-size: 11px; color: rgba(147,197,253,0.5);
          font-weight: 600; letter-spacing: .08em; white-space: nowrap;
        }

        .cmp-lb-dots {
          position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
          z-index: 11; display: flex; gap: 6px;
        }
        .cmp-lb-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.3); border: none; cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }
        .cmp-lb-dot-active {
          background: #3b82f6;
          transform: scale(1.3);
          box-shadow: 0 0 6px #3b82f6;
        }
      `}</style>

      {/* ── Header ── */}
      <div className="cmp-header">
        <div className="cmp-eyebrow">
          <span className="cmp-eyebrow-dot" />
          Campus Life
        </div>
        <h2 className="cmp-title">
          Explore Our <span className="cmp-title-accent">World-Class Campus</span>
        </h2>
        <p className="cmp-subtitle">
          A living, breathing community — where cutting-edge facilities meet spaces designed for discovery, creativity, and belonging.
        </p>
      </div>

      {/* ── Gallery grid ── */}
      <div className="cmp-grid">
        {galleryData.map((item, i) => (
          <GalleryTile key={i} item={item} index={i} onOpen={openLightbox} />
        ))}
      </div>

      {/* ── Stats strip ── */}
      <div className="cmp-stats">
        {[
          { icon: "🏛️", num: "48",  suffix: "+", label: "Facilities"       },
          { icon: "🌳", num: "120", suffix: "ac", label: "Campus Area"      },
          { icon: "🔬", num: "22",  suffix: "+",  label: "Research Labs"    },
          { icon: "🏠", num: "6",   suffix: "k+", label: "Student Housing"  },
        ].map((s) => (
          <div key={s.label} className="cmp-stat-card">
            <div className="cmp-stat-icon">{s.icon}</div>
            <div>
              <div className="cmp-stat-num">{s.num}<em>{s.suffix}</em></div>
              <div className="cmp-stat-lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      <Lightbox
        items={galleryData}
        active={lightboxIdx}
        onClose={closeLightbox}
        onPrev={prevImg}
        onNext={nextImg}
      />
    </section>
  );
};

export default Campus;