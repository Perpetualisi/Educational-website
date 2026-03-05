import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   SCROLL HELPER
───────────────────────────────────────────────────────────── */
const goTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ─────────────────────────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────────────────────────── */
const useTypewriter = (words, speed = 75, pause = 2200) => {
  const [display, setDisplay] = useState("");
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = words[wi];
    let t;
    if (!del && display === cur)     t = setTimeout(() => setDel(true), pause);
    else if (del && display === "")  { setDel(false); setWi(i => (i + 1) % words.length); }
    else t = setTimeout(() =>
      setDisplay(del ? cur.slice(0, display.length - 1) : cur.slice(0, display.length + 1)),
      del ? speed / 2 : speed
    );
    return () => clearTimeout(t);
  }, [display, del, wi, words, speed, pause]);
  return display;
};

/* ─────────────────────────────────────────────────────────────
   COUNTER
───────────────────────────────────────────────────────────── */
const Counter = ({ end, suffix = "", label, icon }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true; obs.disconnect();
      const s = performance.now(), d = 1800;
      const tick = (now) => {
        const p = Math.min((now - s) / d, 1);
        setN(Math.floor((1 - Math.pow(1 - p, 4)) * end));
        if (p < 1) requestAnimationFrame(tick); else setN(end);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return (
    <div ref={ref} className="hst">
      <div className="hst-ic">{icon}</div>
      <div className="hst-n">{n.toLocaleString()}<em>{suffix}</em></div>
      <div className="hst-l">{label}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CURSOR FOLLOWER
───────────────────────────────────────────────────────────── */
const Cursor = ({ on }) => {
  const d = useRef(null), r = useRef(null);
  const p = useRef({ x: -200, y: -200 }), lag = useRef({ x: -200, y: -200 });
  useEffect(() => {
    if (!on) return;
    const mv = (e) => { p.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", mv);
    let raf;
    const loop = () => {
      lag.current.x += (p.current.x - lag.current.x) * 0.11;
      lag.current.y += (p.current.y - lag.current.y) * 0.11;
      if (d.current) d.current.style.transform = `translate(${p.current.x-4}px,${p.current.y-4}px)`;
      if (r.current) r.current.style.transform = `translate(${lag.current.x-20}px,${lag.current.y-20}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); };
  }, [on]);
  if (!on) return null;
  return (
    <>
      <div ref={d} style={{ position:"fixed",top:0,left:0,width:8,height:8,borderRadius:"50%",background:"rgba(96,165,250,.9)",pointerEvents:"none",zIndex:9999,mixBlendMode:"screen",willChange:"transform" }} />
      <div ref={r} style={{ position:"fixed",top:0,left:0,width:40,height:40,borderRadius:"50%",border:"1.5px solid rgba(96,165,250,.4)",pointerEvents:"none",zIndex:9998,willChange:"transform" }} />
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   THREE.JS SCENE
───────────────────────────────────────────────────────────── */
const ThreeScene = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const R = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    R.setSize(el.clientWidth, el.clientHeight);
    R.toneMapping = THREE.ACESFilmicToneMapping;
    R.toneMappingExposure = 1.2;
    el.appendChild(R.domElement);

    const scene = new THREE.Scene();
    const cam   = new THREE.PerspectiveCamera(52, el.clientWidth / el.clientHeight, 0.1, 200);
    cam.position.set(0, 2, 16);
    scene.fog = new THREE.FogExp2(0x020a1a, 0.032);

    scene.add(new THREE.AmbientLight(0x1a1040, 2));
    const dir = new THREE.DirectionalLight(0x60a5fa, 4); dir.position.set(5,12,8); scene.add(dir);
    const ptA = new THREE.PointLight(0x3b82f6, 7, 30); ptA.position.set(-6,4,4); scene.add(ptA);
    const ptB = new THREE.PointLight(0x60a5fa, 5, 24); ptB.position.set(7,2,-3); scene.add(ptB);
    const ptC = new THREE.PointLight(0x93c5fd, 4, 20); ptC.position.set(2,-4,5); scene.add(ptC);

    const gMat = new THREE.MeshPhysicalMaterial({ color:0x1e3a8a,metalness:0.15,roughness:0.08,transmission:0.6,thickness:1.4,transparent:true,opacity:0.85,side:THREE.DoubleSide });
    const eMat = new THREE.LineBasicMaterial({ color:0x60a5fa,transparent:true,opacity:0.5 });
    const ae   = (m) => m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), eMat.clone()));

    // Tower
    const TG = new THREE.Group();
    const tw = new THREE.Mesh(new THREE.BoxGeometry(1.4,5.5,1.4), gMat.clone()); ae(tw); TG.add(tw);
    for (let i=0;i<8;i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.85,0.025,8,48), new THREE.MeshStandardMaterial({color:0x60a5fa,emissive:0x1d4ed8,emissiveIntensity:0.8,metalness:0.9,roughness:0.1}));
      r.position.y = -2.5+i*0.7; r.rotation.x = Math.PI/2; TG.add(r);
    }
    const pyr = new THREE.Mesh(new THREE.ConeGeometry(1.2,2.2,4), new THREE.MeshStandardMaterial({color:0xe0f2fe,metalness:0.95,roughness:0.14,emissive:0x0c4a6e,emissiveIntensity:0.5}));
    pyr.position.set(0,3.85,0); pyr.rotation.y=Math.PI/4; TG.add(pyr);
    scene.add(TG);

    // Rings
    const RG = new THREE.Group();
    const mkR = (r,tube,color,rx,ry,rz) => { const m=new THREE.Mesh(new THREE.TorusGeometry(r,tube,14,100),new THREE.MeshStandardMaterial({color,metalness:0.9,roughness:0.1,emissive:color,emissiveIntensity:0.3})); m.rotation.set(rx,ry,rz); return m; };
    RG.add(mkR(3.4,0.022,0x60a5fa,Math.PI/2.5,0.3,0));
    RG.add(mkR(4.4,0.016,0x60a5fa,Math.PI/3,0.8,0.4));
    RG.add(mkR(2.6,0.028,0x93c5fd,Math.PI/1.6,0.5,1.1));
    RG.add(mkR(5.2,0.012,0x93c5fd,Math.PI/4,1.2,0.6));
    scene.add(RG);

    // Helix
    const HG = new THREE.Group(); HG.position.set(5,0,-2);
    const hm1=new THREE.MeshStandardMaterial({color:0x60a5fa,emissive:0x1d4ed8,emissiveIntensity:0.6,metalness:0.8,roughness:0.15});
    const hm2=new THREE.MeshStandardMaterial({color:0x93c5fd,emissive:0x1d4ed8,emissiveIntensity:0.5,metalness:0.8,roughness:0.15});
    const cm =new THREE.MeshStandardMaterial({color:0xe0f2fe,metalness:0.95,roughness:0.1,emissive:0x60a5fa,emissiveIntensity:0.2,transparent:true,opacity:0.5});
    for (let i=0;i<28;i++) {
      const t=(i/28)*Math.PI*4-Math.PI*2, y=(i/28)*10-5, rr=0.95;
      const b1=new THREE.Mesh(new THREE.SphereGeometry(0.09,10,10),hm1.clone()); b1.position.set(Math.cos(t)*rr,y,Math.sin(t)*rr); HG.add(b1);
      const b2=new THREE.Mesh(new THREE.SphereGeometry(0.09,10,10),hm2.clone()); b2.position.set(Math.cos(t+Math.PI)*rr,y,Math.sin(t+Math.PI)*rr); HG.add(b2);
      if (i%3===0) { const c=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,rr*2,6),cm.clone()); c.position.set(0,y,0); c.rotation.z=Math.PI/2; c.rotation.y=-t; HG.add(c); }
    }
    scene.add(HG);

    // Node network
    const NG=new THREE.Group(); NG.position.set(-5.5,0,-1);
    const np=[],nodes=[];
    const nm=new THREE.MeshStandardMaterial({color:0x93c5fd,emissive:0x1d4ed8,emissiveIntensity:0.8,metalness:0.7,roughness:0.2});
    for (let i=0;i<18;i++) { const x=(Math.random()-.5)*5,y=(Math.random()-.5)*8,z=(Math.random()-.5)*3; np.push(new THREE.Vector3(x,y,z)); const n=new THREE.Mesh(new THREE.SphereGeometry(0.07+Math.random()*0.08,10,10),nm.clone()); n.position.set(x,y,z); nodes.push(n); NG.add(n); }
    const lm=new THREE.LineBasicMaterial({color:0x3b82f6,transparent:true,opacity:0.3});
    for (let i=0;i<np.length;i++) for (let j=i+1;j<np.length;j++) if (np[i].distanceTo(np[j])<3.2) { const g=new THREE.BufferGeometry().setFromPoints([np[i],np[j]]); NG.add(new THREE.Line(g,lm.clone())); }
    scene.add(NG);

    // Satellites
    const sats=[];
    [[-4.5,1.2,-1],[4.2,-0.5,0.5],[-3,-2,1.5],[3.5,2.2,-2],[-2,2.8,-3],[2.8,-1.8,-2.5]].forEach(([x,y,z],i)=>{
      const s=0.3+Math.random()*0.4, geo=i%2===0?new THREE.BoxGeometry(s,s,s):new THREE.OctahedronGeometry(s*0.7);
      const mat=new THREE.MeshPhysicalMaterial({color:[0x1e3a8a,0x1d4ed8,0x1e40af][i%3],metalness:0.6,roughness:0.15,transparent:true,opacity:0.8,emissive:[0x1e3a8a,0x1d4ed8,0x1e40af][i%3],emissiveIntensity:0.2});
      const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); ae(m); sats.push({m,sp:0.004+Math.random()*0.006,ph:i*1.05}); scene.add(m);
    });

    // Glass panels
    const panels=[];
    [[-3.8,0.5,0.5,0.02,3.8,2.2],[3.6,-0.8,0.8,0.02,3.2,1.8],[0,-2.5,-1.5,3.5,0.02,1.4]].forEach(([x,y,z,w,h,dd])=>{
      const mat=gMat.clone(); mat.opacity=0.35;
      const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,dd),mat); m.position.set(x,y,z); ae(m); panels.push({m,by:y,sp:0.003+Math.random()*0.003}); scene.add(m);
    });

    // Particles
    const PC=2200, pp=new Float32Array(PC*3), cl=new Float32Array(PC*3);
    const pal=[[0.23,0.55,1],[0.20,0.65,1],[0.55,0.80,1],[0.40,0.70,1],[0.65,0.50,1]];
    for (let i=0;i<PC;i++) { pp[i*3]=(Math.random()-.5)*70; pp[i*3+1]=(Math.random()-.5)*45; pp[i*3+2]=(Math.random()-.5)*55; const c=pal[Math.floor(Math.random()*pal.length)]; cl[i*3]=c[0];cl[i*3+1]=c[1];cl[i*3+2]=c[2]; }
    const pg=new THREE.BufferGeometry(); pg.setAttribute("position",new THREE.BufferAttribute(pp,3)); pg.setAttribute("color",new THREE.BufferAttribute(cl,3));
    const pm=new THREE.PointsMaterial({size:0.065,vertexColors:true,transparent:true,opacity:0.7,sizeAttenuation:true}); scene.add(new THREE.Points(pg,pm));

    const shaft=new THREE.Mesh(new THREE.ConeGeometry(3,15,32,1,true),new THREE.MeshBasicMaterial({color:0x1d4ed8,transparent:true,opacity:0.04,side:THREE.DoubleSide,depthWrite:false})); shaft.position.set(0,9,0); scene.add(shaft);
    const grd=new THREE.Mesh(new THREE.CircleGeometry(10,64),new THREE.MeshStandardMaterial({color:0x08081e,metalness:0.9,roughness:0.2,transparent:true,opacity:0.55})); grd.rotation.x=-Math.PI/2; grd.position.y=-3.4; scene.add(grd);

    let mx=0,my=0;
    const onM=(e)=>{mx=(e.clientX/window.innerWidth-.5)*2; my=(e.clientY/window.innerHeight-.5)*2;};
    const onRS=()=>{ cam.aspect=el.clientWidth/el.clientHeight; cam.updateProjectionMatrix(); R.setSize(el.clientWidth,el.clientHeight); };
    window.addEventListener("mousemove",onM);
    window.addEventListener("resize",onRS);

    const start=Date.now();
    let fr;
    const animate=()=>{
      fr=requestAnimationFrame(animate); const t=(Date.now()-start)/1000;
      TG.position.y=Math.sin(t*0.5)*0.22; TG.rotation.y=t*0.1; pyr.rotation.y=t*0.18;
      RG.rotation.y=t*0.07; RG.rotation.x=Math.sin(t*0.04)*0.1;
      HG.rotation.y=t*0.15; HG.position.y=Math.sin(t*0.3)*0.4;
      NG.rotation.y=-t*0.06; nodes.forEach((n,i)=>{ n.material.emissiveIntensity=0.4+Math.sin(t*1.2+i*0.8)*0.4; });
      sats.forEach(({m,sp,ph})=>{ m.rotation.x+=sp*0.9; m.rotation.y+=sp; m.position.y+=Math.sin(t*0.4+ph)*0.003; });
      panels.forEach(({m,by,sp})=>{ m.position.y=by+Math.sin(t*sp*60)*0.15; m.rotation.z=Math.sin(t*sp*45)*0.04; });
      shaft.material.opacity=0.025+Math.sin(t*0.8)*0.015;
      ptA.color.setHSL((t*0.03)%1,0.8,0.6); ptB.color.setHSL(((t*0.03)+0.33)%1,0.8,0.6);
      pm.opacity=0.55+Math.sin(t*0.4)*0.12;
      cam.position.x+=(mx*1.8-cam.position.x)*0.022; cam.position.y+=(-my*1.2+2-cam.position.y)*0.022;
      cam.lookAt(0,0.5,0); R.render(scene,cam);
    };
    animate();
    return ()=>{ cancelAnimationFrame(fr); window.removeEventListener("mousemove",onM); window.removeEventListener("resize",onRS); R.dispose(); if(el.contains(R.domElement)) el.removeChild(R.domElement); };
  },[]);
  return <div ref={ref} style={{ position:"absolute",inset:0 }} />;
};

/* ─────────────────────────────────────────────────────────────
   MARQUEE
───────────────────────────────────────────────────────────── */
const Marquee = () => {
  const items = ["QS World Top 50","120+ Years of Excellence","42,000+ Global Alumni","180+ Research Grants","98% Employment Rate","12 International Campuses","$2.4B Research Endowment","Nobel Laureates on Faculty","Times Higher Education Award 2024"];
  return (
    <div style={{ overflow:"hidden",borderTop:"1px solid rgba(96,165,250,.12)",borderBottom:"1px solid rgba(96,165,250,.12)",background:"rgba(2,10,26,.6)",backdropFilter:"blur(8px)",padding:"9px 0",position:"absolute",bottom:44,left:0,right:0,zIndex:25,pointerEvents:"none" }}>
      <div style={{ display:"flex",animation:"hMQ 30s linear infinite",width:"max-content" }}>
        {[...items,...items].map((v,i)=>(
          <span key={i} style={{ display:"inline-flex",alignItems:"center",gap:14,padding:"0 24px",fontFamily:"'Outfit',sans-serif",fontSize:"0.62rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(147,197,253,.5)",whiteSpace:"nowrap" }}>
            <span style={{ width:3,height:3,borderRadius:"50%",background:"rgba(96,165,250,.5)",display:"inline-block",flexShrink:0 }} />{v}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   FACULTY QUICK-NAV — each card scrolls to #programs
───────────────────────────────────────────────────────────── */
const FacultyNav = () => (
  <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
    {[
      { code:"CS", label:"Computer Science & AI",   icon:"⬡", color:"#60a5fa" },
      { code:"MB", label:"Business & Economics",    icon:"◈", color:"#a78bfa" },
      { code:"MD", label:"Medicine & Life Sciences",icon:"⬟", color:"#34d399" },
      { code:"AR", label:"Architecture & Design",   icon:"◇", color:"#f59e0b" },
    ].map(({ code,label,icon,color })=>(
      <button key={code} onClick={()=>goTo("programs")}
        style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 13px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",backdropFilter:"blur(12px)",cursor:"pointer",transition:"all .3s cubic-bezier(.34,1.56,.64,1)",fontFamily:"'Outfit',sans-serif" }}
        onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor=color+"55"; e.currentTarget.style.background="rgba(255,255,255,.07)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="rgba(255,255,255,.08)"; e.currentTarget.style.background="rgba(255,255,255,.04)"; }}
      >
        <span style={{ fontSize:"0.9rem",color,flexShrink:0 }}>{icon}</span>
        <div style={{ textAlign:"left" }}>
          <div style={{ fontSize:"0.52rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginBottom:1 }}>{code}</div>
          <div style={{ fontSize:"0.67rem",color:"rgba(191,219,254,.8)",whiteSpace:"nowrap" }}>{label}</div>
        </div>
      </button>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   VIDEO MODAL
───────────────────────────────────────────────────────────── */
const VideoModal = ({ onClose }) => {
  useEffect(()=>{
    document.body.style.overflow = "hidden";
    const esc = (e) => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return ()=>{ document.body.style.overflow=""; window.removeEventListener("keydown",esc); };
  },[onClose]);
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:99999,background:"rgba(2,8,20,.94)",backdropFilter:"blur(22px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"hLbIn .3s ease" }}>
      <div onClick={e=>e.stopPropagation()} style={{ position:"relative",width:"100%",maxWidth:860,borderRadius:18,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(96,165,250,.15)",animation:"hPop .35s cubic-bezier(.22,1,.36,1)" }}>
        {/* close */}
        <button onClick={onClose}
          style={{ position:"absolute",top:12,right:12,zIndex:10,width:36,height:36,borderRadius:"50%",background:"rgba(4,18,48,.88)",border:"1px solid rgba(96,165,250,.28)",color:"rgba(191,219,254,.85)",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backdropFilter:"blur(8px)",transition:"background .2s,transform .2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(37,99,235,.5)"; e.currentTarget.style.transform="scale(1.1)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="rgba(4,18,48,.88)"; e.currentTarget.style.transform="none"; }}
          aria-label="Close video"
        >✕</button>
        {/* video */}
        <div style={{ position:"relative",paddingBottom:"56.25%",height:0 }}>
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media; fullscreen" allowFullScreen title="Campus Tour" style={{ position:"absolute",inset:0,width:"100%",height:"100%",border:"none" }} />
        </div>
        {/* caption */}
        <div style={{ padding:"12px 20px",background:"rgba(3,12,30,.95)",borderTop:"1px solid rgba(96,165,250,.12)" }}>
          <p style={{ fontFamily:"'Outfit',sans-serif",fontSize:"0.73rem",color:"rgba(147,197,253,.6)",margin:0 }}>
            🎥 Virtual Campus Tour &nbsp;·&nbsp; Press <kbd style={{ background:"rgba(96,165,250,.12)",border:"1px solid rgba(96,165,250,.25)",borderRadius:4,padding:"1px 5px",fontSize:"0.65rem",color:"rgba(191,219,254,.7)" }}>Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */
const Hero = () => {
  const WORDS = ["Innovators.","Leaders.","Researchers.","Visionaries.","Changemakers."];
  const typed = useTypewriter(WORDS, 75, 2000);
  const [isMobile,  setIsMobile]  = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(()=>{
    const ck = ()=>setIsMobile(window.innerWidth < 768);
    ck(); window.addEventListener("resize",ck);
    return ()=>window.removeEventListener("resize",ck);
  },[]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; }

        @keyframes hFU   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes hBI   { from{opacity:0;transform:scale(.9) translateY(10px)} to{opacity:1;transform:none} }
        @keyframes hLE   { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes hGP   { 0%,100%{opacity:.4} 50%{opacity:.85} }
        @keyframes hSC   { from{top:-1px} to{top:100%} }
        @keyframes hFL   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes hDB   { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes hSH   { from{transform:translateX(-120%) skewX(-15deg)} to{transform:translateX(400%) skewX(-15deg)} }
        @keyframes hBP   { 0%,100%{border-color:rgba(59,130,246,.25)} 50%{border-color:rgba(96,165,250,.6)} }
        @keyframes hMQ   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes hCB   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes hLbIn { from{opacity:0} to{opacity:1} }
        @keyframes hPop  { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:none} }
        @keyframes hAR   { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }

        .hf1{animation:hFU .9s cubic-bezier(.22,1,.36,1) .30s both}
        .hf2{animation:hFU .9s cubic-bezier(.22,1,.36,1) .45s both}
        .hf3{animation:hFU .9s cubic-bezier(.22,1,.36,1) .60s both}
        .hf4{animation:hFU .9s cubic-bezier(.22,1,.36,1) .75s both}
        .hf5{animation:hFU .9s cubic-bezier(.22,1,.36,1) .90s both}
        .hf6{animation:hFU .9s cubic-bezier(.22,1,.36,1) 1.05s both}
        .hbi {animation:hBI .7s cubic-bezier(.34,1.56,.64,1) .15s both}

        /* stat cards */
        .hst{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(20px);border-radius:14px;padding:12px 8px;text-align:center;transition:border-color .3s,transform .3s cubic-bezier(.34,1.56,.64,1)}
        .hst:hover{border-color:rgba(59,130,246,.45);transform:translateY(-4px)}
        .hst-ic{font-size:.95rem;margin-bottom:5px}
        .hst-n{font-family:'Cormorant Garamond',serif;font-size:clamp(1.1rem,3.5vw,1.9rem);font-weight:900;color:#eff6ff !important;line-height:1}
        .hst-n em{color:#93c5fd;font-style:normal}
        .hst-l{font-family:'Outfit',sans-serif;font-size:clamp(.5rem,1.2vw,.6rem);letter-spacing:.14em;text-transform:uppercase;color:rgba(148,163,184,.65);margin-top:4px}

        /* award badge */
        .hawd{background:linear-gradient(135deg,rgba(251,191,36,.12),rgba(251,191,36,.06));border:1px solid rgba(251,191,36,.28);border-radius:10px;padding:8px 11px;display:flex;align-items:center;gap:8px;backdrop-filter:blur(12px);transition:all .3s ease;cursor:default}
        .hawd:hover{border-color:rgba(251,191,36,.55);transform:translateY(-2px)}

        /* CTA Buttons */
        .hbp{position:relative;overflow:hidden;background:linear-gradient(135deg,#1d4ed8,#2563eb);border:none;cursor:pointer;display:inline-flex;align-items:center;gap:10px;padding:14px 28px;border-radius:100px;font-family:'Outfit',sans-serif;font-weight:700;font-size:.88rem;letter-spacing:.06em;color:white;transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s ease;white-space:nowrap}
        .hbp:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 20px 50px rgba(37,99,235,.55)}
        .hbp::after{content:'';position:absolute;inset-block:0;left:0;width:36%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);transform:translateX(-140%) skewX(-15deg);pointer-events:none}
        .hbp:hover::after{animation:hSH .6s ease forwards}
        .hbp .arr{animation:hAR 1.8s ease-in-out infinite}

        .hbo{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:100px;font-family:'Outfit',sans-serif;font-weight:600;font-size:.88rem;letter-spacing:.06em;color:white;background:transparent;border:1.5px solid rgba(255,255,255,.22);cursor:pointer;white-space:nowrap;transition:transform .3s cubic-bezier(.34,1.56,.64,1),background .3s,border-color .3s;animation:hBP 3.5s ease-in-out infinite}
        .hbo:hover{transform:translateY(-3px) scale(1.04);background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.5)!important;animation:none}

        .hbg{display:inline-flex;align-items:center;gap:7px;padding:14px 16px;border-radius:100px;font-family:'Outfit',sans-serif;font-weight:500;font-size:.82rem;letter-spacing:.05em;color:rgba(147,197,253,.65);background:transparent;border:none;cursor:pointer;transition:color .25s,transform .25s cubic-bezier(.34,1.56,.64,1);white-space:nowrap}
        .hbg:hover{color:#93c5fd;transform:translateX(3px)}

        /* misc */
        .hglt{text-shadow:0 0 50px rgba(96,165,250,.6),0 0 100px rgba(147,197,253,.2)}
        .hscn{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(59,130,246,.5),transparent);animation:hSC 5s linear infinite;pointer-events:none}
        .horb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;animation:hGP 5s ease-in-out infinite}
        .hdp{animation:hDB 1.8s ease-in-out infinite}
        .hcb{animation:hCB 1s step-end infinite}
        .hla{display:block;height:2px;border-radius:2px;background:linear-gradient(90deg,#60a5fa,#93c5fd,#bfdbfe);transform-origin:left;animation:hLE 1s cubic-bezier(.22,1,.36,1) .5s both}
        .hsd{cursor:pointer;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:6px;animation:hFL 2.2s ease-in-out infinite}
        .hsd:hover .hsd-line{opacity:.8}

        /* responsive */
        @media(max-width:1024px){ .h3d{opacity:.12!important;mask-image:none!important;-webkit-mask-image:none!important} .hfac{display:none!important} .hstg{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:767px){
          .h3d{opacity:.15!important;mask-image:none!important;-webkit-mask-image:none!important}
          .hpad{padding:96px 20px 130px!important}
          .hmxw{max-width:100%!important}
          .hh1{font-size:clamp(2rem,10vw,3rem)!important}
          .hawdr{flex-direction:column!important;gap:6px!important}
          .hawd{width:100%!important}
          .hctar{flex-direction:column!important;gap:10px!important}
          .hctaw{width:100%!important;justify-content:center!important}
          .hstg{grid-template-columns:repeat(2,1fr)!important;gap:8px!important}
          .hfac{display:none!important}
        }
        @media(max-width:380px){ .hh1{font-size:1.85rem!important} }
      `}</style>

      <Cursor on={!isMobile} />
      {videoOpen && <VideoModal onClose={()=>setVideoOpen(false)} />}

      <section id="hero" style={{ fontFamily:"'Outfit',system-ui,sans-serif",position:"relative",width:"100%",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden",background:"linear-gradient(160deg,#020b18 0%,#041220 35%,#061a30 65%,#03101e 100%)",cursor:isMobile?"auto":"none" }}>

        {/* Orbs */}
        <div className="horb" style={{ width:"min(700px,150vw)",height:"min(700px,150vw)",top:"-15%",right:"-10%",background:"radial-gradient(circle,rgba(37,99,235,.12),transparent 70%)" }} />
        <div className="horb" style={{ width:"min(500px,100vw)",height:"min(500px,100vw)",bottom:"-5%",left:"-6%",background:"radial-gradient(circle,rgba(59,130,246,.09),transparent 70%)",animationDelay:"2s" }} />

        {/* Grid */}
        <div style={{ position:"absolute",inset:0,zIndex:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(96,165,250,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,.022) 1px,transparent 1px)",backgroundSize:"60px 60px" }} />

        {/* 3D Scene */}
        <div className="h3d" style={{ position:"absolute",inset:0,zIndex:0,maskImage:"linear-gradient(to right,transparent 0%,rgba(0,0,0,.08) 25%,black 50%,black 100%)",WebkitMaskImage:"linear-gradient(to right,transparent 0%,rgba(0,0,0,.08) 25%,black 50%,black 100%)" }}>
          <ThreeScene />
          <div className="hscn" />
        </div>

        {/* Vignettes */}
        <div style={{ position:"absolute",inset:0,zIndex:10,pointerEvents:"none",background:"radial-gradient(ellipse 100% 100% at 50% 50%,transparent 48%,rgba(3,4,15,.6) 100%)" }} />
        <div style={{ position:"absolute",top:0,left:0,right:0,height:"8rem",zIndex:10,pointerEvents:"none",background:"linear-gradient(to bottom,rgba(3,4,15,.95),transparent)" }} />
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"8rem",zIndex:10,pointerEvents:"none",background:"linear-gradient(to top,rgba(3,4,15,.98),transparent)" }} />

        {/* ═══ CONTENT ═══ */}
        <div className="hpad" style={{ width:"100%",maxWidth:1400,margin:"0 auto",padding:"clamp(110px,12vw,190px) clamp(24px,8vw,100px) 80px",position:"relative",zIndex:20 }}>
          <div className="hmxw" style={{ maxWidth:660 }}>

            {/* Live badge */}
            <div className="hbi" style={{ marginBottom:22 }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 15px",borderRadius:100,background:"linear-gradient(135deg,rgba(59,130,246,.18),rgba(96,165,250,.1))",border:"1px solid rgba(96,165,250,.3)",color:"#93c5fd",backdropFilter:"blur(14px)" }}>
                <span style={{ position:"relative",display:"inline-flex",width:7,height:7,flexShrink:0 }}>
                  <span className="hdp" style={{ position:"absolute",display:"inline-flex",width:"100%",height:"100%",borderRadius:"50%",background:"#60a5fa",opacity:.75 }} />
                  <span style={{ position:"relative",width:7,height:7,borderRadius:"50%",background:"#3b82f6",display:"inline-flex" }} />
                </span>
                <span style={{ fontFamily:"'Outfit',sans-serif",fontSize:".6rem",fontWeight:600,letterSpacing:".16em",textTransform:"uppercase" }}>
                  Admissions Open · Class of 2026
                </span>
              </div>
            </div>

            {/* Eyebrow */}
            <div className="hf1" style={{ marginBottom:14 }}>
              <p style={{ fontFamily:"'Outfit',sans-serif",fontSize:".68rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(147,197,253,.5)",margin:0 }}>
                Est. 1892 · 12 Global Campuses · QS World Top 50
              </p>
            </div>

            {/* H1 */}
            <div className="hf2" style={{ marginBottom:10 }}>
              <h1 className="hh1" style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",lineHeight:1.05,letterSpacing:"-.01em",fontSize:"clamp(2.4rem,7vw,5rem)",color:"#eff6ff",margin:0 }}>
                Shaping the World's
                <br />Next{" "}
                <em className="hglt" style={{ fontStyle:"normal",background:"linear-gradient(135deg,#fff 0%,#93c5fd 30%,#60a5fa 60%,#e0f2fe 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                  {typed||"\u00A0"}
                </em>
                <span className="hcb" style={{ display:"inline-block",width:3,height:".82em",background:"#60a5fa",marginLeft:3,borderRadius:2,verticalAlign:"middle",WebkitTextFillColor:"#60a5fa" }} />
              </h1>
            </div>

            {/* Accent line */}
            <div className="hf2" style={{ marginBottom:22 }}>
              <span className="hla" style={{ width:72 }} />
            </div>

            {/* Body */}
            <div className="hf3" style={{ marginBottom:18 }}>
              <p style={{ fontFamily:"'Outfit',sans-serif",fontSize:"clamp(.85rem,1.8vw,1.05rem)",lineHeight:1.85,color:"rgba(219,234,254,.65)",maxWidth:510,fontWeight:300,margin:0 }}>
                Join a community of <strong style={{ color:"#bfdbfe",fontWeight:600 }}>world-class scholars</strong>, visionary researchers, and bold innovators. An education designed not just to inform — but to <strong style={{ color:"#bfdbfe",fontWeight:600 }}>transform.</strong>
              </p>
            </div>

            {/* Award badges */}
            <div className="hf4 hawdr" style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:24 }}>
              {[
                { icon:"🏆", title:"Times HE Award",     sub:"2024 University of the Year" },
                { icon:"⭐", title:"QS Stars Rating",    sub:"Five Stars Overall" },
                { icon:"🔬", title:"Research Excellence",sub:"REF Gold Framework" },
              ].map(({icon,title,sub})=>(
                <div key={title} className="hawd">
                  <span style={{ fontSize:".95rem",flexShrink:0 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily:"'Outfit',sans-serif",fontSize:".57rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(251,191,36,.85)" }}>{title}</div>
                    <div style={{ fontFamily:"'Outfit',sans-serif",fontSize:".54rem",color:"rgba(255,255,255,.38)",marginTop:1 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ═══ CTA BUTTONS ═══ */}
            <div className="hf5 hctar" style={{ display:"flex",flexWrap:"wrap",gap:10,marginBottom:28 }}>

              {/* → #programs */}
              <button className="hbp hctaw" onClick={()=>goTo("programs")}>
                Explore Programs
                <svg className="arr" width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0 }}>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* → video modal */}
              <button className="hbo hctaw" onClick={()=>setVideoOpen(true)}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink:0 }}>
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="rgba(147,197,253,.7)" strokeWidth="1.4"/>
                  <polygon points="6,5 11,7.5 6,10" fill="rgba(147,197,253,.85)"/>
                </svg>
                Virtual Campus Tour
              </button>

              {/* → #contact */}
              <button className="hbg hctaw" onClick={()=>goTo("contact")}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0 }}>
                  <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                Get In Touch
              </button>
            </div>

            {/* Faculty quick-nav — desktop only */}
            <div className="hf5 hfac" style={{ marginBottom:28 }}>
              <p style={{ fontFamily:"'Outfit',sans-serif",fontSize:".58rem",letterSpacing:".16em",textTransform:"uppercase",color:"rgba(147,197,253,.38)",margin:"0 0 9px" }}>Explore Faculties</p>
              <FacultyNav />
            </div>

            {/* Stats */}
            <div className="hf6">
              <div className="hstg" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8 }}>
                {[
                  { end:120,   suffix:"+", label:"Years Legacy",    icon:"🏛️" },
                  { end:42000, suffix:"+", label:"Alumni Global",   icon:"🌍" },
                  { end:98,    suffix:"%", label:"Employment Rate", icon:"📈" },
                  { end:180,   suffix:"+", label:"Research Grants", icon:"🔬" },
                ].map(s=><Counter key={s.label} {...s} />)}
              </div>
            </div>

          </div>
        </div>

        {/* Marquee */}
        <Marquee />

        {/* Scroll indicator — CLICKABLE, scrolls to #programs */}
        <button
          className="hsd"
          onClick={()=>goTo("programs")}
          aria-label="Scroll to programs"
          style={{ position:"absolute",bottom:52,left:"50%",transform:"translateX(-50%)",zIndex:26 }}
        >
          <span style={{ fontFamily:"'Outfit',sans-serif",fontSize:".52rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(147,197,253,.35)" }}>Scroll</span>
          <div className="hsd-line" style={{ width:1,height:32,background:"linear-gradient(to bottom,rgba(59,130,246,.5),transparent)",transition:"opacity .25s" }} />
        </button>

        {/* Grain */}
        <div style={{ position:"absolute",inset:0,zIndex:30,pointerEvents:"none",opacity:0.022,backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      </section>
    </>
  );
};

export default Hero;