import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════
   TYPEWRITER HOOK
═══════════════════════════════════════════════════════ */
const useTypewriter = (words, speed = 80, pause = 2200) => {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && display === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && display === "") {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setDisplay(deleting ? current.slice(0, display.length - 1) : current.slice(0, display.length + 1));
      }, deleting ? speed / 2 : speed);
    }
    return () => clearTimeout(timeout);
  }, [display, deleting, wordIdx, words, speed, pause]);
  return display;
};

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════════ */
const Counter = ({ end, suffix = "", label, icon }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true;
      obs.disconnect();
      const duration = 1800;
      const startTime = performance.now();
      const tick = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setCount(Math.floor(eased * end));
        if (p < 1) requestAnimationFrame(tick);
        else setCount(end);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return (
    <div ref={ref} className="stat-card-inner">
      <div className="stat-icon">{icon}</div>
      <div className="stat-number">{count.toLocaleString()}<span className="stat-suffix">{suffix}</span></div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   CURSOR FOLLOWER — desktop only
═══════════════════════════════════════════════════════ */
const CursorFollower = ({ isMobile }) => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  useEffect(() => {
    if (isMobile) return;
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);
    let raf;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x - 18}px,${ring.current.y - 18}px)`;
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, [isMobile]);
  if (isMobile) return null;
  return (
    <>
      <div ref={dotRef} style={{ position:"fixed",top:0,left:0,width:8,height:8,borderRadius:"50%",background:"rgba(96,165,250,0.9)",pointerEvents:"none",zIndex:9999,mixBlendMode:"screen" }} />
      <div ref={ringRef} style={{ position:"fixed",top:0,left:0,width:36,height:36,borderRadius:"50%",border:"1.5px solid rgba(96,165,250,0.45)",pointerEvents:"none",zIndex:9998 }} />
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   THREE.JS SCENE
═══════════════════════════════════════════════════════ */
const ThreeScene = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, el.clientWidth / el.clientHeight, 0.1, 200);
    camera.position.set(0, 2, 16);
    scene.fog = new THREE.FogExp2(0x020a1a, 0.032);
    scene.add(new THREE.AmbientLight(0x1a1040, 2));
    const dir = new THREE.DirectionalLight(0x60a5fa, 4); dir.position.set(5, 12, 8); scene.add(dir);
    const ptA = new THREE.PointLight(0x60a5fa, 7, 30); ptA.position.set(-6, 4, 4); scene.add(ptA);
    const ptB = new THREE.PointLight(0x3b82f6, 5, 24); ptB.position.set(7, 2, -3); scene.add(ptB);
    const ptC = new THREE.PointLight(0xc084fc, 4, 20); ptC.position.set(2, -4, 5); scene.add(ptC);
    const glassMat = new THREE.MeshPhysicalMaterial({ color:0x1e3a8a,metalness:0.15,roughness:0.08,transmission:0.6,thickness:1.4,transparent:true,opacity:0.85,side:THREE.DoubleSide });
    const goldMat = new THREE.MeshStandardMaterial({ color:0xe0f2fe,metalness:0.95,roughness:0.14,emissive:0x0c4a6e,emissiveIntensity:0.5 });
    const edgeMat = new THREE.LineBasicMaterial({ color:0x60a5fa,transparent:true,opacity:0.5 });
    const addEdges = (m) => { const l = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), edgeMat.clone()); m.add(l); };
    const towerGroup = new THREE.Group();
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.4,5.5,1.4), glassMat.clone()); addEdges(tower); towerGroup.add(tower);
    for (let i=0;i<8;i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.85,0.025,8,48),new THREE.MeshStandardMaterial({color:0x60a5fa,emissive:0x1d4ed8,emissiveIntensity:0.8,metalness:0.9,roughness:0.1}));
      r.position.y=-2.5+i*0.7; r.rotation.x=Math.PI/2; towerGroup.add(r);
    }
    const pyr = new THREE.Mesh(new THREE.ConeGeometry(1.2,2.2,4), goldMat.clone());
    pyr.position.set(0,3.85,0); pyr.rotation.y=Math.PI/4; towerGroup.add(pyr);
    scene.add(towerGroup);
    const ringGroup = new THREE.Group();
    const makeRing = (r,tube,color,rx,ry,rz) => { const m=new THREE.Mesh(new THREE.TorusGeometry(r,tube,14,100),new THREE.MeshStandardMaterial({color,metalness:0.9,roughness:0.1,emissive:color,emissiveIntensity:0.3})); m.rotation.set(rx,ry,rz); return m; };
    ringGroup.add(makeRing(3.4,0.022,0x60a5fa,Math.PI/2.5,0.3,0));
    ringGroup.add(makeRing(4.4,0.016,0x60a5fa,Math.PI/3,0.8,0.4));
    ringGroup.add(makeRing(2.6,0.028,0x93c5fd,Math.PI/1.6,0.5,1.1));
    ringGroup.add(makeRing(5.2,0.012,0xc084fc,Math.PI/4,1.2,0.6));
    scene.add(ringGroup);
    const helixGroup = new THREE.Group(); helixGroup.position.set(5,0,-2);
    const hMat1=new THREE.MeshStandardMaterial({color:0x60a5fa,emissive:0x1d4ed8,emissiveIntensity:0.6,metalness:0.8,roughness:0.15});
    const hMat2=new THREE.MeshStandardMaterial({color:0xc084fc,emissive:0x7c3aed,emissiveIntensity:0.6,metalness:0.8,roughness:0.15});
    const cMat=new THREE.MeshStandardMaterial({color:0xe0f2fe,metalness:0.95,roughness:0.1,emissive:0x60a5fa,emissiveIntensity:0.2,transparent:true,opacity:0.55});
    for (let i=0;i<28;i++) {
      const t=(i/28)*Math.PI*4-Math.PI*2, y=(i/28)*10-5, rr=0.95;
      const b1=new THREE.Mesh(new THREE.SphereGeometry(0.09,10,10),hMat1.clone()); b1.position.set(Math.cos(t)*rr,y,Math.sin(t)*rr); helixGroup.add(b1);
      const b2=new THREE.Mesh(new THREE.SphereGeometry(0.09,10,10),hMat2.clone()); b2.position.set(Math.cos(t+Math.PI)*rr,y,Math.sin(t+Math.PI)*rr); helixGroup.add(b2);
      if (i%3===0) { const c=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,rr*2,6),cMat.clone()); c.position.set(0,y,0); c.rotation.z=Math.PI/2; c.rotation.y=-t; helixGroup.add(c); }
    }
    scene.add(helixGroup);
    const nodeGroup = new THREE.Group(); nodeGroup.position.set(-5.5,0,-1);
    const nPos=[], nodes=[];
    const nMat=new THREE.MeshStandardMaterial({color:0x93c5fd,emissive:0x1d4ed8,emissiveIntensity:0.8,metalness:0.7,roughness:0.2});
    for (let i=0;i<18;i++) { const x=(Math.random()-.5)*5,y=(Math.random()-.5)*8,z=(Math.random()-.5)*3; nPos.push(new THREE.Vector3(x,y,z)); const n=new THREE.Mesh(new THREE.SphereGeometry(0.07+Math.random()*0.08,10,10),nMat.clone()); n.position.set(x,y,z); nodes.push(n); nodeGroup.add(n); }
    const lMat=new THREE.LineBasicMaterial({color:0x3b82f6,transparent:true,opacity:0.3});
    for (let i=0;i<nPos.length;i++) for (let j=i+1;j<nPos.length;j++) if (nPos[i].distanceTo(nPos[j])<3.2) { const pts=new THREE.BufferGeometry().setFromPoints([nPos[i],nPos[j]]); nodeGroup.add(new THREE.Line(pts,lMat.clone())); }
    scene.add(nodeGroup);
    const satellites=[];
    [[-4.5,1.2,-1],[4.2,-0.5,0.5],[-3,-2,1.5],[3.5,2.2,-2],[-2,2.8,-3],[2.8,-1.8,-2.5]].forEach(([x,y,z],i)=>{
      const s=0.3+Math.random()*0.4, geo=i%2===0?new THREE.BoxGeometry(s,s,s):new THREE.OctahedronGeometry(s*0.7);
      const mat=new THREE.MeshPhysicalMaterial({color:[0x1e3a8a,0x1d4ed8,0x1e40af][i%3],metalness:0.6,roughness:0.15,transparent:true,opacity:0.8,emissive:[0x1e3a8a,0x1d4ed8,0x1e40af][i%3],emissiveIntensity:0.2});
      const mesh=new THREE.Mesh(geo,mat); mesh.position.set(x,y,z); addEdges(mesh); satellites.push({mesh,speed:0.004+Math.random()*0.006,phase:i*1.05}); scene.add(mesh);
    });
    const panels=[];
    [[-3.8,0.5,0.5,0.02,3.8,2.2],[3.6,-0.8,0.8,0.02,3.2,1.8],[0,-2.5,-1.5,3.5,0.02,1.4]].forEach(([x,y,z,w,h,d])=>{
      const mat=glassMat.clone(); mat.opacity=0.35;
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); mesh.position.set(x,y,z); addEdges(mesh); panels.push({mesh,baseY:y,speed:0.003+Math.random()*0.003}); scene.add(mesh);
    });
    const PARTS=2200, ppos=new Float32Array(PARTS*3), col=new Float32Array(PARTS*3);
    const pal=[[0.23,0.55,1],[0.20,0.65,1],[0.55,0.80,1],[0.40,0.70,1],[0.65,0.50,1]];
    for (let i=0;i<PARTS;i++) { ppos[i*3]=(Math.random()-.5)*70; ppos[i*3+1]=(Math.random()-.5)*45; ppos[i*3+2]=(Math.random()-.5)*55; const p=pal[Math.floor(Math.random()*pal.length)]; col[i*3]=p[0]; col[i*3+1]=p[1]; col[i*3+2]=p[2]; }
    const ptGeo=new THREE.BufferGeometry(); ptGeo.setAttribute('position',new THREE.BufferAttribute(ppos,3)); ptGeo.setAttribute('color',new THREE.BufferAttribute(col,3));
    const ptMat=new THREE.PointsMaterial({size:0.065,vertexColors:true,transparent:true,opacity:0.7,sizeAttenuation:true}); scene.add(new THREE.Points(ptGeo,ptMat));
    const shaft=new THREE.Mesh(new THREE.ConeGeometry(3,15,32,1,true),new THREE.MeshBasicMaterial({color:0x1d4ed8,transparent:true,opacity:0.04,side:THREE.DoubleSide,depthWrite:false})); shaft.position.set(0,9,0); scene.add(shaft);
    const ground=new THREE.Mesh(new THREE.CircleGeometry(10,64),new THREE.MeshStandardMaterial({color:0x08081e,metalness:0.9,roughness:0.2,transparent:true,opacity:0.55})); ground.rotation.x=-Math.PI/2; ground.position.y=-3.4; scene.add(ground);
    let mouseX=0,mouseY=0;
    const onMouse=(e)=>{mouseX=(e.clientX/window.innerWidth-.5)*2;mouseY=(e.clientY/window.innerHeight-.5)*2;};
    window.addEventListener('mousemove',onMouse);
    const onResize=()=>{camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight);};
    window.addEventListener('resize',onResize);
    let frame; const clock={start:Date.now(),get:()=>(Date.now()-clock.start)/1000};
    const animate=()=>{
      frame=requestAnimationFrame(animate); const t=clock.get();
      towerGroup.position.y=Math.sin(t*0.5)*0.22; towerGroup.rotation.y=t*0.1; pyr.rotation.y=t*0.18;
      ringGroup.rotation.y=t*0.07; ringGroup.rotation.x=Math.sin(t*0.04)*0.1;
      helixGroup.rotation.y=t*0.15; helixGroup.position.y=Math.sin(t*0.3)*0.4;
      nodeGroup.rotation.y=-t*0.06; nodes.forEach((n,i)=>{n.material.emissiveIntensity=0.4+Math.sin(t*1.2+i*0.8)*0.4;});
      satellites.forEach(({mesh,speed,phase})=>{mesh.rotation.x+=speed*0.9;mesh.rotation.y+=speed;mesh.position.y+=Math.sin(t*0.4+phase)*0.003;});
      panels.forEach(({mesh,baseY,speed})=>{mesh.position.y=baseY+Math.sin(t*speed*60)*0.15;mesh.rotation.z=Math.sin(t*speed*45)*0.04;});
      shaft.material.opacity=0.025+Math.sin(t*0.8)*0.015;
      ptA.color.setHSL((t*0.03)%1,0.8,0.6); ptB.color.setHSL(((t*0.03)+0.33)%1,0.8,0.6);
      ptMat.opacity=0.55+Math.sin(t*0.4)*0.12;
      camera.position.x+=(mouseX*1.8-camera.position.x)*0.022;
      camera.position.y+=(-mouseY*1.2+2-camera.position.y)*0.022;
      camera.lookAt(0,0.5,0);
      renderer.render(scene,camera);
    };
    animate();
    return ()=>{ cancelAnimationFrame(frame); window.removeEventListener('mousemove',onMouse); window.removeEventListener('resize',onResize); renderer.dispose(); if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement); };
  }, []);
  return <div ref={mountRef} style={{ position:'absolute',inset:0,background:'transparent' }} />;
};

/* ═══════════════════════════════════════════════════════
   MARQUEE
═══════════════════════════════════════════════════════ */
const Marquee = () => {
  const items = ["QS World Top 50","120+ Years of Excellence","42,000+ Global Alumni","180+ Research Grants","98% Employment Rate","12 International Campuses","$2.4B Research Endowment","Nobel Laureates on Faculty","Times Higher Education Award 2024"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow:'hidden',borderTop:'1px solid rgba(96,165,250,0.12)',borderBottom:'1px solid rgba(96,165,250,0.12)',background:'rgba(2,10,26,0.6)',backdropFilter:'blur(8px)',padding:'9px 0',position:'absolute',bottom:44,left:0,right:0,zIndex:25 }}>
      <div style={{ display:'flex',animation:'marqueeScroll 30s linear infinite',width:'max-content' }}>
        {doubled.map((item,i) => (
          <span key={i} style={{ display:'inline-flex',alignItems:'center',gap:14,padding:'0 24px',fontFamily:"'Outfit',sans-serif",fontSize:'0.62rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(147,197,253,0.5)',whiteSpace:'nowrap' }}>
            <span style={{ width:3,height:3,borderRadius:'50%',background:'rgba(96,165,250,0.5)',display:'inline-block',flexShrink:0 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   PROGRAM CARDS
═══════════════════════════════════════════════════════ */
const ProgramCards = () => {
  const programs = [
    { code:"CS", label:"Computer Science & AI", icon:"⬡", color:"#60a5fa" },
    { code:"MB", label:"Business & Economics",  icon:"◈", color:"#a78bfa" },
    { code:"MD", label:"Medicine & Life Sciences", icon:"⬟", color:"#34d399" },
    { code:"AR", label:"Architecture & Design", icon:"◇", color:"#f59e0b" },
  ];
  return (
    <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
      {programs.map(({code,label,icon,color}) => (
        <div key={code}
          style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 13px',borderRadius:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',backdropFilter:'blur(12px)',cursor:'pointer',transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',fontFamily:"'Outfit',sans-serif" }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor=`${color}44`;}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';}}
        >
          <span style={{ fontSize:'0.9rem',color,flexShrink:0 }}>{icon}</span>
          <div>
            <div style={{ fontSize:'0.52rem',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:1 }}>{code}</div>
            <div style={{ fontSize:'0.67rem',color:'rgba(191,219,254,0.8)',whiteSpace:'nowrap' }}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN HERO
═══════════════════════════════════════════════════════ */
const Hero = () => {
  const typeWords = ["Innovators.","Leaders.","Researchers.","Visionaries.","Changemakers."];
  const typed = useTypewriter(typeWords, 75, 2000);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes heroFadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes badgeIn       { from{opacity:0;transform:scale(.9) translateY(10px)} to{opacity:1;transform:none} }
        @keyframes lineExpand    { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes glowPulse     { 0%,100%{opacity:.4} 50%{opacity:.85} }
        @keyframes scanLine      { from{top:-1px} to{top:100%} }
        @keyframes float         { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes dotBlink      { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes shimmer       { from{transform:translateX(-120%) skewX(-15deg)} to{transform:translateX(400%) skewX(-15deg)} }
        @keyframes borderPulse   { 0%,100%{border-color:rgba(59,130,246,0.25)} 50%{border-color:rgba(96,165,250,0.6)} }
        @keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes cursorBlink   { 0%,100%{opacity:1} 50%{opacity:0} }

        .hf1{animation:heroFadeUp .9s cubic-bezier(0.22,1,0.36,1) .30s both}
        .hf2{animation:heroFadeUp .9s cubic-bezier(0.22,1,0.36,1) .45s both}
        .hf3{animation:heroFadeUp .9s cubic-bezier(0.22,1,0.36,1) .60s both}
        .hf4{animation:heroFadeUp .9s cubic-bezier(0.22,1,0.36,1) .75s both}
        .hf5{animation:heroFadeUp .9s cubic-bezier(0.22,1,0.36,1) .90s both}
        .hf6{animation:heroFadeUp .9s cubic-bezier(0.22,1,0.36,1) 1.05s both}
        .badge-in{animation:badgeIn .7s cubic-bezier(0.34,1.56,0.64,1) .15s both}

        .line-acc{display:block;height:2px;border-radius:2px;background:linear-gradient(90deg,#7c6fff,#93c5fd,#00eaff);transform-origin:left;animation:lineExpand 1s cubic-bezier(0.22,1,0.36,1) .5s both}

        .btn-primary{position:relative;overflow:hidden;background:linear-gradient(135deg,#1d4ed8,#2563eb);transition:transform .3s cubic-bezier(0.34,1.56,0.64,1),box-shadow .3s ease}
        .btn-primary:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 20px 50px rgba(37,99,235,.55)}
        .btn-primary::after{content:'';position:absolute;inset-block:0;left:0;width:36%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:translateX(-140%) skewX(-15deg)}
        .btn-primary:hover::after{animation:shimmer .6s ease forwards}

        .btn-outline{transition:transform .3s cubic-bezier(0.34,1.56,0.64,1),background .3s,border-color .3s;animation:borderPulse 3.5s ease-in-out infinite}
        .btn-outline:hover{transform:translateY(-3px) scale(1.04);background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.45)!important;animation:none}

        .glow-text{text-shadow:0 0 50px rgba(96,165,250,.6),0 0 100px rgba(147,197,253,.2)}

        .stat-card-inner{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(20px);border-radius:14px;padding:12px 8px;transition:border-color .3s,transform .3s cubic-bezier(0.34,1.56,0.64,1);text-align:center}
        .stat-card-inner:hover{border-color:rgba(59,130,246,.45);transform:translateY(-4px)}
        .stat-icon{font-size:0.95rem;margin-bottom:5px}
        .stat-number{font-family:'Cormorant Garamond',serif;font-size:clamp(1.1rem,3.5vw,1.9rem);font-weight:900;color:white;line-height:1}
        .stat-suffix{color:#93c5fd}
        .stat-label{font-family:'Outfit',sans-serif;font-size:clamp(0.5rem,1.2vw,0.6rem);letter-spacing:0.14em;text-transform:uppercase;color:rgba(148,163,184,0.65);margin-top:4px}

        .scan-line{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(59,130,246,.5),transparent);animation:scanLine 5s linear infinite;pointer-events:none}
        .orb-bg{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;animation:glowPulse 5s ease-in-out infinite}
        .scroll-ind{animation:float 2.2s ease-in-out infinite}
        .cursor-blink{animation:cursorBlink 1s step-end infinite}
        .hero-dot{animation:dotBlink 1.8s ease-in-out infinite}

        .award-badge{background:linear-gradient(135deg,rgba(251,191,36,.12),rgba(251,191,36,.06));border:1px solid rgba(251,191,36,.28);border-radius:10px;padding:8px 11px;display:flex;align-items:center;gap:8px;backdrop-filter:blur(12px);transition:all 0.3s ease}
        .award-badge:hover{border-color:rgba(251,191,36,.5);transform:translateY(-2px)}

        /* ── TABLET ── */
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .program-cards-wrap { display: none !important; }
        }

        /* ── MOBILE ── */
        @media (max-width: 767px) {
          .hero-scene-wrap {
            opacity: 0.18 !important;
            mask-image: none !important;
            -webkit-mask-image: none !important;
          }
          .hero-content-pad {
            padding: 96px 20px 130px !important;
          }
          .hero-inner-max {
            max-width: 100% !important;
          }
          .hero-h1 {
            font-size: clamp(2rem, 10vw, 3rem) !important;
          }
          .award-badges-row {
            flex-direction: column !important;
            gap: 6px !important;
          }
          .award-badge {
            width: 100% !important;
          }
          .cta-row {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .cta-btn-full {
            width: 100% !important;
            justify-content: center !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2,1fr) !important;
            gap: 8px !important;
          }
          .program-cards-wrap {
            display: none !important;
          }
          .scroll-ind {
            bottom: 56px !important;
          }
          .eyebrow-text {
            font-size: 0.58rem !important;
            letter-spacing: 0.12em !important;
          }
        }

        @media (max-width: 380px) {
          .hero-h1 { font-size: 1.85rem !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <CursorFollower isMobile={isMobile} />

      <section
        id="hero"
        style={{
          fontFamily:"'Outfit',system-ui,sans-serif",
          position:'relative', width:'100%', minHeight:'100vh',
          display:'flex', alignItems:'center', overflow:'hidden',
          background:'linear-gradient(160deg,#020b18 0%,#041220 35%,#061a30 65%,#03101e 100%)',
          cursor: isMobile ? 'auto' : 'none',
        }}
      >
        {/* Glow orbs */}
        <div className="orb-bg" style={{ width:'min(700px,150vw)',height:'min(700px,150vw)',top:'-15%',right:'-10%',background:'radial-gradient(circle,rgba(37,99,235,.12),transparent 70%)' }} />
        <div className="orb-bg" style={{ width:'min(500px,100vw)',height:'min(500px,100vw)',bottom:'-5%',left:'-6%',background:'radial-gradient(circle,rgba(59,130,246,.09),transparent 70%)',animationDelay:'2s' }} />

        {/* Grid */}
        <div style={{ position:'absolute',inset:0,zIndex:0,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(96,165,250,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,.02) 1px,transparent 1px)',backgroundSize:'60px 60px' }} />

        {/* 3D Scene */}
        <div
          className="hero-scene-wrap"
          style={{ position:'absolute',inset:0,zIndex:0,maskImage:'linear-gradient(to right,transparent 0%,rgba(0,0,0,.08) 25%,black 50%,black 100%)',WebkitMaskImage:'linear-gradient(to right,transparent 0%,rgba(0,0,0,.08) 25%,black 50%,black 100%)' }}
        >
          <ThreeScene />
          <div className="scan-line" />
        </div>

        {/* Vignette */}
        <div style={{ position:'absolute',inset:0,zIndex:10,pointerEvents:'none',background:'radial-gradient(ellipse 100% 100% at 50% 50%,transparent 48%,rgba(3,4,15,.6) 100%)' }} />
        <div style={{ position:'absolute',top:0,left:0,right:0,height:'8rem',zIndex:10,pointerEvents:'none',background:'linear-gradient(to bottom,rgba(3,4,15,.95),transparent)' }} />
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'8rem',zIndex:10,pointerEvents:'none',background:'linear-gradient(to top,rgba(3,4,15,.98),transparent)' }} />

        {/* ── CONTENT ── */}
        <div
          className="hero-content-pad"
          style={{ width:'100%',maxWidth:1400,margin:'0 auto',padding:'clamp(110px,12vw,190px) clamp(24px,8vw,100px) 80px',position:'relative',zIndex:20 }}
        >
          <div className="hero-inner-max" style={{ maxWidth:660 }}>

            {/* Badge */}
            <div className="badge-in" style={{ marginBottom:22 }}>
              <div style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'7px 15px',borderRadius:100,background:'linear-gradient(135deg,rgba(59,130,246,.18),rgba(96,165,250,.1))',border:'1px solid rgba(96,165,250,.3)',color:'#93c5fd',backdropFilter:'blur(14px)' }}>
                <span style={{ position:'relative',display:'inline-flex',width:7,height:7,flexShrink:0 }}>
                  <span className="hero-dot" style={{ position:'absolute',display:'inline-flex',width:'100%',height:'100%',borderRadius:'50%',background:'#60a5fa',opacity:.75 }} />
                  <span style={{ position:'relative',display:'inline-flex',width:7,height:7,borderRadius:'50%',background:'#3b82f6' }} />
                </span>
                <span style={{ fontFamily:"'Outfit',sans-serif",fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.16em',textTransform:'uppercase' }}>
                  Admissions Open &nbsp;·&nbsp; Class of 2026
                </span>
              </div>
            </div>

            {/* Eyebrow */}
            <div className="hf1" style={{ marginBottom:14 }}>
              <p className="eyebrow-text" style={{ fontFamily:"'Outfit',sans-serif",fontSize:'0.68rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(147,197,253,.5)',margin:0 }}>
                Est. 1892 &nbsp;·&nbsp; 12 Global Campuses &nbsp;·&nbsp; QS World Top 50
              </p>
            </div>

            {/* Headline */}
            <div className="hf2" style={{ marginBottom:10 }}>
              <h1
                className="hero-h1"
                style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",lineHeight:1.05,letterSpacing:'-0.01em',fontSize:'clamp(2.4rem,7vw,5rem)',color:'#eff6ff',margin:0 }}
              >
                Shaping the World's
                <br />
                Next{' '}
                <em className="glow-text" style={{ fontStyle:'normal',background:'linear-gradient(135deg,#ffffff 0%,#93c5fd 30%,#60a5fa 60%,#e0f2fe 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>
                  {typed || '\u00A0'}
                </em>
                <span className="cursor-blink" style={{ display:'inline-block',width:3,height:'0.82em',background:'#60a5fa',marginLeft:3,borderRadius:2,verticalAlign:'middle',WebkitTextFillColor:'#60a5fa' }} />
              </h1>
            </div>

            {/* Accent line */}
            <div className="hf2" style={{ marginBottom:22 }}>
              <span className="line-acc" style={{ width:72 }} />
            </div>

            {/* Body */}
            <div className="hf3" style={{ marginBottom:18 }}>
              <p style={{ fontFamily:"'Outfit',sans-serif",fontSize:'clamp(0.85rem,1.8vw,1.05rem)',lineHeight:1.85,color:'rgba(219,234,254,.65)',maxWidth:510,fontWeight:300,margin:0 }}>
                Join a community of <strong style={{color:'#bfdbfe',fontWeight:600}}>world-class scholars</strong>, visionary researchers, and bold innovators. An education designed not just to inform — but to{' '}
                <strong style={{color:'#bfdbfe',fontWeight:600}}>transform.</strong>
              </p>
            </div>

            {/* Award badges */}
            <div className="hf4 award-badges-row" style={{ display:'flex',gap:8,flexWrap:'wrap',marginBottom:24 }}>
              {[
                { icon:'🏆', title:'Times HE Award',     sub:'2024 University of the Year' },
                { icon:'⭐', title:'QS Stars Rating',     sub:'Five Stars Overall' },
                { icon:'🔬', title:'Research Excellence', sub:'REF Gold Framework' },
              ].map(({icon,title,sub}) => (
                <div key={title} className="award-badge">
                  <span style={{ fontSize:'0.95rem',flexShrink:0 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily:"'Outfit',sans-serif",fontSize:'0.57rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(251,191,36,.85)' }}>{title}</div>
                    <div style={{ fontFamily:"'Outfit',sans-serif",fontSize:'0.54rem',color:'rgba(255,255,255,0.38)',marginTop:1 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="hf5 cta-row" style={{ display:'flex',flexWrap:'wrap',gap:10,marginBottom:28 }}>
              <button
                className="btn-primary cta-btn-full"
                style={{ display:'inline-flex',alignItems:'center',gap:10,padding:'13px 26px',borderRadius:100,fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:'0.85rem',letterSpacing:'0.06em',color:'white',border:'none',cursor:'pointer' }}
              >
                Explore Programs
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ animation:'float 1.8s ease-in-out infinite',flexShrink:0 }}>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <button
                className="btn-outline cta-btn-full"
                style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'13px 26px',borderRadius:100,fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:'0.85rem',letterSpacing:'0.06em',color:'white',background:'transparent',border:'1.5px solid rgba(255,255,255,.2)',cursor:'pointer' }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink:0 }}>
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="rgba(147,197,253,.7)" strokeWidth="1.4"/>
                  <polygon points="6,5 11,7.5 6,10" fill="rgba(147,197,253,.85)"/>
                </svg>
                Virtual Campus Tour
              </button>

              <button
                className="cta-btn-full"
                style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',gap:7,padding:'13px 16px',borderRadius:100,fontFamily:"'Outfit',sans-serif",fontWeight:500,fontSize:'0.8rem',letterSpacing:'0.05em',color:'rgba(147,197,253,0.6)',background:'transparent',border:'none',cursor:'pointer',transition:'color .2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#93c5fd'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(147,197,253,0.6)'}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0 }}>
                  <path d="M7 1v6M7 7l3-3M7 7L4 4M2 10h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download Prospectus
              </button>
            </div>

            {/* Program cards — hidden on tablet/mobile */}
            <div className="hf5 program-cards-wrap" style={{ marginBottom:28 }}>
              <p style={{ fontFamily:"'Outfit',sans-serif",fontSize:'0.58rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(147,197,253,0.38)',margin:'0 0 9px' }}>Explore Faculties</p>
              <ProgramCards />
            </div>

            {/* Stats */}
            <div className="hf6">
              <div className="stats-grid" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8 }}>
                {[
                  { end:120,   suffix:'+', label:'Years Legacy',    icon:'🏛️' },
                  { end:42000, suffix:'+', label:'Alumni Global',   icon:'🌍' },
                  { end:98,    suffix:'%', label:'Employment Rate', icon:'📈' },
                  { end:180,   suffix:'+', label:'Research Grants', icon:'🔬' },
                ].map(s => <Counter key={s.label} {...s} />)}
              </div>
            </div>

          </div>
        </div>

        {/* Marquee */}
        <Marquee />

        {/* Scroll indicator */}
        <div className="scroll-ind" style={{ position:'absolute',bottom:52,left:'50%',transform:'translateX(-50%)',zIndex:20,display:'flex',flexDirection:'column',alignItems:'center',gap:6,pointerEvents:'none' }}>
          <span style={{ fontFamily:"'Outfit',sans-serif",fontSize:'0.52rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(147,197,253,.3)' }}>Scroll</span>
          <div style={{ width:1,height:32,background:'linear-gradient(to bottom,rgba(59,130,246,.5),transparent)' }} />
        </div>

        {/* Noise */}
        <div style={{ position:'absolute',inset:0,zIndex:30,pointerEvents:'none',opacity:0.022,backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      </section>
    </>
  );
};

export default Hero;