import React, { useRef, useState, useEffect, useCallback } from "react";
import program_1 from "../../assets/program-1.png";
import program_2 from "../../assets/program-2.png";
import program_3 from "../../assets/program-3.png";
import program_icon_1 from "../../assets/program-icon-1.png";
import program_icon_2 from "../../assets/program-icon-2.png";
import program_icon_3 from "../../assets/program-icon-3.png";

/* ─────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────── */
const PROGRAMS = [
  {
    img: program_1, icon: program_icon_1,
    title: "Graduation",    subtitle: "Undergraduate Degree",
    duration: "3 – 4 Years", courses: "120+ Courses",
    badge: "Most Popular",
    badgeColor: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
    accent: "rgba(59,130,246,0.75)",   accentSoft: "rgba(59,130,246,0.14)",
    accentSolid: "#3b82f6",            glow: "rgba(59,130,246,0.35)",
    description: "Build a rock-solid academic foundation across arts, sciences, and engineering with world-renowned faculty.",
    tags: ["Arts & Sciences","Engineering","Business"],
    features: ["Flexible credit system","Industry internships","Global exchange semester","Merit scholarships"],
    number: "01",
  },
  {
    img: program_2, icon: program_icon_2,
    title: "Masters",       subtitle: "Graduate Degree",
    duration: "1 – 2 Years", courses: "80+ Specialisations",
    badge: "High Demand",
    badgeColor: "linear-gradient(135deg,#0369a1,#60a5fa)",
    accent: "rgba(96,165,250,0.75)",   accentSoft: "rgba(96,165,250,0.14)",
    accentSolid: "#60a5fa",            glow: "rgba(96,165,250,0.35)",
    description: "Deepen your expertise, lead research initiatives, and emerge as a sought-after specialist in your field.",
    tags: ["Research","Leadership","Specialisation"],
    features: ["Thesis or coursework track","Research lab access","Industry mentorship","TA opportunities"],
    number: "02",
  },
  {
    img: program_3, icon: program_icon_3,
    title: "Doctorate",     subtitle: "Post Graduation",
    duration: "3 – 5 Years", courses: "40+ Research Tracks",
    badge: "Fully Funded",
    badgeColor: "linear-gradient(135deg,#1e40af,#93c5fd)",
    accent: "rgba(147,197,253,0.75)",  accentSoft: "rgba(147,197,253,0.14)",
    accentSolid: "#93c5fd",            glow: "rgba(147,197,253,0.35)",
    description: "Pioneer breakthroughs, publish globally, and shape the next generation of human knowledge.",
    tags: ["Innovation","Publication","Fellowship"],
    features: ["Full funding + stipend","Dedicated supervisor","Conference grants","IP commercialisation"],
    number: "03",
  },
];

/* ─────────────────────────────────────────────────────
   PARTICLE FIELD
───────────────────────────────────────────────────── */
const ParticleField = () => {
  const cvs = useRef(null);
  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.28, vy: (Math.random()-.5)*.28,
      r: Math.random()*1.4+.5, a: Math.random(),
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0) p.x=W; if(p.x>W) p.x=0;
        if(p.y<0) p.y=H; if(p.y>H) p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(96,165,250,${p.a*.5})`; ctx.fill();
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<90){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(96,165,250,${.16*(1-d/90)})`; ctx.lineWidth=.5; ctx.stroke(); }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onR=()=>{ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; };
    window.addEventListener("resize",onR);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",onR); };
  },[]);
  return <canvas ref={cvs} style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0 }} />;
};

