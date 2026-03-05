import React, { useState, useRef, useEffect, useCallback } from "react";
import mail_icon     from "../../assets/mail-icon.png";
import phone_icon    from "../../assets/phone-icon.png";
import location_icon from "../../assets/location-icon.png";

/* ═══════════════════════════════════════════════════════════
   3D NEURAL WEB CANVAS
   – Layered particles at different Z-depths (parallax)
   – Mouse-reactive tilt
   – Icosahedron wireframe slowly rotating in the centre
   – Scanline sweep & radial pulse
═══════════════════════════════════════════════════════════ */
const NeuralCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, raf;
    let mx = 0.5, my = 0.5;   // normalised mouse pos
    let t  = 0;

    const resize = () => {
      W = c.width  = c.offsetWidth;
      H = c.height = c.offsetHeight;
    };
    resize();

    /* -- Particles at 3 Z-layers -- */
    const mkParticles = () => Array.from({ length: 70 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      z:  Math.random() * 2.5 + 0.3,      // depth 0.3 → 2.8
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      r:  Math.random() * 1.6 + .4,
      ph: Math.random() * Math.PI * 2,
      sp: Math.random() * .006 + .002,
    }));
    let pts = mkParticles();

    /* -- Drifting background blobs -- */
    const blobs = Array.from({ length: 4 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 200 + 100,
      vx: (Math.random() - .5) * .06,
      vy: (Math.random() - .5) * .06,
      h:  Math.floor(Math.random() * 30 + 210),
      a:  Math.random() * .055 + .025,
    }));

    /* -- Icosahedron wireframe projected in centre -- */
    const phi = (1 + Math.sqrt(5)) / 2;
    const iVerts = [
      [-1, phi, 0],[1, phi, 0],[-1,-phi, 0],[1,-phi, 0],
      [0,-1, phi],[0, 1, phi],[0,-1,-phi],[0, 1,-phi],
      [phi, 0,-1],[phi, 0, 1],[-phi, 0,-1],[-phi, 0, 1],
    ].map(v => { const l = Math.hypot(...v); return v.map(x => x/l * 3.4); });
    const iEdges = [
      [0,1],[0,5],[0,7],[0,10],[0,11],
      [1,5],[1,7],[1,8],[1,9],
      [2,3],[2,6],[2,10],[2,11],
      [3,4],[3,6],[3,8],[3,9],
      [4,5],[4,9],[4,11],
      [5,9],[6,7],[6,8],[6,10],
      [7,8],[7,10],[8,9],[10,11],[11,4],
    ];

    const rotY = (v, a) => [v[0]*Math.cos(a)+v[2]*Math.sin(a), v[1], -v[0]*Math.sin(a)+v[2]*Math.cos(a)];
    const rotX = (v, a) => [v[0], v[1]*Math.cos(a)-v[2]*Math.sin(a), v[1]*Math.sin(a)+v[2]*Math.cos(a)];
    const project = (v, cx, cy, fov=320) => {
      const z = v[2] + 12;
      return [cx + v[0]*fov/z, cy + v[1]*fov/z, v[2]];
    };

    const onMM = e => {
      const r = c.getBoundingClientRect();
      mx = (e.clientX - r.left) / W;
      my = (e.clientY - r.top)  / H;
    };
    c.addEventListener("mousemove", onMM);
    window.addEventListener("resize", () => { resize(); pts = mkParticles(); });

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      t += .010;

      /* Blobs */
      blobs.forEach(b => {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.r) b.x = W+b.r;
        if (b.x > W+b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H+b.r;
        if (b.y > H+b.r) b.y = -b.r;
        const g = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
        g.addColorStop(0, `hsla(${b.h},88%,64%,${b.a})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
      });

      /* Icosahedron */
      const icx = W * .72, icy = H * .38;
      const ry =  t * .28 + (mx - .5) * .9;
      const rx = (my - .5) * .55;
      const pv = iVerts.map(v => project(rotX(rotY(v, ry), rx), icx, icy));
      const alpha = .13 + .05 * Math.sin(t * .7);
      ctx.strokeStyle = `rgba(96,165,250,${alpha})`;
      ctx.lineWidth = .8;
      iEdges.forEach(([a,b]) => {
        ctx.beginPath(); ctx.moveTo(pv[a][0],pv[a][1]); ctx.lineTo(pv[b][0],pv[b][1]); ctx.stroke();
      });
      pv.forEach(v => {
        const pulse = .25 + .18 * Math.sin(t * 1.3 + v[2]);
        ctx.beginPath(); ctx.arc(v[0],v[1],1.8,0,Math.PI*2);
        ctx.fillStyle = `rgba(147,197,253,${pulse})`; ctx.fill();
      });

      /* Particles */
      const ox = (mx-.5)*20, oy = (my-.5)*20;
      pts.forEach(p => {
        p.x += p.vx + Math.cos(t*p.sp+p.ph)*.12;
        p.y += p.vy + Math.sin(t*p.sp+p.ph)*.12;
        if(p.x<0) p.x=W; if(p.x>W) p.x=0;
        if(p.y<0) p.y=H; if(p.y>H) p.y=0;
        const px = p.x + ox*p.z, py = p.y + oy*p.z;
        const pulse = .4 + .3*Math.sin(t*1.2+p.ph);
        ctx.beginPath(); ctx.arc(px,py, p.r*p.z, 0, Math.PI*2);
        ctx.fillStyle = `rgba(96,165,250,${pulse*.5*Math.min(p.z,1.4)})`; ctx.fill();
      });

      /* Edges */
      for(let i=0;i<pts.length;i++) {
        const a=pts[i], px=a.x+ox*a.z, py=a.y+oy*a.z;
        for(let j=i+1;j<pts.length;j++) {
          const b=pts[j], qx=b.x+ox*b.z, qy=b.y+oy*b.z;
          const d=Math.hypot(px-qx,py-qy);
          if(d<95) {
            ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(qx,qy);
            ctx.strokeStyle=`rgba(96,165,250,${.13*(1-d/95)})`;
            ctx.lineWidth=.45; ctx.stroke();
          }
        }
      }

      /* Scanline sweep */
      const sw = ((t*18)%(H+60))-30;
      const sg = ctx.createLinearGradient(0,sw-30,0,sw+30);
      sg.addColorStop(0,"transparent"); sg.addColorStop(.5,"rgba(96,165,250,.05)"); sg.addColorStop(1,"transparent");
      ctx.fillStyle=sg; ctx.fillRect(0,sw-30,W,60);

      /* Radial pulse from icosahedron centre */
      const pr = ((t*.5)%1) * Math.max(W,H)*.55;
      const pa = (1 - (t*.5)%1) * .04;
      ctx.beginPath(); ctx.arc(icx,icy,pr,0,Math.PI*2);
      ctx.strokeStyle=`rgba(59,130,246,${pa})`; ctx.lineWidth=1.2; ctx.stroke();
    };
    draw();
    return ()=>{ cancelAnimationFrame(raf); c.removeEventListener("mousemove",onMM); };
  }, []);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} />;
};

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════════════ */
const Counter = ({ end, suffix, label, icon }) => {
  const [v,setV]=useState(0), ref=useRef(null), ran=useRef(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(!e.isIntersecting||ran.current) return;
      ran.current=true; obs.disconnect();
      const s=performance.now(), d=1600;
      const tick=n=>{ const p=Math.min((n-s)/d,1); setV(Math.floor((1-Math.pow(1-p,3))*end)); if(p<1) requestAnimationFrame(tick); else setV(end); };
      requestAnimationFrame(tick);
    },{threshold:.4});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[end]);
  return (
    <div ref={ref} className="ctc-stat">
      <span className="ctc-stat-icon">{icon}</span>
      <div className="ctc-stat-num">{v.toLocaleString()}{suffix}</div>
      <div className="ctc-stat-lbl">{label}</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN CONTACT COMPONENT
═══════════════════════════════════════════════════════════ */
const Contact = () => {
  const [result,   setResult]   = useState("");
  const [status,   setStatus]   = useState("idle");
  const [focused,  setFocused]  = useState("");
  const [reveal,   setReveal]   = useState(false);
  const [charCount,setCharCount]= useState(0);
  const [enquiry,  setEnquiry]  = useState("General");
  const sectionRef = useRef(null);

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){setReveal(true); obs.disconnect();}
    },{threshold:.08});
    if(sectionRef.current) obs.observe(sectionRef.current);
    return ()=>obs.disconnect();
  },[]);

  const onSubmit = async e => {
    e.preventDefault(); setStatus("sending"); setResult("");
    const fd = new FormData(e.target);
    fd.append("access_key","f03b99d4-599d-460a-998d-62046420b9ba");
    fd.append("enquiry_type", enquiry);
    try {
      const res  = await fetch("https://api.web3forms.com/submit",{method:"POST",body:fd});
      const data = await res.json();
      if(data.success){ setStatus("success"); setResult("Message sent! We'll be in touch within 24 hours."); e.target.reset(); setCharCount(0); }
      else            { setStatus("error");   setResult(data.message||"Something went wrong."); }
    } catch { setStatus("error"); setResult("Network error. Please try again."); }
  };

  const INFO = [
    { icon:mail_icon,     label:"Email Us",  value:"Contact@edusity.com",                href:"mailto:Contact@edusity.com",   color:"#60a5fa", glow:"rgba(96,165,250,.25)"  },
    { icon:phone_icon,    label:"Call Us",   value:"+1 123-456-7890",                    href:"tel:+11234567890",              color:"#a78bfa", glow:"rgba(167,139,250,.25)" },
    { icon:location_icon, label:"Visit Us",  value:"77 Massachusetts Ave, Cambridge MA", href:"https://maps.google.com/?q=77+Massachusetts+Ave+Cambridge+MA", color:"#34d399", glow:"rgba(52,211,153,.25)" },
  ];

  // SVG paths use only l/h/v/m/z commands — no A/S arc flags that confuse Babel's JSX parser
  const SOCIALS = [
    {
      label: "LinkedIn",
      vb: "0 0 13 13",
      // Simplified: in-badge rect + L-shape for "in"
      d: "M2 2h3v1h-3zM2 4h1v6h-1zM5 4h1v0.8h0.05c0.3-0.55 1-0.9 1.7-0.9 1.8 0 2.15 1.15 2.15 2.65v3.45h-1.1v-3.05c0-0.73-0.55-1.25-1.2-1.25-0.68 0-1.3 0.52-1.3 1.25v3.05h-1.1z",
    },
    {
      label: "Twitter/X",
      vb: "0 0 11 12",
      d: "M1.5 2h2l1.8 2.6L7.4 2H9L6.4 5.3 9.5 10h-2L5.5 7.1 3.4 10H1.8L4.6 6.5z",
    },
    {
      label: "YouTube",
      vb: "0 0 12 12",
      // Rounded rect + play triangle — no arc commands
      d: "M1 3h10v6h-10zM4.5 4.8l3.5 1.7-3.5 1.7z",
    },
    {
      label: "Instagram",
      vb: "0 0 12 12",
      // Square frame + inner circle approximated with a diamond + centre dot
      d: "M1 1h10v10h-10zM4 6c0-1.1 0.9-2 2-2 1.1 0 2 0.9 2 2 0 1.1-0.9 2-2 2-1.1 0-2-0.9-2-2zM9 2.5h0.8v0.8h-0.8z",
    },
  ];

  const ENQUIRY_TYPES = ["Admissions","Programs","Research","Partnership","General"];

  return (
    <section id="contact" ref={sectionRef} className="ctc-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

        /* ── Keyframes ─────────────────────────────── */
        @keyframes ctcDot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }
        @keyframes ctcPulse { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes ctcShim  { to{transform:translateX(350%) skewX(-15deg)} }
        @keyframes ctcSpin  { to{transform:rotate(360deg)} }
        @keyframes ctcIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes ctcSlideL{ from{opacity:0;transform:translateX(-36px)} to{opacity:1;transform:none} }
        @keyframes ctcSlideR{ from{opacity:0;transform:translateX(36px)}  to{opacity:1;transform:none} }
        @keyframes ctcFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes ctcBorder{ 0%,100%{border-color:rgba(96,165,250,.13)} 50%{border-color:rgba(96,165,250,.38)} }

        /* ── Section shell ─────────────────────────── */
        .ctc-section {
          position:relative; width:100%;
          padding:clamp(72px,10vw,124px) 0 clamp(72px,8vw,104px);
          background:
            radial-gradient(ellipse 70% 55% at 5%  5%,  rgba(29,78,216,.09) 0%,transparent 65%),
            radial-gradient(ellipse 60% 50% at 95% 95%, rgba(37,99,235,.08) 0%,transparent 65%),
            linear-gradient(160deg,#020b18 0%,#041220 40%,#061a30 70%,#030e1e 100%);
          font-family:'Outfit',sans-serif; overflow:hidden;
        }
        .ctc-section::before {
          content:''; position:absolute; inset:0; z-index:0; pointer-events:none;
          background-image:linear-gradient(rgba(96,165,250,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,.022) 1px,transparent 1px);
          background-size:60px 60px;
        }
        .ctc-section::after {
          content:''; position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.02;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* ── Grid ───────────────────────────────────── */
        .ctc-inner {
          position:relative; z-index:1;
          max-width:1280px; margin:0 auto;
          padding:0 clamp(16px,5vw,72px);
          display:grid; grid-template-columns:1fr 1.3fr;
          gap:clamp(36px,6vw,90px); align-items:start;
        }
        @media(max-width:900px){ .ctc-inner{grid-template-columns:1fr} }

        /* ── Eyebrow ────────────────────────────────── */
        .ctc-eyebrow { display:inline-flex; align-items:center; gap:8px; padding:5px 14px; border-radius:100px; background:rgba(59,130,246,.1); border:1px solid rgba(96,165,250,.25); font-size:10px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:#93c5fd; margin-bottom:20px; }
        .ctc-dot { width:5px; height:5px; border-radius:50%; background:#3b82f6; box-shadow:0 0 7px #3b82f6; animation:ctcDot 2s ease-in-out infinite; position:relative; }
        .ctc-dot::after { content:''; position:absolute; inset:-3px; border-radius:50%; border:1px solid rgba(59,130,246,.4); animation:ctcPulse 2s ease-out infinite; }

        /* ── Title ──────────────────────────────────── */
        .ctc-title { font-family:'Syne',sans-serif; font-size:clamp(2rem,4.2vw,3.1rem); font-weight:900; line-height:1.06; letter-spacing:-.025em; color:#eff6ff !important; margin-bottom:16px; }
        .ctc-title-acc { background:linear-gradient(135deg,#60a5fa 0%,#93c5fd 50%,#bfdbfe 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .ctc-divider { width:52px; height:2px; background:linear-gradient(90deg,#1d4ed8,#60a5fa,#bfdbfe); border-radius:2px; margin:0 0 22px; box-shadow:0 0 12px rgba(59,130,246,.4); }
        .ctc-desc { font-size:clamp(13.5px,1.4vw,15px); color:rgba(191,219,254,.56); font-weight:300; line-height:1.85; margin-bottom:26px; max-width:390px; }

        /* ── Stats row ──────────────────────────────── */
        .ctc-stats { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:28px; }
        .ctc-stat { display:flex; flex-direction:column; align-items:center; padding:10px 14px; border-radius:12px; background:rgba(255,255,255,.03); border:1px solid rgba(96,165,250,.11); backdrop-filter:blur(10px); min-width:64px; text-align:center; transition:border-color .3s,transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s; animation:ctcBorder 3.5s ease-in-out infinite; }
        .ctc-stat:hover { border-color:rgba(96,165,250,.38); transform:translateY(-3px); box-shadow:0 8px 24px rgba(29,78,216,.2); animation:none; }
        .ctc-stat-icon { font-size:.88rem; margin-bottom:3px; }
        .ctc-stat-num { font-family:'Syne',sans-serif; font-size:.98rem; font-weight:900; color:#eff6ff; line-height:1; }
        .ctc-stat-lbl { font-size:8px; font-weight:600; text-transform:uppercase; letter-spacing:.12em; color:rgba(147,197,253,.44); margin-top:2px; }

        /* ── Info cards ─────────────────────────────── */
        .ctc-info-list { display:flex; flex-direction:column; gap:10px; }
        .ctc-info-card {
          display:flex; align-items:center; gap:14px;
          padding:15px 18px; border-radius:15px;
          background:rgba(255,255,255,.032); border:1px solid rgba(96,165,250,.1);
          text-decoration:none; overflow:hidden; position:relative;
          transition:border-color .3s,background .3s,transform .32s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;
        }
        .ctc-info-card::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent); opacity:0; transition:opacity .3s; }
        .ctc-info-card:hover { transform:translateX(7px); border-color:var(--c,.3); background:rgba(29,78,216,.07); box-shadow:var(--g,none); }
        .ctc-info-card:hover::before { opacity:1; }
        .ctc-info-card:hover .ctc-info-arr { transform:translateX(5px); opacity:1; }
        .ctc-info-card:hover .ctc-info-icon-box { box-shadow:0 0 18px var(--ig,rgba(96,165,250,.3)); }

        .ctc-info-icon-box { width:42px; height:42px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,rgba(29,78,216,.45),rgba(59,130,246,.2)); border:1px solid rgba(96,165,250,.18); transition:box-shadow .3s; }
        .ctc-info-icon-box img { width:18px; height:18px; object-fit:contain; }
        .ctc-info-lbl { font-size:8.5px; font-weight:700; text-transform:uppercase; letter-spacing:.14em; color:rgba(147,197,253,.48); margin-bottom:2px; }
        .ctc-info-val { font-size:13px; font-weight:500; color:rgba(219,234,254,.82); line-height:1.4; }
        .ctc-info-arr { margin-left:auto; flex-shrink:0; opacity:.35; transition:transform .3s,opacity .3s; }

        /* ── Availability ───────────────────────────── */
        .ctc-avail { display:inline-flex; align-items:center; gap:7px; padding:6px 13px; border-radius:100px; background:rgba(52,211,153,.07); border:1px solid rgba(52,211,153,.2); margin-top:16px; }
        .ctc-avail-dot { width:6px; height:6px; border-radius:50%; background:#34d399; box-shadow:0 0 8px #34d399; animation:ctcDot 2s ease-in-out infinite; }
        .ctc-avail-txt { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.1em; color:rgba(110,231,183,.75); }

        /* ── Socials ────────────────────────────────── */
        .ctc-socials { display:flex; gap:8px; margin-top:18px; flex-wrap:wrap; }
        .ctc-social { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.04); border:1px solid rgba(96,165,250,.13); cursor:pointer; text-decoration:none; transition:background .25s,border-color .25s,transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .25s; }
        .ctc-social:hover { background:rgba(37,99,235,.28); border-color:rgba(96,165,250,.45); transform:translateY(-3px) scale(1.1); box-shadow:0 8px 20px rgba(37,99,235,.32); }

        /* ── Map ────────────────────────────────────── */
        .ctc-map { border-radius:16px; overflow:hidden; border:1px solid rgba(96,165,250,.12); box-shadow:0 10px 36px rgba(0,0,0,.45); margin-top:18px; position:relative; }
        .ctc-map::after { content:''; position:absolute; inset:0; background:linear-gradient(160deg,rgba(29,78,216,.08),transparent 55%); pointer-events:none; }
        .ctc-map-label { position:absolute; top:10px; left:12px; z-index:2; display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:100px; background:rgba(4,18,48,.82); border:1px solid rgba(96,165,250,.22); font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:rgba(147,197,253,.7); backdrop-filter:blur(8px); }

        /* ── Form card ──────────────────────────────── */
        .ctc-form-card {
          padding:clamp(26px,4vw,44px); border-radius:24px;
          background:rgba(255,255,255,.038); border:1px solid rgba(96,165,250,.13);
          backdrop-filter:blur(22px);
          box-shadow:0 28px 72px rgba(0,0,0,.44),inset 0 1px 0 rgba(255,255,255,.07);
          position:relative; overflow:hidden;
        }
        .ctc-form-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(96,165,250,.48),transparent); pointer-events:none; }
        /* Inner glow blob */
        .ctc-form-blob { position:absolute; top:-40px; right:-40px; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle,rgba(37,99,235,.09),transparent 70%); pointer-events:none; animation:ctcFloat 5s ease-in-out infinite; }

        .ctc-form-hd { font-family:'Syne',sans-serif; font-size:1.18rem; font-weight:800; color:#eff6ff !important; letter-spacing:-.015em; margin-bottom:4px; }
        .ctc-form-sub { font-size:11.5px; color:rgba(147,197,253,.48); margin-bottom:20px; }

        /* Progress strip */
        .ctc-prog { display:flex; gap:4px; margin-bottom:20px; }
        .ctc-prog-seg { height:3px; border-radius:2px; transition:width .45s cubic-bezier(.34,1.56,.64,1),background .35s; }

        /* ── Enquiry type chips ──────────────────────── */
        .ctc-chips { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:18px; }
        .ctc-chip {
          padding:4px 12px; border-radius:100px; font-size:10px; font-weight:600;
          letter-spacing:.08em; border:1px solid rgba(96,165,250,.18);
          color:rgba(147,197,253,.6); background:rgba(255,255,255,.03);
          cursor:pointer; transition:all .22s ease; user-select:none;
        }
        .ctc-chip:hover  { border-color:rgba(96,165,250,.4); color:#93c5fd; background:rgba(59,130,246,.1); }
        .ctc-chip.active { border-color:rgba(96,165,250,.55); color:#bfdbfe; background:linear-gradient(135deg,rgba(29,78,216,.3),rgba(59,130,246,.2)); box-shadow:0 0 12px rgba(37,99,235,.2); }

        /* ── Two-col row ────────────────────────────── */
        .ctc-row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media(max-width:520px){ .ctc-row2{grid-template-columns:1fr} }

        /* ── Field ──────────────────────────────────── */
        .ctc-field { margin-bottom:14px; }
        .ctc-lbl { display:block; margin-bottom:5px; font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:.13em; color:rgba(147,197,253,.5); transition:color .2s; }
        .ctc-lbl.on { color:#93c5fd; }

        .ctc-input,.ctc-ta {
          width:100%; padding:11px 14px; border-radius:11px;
          background:rgba(255,255,255,.042); border:1px solid rgba(96,165,250,.14);
          color:#eff6ff; font-family:'Outfit',sans-serif; font-size:13.5px;
          outline:none; transition:border-color .25s,background .25s,box-shadow .25s;
          color-scheme:dark; -webkit-appearance:none; box-sizing:border-box;
        }
        .ctc-input::placeholder,.ctc-ta::placeholder { color:rgba(147,197,253,.27); }
        .ctc-input:hover,.ctc-ta:hover { border-color:rgba(96,165,250,.3); background:rgba(255,255,255,.055); }
        .ctc-input:focus,.ctc-ta:focus { border-color:rgba(96,165,250,.65); background:rgba(59,130,246,.075); box-shadow:0 0 0 3px rgba(37,99,235,.18),0 0 14px rgba(37,99,235,.1); }
        .ctc-ta { min-height:108px; resize:vertical; line-height:1.62; }

        /* Character count */
        .ctc-char { text-align:right; font-size:9.5px; margin-top:3px; transition:color .2s; }

        /* ── Submit button ──────────────────────────── */
        .ctc-btn {
          width:100%; margin-top:6px; padding:13px 32px;
          display:inline-flex; align-items:center; justify-content:center; gap:9px;
          border-radius:100px;
          background:linear-gradient(135deg,#1d4ed8,#2563eb);
          border:1px solid rgba(96,165,250,.28); color:#fff;
          font-family:'Outfit',sans-serif; font-size:14px; font-weight:700; letter-spacing:.04em;
          cursor:pointer; position:relative; overflow:hidden;
          transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s,background .3s;
        }
        .ctc-btn:hover:not(:disabled) { transform:translateY(-2px) scale(1.02); box-shadow:0 14px 38px rgba(37,99,235,.55); background:linear-gradient(135deg,#2563eb,#3b82f6); }
        .ctc-btn:active:not(:disabled) { transform:scale(.98); }
        .ctc-btn:disabled { opacity:.62; cursor:not-allowed; }
        .ctc-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent); transform:translateX(-120%) skewX(-15deg); pointer-events:none; }
        .ctc-btn:hover:not(:disabled)::after { animation:ctcShim .55s ease forwards; }
        .ctc-btn-success { background:linear-gradient(135deg,#065f46,#059669) !important; border-color:rgba(52,211,153,.3) !important; }

        .ctc-spinner { width:16px; height:16px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:white; animation:ctcSpin .7s linear infinite; flex-shrink:0; }

        /* ── Result banner ──────────────────────────── */
        .ctc-result { margin-top:13px; padding:11px 15px; border-radius:11px; font-size:13px; font-weight:600; display:flex; align-items:center; gap:8px; animation:ctcIn .4s cubic-bezier(.22,1,.36,1); }
        .ctc-ok  { background:rgba(52,211,153,.1);  border:1px solid rgba(52,211,153,.28);  color:#6ee7b7; }
        .ctc-err { background:rgba(244,63,94,.1);   border:1px solid rgba(244,63,94,.28);   color:#fca5a5; }

        /* ── Privacy note ───────────────────────────── */
        .ctc-privacy { font-size:10px; color:rgba(147,197,253,.3); text-align:center; margin-top:10px; line-height:1.6; }

        /* ── Scroll reveals ─────────────────────────── */
        .ctc-rl { opacity:0; transform:translateX(-34px); transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1); }
        .ctc-rr { opacity:0; transform:translateX(34px);  transition:opacity .85s cubic-bezier(.22,1,.36,1) .12s,transform .85s cubic-bezier(.22,1,.36,1) .12s; }
        .ctc-on  { opacity:1 !important; transform:none !important; }

        /* ── Mobile tweaks ──────────────────────────── */
        @media(max-width:640px){
          .ctc-stats{gap:6px}
          .ctc-stat{padding:8px 10px;min-width:56px}
          .ctc-stat-num{font-size:.88rem}
          .ctc-form-card{padding:20px 15px}
          .ctc-map{display:none}
        }
      `}</style>

      {/* ── 3D canvas ── */}
      <NeuralCanvas />

      <div className="ctc-inner">

        {/* ════ LEFT ════ */}
        <div className={`ctc-rl ${reveal?"ctc-on":""}`}>

          <div className="ctc-eyebrow">
            <span className="ctc-dot" />
            Get In Touch
          </div>

          <h2 className="ctc-title">
            Let's <span className="ctc-title-acc">Connect</span>
          </h2>
          <div className="ctc-divider" />

          <p className="ctc-desc">
            Questions about admissions, programs, or partnerships? Our admissions team responds within 24 hours — personally, not automated.
          </p>

          {/* Animated counters */}
          <div className="ctc-stats">
            <Counter end={24}  suffix="h"  label="Response"  icon="⚡" />
            <Counter end={98}  suffix="%"  label="Resolved"  icon="✅" />
            <Counter end={12}  suffix="+"  label="Campuses"  icon="🌍" />
            <Counter end={42}  suffix="k+" label="Alumni"    icon="🎓" />
          </div>

          {/* Info cards */}
          <div className="ctc-info-list">
            {INFO.map((item, idx) => (
              <a key={item.label} href={item.href}
                target={item.href.startsWith("https")?"_blank":undefined}
                rel="noopener noreferrer"
                className="ctc-info-card"
                style={{
                  "--c":    `rgba(96,165,250,.3)`,
                  "--g":    `0 8px 28px ${item.glow}`,
                  "--ig":   item.glow,
                  animationDelay:`${idx*.1}s`,
                }}
              >
                <div className="ctc-info-icon-box">
                  <img src={item.icon} alt={item.label} />
                </div>
                <div style={{minWidth:0}}>
                  <p className="ctc-info-lbl">{item.label}</p>
                  <p className="ctc-info-val">{item.value}</p>
                </div>
                <div className="ctc-info-arr">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Availability */}
          <div className="ctc-avail">
            <span className="ctc-avail-dot" />
            <span className="ctc-avail-txt">Admissions Open · Responding Now</span>
          </div>

          {/* Socials */}
          <div className="ctc-socials">
            {SOCIALS.map(s => (
              <a key={s.label} href="#" className="ctc-social" aria-label={s.label}
                onClick={e=>e.preventDefault()}>
                <svg width="14" height="14" viewBox={s.vb} fill="none">
                  <path d={s.d} stroke="rgba(147,197,253,.7)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ))}
          </div>

          {/* Map */}
          <div className="ctc-map">
            <div className="ctc-map-label">📍 Cambridge, MA</div>
            <iframe
              title="Campus Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.107559128437!2d-71.09600068454445!3d42.35983097918645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370a5cb30cc5f%3A0xfd66e52e96c32e55!2sMIT%20-%20Massachusetts%20Institute%20of%20Technology!5e0!3m2!1sen!2sus!4v1681060000000"
              width="100%" height="160"
              style={{border:"none",filter:"invert(92%) hue-rotate(180deg) saturate(.45) brightness(.85)",display:"block"}}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

        {/* ════ RIGHT — FORM ════ */}
        <div className={`ctc-rr ${reveal?"ctc-on":""}`}>
          <div className="ctc-form-card">
            <div className="ctc-form-blob" />

            {/* Progress strip */}
            <div className="ctc-prog">
              {["Name","Contact","Topic","Message"].map((_,i)=>(
                <div key={i} className="ctc-prog-seg" style={{
                  width: status==="success" ? "25%" : i===0 ? "34%" : "6%",
                  background: status==="success"
                    ? "linear-gradient(90deg,#34d399,#6ee7b7)"
                    : i===0
                      ? "linear-gradient(90deg,#1d4ed8,#60a5fa)"
                      : "rgba(96,165,250,.18)",
                }} />
              ))}
            </div>

            <p className="ctc-form-hd">
              {status==="success" ? "🎉 Message Received!" : "Send a Message"}
            </p>
            <p className="ctc-form-sub">
              {status==="success"
                ? "We'll be in touch within 24 hours."
                : "All fields required · We reply personally within 24 h"}
            </p>

            <form onSubmit={onSubmit} noValidate>

              {/* Name + Phone */}
              <div className="ctc-row2">
                {[
                  {name:"name",  type:"text",  label:"Full Name",       ph:"Your full name"},
                  {name:"phone", type:"tel",   label:"Phone Number",    ph:"+1 234 567 890"},
                ].map(f=>(
                  <div key={f.name} className="ctc-field">
                    <label className={`ctc-lbl${focused===f.name?" on":""}`}>{f.label}</label>
                    <input type={f.type} name={f.name} placeholder={f.ph} required className="ctc-input"
                      onFocus={()=>setFocused(f.name)} onBlur={()=>setFocused("")} />
                  </div>
                ))}
              </div>

              {/* Email */}
              <div className="ctc-field">
                <label className={`ctc-lbl${focused==="email"?" on":""}`}>Email Address</label>
                <input type="email" name="email" placeholder="your@email.com" required className="ctc-input"
                  onFocus={()=>setFocused("email")} onBlur={()=>setFocused("")} />
              </div>

              {/* Enquiry type */}
              <div className="ctc-field" style={{marginBottom:8}}>
                <label className="ctc-lbl">Enquiry Type</label>
              </div>
              <div className="ctc-chips">
                {ENQUIRY_TYPES.map(t=>(
                  <span key={t} className={`ctc-chip${enquiry===t?" active":""}`}
                    onClick={()=>setEnquiry(t)}>{t}</span>
                ))}
              </div>

              {/* Subject */}
              <div className="ctc-field">
                <label className={`ctc-lbl${focused==="subject"?" on":""}`}>Subject</label>
                <input type="text" name="subject" placeholder="How can we help?" className="ctc-input"
                  onFocus={()=>setFocused("subject")} onBlur={()=>setFocused("")} />
              </div>

              {/* Message */}
              <div className="ctc-field">
                <label className={`ctc-lbl${focused==="message"?" on":""}`}>Message</label>
                <textarea name="message" rows={4} placeholder="Tell us more about your enquiry…" required className="ctc-ta"
                  maxLength={500}
                  onFocus={()=>setFocused("message")} onBlur={()=>setFocused("")}
                  onChange={e=>setCharCount(e.target.value.length)} />
                <div className="ctc-char" style={{color:charCount>450?"#fca5a5":"rgba(147,197,253,.3)"}}>
                  {charCount}/500
                </div>
              </div>

              {/* Submit */}
              <button type="submit"
                className={`ctc-btn${status==="success"?" ctc-btn-success":""}`}
                disabled={status==="sending"}>
                {status==="sending" ? (
                  <><span className="ctc-spinner"/>Sending…</>
                ) : status==="success" ? (
                  <><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Message Sent!</>
                ) : (
                  <>Send Message<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 7.5h11M8.5 3l4.5 4.5L8.5 12" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></>
                )}
              </button>

              <p className="ctc-privacy">🔒 Encrypted & never shared with third parties</p>
            </form>

            {result && (
              <div className={`ctc-result ${status==="success"?"ctc-ok":"ctc-err"}`}>
                {status==="success"
                  ? <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="rgba(52,211,153,.2)" stroke="#34d399" strokeWidth="1.2"/><path d="M4.5 7.5l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="rgba(244,63,94,.2)" stroke="#f43f5e" strokeWidth="1.2"/><path d="M5 5l5 5M10 5l-5 5" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round"/></svg>
                }
                {result}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;