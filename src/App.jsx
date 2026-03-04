import React, { useState, useEffect, useRef } from 'react'
import Navbar from './component/Nav bar/Navbar'
import Hero from './component/Nav bar/Hero/Hero'
import Program from './component/Program/Program'
import About from './component/About/About'
import Campus from './component/Campus/Campus'
import Testimonial from './component/Testimonial/Testimonial'
import Contact from './component/Contact/Contact'
import Footer from './component/Footer/Footer'
import Videoplayer from './component/Videoplayer/Videoplayer'
import "./index.css"

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────── */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 3, zIndex: 9999, background: 'transparent',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #1d4ed8, #60a5fa, #1d4ed8)',
        backgroundSize: '200% 100%',
        animation: 'shimmerBar 2.5s linear infinite',
        transition: 'width 0.1s ease',
        borderRadius: '0 2px 2px 0',
        boxShadow: '0 0 10px rgba(96,165,250,0.5)',
      }} />
    </div>
  )
}

/* ─────────────────────────────────────────────
   BACK TO TOP BUTTON
───────────────────────────────────────────── */
const BackToTop = () => {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Back to top"
      style={{
        position: 'fixed', bottom: 32, right: 28, zIndex: 999,
        width: 46, height: 46, borderRadius: '50%',
        background: hovered
          ? 'linear-gradient(135deg,#1d4ed8,#2563eb)'
          : 'rgba(4,18,48,0.85)',
        border: '1.5px solid rgba(96,165,250,0.35)',
        boxShadow: hovered
          ? '0 8px 28px rgba(29,78,216,0.5)'
          : '0 4px 16px rgba(0,0,0,0.4)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible
          ? (hovered ? 'translateY(-4px) scale(1.08)' : 'translateY(0) scale(1)')
          : 'translateY(16px) scale(0.9)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 14V4M4 9l5-5 5 5"
          stroke="#93c5fd"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

/* ─────────────────────────────────────────────
   SECTION REVEAL WRAPPER
───────────────────────────────────────────── */
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'none' : 'translateY(32px)',
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */
const App = () => {
  const [playState, setPlayState] = useState(false)

  return (
    <>
      <style>{`
        @keyframes shimmerBar {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>

      <ScrollProgress />
      <Navbar />
      <Hero />

      <main>

        <Reveal>
          <Program />
        </Reveal>

        <Reveal delay={0.05}>
          <About setPlayState={setPlayState} />
        </Reveal>

        <Reveal delay={0.05}>
          <Campus />
        </Reveal>

        <Reveal delay={0.05}>
          <Testimonial />
        </Reveal>

        <Reveal delay={0.05}>
          <Contact />
        </Reveal>

        <Footer />
      </main>

      <BackToTop />
      <Videoplayer playState={playState} setPlayState={setPlayState} />
    </>
  )
}

export default App