/* ─────────────────────────────────────────────────────
   COUNTER
───────────────────────────────────────────────────── */
const CountUp = ({ end, suffix, label }) => {
  const [v,setV]=useState(0); const ref=useRef(null); const ran=useRef(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(!e.isIntersecting||ran.current) return;
      ran.current=true; obs.disconnect();
      const t0=performance.now();
      const tick=(now)=>{ const p=Math.min((now-t0)/1600,1); setV(Math.floor((1-Math.pow(1-p,3))*end)); if(p<1) requestAnimationFrame(tick); else setV(end); };
      requestAnimationFrame(tick);
    },{threshold:0.4});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[end]);
  return (
    <div ref={ref} className="pc-counter">
      <span className="pc-counter-num">{v.toLocaleString()}{suffix}</span>
      <span className="pc-counter-lbl">{label}</span>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   APPLY MODAL
───────────────────────────────────────────────────── */
const ApplyModal = ({ program, onClose }) => {
  const [step,  setStep]  = useState(1);    // 1=details, 2=form, 3=success
  const [form,  setForm]  = useState({ name:"", email:"", phone:"", message:"" });
  const [busy,  setBusy]  = useState(false);
  const [err,   setErr]   = useState("");

  useEffect(()=>{
    document.body.style.overflow="hidden";
    const esc=(e)=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown",esc);
    return ()=>{ document.body.style.overflow=""; window.removeEventListener("keydown",esc); };
  },[onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.name||!form.email){ setErr("Please fill in name and email."); return; }
    setBusy(true); setErr("");
    // Simulate async submit (replace with real endpoint)
    await new Promise(r=>setTimeout(r,1200));
    setBusy(false); setStep(3);
  };

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:99999,background:"rgba(2,8,20,.94)",backdropFilter:"blur(22px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"pcLbIn .3s ease" }}>
      <div onClick={e=>e.stopPropagation()} style={{ position:"relative",width:"100%",maxWidth:560,borderRadius:22,overflow:"hidden",background:"rgba(4,14,36,.97)",border:"1px solid rgba(96,165,250,.15)",boxShadow:"0 32px 80px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.06)",animation:"pcPop .35s cubic-bezier(.22,1,.36,1)",fontFamily:"'Outfit',sans-serif" }}>

        {/* Shimmer top */}
        <div style={{ height:1,background:"linear-gradient(90deg,transparent,rgba(96,165,250,.42),transparent)" }} />

        {/* Header */}
        <div style={{ padding:"22px 26px 0",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12 }}>
          <div>
            <div style={{ fontSize:9,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(147,197,253,.55)",marginBottom:6 }}>
              Apply Now
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.1rem,3vw,1.4rem)",fontWeight:900,color:"#eff6ff",letterSpacing:"-.02em",margin:0 }}>
              {program.title} Program
            </h3>
            <p style={{ fontSize:11,color:"rgba(147,197,253,.5)",margin:"4px 0 0",letterSpacing:".06em" }}>
              {program.subtitle} · {program.duration}
            </p>
          </div>
          {/* Step indicator */}
          <div style={{ display:"flex",alignItems:"center",gap:6,flexShrink:0,marginTop:4 }}>
            {[1,2,3].map(s=>(
              <div key={s} style={{ width: s===step?24:8, height:8, borderRadius:4, transition:"width .3s ease,background .3s",
                background: s<step ? "#3b82f6" : s===step ? `linear-gradient(90deg,${program.accentSolid},#93c5fd)` : "rgba(255,255,255,.1)" }} />
            ))}
          </div>
        </div>

        {/* Close */}
        <button onClick={onClose} style={{ position:"absolute",top:16,right:16,width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.05)",border:"1px solid rgba(96,165,250,.18)",color:"rgba(191,219,254,.7)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background .2s,transform .2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(37,99,235,.4)"; e.currentTarget.style.transform="scale(1.1)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.transform="none"; }}>
          ✕
        </button>

        {/* ── STEP 1: Program details ── */}
        {step===1 && (
          <div style={{ padding:"20px 26px 26px" }}>
            {/* Feature list */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18 }}>
              {program.features.map(f=>(
                <div key={f} style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 13px",borderRadius:10,background:"rgba(255,255,255,.03)",border:"1px solid rgba(96,165,250,.1)" }}>
                  <div style={{ width:16,height:16,borderRadius:"50%",background:`${program.accentSolid}22`,border:`1px solid ${program.accentSolid}55`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2 3-3" stroke={program.accentSolid} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontSize:11.5,color:"rgba(191,219,254,.72)",fontWeight:400 }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:20 }}>
              {program.tags.map(t=>(
                <span key={t} style={{ padding:"3px 10px",borderRadius:100,fontSize:9.5,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:program.accentSolid,border:`1px solid ${program.accentSolid}40`,background:"transparent" }}>{t}</span>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display:"flex",gap:12,marginBottom:22 }}>
              {[{label:"Duration",val:program.duration},{label:"Available",val:program.courses},{label:"Funding",val:program.badge}].map(({label,val})=>(
                <div key={label} style={{ flex:1,padding:"12px 10px",borderRadius:12,background:"rgba(255,255,255,.03)",border:"1px solid rgba(96,165,250,.1)",textAlign:"center" }}>
                  <div style={{ fontSize:12,fontWeight:700,color:"#eff6ff",marginBottom:3,fontFamily:"'Syne',sans-serif" }}>{val}</div>
                  <div style={{ fontSize:9,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(147,197,253,.45)" }}>{label}</div>
                </div>
              ))}
            </div>

            <button onClick={()=>setStep(2)} style={{ width:"100%",padding:"13px",borderRadius:100,background:program.badgeColor,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,color:"white",letterSpacing:".05em",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s",boxShadow:`0 6px 22px ${program.glow}` }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow=`0 12px 32px ${program.glow}`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=`0 6px 22px ${program.glow}`; }}>
              Continue to Application
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* ── STEP 2: Form ── */}
        {step===2 && (
          <form onSubmit={handleSubmit} style={{ padding:"20px 26px 26px" }} noValidate>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
              {[{name:"name",label:"Full Name",type:"text",ph:"Your full name"},{name:"email",label:"Email Address",type:"email",ph:"your@email.com"}].map(f=>(
                <div key={f.name}>
                  <label style={{ display:"block",fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(147,197,253,.5)",marginBottom:5 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={form[f.name]} onChange={e=>setForm(p=>({...p,[f.name]:e.target.value}))}
                    style={{ width:"100%",padding:"11px 14px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(96,165,250,.15)",color:"#eff6ff",fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",colorScheme:"dark",transition:"border-color .2s,box-shadow .2s" }}
                    onFocus={e=>{ e.target.style.borderColor="rgba(96,165,250,.5)"; e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,.18)"; }}
                    onBlur={e=>{ e.target.style.borderColor="rgba(96,165,250,.15)"; e.target.style.boxShadow="none"; }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ display:"block",fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(147,197,253,.5)",marginBottom:5 }}>Phone (optional)</label>
              <input type="tel" placeholder="+1 234 567 890" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}
                style={{ width:"100%",padding:"11px 14px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(96,165,250,.15)",color:"#eff6ff",fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",colorScheme:"dark",transition:"border-color .2s,box-shadow .2s" }}
                onFocus={e=>{ e.target.style.borderColor="rgba(96,165,250,.5)"; e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,.18)"; }}
                onBlur={e=>{ e.target.style.borderColor="rgba(96,165,250,.15)"; e.target.style.boxShadow="none"; }} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block",fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(147,197,253,.5)",marginBottom:5 }}>Why this program?</label>
              <textarea rows={3} placeholder="Tell us about your goals..." value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                style={{ width:"100%",padding:"11px 14px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(96,165,250,.15)",color:"#eff6ff",fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",colorScheme:"dark",resize:"none",lineHeight:1.6,transition:"border-color .2s,box-shadow .2s" }}
                onFocus={e=>{ e.target.style.borderColor="rgba(96,165,250,.5)"; e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,.18)"; }}
                onBlur={e=>{ e.target.style.borderColor="rgba(96,165,250,.15)"; e.target.style.boxShadow="none"; }} />
            </div>

            {err && <p style={{ fontSize:12,color:"#fca5a5",marginBottom:10,background:"rgba(244,63,94,.08)",border:"1px solid rgba(244,63,94,.2)",padding:"8px 12px",borderRadius:8 }}>{err}</p>}

            <div style={{ display:"flex",gap:10 }}>
              <button type="button" onClick={()=>setStep(1)} style={{ flex:"0 0 auto",padding:"13px 18px",borderRadius:100,background:"rgba(255,255,255,.05)",border:"1px solid rgba(96,165,250,.15)",color:"rgba(191,219,254,.65)",cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif",transition:"background .2s" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.09)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.05)"}>← Back</button>

              <button type="submit" disabled={busy} style={{ flex:1,padding:"13px",borderRadius:100,background:program.badgeColor,border:"none",cursor:busy?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,color:"white",letterSpacing:".05em",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:busy?.7:1,transition:"transform .3s,box-shadow .3s",boxShadow:`0 6px 22px ${program.glow}` }}
                onMouseEnter={e=>{ if(!busy){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${program.glow}`; }}}
                onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=`0 6px 22px ${program.glow}`; }}>
                {busy ? (
                  <><div style={{ width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",animation:"pcSpin .7s linear infinite" }} /> Sending…</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7h11M7.5 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Submit Application</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Success ── */}
        {step===3 && (
          <div style={{ padding:"30px 26px 32px",textAlign:"center" }}>
            <div style={{ width:56,height:56,borderRadius:"50%",background:"rgba(52,211,153,.12)",border:"1px solid rgba(52,211,153,.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="10" stroke="#34d399" strokeWidth="1.5"/>
                <path d="M6 11l3.5 3.5L16 8" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:"1.25rem",fontWeight:900,color:"#eff6ff",marginBottom:8 }}>Application Submitted!</h3>
            <p style={{ fontSize:13,color:"rgba(191,219,254,.6)",lineHeight:1.75,marginBottom:22,maxWidth:340,margin:"0 auto 22px" }}>
              Thank you, <strong style={{ color:"#bfdbfe" }}>{form.name}</strong>! We've received your interest in the{" "}
              <strong style={{ color:"#bfdbfe" }}>{program.title}</strong> program. Our admissions team will reach out within 2–3 business days.
            </p>
            <button onClick={onClose} style={{ padding:"12px 28px",borderRadius:100,background:program.badgeColor,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,color:"white",transition:"transform .3s cubic-bezier(.34,1.56,.64,1)",boxShadow:`0 6px 22px ${program.glow}` }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px) scale(1.04)"}
              onMouseLeave={e=>e.currentTarget.style.transform="none"}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   TILT CARD
───────────────────────────────────────────────────── */
const TiltCard = ({ program, index, isMobile, onApply }) => {
  const cardRef = useRef(null);
  const [tilt,    setTilt]    = useState({ x:0, y:0 });
  const [glare,   setGlare]   = useState({ x:50, y:50 });
  const [hovered, setHovered] = useState(false);
  const [active,  setActive]  = useState(false);

  const onMM = (e) => {
    if(isMobile) return;
    const { left,top,width,height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX-left)/width, y = (e.clientY-top)/height;
    setTilt({ x:(y-.5)*-16, y:(x-.5)*16 });
    setGlare({ x:x*100, y:y*100 });
  };

  const revealed = isMobile ? active : hovered;

  return (
    <div ref={cardRef}
      onMouseMove={onMM}
      onMouseEnter={()=>!isMobile&&setHovered(true)}
      onMouseLeave={()=>{ setTilt({x:0,y:0}); setHovered(false); }}
      onClick={()=>isMobile&&setActive(a=>!a)}
      className="pc-wrap"
      style={{ animationDelay:`${index*0.13}s` }}
    >
      <div className="pc-num">{program.number}</div>

      <div className="pc-card" style={{
        transform: !isMobile&&hovered
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.035,1.035,1.035)`
          : "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)",
        transition: hovered ? "transform 0.1s ease-out" : "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: revealed
          ? `0 28px 64px ${program.glow}, 0 0 0 1.5px ${program.accentSolid}40`
          : "0 8px 32px rgba(0,0,0,0.35)",
      }}>

        {/* BG image */}
        <div className="pc-img" style={{ transform:revealed?"scale(1.09)":"scale(1)", transition:"transform 0.65s cubic-bezier(0.22,1,0.36,1)" }}>
          <img src={program.img} alt={program.title} />
        </div>

        {/* Overlays */}
        <div className="pc-base-ov" />
        <div className="pc-tint" style={{ background:`linear-gradient(160deg,${program.accentSoft} 0%,rgba(2,11,28,0.7) 100%)`, opacity:revealed?1:0, transition:"opacity 0.4s ease" }} />
        {!isMobile&&hovered && <div className="pc-glare" style={{ background:`radial-gradient(circle at ${glare.x}% ${glare.y}%,rgba(255,255,255,0.12) 0%,transparent 65%)` }} />}
        <div className="pc-border-glow" style={{ opacity:revealed?1:0, boxShadow:`inset 0 0 0 1.5px ${program.accentSolid}60` }} />

        {/* Badge */}
        <div className="pc-badge" style={{ background:program.badgeColor }}>{program.badge}</div>

        {/* Mobile hint */}
        {isMobile&&!active && (
          <div className="pc-tap-hint">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Tap to explore
          </div>
        )}

        {/* Default label */}
        <div className="pc-label" style={{ opacity:revealed?0:1, transform:revealed?"translateY(10px)":"none", transition:"opacity .3s ease,transform .3s ease" }}>
          <div className="pc-label-pill" style={{ background:program.accentSoft, borderColor:program.accentSolid }}>
            <span className="pc-label-dot" style={{ background:program.accentSolid }} />
            {program.subtitle}
          </div>
          <p className="pc-label-title">{program.title}</p>
        </div>

        {/* Hover panel */}
        <div className="pc-panel" style={{ opacity:revealed?1:0, transform:revealed?"translateY(0)":"translateY(22px)", transition:"opacity .35s ease,transform .35s cubic-bezier(0.22,1,0.36,1)" }}>
          <div className="pc-icon-box" style={{
            background:program.accentSoft, border:`1px solid ${program.accentSolid}50`,
            transform:revealed?"scale(1) translateY(0)":"scale(0.8) translateY(10px)",
            transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.06s",
          }}>
            <img src={program.icon} alt="" />
          </div>

          <h3 className="pc-panel-title">{program.title}</h3>
          <p className="pc-panel-sub">{program.subtitle}</p>
          <p className="pc-panel-desc">{program.description}</p>

          {/* Tags */}
          <div className="pc-panel-tags">
            {program.tags.map(t=>(
              <span key={t} className="pc-panel-tag" style={{ borderColor:`${program.accentSolid}40`, color:program.accentSolid }}>{t}</span>
            ))}
          </div>

          {/* Stats */}
          <div className="pc-stats">
            <div className="pc-stat">
              <span className="pc-stat-n" style={{ color:program.accentSolid }}>{program.duration}</span>
              <span className="pc-stat-l">Duration</span>
            </div>
            <div className="pc-stat-div" />
            <div className="pc-stat">
              <span className="pc-stat-n" style={{ color:program.accentSolid }}>{program.courses}</span>
              <span className="pc-stat-l">Available</span>
            </div>
          </div>

          {/* ── APPLY BUTTON (replaces broken "Explore Program") ── */}
          <button className="pc-apply-btn"
            style={{ background:program.badgeColor, boxShadow:`0 6px 20px ${program.glow}` }}
            onClick={(e)=>{ e.stopPropagation(); onApply(program); }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 6.5h10M6.5 2l4.5 4.5L6.5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */
const Program = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [applyFor, setApplyFor] = useState(null);   // which program modal is open

  useEffect(()=>{
    const ck=()=>setIsMobile(window.innerWidth<640);
    ck(); window.addEventListener("resize",ck);
    return ()=>window.removeEventListener("resize",ck);
  },[]);

  return (
    <section id="programs" className="pc-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

        /* ── Section ── */
        .pc-section {
          position:relative; width:100%;
          padding:clamp(64px,10vw,116px) 0 clamp(64px,8vw,96px);
          background:
            radial-gradient(ellipse 70% 40% at 10% 20%,rgba(29,78,216,.08) 0%,transparent 65%),
            radial-gradient(ellipse 60% 35% at 90% 80%,rgba(37,99,235,.07) 0%,transparent 65%),
            linear-gradient(160deg,#020b18 0%,#041220 40%,#061a30 70%,#030e1e 100%);
          overflow:hidden; font-family:'Outfit',sans-serif;
        }
        .pc-section::before { content:''; position:absolute; inset:0; z-index:0; pointer-events:none; background-image:linear-gradient(rgba(96,165,250,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,.022) 1px,transparent 1px); background-size:58px 58px; }
        .pc-section::after  { content:''; position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.025; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

        /* ── Header ── */
        .pc-header { position:relative; z-index:1; text-align:center; margin-bottom:clamp(32px,5vw,60px); padding:0 clamp(16px,5vw,72px); }
        .pc-eyebrow { display:inline-flex; align-items:center; gap:8px; padding:5px 15px; border-radius:100px; background:rgba(59,130,246,.1); border:1px solid rgba(96,165,250,.22); font-size:10px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:#93c5fd; margin-bottom:20px; }
        .pc-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:#3b82f6; box-shadow:0 0 6px #3b82f6; animation:pcDot 2s ease-in-out infinite; }
        @keyframes pcDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.65)} }
        .pc-title { font-family:'Syne',sans-serif; font-size:clamp(1.85rem,4.5vw,3.2rem); font-weight:900; line-height:1.08; letter-spacing:-.025em; color:#eff6ff !important; margin-bottom:14px; }
        .pc-title-acc { background:linear-gradient(135deg,#60a5fa 0%,#93c5fd 50%,#bfdbfe 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .pc-subtitle { font-size:clamp(13px,1.5vw,15.5px); color:rgba(191,219,254,.55); font-weight:300; max-width:480px; margin:0 auto; line-height:1.85; }
        .pc-divider { width:56px; height:2px; background:linear-gradient(90deg,#1d4ed8,#60a5fa,#bfdbfe); border-radius:2px; margin:20px auto 0; box-shadow:0 0 14px rgba(59,130,246,.45); }

        /* ── Counters ── */
        .pc-counters { position:relative; z-index:1; display:flex; justify-content:center; flex-wrap:wrap; gap:clamp(10px,2.5vw,24px); padding:0 clamp(16px,5vw,72px); margin-bottom:clamp(32px,5vw,56px); }
        .pc-counter { display:flex; flex-direction:column; align-items:center; padding:13px 20px; border-radius:14px; background:rgba(255,255,255,.03); border:1px solid rgba(96,165,250,.12); backdrop-filter:blur(10px); min-width:100px; transition:border-color .3s,transform .3s cubic-bezier(.34,1.56,.64,1); }
        .pc-counter:hover { border-color:rgba(96,165,250,.35); transform:translateY(-3px); }
        .pc-counter-num { font-family:'Syne',sans-serif; font-size:clamp(1.2rem,2.5vw,1.65rem); font-weight:900; color:#fff; line-height:1; }
        .pc-counter-lbl { font-size:9.5px; font-weight:500; letter-spacing:.14em; text-transform:uppercase; color:rgba(147,197,253,.5); margin-top:4px; }

        /* ── Grid ── */
        .pc-grid { position:relative; z-index:1; display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(12px,2.2vw,24px); padding:0 clamp(16px,5vw,72px); max-width:1280px; margin:0 auto; }
        @media(max-width:920px){ .pc-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:560px){ .pc-grid { grid-template-columns:1fr; gap:16px; } }

        /* ── Card wrap ── */
        .pc-wrap { position:relative; opacity:0; animation:pcIn .72s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes pcIn { from{opacity:0;transform:translateY(28px) scale(.97)} to{opacity:1;transform:none} }
        .pc-num { position:absolute; top:-13px; left:18px; z-index:10; font-family:'Syne',sans-serif; font-size:.65rem; font-weight:900; letter-spacing:.18em; text-transform:uppercase; color:rgba(96,165,250,.4); pointer-events:none; }

        /* ── Card ── */
        .pc-card { position:relative; width:100%; height:clamp(320px,40vw,460px); border-radius:20px; overflow:hidden; cursor:pointer; transform-style:preserve-3d; will-change:transform; transition:box-shadow .4s ease; }
        @media(max-width:560px){ .pc-card{height:330px} }

        .pc-img { position:absolute; inset:0; will-change:transform; }
        .pc-img img { width:100%; height:100%; object-fit:cover; object-position:center; display:block; }
        .pc-base-ov { position:absolute; inset:0; z-index:1; background:linear-gradient(to top,rgba(2,11,24,.95) 0%,rgba(4,18,32,.55) 45%,rgba(4,18,32,.18) 100%); }
        .pc-tint { position:absolute; inset:0; z-index:1; pointer-events:none; }
        .pc-glare { position:absolute; inset:0; z-index:2; pointer-events:none; border-radius:20px; }
        .pc-border-glow { position:absolute; inset:0; border-radius:20px; z-index:3; pointer-events:none; transition:opacity .35s; }
        .pc-badge { position:absolute; top:14px; left:14px; z-index:5; padding:4px 11px; border-radius:100px; font-size:9.5px; font-weight:700; letter-spacing:.13em; text-transform:uppercase; color:#fff; box-shadow:0 4px 14px rgba(0,0,0,.4); }
        .pc-tap-hint { position:absolute; bottom:18px; right:16px; z-index:5; display:flex; align-items:center; gap:5px; font-size:10px; color:rgba(255,255,255,.4); letter-spacing:.06em; }

        /* Default label */
        .pc-label { position:absolute; bottom:0; left:0; right:0; z-index:4; padding:22px 18px 18px; }
        .pc-label-pill { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:100px; border:1px solid; font-size:9.5px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.72); margin-bottom:6px; }
        .pc-label-dot { width:4px; height:4px; border-radius:50%; flex-shrink:0; }
        .pc-label-title { font-family:'Syne',sans-serif; font-size:clamp(1.1rem,2vw,1.3rem); font-weight:800; color:#fff; letter-spacing:-.02em; margin:0; }

        /* Hover panel */
        .pc-panel { position:absolute; inset:0; z-index:5; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px 18px; text-align:center; background:linear-gradient(160deg,rgba(4,16,44,.9),rgba(2,10,28,.95)); backdrop-filter:blur(6px); }
        .pc-icon-box { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
        .pc-icon-box img { width:26px; height:26px; object-fit:contain; filter:brightness(0) invert(1); }
        .pc-panel-title { font-family:'Syne',sans-serif; font-size:clamp(1.1rem,2.2vw,1.35rem); font-weight:900; color:#fff; letter-spacing:-.02em; margin:0 0 2px; }
        .pc-panel-sub { font-size:10px; font-weight:600; letter-spacing:.13em; text-transform:uppercase; color:rgba(147,197,253,.6); margin-bottom:8px; }
        .pc-panel-desc { font-size:12px; font-weight:300; color:rgba(191,219,254,.58); line-height:1.7; margin-bottom:10px; max-width:220px; }
        .pc-panel-tags { display:flex; flex-wrap:wrap; justify-content:center; gap:4px; margin-bottom:10px; }
        .pc-panel-tag { padding:2px 8px; border-radius:100px; font-size:9px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; border:1px solid; background:transparent; }
        .pc-stats { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .pc-stat { display:flex; flex-direction:column; align-items:center; gap:2px; }
        .pc-stat-n { font-size:12px; font-weight:700; }
        .pc-stat-l { font-size:9px; text-transform:uppercase; letter-spacing:.1em; color:rgba(147,197,253,.45); }
        .pc-stat-div { width:1px; height:24px; background:rgba(96,165,250,.18); }

        /* Apply button */
        .pc-apply-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 20px; border-radius:100px; font-family:'Outfit',sans-serif; font-size:12px; font-weight:700; letter-spacing:.06em; color:#fff; border:none; cursor:pointer; transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s; }
        .pc-apply-btn:hover { transform:translateY(-2px) scale(1.04); }

        /* ── Tags strip ── */
        .pc-tags { position:relative; z-index:1; display:flex; flex-wrap:wrap; justify-content:center; gap:8px; padding:clamp(32px,5vw,52px) clamp(16px,5vw,72px) 0; max-width:1280px; margin:0 auto; }
        .pc-tag { display:inline-flex; align-items:center; gap:6px; padding:6px 13px; border-radius:100px; background:rgba(255,255,255,.03); border:1px solid rgba(96,165,250,.14); font-size:10.5px; font-weight:500; color:rgba(191,219,254,.5); transition:all .25s ease; cursor:default; }
        .pc-tag:hover { background:rgba(59,130,246,.1); border-color:rgba(96,165,250,.32); color:#bfdbfe; transform:translateY(-2px); }
        .pc-tag-dot { width:4px; height:4px; border-radius:50%; background:#3b82f6; opacity:.65; }

        /* ── Comparison table ── */
        .pc-compare { position:relative; z-index:1; margin:clamp(36px,5vw,60px) auto 0; max-width:860px; padding:0 clamp(16px,5vw,72px); }
        .pc-compare-lbl { text-align:center; font-size:10px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:rgba(147,197,253,.4); margin-bottom:16px; }
        .pc-compare-tbl { width:100%; border-collapse:separate; border-spacing:0; background:rgba(255,255,255,.025); border:1px solid rgba(96,165,250,.12); border-radius:16px; overflow:hidden; }
        .pc-compare-tbl th { padding:12px 16px; font-family:'Syne',sans-serif; font-size:11px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:rgba(147,197,253,.7); background:rgba(29,78,216,.07); border-bottom:1px solid rgba(96,165,250,.1); text-align:left; }
        .pc-compare-tbl th:first-child{border-radius:16px 0 0 0} .pc-compare-tbl th:last-child{border-radius:0 16px 0 0}
        .pc-compare-tbl td { padding:11px 16px; font-size:12.5px; color:rgba(191,219,254,.65); border-bottom:1px solid rgba(96,165,250,.06); }
        .pc-compare-tbl tr:last-child td{border-bottom:none}
        .pc-compare-tbl tr:hover td { background:rgba(59,130,246,.04); color:rgba(191,219,254,.85); }
        .pc-dot-ind { display:inline-block; width:7px; height:7px; border-radius:50%; background:#3b82f6; box-shadow:0 0 6px #3b82f6; }

        /* ── Modal animations ── */
        @keyframes pcLbIn { from{opacity:0} to{opacity:1} }
        @keyframes pcPop  { from{opacity:0;transform:scale(.93) translateY(12px)} to{opacity:1;transform:none} }
        @keyframes pcSpin { to{transform:rotate(360deg)} }

        @media(max-width:560px){
          .pc-compare{display:none}
          .pc-counters{gap:8px}
          .pc-counter{min-width:78px;padding:10px 12px}
          .pc-counter-num{font-size:1.15rem}
        }
      `}</style>

      <ParticleField />

      {/* Apply modal */}
      {applyFor && <ApplyModal program={applyFor} onClose={()=>setApplyFor(null)} />}

      {/* Header */}
      <div className="pc-header">
        <div className="pc-eyebrow"><span className="pc-eyebrow-dot" />Academic Pathways</div>
        <h2 className="pc-title">Choose Your <span className="pc-title-acc">Academic Journey</span></h2>
        <p className="pc-subtitle">Three distinct pathways — each engineered to take you further, faster, and with lasting impact.</p>
        <div className="pc-divider" />
      </div>

      {/* Counters */}
      <div className="pc-counters">
        <CountUp end={240}   suffix="+" label="Programs" />
        <CountUp end={12000} suffix="+" label="Students" />
        <CountUp end={98}    suffix="%" label="Employment" />
        <CountUp end={45}    suffix=""  label="Countries" />
      </div>

      {/* Cards */}
      <div className="pc-grid">
        {PROGRAMS.map((p,i)=>(
          <TiltCard key={i} program={p} index={i} isMobile={isMobile} onApply={setApplyFor} />
        ))}
      </div>

      {/* Tags */}
      <div className="pc-tags">
        {["Accredited Programs","Global Faculty","Scholarships Available","Flexible Schedule","Industry Partnerships","Research Opportunities","Exchange Programs","Career Placement"].map(t=>(
          <div key={t} className="pc-tag"><span className="pc-tag-dot" />{t}</div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="pc-compare">
        <p className="pc-compare-lbl">Quick Comparison</p>
        <table className="pc-compare-tbl">
          <thead>
            <tr><th>Program</th><th>Duration</th><th>Courses</th><th>Scholarship</th><th>Research</th></tr>
          </thead>
          <tbody>
            {PROGRAMS.map(p=>(
              <tr key={p.title}>
                <td style={{ fontWeight:600,color:"rgba(224,242,254,.85)",fontFamily:"'Syne',sans-serif",fontSize:13 }}>{p.title}</td>
                <td>{p.duration}</td>
                <td>{p.courses}</td>
                <td>{p.title==="Doctorate" ? <span className="pc-dot-ind"/> : "Merit-based"}</td>
                <td>{p.title!=="Graduation" ? <span className="pc-dot-ind"/> : "Optional"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Program;