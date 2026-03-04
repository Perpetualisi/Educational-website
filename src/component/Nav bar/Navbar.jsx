import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-scroll";

const NAV_ITEMS = ["Home", "Programs", "About", "Campus", "Testimonial"];
const NAV_OFFSET = -100;

const Navbar = () => {
  const [sticky, setSticky]         = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActive]  = useState("hero");
  const [scrollPct, setScrollPct]   = useState(0);
  const menuRef = useRef(null);

  /* ── Scroll effects ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSticky(y > 50);

      const d = document.documentElement;
      setScrollPct((y / (d.scrollHeight - d.clientHeight)) * 100);

      const sections = [...NAV_ITEMS.map(i => i === "Home" ? "hero" : i.toLowerCase()), "contact"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(id); break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close on outside click ── */
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenu(false);
      }
    };
    if (mobileMenu) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileMenu]);

  /* ── Lock body scroll when menu open ── */
  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenu]);

  const handleNavClick = () => setMobileMenu(false);
  const sectionId = (item) => item === "Home" ? "hero" : item.toLowerCase();
  const isActive  = (item) => activeSection === sectionId(item);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .nb-font { font-family: 'Outfit', sans-serif; }

        /* ── Sticky glass ── */
        .nb-glass {
          background: rgba(3, 12, 30, 0.90);
          backdrop-filter: blur(24px) saturate(1.8);
          -webkit-backdrop-filter: blur(24px) saturate(1.8);
          border-bottom: 1px solid rgba(96,165,250,0.15);
          box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(96,165,250,0.08);
        }
        .nb-glass::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(59,130,246,0.5) 25%,
            rgba(147,197,253,0.9) 50%,
            rgba(59,130,246,0.5) 75%,
            transparent 100%);
          pointer-events: none;
        }

        /* ── Reading bar ── */
        .nb-progress {
          background: linear-gradient(90deg, #1d4ed8, #60a5fa, #bfdbfe);
          box-shadow: 0 0 8px rgba(59,130,246,0.5);
          transition: width .08s linear;
        }

        /* ── Desktop link hover underline ── */
        .nb-link {
          position: relative;
        }
        .nb-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #3b82f6, #93c5fd);
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .nb-link:hover::after  { width: 100%; }
        .nb-link-active::after { width: 100%; box-shadow: 0 0 8px rgba(59,130,246,0.6); }

        /* ── Contact button ── */
        .nb-cta {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          border: 1px solid rgba(96,165,250,0.3);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.3s ease;
          position: relative; overflow: hidden;
        }
        .nb-cta::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: translateX(-100%) skewX(-15deg);
          transition: none;
        }
        .nb-cta:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 10px 28px rgba(37,99,235,0.5);
          background: linear-gradient(135deg, #2563eb, #3b82f6);
        }
        .nb-cta:hover::before {
          animation: nbShim 0.55s ease forwards;
        }
        @keyframes nbShim {
          to { transform: translateX(300%) skewX(-15deg); }
        }

        /* ── Hamburger ── */
        .nb-bar {
          display: block;
          height: 2px;
          border-radius: 2px;
          background: #fff;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                      opacity 0.2s ease,
                      width 0.3s ease;
          transform-origin: center;
        }
        .nb-ham-open .nb-bar:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .nb-ham-open .nb-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nb-ham-open .nb-bar:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        /* ── Mobile menu panel ── */
        .nb-mobile-panel {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(80vw, 300px);
          z-index: 80;
          display: flex;
          flex-direction: column;
          background: linear-gradient(160deg, #030d1e 0%, #051528 55%, #020a18 100%);
          border-left: 1px solid rgba(96,165,250,0.12);
          box-shadow: -20px 0 60px rgba(0,0,0,0.6);
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1),
                      opacity 0.35s ease;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .nb-mobile-panel-closed {
          transform: translateX(100%);
          opacity: 0;
          pointer-events: none;
        }
        .nb-mobile-panel-open {
          transform: translateX(0);
          opacity: 1;
          pointer-events: all;
        }

        /* ── Mobile link ── */
        .nb-mob-link {
          position: relative;
          display: block;
          padding: 14px 0;
          font-size: 1rem;
          font-weight: 500;
          color: rgba(191,219,254,0.7);
          transition: color 0.2s ease, padding-left 0.25s cubic-bezier(0.22,1,0.36,1);
          border-bottom: 1px solid rgba(96,165,250,0.06);
        }
        .nb-mob-link::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%) scaleX(0);
          width: 3px; height: 55%;
          border-radius: 2px;
          background: linear-gradient(to bottom, #3b82f6, #93c5fd);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .nb-mob-link:hover {
          color: #fff;
          padding-left: 12px;
        }
        .nb-mob-link:hover::before {
          transform: translateY(-50%) scaleX(1);
        }
        .nb-mob-link-active {
          color: #93c5fd !important;
          padding-left: 14px !important;
        }
        .nb-mob-link-active::before {
          transform: translateY(-50%) scaleX(1) !important;
        }

        /* ── Backdrop ── */
        .nb-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          z-index: 75;
          transition: opacity 0.3s ease;
        }
      `}</style>

      {/* Reading progress */}
      <div
        className="nb-progress fixed top-0 left-0 h-[2px] z-[70] pointer-events-none"
        style={{ width: `${Math.min(scrollPct, 100)}%` }}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════
          NAV BAR
      ════════════════════════════════════ */}
      <nav
        className={`nb-font fixed top-0 left-0 w-full z-[60] flex items-center justify-between
          transition-[padding,background,box-shadow,border-color] duration-[380ms] ease-out
          px-4 sm:px-6 lg:px-12 xl:px-16
          ${sticky ? "nb-glass py-3" : "py-5 bg-transparent"}`}
        role="navigation"
        aria-label="Main navigation"
      >

        {/* Logo */}
        <a href="/" aria-label="Go to homepage" className="flex-shrink-0 z-10">
          <img
            src={logo}
            alt="University logo"
            style={{
              width: sticky ? "96px" : "128px",
              transition: "width 0.4s ease",
              objectFit: "contain",
              display: "block",
            }}
          />
        </a>

        {/* ── Desktop links (md and up) ── */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-2 xl:gap-3">
          {NAV_ITEMS.map((item) => (
            <li key={item} className="list-none">
              <Link
                to={sectionId(item)}
                smooth={true}
                offset={item === "Home" ? 0 : NAV_OFFSET}
                duration={550}
                className={`nb-link px-3 lg:px-4 py-2 block whitespace-nowrap
                  font-medium tracking-wide cursor-pointer
                  transition-colors duration-200 text-[13.5px] lg:text-[14px]
                  ${isActive(item)
                    ? "nb-link-active text-white"
                    : "text-blue-100/75 hover:text-white"
                  }`}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:block flex-shrink-0">
          <Link
            to="contact"
            smooth={true}
            offset={NAV_OFFSET}
            duration={550}
            className="nb-cta text-white text-[13.5px] font-semibold tracking-wide
              py-2.5 px-5 lg:px-6 rounded-full cursor-pointer inline-block"
          >
            Contact Us
          </Link>
        </div>

        {/* ── Hamburger (below md) ── */}
        <button
          onClick={() => setMobileMenu((v) => !v)}
          aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenu}
          aria-controls="mobile-nav-panel"
          className={`md:hidden flex-shrink-0 z-[62] flex flex-col justify-center
            items-end gap-[6px] w-9 h-9 p-1 rounded-lg
            transition-colors duration-200
            ${mobileMenu ? "nb-ham-open" : ""}
            ${sticky ? "hover:bg-white/5" : "hover:bg-white/10"}`}
        >
          <span className="nb-bar w-full" />
          <span className="nb-bar w-[70%]" />
          <span className="nb-bar w-full" />
        </button>
      </nav>

      {/* ════════════════════════════════════
          MOBILE BACKDROP
      ════════════════════════════════════ */}
      <div
        className="nb-backdrop md:hidden"
        style={{ zIndex: 75, opacity: mobileMenu ? 1 : 0, pointerEvents: mobileMenu ? "all" : "none" }}
        onClick={() => setMobileMenu(false)}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════
          MOBILE SLIDE PANEL
      ════════════════════════════════════ */}
      <div
        id="mobile-nav-panel"
        ref={menuRef}
        className={`nb-mobile-panel md:hidden ${mobileMenu ? "nb-mobile-panel-open" : "nb-mobile-panel-closed"}`}
        style={{ zIndex: 80 }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5"
          style={{ borderBottom: "1px solid rgba(96,165,250,0.1)" }}>
          <img src={logo} alt="Logo" style={{ width: "88px", objectFit: "contain" }} />
          <button
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-full
              text-blue-200/60 hover:text-white hover:bg-white/10
              transition-colors duration-200 text-lg leading-none flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-6 pt-4 pb-2" aria-label="Mobile navigation">
          <p className="text-[9px] font-semibold tracking-[0.22em] uppercase mb-4"
            style={{ color: "rgba(147,197,253,0.4)" }}>
            Menu
          </p>
          <ul className="list-none space-y-0">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <Link
                  to={sectionId(item)}
                  smooth={true}
                  offset={item === "Home" ? 0 : NAV_OFFSET}
                  duration={550}
                  onClick={handleNavClick}
                  className={`nb-mob-link
                    ${isActive(item) ? "nb-mob-link-active" : ""}`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA + footer */}
        <div className="px-6 pb-8 pt-4"
          style={{ borderTop: "1px solid rgba(96,165,250,0.1)" }}>
          <Link
            to="contact"
            smooth={true}
            offset={NAV_OFFSET}
            duration={550}
            onClick={handleNavClick}
            className="nb-cta block w-full text-center text-white text-sm
              font-semibold tracking-wide py-3 rounded-full cursor-pointer mb-6"
          >
            Contact Us
          </Link>

          {/* Divider + tagline */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "rgba(96,165,250,0.1)" }} />
            <span className="text-[9px] tracking-widest uppercase flex-shrink-0"
              style={{ color: "rgba(147,197,253,0.3)" }}>
              Est. 1892
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(96,165,250,0.1)" }} />
          </div>

          <p className="text-center text-[9px] tracking-widest uppercase"
            style={{ color: "rgba(147,197,253,0.25)" }}>
            QS World Ranking · Top 50
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;