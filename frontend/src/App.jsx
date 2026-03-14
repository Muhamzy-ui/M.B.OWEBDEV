import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";
import React from "react";

// ─── EMAILJS CONFIG ── Fill these in after signing up at emailjs.com ─────────
const EMAILJS_CONFIG = {
  publicKey:  "your_actual_key",        // EmailJS → Account → API Keys
  bookingServiceId:  "service_bqb0xyg", // Your "Booking" Email Service
  contactServiceId:  "service_49my69t", // Your "Contact" Email Service
  bookingTemplate:  "template_xxxxx",  // EmailJS → Email Templates (for bookings)
  contactTemplate:  "template_xxxxx",  // EmailJS → Email Templates (for contact)
};
// ─── ADMIN PASSWORD ─── Change this to your own secret password ──────────────
const ADMIN_PASSWORD = "Mahmud12$$";

// ─── THEMES ──────────────────────────────────────────────────────────────────
const DARK = {
  bg:"#060e06",bg2:"#091409",surface:"#0b180b",card:"#0d1c0d",
  border:"rgba(34,197,94,0.14)",borderHov:"rgba(34,197,94,0.55)",
  text:"#f0fdf4",textSub:"#9ca3af",textMuted:"#4b5563",
  accent:"#22c55e",accentDim:"rgba(34,197,94,0.09)",accentGlow:"rgba(34,197,94,0.28)",
  tagBg:"rgba(34,197,94,0.08)",tagColor:"#86efac",
  inputBg:"rgba(0,0,0,0.45)",codeBg:"#030c03",
  navBg:"rgba(6,14,6,0.97)",shadow:"rgba(0,0,0,0.75)",
  grid:"rgba(34,197,94,0.028)",orb:"rgba(22,163,74,0.11)",
};
const LIGHT = {
  bg:"#f0fdf4",bg2:"#dcfce7",surface:"#fff",card:"#fff",
  border:"rgba(22,163,74,0.18)",borderHov:"rgba(22,163,74,0.55)",
  text:"#052e16",textSub:"#374151",textMuted:"#6b7280",
  accent:"#16a34a",accentDim:"rgba(22,163,74,0.07)",accentGlow:"rgba(22,163,74,0.22)",
  tagBg:"rgba(22,163,74,0.07)",tagColor:"#15803d",
  inputBg:"rgba(255,255,255,0.95)",codeBg:"#f8fff9",
  navBg:"rgba(240,253,244,0.97)",shadow:"rgba(0,0,0,0.07)",
  grid:"rgba(22,163,74,0.04)",orb:"rgba(22,163,74,0.06)",
};

const makeCSS = (t) => `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:${t.bg};color:${t.text};overflow-x:hidden;transition:background .3s,color .3s;font-family:'Rajdhani',sans-serif}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:${t.bg}}
::-webkit-scrollbar-thumb{background:linear-gradient(${t.accent},#4ade80);border-radius:3px}
@keyframes fadeUp    {from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes slideR    {from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
@keyframes floatY    {0%,100%{transform:translateY(0)}50%{transform:translateY(-11px)}}
@keyframes orbit     {from{transform:rotate(0deg) translateX(56px) rotate(0deg)}to{transform:rotate(360deg) translateX(56px) rotate(-360deg)}}
@keyframes blink     {0%,100%{opacity:1}50%{opacity:0}}
@keyframes scanLine  {0%{top:-2px}100%{top:100%}}
@keyframes gradShift {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes neonPulse {0%,100%{text-shadow:0 0 8px ${t.accent}55}50%{text-shadow:0 0 22px ${t.accent},0 0 44px ${t.accent}44}}
@keyframes pulseDot  {0%,100%{box-shadow:0 0 0 0 ${t.accentGlow}}50%{box-shadow:0 0 0 8px transparent}}
@keyframes ripple    {to{transform:scale(22);opacity:0}}
@keyframes sbIn      {from{opacity:0;transform:translateX(-22px)}to{opacity:1;transform:none}}
@keyframes pageIn    {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes starPop   {0%{transform:scale(0) rotate(-30deg)}60%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0deg)}}
@keyframes shimmer   {0%{background-position:-200% 0}100%{background-position:200% 0}}
.page-enter{animation:pageIn .42s cubic-bezier(.4,0,.2,1) both}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 22px;border-radius:10px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:15px;cursor:pointer;border:none;transition:all .2s ease;position:relative;overflow:hidden;text-decoration:none;white-space:nowrap;letter-spacing:.3px;-webkit-tap-highlight-color:transparent}
.btn:active{transform:scale(.95)!important}
.btn-primary{background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;box-shadow:0 4px 18px ${t.accentGlow}}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 26px ${t.accentGlow};filter:brightness(1.07)}
.btn-outline{background:transparent;color:${t.accent};border:1.5px solid ${t.border}}
.btn-outline:hover{background:${t.accentDim};border-color:${t.accent};transform:translateY(-2px)}
.btn-ghost{background:${t.accentDim};color:${t.textSub};border:1px solid ${t.border}}
.btn-ghost:hover{color:${t.accent};border-color:${t.borderHov};transform:translateY(-2px)}
.btn-sm{padding:7px 15px;font-size:13px;border-radius:8px}
.btn-lg{padding:13px 30px;font-size:16px}
.btn-block{width:100%}
.btn-danger{background:rgba(239,68,68,0.12);color:#ef4444;border:1px solid rgba(239,68,68,0.3)}
.btn-danger:hover{background:rgba(239,68,68,0.22);border-color:#ef4444}
.footlink{color:${t.textMuted};font-size:13px;font-weight:600;background:none;border:none;cursor:pointer;text-align:left;padding:3px 0;position:relative;display:inline-block;font-family:'Rajdhani',sans-serif;transition:color .2s;text-decoration:none}
.footlink::after{content:'';position:absolute;left:0;bottom:-1px;width:0;height:1.5px;background:${t.accent};transition:width .25s ease}
.footlink:hover{color:${t.accent}}.footlink:hover::after{width:100%}
.star-anim{animation:starPop .35s cubic-bezier(.34,1.56,.64,1) both}
@media(min-width:769px){.mob-btn{display:none!important}.desk-nav{display:flex!important}}
@media(max-width:768px){
  .desk-nav{display:none!important}.mob-btn{display:flex!important}
  .hero-grid{grid-template-columns:1fr!important}.hero-right{display:none!important}
  .about-grid{grid-template-columns:1fr!important}.skills-grid{grid-template-columns:1fr!important}
  .proj-grid{grid-template-columns:1fr!important}.blog-grid{grid-template-columns:1fr!important}
  .foot-grid{grid-template-columns:1fr 1fr!important}.c2{grid-template-columns:1fr!important}
  .times-grid{grid-template-columns:repeat(4,1fr)!important}.ratings-grid{grid-template-columns:1fr!important}
}
@media(max-width:520px){
  .foot-grid{grid-template-columns:1fr!important}.hero-btns .btn{width:100%}
  .times-grid{grid-template-columns:repeat(2,1fr)!important}.ratings-grid{grid-template-columns:1fr!important}
}
`;

// ─── INITIAL PROJECT DATA ─────────────────────────────────────────────────────
const INIT_PROJECTS = [
  {id:1,icon:"🛒",title:"FullStack E-Commerce Platform",
   desc:"End-to-end e-commerce with Django REST backend, React frontend, real-time inventory, Stripe payments & admin dashboard.",
   tags:["Django","React","PostgreSQL","Stripe","Redis"],stats:{Commits:"240+",Users:"500+",Uptime:"99.9%"},
   github:"https://github.com/Muhamzy-ui",live:"#"},
  {id:2,icon:"⛏️",title:"Mining Operations Platform",
   desc:"Custom client platform for real-time mining ops, equipment tracking, shift management & automated compliance reports.",
   tags:["Python","Flask","PostgreSQL","WebSockets","Chart.js"],stats:{Sensors:"80+",Reports:"1000+",Efficiency:"+35%"},
   github:"https://github.com/Muhamzy-ui",live:"#"},
  {id:3,icon:"🌐",title:"M.B.O WebDev Portfolio",
   desc:"This site — animated dark fintech portfolio with meeting booking, blog, admin panel & full animations.",
   tags:["React","Django","PostgreSQL","Vite"],stats:{Animations:"30+",Score:"98/100",Load:"<1s"},
   github:"https://github.com/Muhamzy-ui",live:"#"},
];

// ─── INITIAL RATINGS DATA ─────────────────────────────────────────────────────
const INIT_RATINGS = [
  {id:1,name:"James O.",role:"E-commerce Client",country:"🇬🇧 UK",stars:5,
   text:"Mahmud delivered the entire e-commerce platform 3 days ahead of schedule. The Django backend is rock solid — zero downtime since launch. Genuinely one of the best developers I've worked with.",
   project:"FullStack E-Commerce Platform",date:"Feb 2026"},
  {id:2,name:"Sarah M.",role:"Startup Founder",country:"🇨🇦 Canada",stars:5,
   text:"We needed a full-stack developer who could handle both the Django API and the React frontend. Mahmud handled both brilliantly. Communication was clear, code was clean, delivery was on time. 10/10.",
   project:"Custom Dashboard App",date:"Jan 2026"},
  {id:3,name:"Chukwuemeka A.",role:"Mining Operations Manager",country:"🇳🇬 Nigeria",stars:5,
   text:"The mining operations platform Mahmud built for us saved our team 20+ hours per month on compliance reports alone. He understood our non-technical team's needs and built something intuitive. Outstanding work.",
   project:"Mining Operations Platform",date:"Dec 2025"},
  {id:4,name:"Lena K.",role:"Product Manager",country:"🇩🇪 Germany",stars:5,
   text:"Hired Mahmud for a PostgreSQL performance fix. He identified the bottleneck in under an hour and brought our API from 3s response times down to 50ms. Exceptional technical depth.",
   project:"Database Optimisation",date:"Nov 2025"},
  {id:5,name:"David T.",role:"Freelance Client",country:"🇦🇺 Australia",stars:5,
   text:"Clear communication, clean code, responsive across all timezones. Mahmud built our REST API with JWT auth and full test coverage. Will definitely hire again.",
   project:"REST API Development",date:"Oct 2025"},
  {id:6,name:"Fatima B.",role:"EdTech Founder",country:"🇳🇱 Netherlands",stars:4,
   text:"Fantastic developer. Built our Django backend with full documentation. Minor revision needed on the frontend but resolved same day. Very professional attitude throughout.",
   project:"EdTech Platform Backend",date:"Sep 2025"},
];

const BLOGS = [
  {id:1,slug:"django-rest-apis",tag:"Django",date:"Mar 2026",icon:"🎸",rt:"8 min",
   title:"Building REST APIs with Django REST Framework",
   desc:"A deep dive into DRF viewsets, serializers, JWT auth and pagination — patterns I use on every project.",
   body:`Django REST Framework is the gold standard for Python APIs. Here are the patterns that actually matter after 2+ years in production.nn## ViewSets vs APIViewsnnFor simple CRUD, ViewSets save massive amounts of code. For complex business logic, APIView gives full control. I default to APIView for anything beyond basic CRUD — the explicitness pays off.nn## Serializers Are Your ContractnnYour serializer IS your API contract. Validate everything at the serializer level. Use nested serializers sparingly — they cause N+1 queries that kill performance at scale.nn## JWT AuthenticationnnUse djangorestframework-simplejwt. Set access token expiry to 15 minutes, refresh to 7 days. Always blacklist tokens on logout.nn## PaginationnnAlways paginate list endpoints. Use PageNumberPagination with page_size=20. Your API users will thank you when the dataset hits 100k records.`},
  {id:2,slug:"react-native-journey",tag:"React Native",date:"Feb 2026",icon:"📱",rt:"6 min",
   title:"From Web Dev to Mobile: My React Native Journey",
   desc:"How a Django/React developer learned to ship production mobile apps on iOS and Android.",
   body:`Making the jump from web to mobile was the best skill investment I made.nn## The Mental ShiftnnThe biggest change isn't the code — it's constraints. No hover states. No right-click. Touch targets must be at least 44px. Think offline-first from day one.nn## Expo vs Bare React NativennStart with Expo. You can always eject later. Expo Go makes prototyping 10x faster.nn## State ManagementnnZustand is my pick for React Native. Lightweight, simple, works perfectly with async storage.nn## NavigationnnReact Navigation is the standard. Stack navigator for flows, tab navigator for main sections.`},
  {id:3,slug:"postgresql-indexing",tag:"PostgreSQL",date:"Jan 2026",icon:"🐘",rt:"10 min",
   title:"PostgreSQL Indexing Strategies That Actually Matter",
   desc:"The mistakes I made and the patterns that took my query times from 3s to under 50ms on real data.",
   body:`Database performance is where good apps become great ones.nn## The Query That Started It AllnnA mining dashboard query was taking 3.2 seconds on 50,000 rows. Adding a single B-tree index dropped it to 12ms — a 99.6% improvement.nn## When to IndexnnIndex columns in WHERE clauses, JOIN conditions, and ORDER BY. Don't index low-cardinality columns.nn## Composite IndexesnnColumn order is critical. Put the highest-cardinality column first.nn## EXPLAIN ANALYZEnnRun EXPLAIN ANALYZE before and after every optimization. Look for Sequential Scans on large tables.`},
  {id:4,slug:"flutter-vs-rn",tag:"Flutter",date:"Dec 2025",icon:"💙",rt:"7 min",
   title:"Flutter vs React Native: An Honest Full-Stack Take",
   desc:"After shipping apps in both, here's my unfiltered comparison.",
   body:`I've shipped production apps in both Flutter and React Native.nn## PerformancennFlutter wins. Dart compiles to native ARM code and renders with its own engine — consistent 60fps.nn## Developer ExperiencennIf you're a JS developer, React Native feels natural immediately. Flutter requires learning Dart, but Dart is genuinely pleasant.nn## My RecommendationnnChoose React Native if your team is JS-heavy. Choose Flutter for pixel-perfect UI across all platforms.`},
  {id:5,slug:"async-django",tag:"Django",date:"Nov 2025",icon:"🚀",rt:"9 min",
   title:"Async Django: Non-Blocking Views That Scale",
   desc:"How I rewrote a slow synchronous Django API and cut response times 70% on I/O-heavy endpoints.",
   body:`Django has had async support since 3.1 but most tutorials don't show effective usage.nn## Why Async MattersnnMost API endpoints are I/O-bound — waiting on databases or external APIs. Async views release the thread so Django handles other requests meanwhile.nn## Concurrent Requests with asyncio.gathernnThree sequential calls taking 300ms become three concurrent calls finishing in ~100ms — a 3x speedup.nn## When NOT to Use AsyncnnCPU-bound tasks don't benefit from async. Use Celery + Redis for those.`},
  {id:6,slug:"deploy-railway",tag:"DevOps",date:"Oct 2025",icon:"🚂",rt:"5 min",
   title:"Deploying Django + PostgreSQL to Railway in 15 Minutes",
   desc:"The fastest way to get a production Django app live.",
   body:`Railway is genuinely the fastest Django deployment I've found.nn## Why RailwaynnNo server management. Git-push-to-deploy. Built-in PostgreSQL. Automatic SSL. $5/month for hobby projects.nn## Stepsnn1. Add gunicorn to requirements.txtn2. Create Procfile: web: gunicorn yourapp.wsgin3. Add .railway.app to ALLOWED_HOSTSn4. Push to GitHub, connect in Railway dashboardn5. Click + New → Database → PostgreSQLnnDone in under 15 minutes every time.`},
];

const SKILLS = [
  {n:"Python",p:90,i:"🐍",c:"#22c55e"},{n:"Django",p:88,i:"🎸",c:"#16a34a"},
  {n:"Bootstrap",p:85,i:"🅱️",c:"#4ade80"},{n:"React",p:80,i:"⚛️",c:"#86efac"},
  {n:"HTML/CSS",p:88,i:"🌐",c:"#34d399"},{n:"PostgreSQL",p:85,i:"🐘",c:"#22c55e"},
  {n:"JavaScript",p:80,i:"⚡",c:"#a3e635"},{n:"REST APIs",p:92,i:"🔗",c:"#4ade80"},
  {n:"React Native",p:78,i:"📱",c:"#86efac"},
];

const NAV = [
  {id:"home",label:"Home",icon:"⌂",sub:"Start here"},
  {id:"about",label:"About",icon:"◉",sub:"Who I am"},
  {id:"skills",label:"Skills",icon:"⚡",sub:"Tech stack"},
  {id:"projects",label:"Projects",icon:"◈",sub:"My work"},
  {id:"ratings",label:"Ratings",icon:"★",sub:"Client reviews"},
  {id:"blog",label:"Blog",icon:"✦",sub:"Articles"},
  {id:"book-meeting",label:"Book Meeting",icon:"◷",sub:"Schedule a call"},
  {id:"contact",label:"Contact",icon:"◎",sub:"Get in touch"},
];

const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const TIMES=["09:00 AM","10:00 AM","11:00 AM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"];

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
const Logo=({size=40})=>(
  <svg width={size} height={size} viewBox="0 0 40 40">
    <rect width="40" height="40" rx="10" fill="#16a34a"/>
    <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle"
      fill="#fff" fontSize="14" fontWeight="900" fontFamily="monospace">MBO</text>
  </svg>
);

const FadeUp=({children,delay=0,style:s={}})=>{
  const ref=useRef();const[vis,setV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:.12});
    if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);
  return <div ref={ref} style={{opacity:vis?1:0,transform:vis?"none":"translateY(22px)",
    transition:`opacity .6s ${delay}s ease,transform .6s ${delay}s ease`,...s}}>{children}</div>;
};

const Typewriter=({texts,speed=75})=>{
  const[idx,setI]=useState(0);const[ch,setCh]=useState(0);const[del,setDel]=useState(false);
  useEffect(()=>{
    const t=setTimeout(()=>{
      if(!del){if(ch<texts[idx].length)setCh(c=>c+1);else setTimeout(()=>setDel(true),1400);}
      else{if(ch>0)setCh(c=>c-1);else{setDel(false);setI(i=>(i+1)%texts.length);}}
    },del?38:speed);
    return()=>clearTimeout(t);
  },[ch,del,idx,texts,speed]);
  return <span>{texts[idx].slice(0,ch)}<span style={{animation:"blink 1s step-end infinite",color:"#22c55e"}}>|</span></span>;
};

const CountUp=({end,sfx=""})=>{
  const[v,setV]=useState(0);const ref=useRef();
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{
    if(e.isIntersecting){let s=0;const i=setInterval(()=>{s+=Math.ceil(end/40);if(s>=end){setV(end);clearInterval(i);}else setV(s);},35);o.disconnect();}
  },{threshold:.5});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[end]);
  return <span ref={ref}>{v}{sfx}</span>;
};

const Stars=({count=5,size=18,animated=false})=>(
  <span style={{display:"inline-flex",gap:2}}>
    {Array(5).fill(0).map((_,i)=>(
      <span key={i} style={{
        fontSize:size,color:i<count?"#f59e0b":"rgba(245,158,11,0.2)",
        animation:animated?`starPop .35s cubic-bezier(.34,1.56,.64,1) ${i*0.07}s both`:"none",
        display:"inline-block",
      }}>★</span>
    ))}
  </span>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar=({open,onClose,active,go,t,dark,setDark})=>{
  const[hov,setHov]=useState(null);
  useEffect(()=>{const h=(e)=>{if(open&&e.key==="Escape")onClose();};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[open,onClose]);
  return(
    <>
      {open&&<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(4px)",zIndex:998,transition:"opacity .3s"}}/>}
      <nav style={{position:"fixed",top:0,left:0,height:"100vh",width:290,zIndex:999,
        background:"linear-gradient(180deg,#020b02 0%,#040f04 100%)",
        borderRight:`1px solid rgba(34,197,94,0.18)`,
        transform:open?"translateX(0)":"translateX(-100%)",
        transition:"transform .42s cubic-bezier(.32,.72,0,1)",
        display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${t.accent},transparent)`,animation:"scanLine 3.5s linear infinite",opacity:.7}}/>
        <div style={{position:"absolute",top:-60,left:-60,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{padding:"28px 22px 18px",borderBottom:"1px solid rgba(34,197,94,0.1)"}}>
          <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:4}}><Logo size={36}/>
            <div><div style={{fontFamily:"'Orbitron',monospace",fontSize:15,fontWeight:900,color:"#f0fdf4"}}>M.B.O</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:9,color:t.accent,fontWeight:700,letterSpacing:3}}>WEBDEV</div></div>
            <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(34,197,94,.5)",fontSize:20,cursor:"pointer",lineHeight:1,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="#22c55e"} onMouseLeave={e=>e.target.style.color="rgba(34,197,94,.5)"}>✕</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"12px 0"}}>
          {NAV.map((item,idx)=>{
            const isActive=active===item.id;
            return(
              <button key={item.id} onClick={()=>{go(item.id);onClose();}}
                onMouseEnter={()=>setHov(item.id)} onMouseLeave={()=>setHov(null)}
                style={{display:"flex",alignItems:"center",gap:13,width:"100%",padding:"12px 22px",
                  background:isActive?"rgba(34,197,94,0.1)":hov===item.id?"rgba(34,197,94,0.05)":"transparent",
                  border:"none",borderLeft:`3px solid ${isActive?t.accent:"transparent"}`,
                  cursor:"pointer",animation:`sbIn .3s ease ${idx*.05}s both`,
                  transition:"all .18s",position:"relative"}}>
                <span style={{fontSize:16,opacity:.8,color:isActive?t.accent:"#9ca3af",transition:"color .2s"}}>{item.icon}</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:isActive?t.accent:"#d1fae5",transition:"color .2s"}}>{item.label}</div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"rgba(156,163,175,.6)",marginTop:1}}>{item.sub}</div>
                </div>
                {isActive&&<div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:t.accent,animation:"pulseDot 2s ease infinite"}}/>}
              </button>
            );
          })}
        </div>
        <div style={{padding:"14px 22px",borderTop:"1px solid rgba(34,197,94,0.1)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"rgba(156,163,175,.7)",fontWeight:700,letterSpacing:1}}>THEME</span>
            <button onClick={()=>setDark(d=>!d)} style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:20,padding:"4px 12px",cursor:"pointer",color:t.accent,fontFamily:"'Rajdhani',sans-serif",fontSize:11,fontWeight:700}}>{dark?"☀️ Light":"🌙 Dark"}</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",animation:"pulseDot 2s ease infinite"}}/>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"rgba(34,197,94,.8)",fontWeight:600}}>Available for Projects</span>
          </div>
        </div>
      </nav>
    </>
  );
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar=({active,go,t,dark,setDark,sb,setSb})=>{
  const[scroll,setScroll]=useState(false);
  useEffect(()=>{const h=()=>setScroll(window.scrollY>40);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  return(
    <header style={{position:"fixed",top:0,left:0,right:0,zIndex:997,
      background:scroll?t.navBg:"transparent",
      borderBottom:scroll?`1px solid ${t.border}`:"none",
      backdropFilter:scroll?"blur(14px)":"none",
      transition:"all .3s",padding:"0 clamp(16px,4vw,52px)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>go("home")} style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer"}}>
          <Logo size={32}/>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:900,color:t.text}}>M.B.O<span style={{color:t.accent}}>.dev</span></div>
        </button>
        <nav className="desk-nav" style={{display:"flex",gap:4,alignItems:"center"}}>
          {NAV.filter(n=>!["book-meeting"].includes(n.id)).map(item=>(
            <button key={item.id} onClick={()=>go(item.id)}
              style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,
                background:"none",border:"none",cursor:"pointer",padding:"6px 10px",borderRadius:7,
                color:active===item.id?t.accent:t.textSub,
                borderBottom:active===item.id?`2px solid ${t.accent}`:"2px solid transparent",
                transition:"all .2s"}}
              onMouseEnter={e=>e.currentTarget.style.color=t.accent}
              onMouseLeave={e=>e.currentTarget.style.color=active===item.id?t.accent:t.textSub}>{item.label}</button>
          ))}
          <button className="btn btn-primary btn-sm" style={{marginLeft:6}} onClick={()=>go("book-meeting")}>📅 Book</button>
          <button onClick={()=>setDark(d=>!d)} style={{background:t.accentDim,border:`1px solid ${t.border}`,borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:14,marginLeft:4}}>{dark?"☀️":"🌙"}</button>
        </nav>
        <button className="mob-btn btn btn-ghost btn-sm" onClick={()=>setSb(true)}>☰ Menu</button>
      </div>
    </header>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero=({go,t})=>(
  <section style={{minHeight:"100vh",display:"flex",alignItems:"center",
    padding:"100px clamp(16px,5vw,68px) 60px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${t.grid} 1px,transparent 1px),linear-gradient(90deg,${t.grid} 1px,transparent 1px)`,backgroundSize:"50px 50px",pointerEvents:"none"}}/>
    <div style={{position:"absolute",top:"10%",right:"3%",width:"min(520px,55vw)",height:"min(520px,55vw)",borderRadius:"50%",background:`radial-gradient(circle,${t.orb} 0%,transparent 70%)`,pointerEvents:"none"}}/>
    <div style={{position:"absolute",left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,rgba(34,197,94,.28),transparent)`,animation:"scanLine 7s linear infinite",pointerEvents:"none"}}/>
    <div className="hero-grid" style={{maxWidth:1280,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(24px,5vw,72px)",alignItems:"center"}}>
      <div style={{animation:"fadeUp .7s ease both"}}>
        <div style={{marginBottom:18}}>
          <span style={{background:t.accentDim,border:`1px solid ${t.border}`,color:t.accent,
            padding:"5px 14px",borderRadius:20,fontFamily:"'Rajdhani',sans-serif",
            fontSize:13,fontWeight:700,letterSpacing:1,animation:"pulseDot 2.5s ease infinite"}}>
            🟢 &nbsp;Available for Projects
          </span>
        </div>
        <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(26px,4vw,52px)",fontWeight:900,lineHeight:1.1,marginBottom:10,color:t.text}}>
          MAHMUD<br/>
          <span style={{background:"linear-gradient(135deg,#22c55e,#4ade80,#86efac)",backgroundSize:"200% 200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 4s ease infinite,neonPulse 3s ease infinite"}}>BASHIR</span>
          <br/><span style={{fontSize:"clamp(15px,2vw,28px)",color:t.textMuted,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>OLASUNKANMI</span>
        </h1>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"clamp(14px,1.6vw,19px)",color:t.textSub,marginBottom:22,fontWeight:600}}>
          <Typewriter texts={["Full Stack Developer","Django Backend Expert","React Engineer","Bootstrap Specialist","API Architect","HTML/CSS Developer"]}/>
        </div>
        <p style={{color:t.textSub,lineHeight:1.9,fontSize:"clamp(13px,1.1vw,15px)",maxWidth:500,marginBottom:28,fontFamily:"'Rajdhani',sans-serif"}}>
          Turning ideas into fast, elegant web solutions. I build production-grade apps with Python, Django, React & Bootstrap — from API design to pixel-perfect UI.
        </p>
        <div className="hero-btns" style={{display:"flex",gap:11,flexWrap:"wrap",marginBottom:16}}>
          <button className="btn btn-primary btn-lg" onClick={()=>go("projects")}>View My Work ↗</button>
          <button className="btn btn-outline btn-lg" onClick={()=>go("book-meeting")}>📅 Book Meeting</button>
          <a className="btn btn-ghost btn-lg"
            href="/Mahmud_Bashir_Resume.pdf"
            download="Mahmud_Bashir_Olasunkanmi_Resume.pdf"
            style={{textDecoration:"none"}}>
            📄 Download CV
          </a>
        </div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          {[["GitHub","https://github.com/Muhamzy-ui"],["LinkedIn","https://linkedin.com/in/mahmud-olasunkanmi"],["Upwork","#"],["WhatsApp","#"]].map(([s,href])=>(
            <a key={s} href={href} target="_blank" rel="noreferrer"
              style={{color:t.textMuted,fontSize:11,fontFamily:"'Rajdhani',sans-serif",textDecoration:"none",fontWeight:700,borderBottom:`1px solid ${t.border}`,paddingBottom:2,transition:"color .2s,border-color .2s",letterSpacing:.4}}
              onMouseEnter={e=>{e.target.style.color=t.accent;e.target.style.borderColor=t.accent}}
              onMouseLeave={e=>{e.target.style.color=t.textMuted;e.target.style.borderColor=t.border}}>{s}</a>
          ))}
        </div>
      </div>
      <div className="hero-right" style={{display:"flex",justifyContent:"center",animation:"slideR .85s ease both"}}>
        <div style={{position:"relative",width:"clamp(230px,28vw,310px)"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",width:210,height:210,marginLeft:-105,marginTop:-105,borderRadius:"50%",border:`1px solid ${t.border}`,pointerEvents:"none"}}>
            <div style={{position:"absolute",width:8,height:8,background:t.accent,borderRadius:"50%",boxShadow:`0 0 12px ${t.accent}`,animation:"orbit 4s linear infinite",top:"50%",left:"50%",marginLeft:-4,marginTop:-4}}/>
          </div>
          <div style={{background:t.card,border:`1px solid ${t.borderHov}`,borderRadius:20,padding:22,boxShadow:`0 20px 65px ${t.shadow},0 0 32px ${t.accentGlow}`,animation:"floatY 5s ease-in-out infinite"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}><Logo size={42}/>
              <div><div style={{fontFamily:"'Orbitron',monospace",fontSize:17,fontWeight:900,color:t.text}}>M.B.O</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:9,color:t.accent,fontWeight:700,letterSpacing:3}}>WEBDEV</div></div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
              {[{v:"2+",l:"Yrs Exp"},{v:"3+",l:"Projects"},{v:"100%",l:"Satisfaction"},{v:"500+",l:"Commits"}].map(s=>(
                <div key={s.l} style={{background:t.accentDim,border:`1px solid ${t.border}`,borderRadius:8,padding:"9px 10px"}}>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:900,color:t.accent}}>{s.v}</div>
                  <div style={{fontSize:10,color:t.textMuted,fontFamily:"'Rajdhani',sans-serif",marginTop:2,fontWeight:600}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{borderTop:`1px solid ${t.border}`,paddingTop:11}}>
              <div style={{fontSize:9,color:t.textMuted,fontFamily:"'Rajdhani',sans-serif",marginBottom:6,fontWeight:700,letterSpacing:2}}>TECH STACK</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {["🐍 Python","🎸 Django","⚛️ React","🌐 HTML/CSS"].map(tag=>(
                  <span key={tag} style={{background:t.tagBg,border:`1px solid ${t.border}`,color:t.tagColor,padding:"2px 7px",borderRadius:20,fontSize:10,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const About=({t})=>{
  const[flip,setFlip]=useState(false);
  return(
    <section style={{padding:"100px clamp(16px,5vw,68px)",background:t.bg2}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <FadeUp><div style={{textAlign:"center",marginBottom:50}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",color:t.accent,fontSize:11,letterSpacing:3,fontWeight:700,marginBottom:8}}>// ABOUT_ME</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(22px,4vw,40px)",color:t.text}}>Who I Am</h2>
        </div></FadeUp>
        <div className="about-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(24px,5vw,60px)",alignItems:"start"}}>
          <FadeUp>
            <div style={{background:t.codeBg,border:`1px solid ${t.border}`,borderRadius:14,padding:"clamp(16px,3vw,28px)",fontFamily:"monospace",fontSize:"clamp(11px,1.2vw,13px)",lineHeight:2,marginBottom:20}}>
              <div style={{color:"#4b5563",marginBottom:10,fontSize:11}}>// mahmud_olasunkanmi.py</div>
              {[["name","Mahmud Bashir Olasunkanmi"],["role","Full Stack Developer"],["location","Abuja, Nigeria 🇳🇬"],["experience","2.5+ years"],["stack",["Python","Django","React","Bootstrap","PostgreSQL"]],["available",true]].map(([k,v])=>(
                <div key={k} style={{marginBottom:4}}>
                  <span style={{color:"#86efac"}}>{k}</span>
                  <span style={{color:"#9ca3af"}}> = </span>
                  {Array.isArray(v)
                    ?<span style={{color:"#fcd34d"}}>{"["}{v.map((i,idx)=><span key={i}><span style={{color:"#f9a8d4"}}>"{i}"</span>{idx<v.length-1?", ":""}</span>)}{"]"}</span>
                    :typeof v==="boolean"?<span style={{color:"#f87171"}}>{String(v)}</span>
                    :<span style={{color:"#fcd34d"}}>"{v}"</span>}
                </div>
              ))}
            </div>
            <div className="stats3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[["Projects","3+","🚀"],["Commits","500+","💻"],["Satisfaction","100%","⭐"]].map(([l,v,ic])=>(
                <div key={l} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:"16px 10px",textAlign:"center"}}>
                  <div style={{fontSize:20,marginBottom:4}}>{ic}</div>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:900,color:t.accent}}><CountUp end={parseInt(v)||0} sfx={v.replace(/d/g,"")}/></div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,marginTop:3,fontWeight:700}}>{l}</div>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={.15}>
            <p style={{color:t.textSub,lineHeight:1.95,fontSize:"clamp(13px,1.2vw,15px)",marginBottom:22,fontFamily:"'Rajdhani',sans-serif"}}>
              I'm a full stack developer based in Abuja, Nigeria. I turn ideas into production-ready applications — with clean architecture, fast performance, and code that actually ships.
            </p>
            <p style={{color:t.textSub,lineHeight:1.95,fontSize:"clamp(13px,1.2vw,15px)",marginBottom:26,fontFamily:"'Rajdhani',sans-serif"}}>
              From building Django REST APIs that handle thousands of requests, to crafting pixel-perfect React + Bootstrap frontends and mobile apps — I handle the full stack end to end.
            </p>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:26}}>
              {["Python","Django","React","Bootstrap","HTML/CSS","PostgreSQL","REST APIs","JavaScript","Git"].map(tag=>(
                <span key={tag} style={{background:t.tagBg,border:`1px solid ${t.border}`,color:t.tagColor,padding:"4px 11px",borderRadius:20,fontSize:12,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>{tag}</span>
              ))}
            </div>
            {/* Business Card */}
            <div onClick={()=>setFlip(f=>!f)} style={{cursor:"pointer",perspective:800,height:170}}>
              <div style={{position:"relative",width:"100%",height:"100%",transition:"transform .6s",transformStyle:"preserve-3d",transform:flip?"rotateY(180deg)":"none"}}>
                <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${t.card},${t.surface})`,border:`1px solid ${t.borderHov}`,borderRadius:16,padding:20,backfaceVisibility:"hidden",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}><Logo size={36}/><div><div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:15,color:t.text}}>M.B.O WebDev</div><div style={{fontSize:11,color:t.accent,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>Full Stack Developer</div></div></div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,textAlign:"center"}}>Click to flip →</div>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>{["Python","Django","React","Bootstrap"].map(s=><span key={s} style={{fontSize:11,color:t.tagColor,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>{s}</span>)}</div>
                </div>
                <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,#052e16,#0d1c0d)`,border:`1px solid ${t.borderHov}`,borderRadius:16,padding:20,backfaceVisibility:"hidden",transform:"rotateY(180deg)",display:"flex",flexDirection:"column",justifyContent:"center",gap:8}}>
                  {[["📧","mahmudolasunkami895@gmail.com"],["📍","Abuja, Nigeria"],["📞","08072410373"],["🐙","github.com/Muhamzy-ui"]].map(([ic,v])=>(
                    <div key={v} style={{display:"flex",gap:9,alignItems:"center"}}><span style={{fontSize:13}}>{ic}</span><span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"#86efac",fontWeight:600}}>{v}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

// ─── SKILLS ───────────────────────────────────────────────────────────────────
const SkillBar=({s,delay,t})=>{
  const[w,setW]=useState(0);const ref=useRef();
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setTimeout(()=>setW(s.p),100)},{threshold:.3});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[s.p]);
  return(
    <div ref={ref} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:"16px 18px",transition:"transform .2s,box-shadow .2s",cursor:"default"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px ${t.accentGlow}`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{s.i}</span><span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:t.text}}>{s.n}</span></div>
        <span style={{fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:700,color:t.accent}}>{s.p}%</span>
      </div>
      <div style={{height:5,background:t.border,borderRadius:3,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${w}%`,background:`linear-gradient(90deg,${s.c},#4ade80)`,borderRadius:3,transition:"width 1.1s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 8px ${s.c}66`}}/>
      </div>
    </div>
  );
};

const Skills=({t})=>(
  <section style={{padding:"100px clamp(16px,5vw,68px)"}}>
    <div style={{maxWidth:1280,margin:"0 auto"}}>
      <FadeUp><div style={{textAlign:"center",marginBottom:50}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",color:t.accent,fontSize:11,letterSpacing:3,fontWeight:700,marginBottom:8}}>// SKILLS.map()</div>
        <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(22px,4vw,40px)",color:t.text}}>Tech Stack</h2>
      </div></FadeUp>
      <div className="skills-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {SKILLS.map((s,i)=><FadeUp key={s.n} delay={i*.07}><SkillBar s={s} delay={i*.1} t={t}/></FadeUp>)}
      </div>
    </div>
  </section>
);

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const ProjCard=({p,t,isAdmin,onDelete})=>(
  <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:18,padding:"clamp(18px,3vw,26px)",display:"flex",flexDirection:"column",transition:"transform .22s,box-shadow .22s",position:"relative"}}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=`0 18px 50px ${t.shadow}`;e.currentTarget.style.borderColor=t.borderHov;}}
    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=t.border;}}>
    {isAdmin&&(
      <button className="btn btn-danger btn-sm" style={{position:"absolute",top:12,right:12,padding:"4px 10px",fontSize:11}} onClick={()=>onDelete(p.id)}>✕ Remove</button>
    )}
    <div style={{fontSize:"clamp(28px,4vw,38px)",marginBottom:14}}>{p.icon}</div>
    <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(13px,1.5vw,16px)",color:t.text,marginBottom:10,lineHeight:1.3}}>{p.title}</h3>
    <p style={{color:t.textSub,fontFamily:"'Rajdhani',sans-serif",fontSize:"clamp(12px,1vw,14px)",lineHeight:1.75,marginBottom:14,flex:1}}>{p.desc}</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
      {p.tags.map(tag=><span key={tag} style={{background:t.tagBg,border:`1px solid ${t.border}`,color:t.tagColor,padding:"3px 9px",borderRadius:20,fontSize:11,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>{tag}</span>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:14}}>
      {Object.entries(p.stats).map(([k,v])=>(
        <div key={k} style={{textAlign:"center",background:t.accentDim,borderRadius:8,padding:"8px 4px"}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:13,fontWeight:900,color:t.accent}}>{v}</div>
          <div style={{fontSize:9,color:t.textMuted,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,marginTop:2}}>{k}</div>
        </div>
      ))}
    </div>
    <div style={{display:"flex",gap:8}}>
      <a href={p.github||"#"} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{flex:1,textDecoration:"none"}}>🐙 GitHub</a>
      <a href={p.live||"#"} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{flex:1,textDecoration:"none"}}>🚀 Live Demo</a>
    </div>
  </div>
);

const Projects=({t,projects,setProjects})=>{
  const[isAdmin,setIsAdmin]=useState(false);
  const[showLogin,setShowLogin]=useState(false);
  const[pw,setPw]=useState("");const[pwErr,setPwErr]=useState(false);
  const[showAdd,setShowAdd]=useState(false);
  const[newP,setNewP]=useState({icon:"🚀",title:"",desc:"",tags:"",github:"",live:"",stat1k:"",stat1v:"",stat2k:"",stat2v:"",stat3k:"",stat3v:""});

  const inp={background:t.inputBg,border:`1px solid ${t.border}`,borderRadius:8,padding:"9px 12px",color:t.text,fontFamily:"'Rajdhani',sans-serif",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"};

  const handleLogin=()=>{
    if(pw===ADMIN_PASSWORD){setIsAdmin(true);setShowLogin(false);setPw("");}
    else{setPwErr(true);setTimeout(()=>setPwErr(false),2000);}
  };

  const handleAdd=()=>{
    if(!newP.title||!newP.desc)return;
    const p={
      id:Date.now(),icon:newP.icon||"🚀",title:newP.title,desc:newP.desc,
      tags:newP.tags.split(",").map(t=>t.trim()).filter(Boolean),
      github:newP.github||"#",live:newP.live||"#",
      stats:{
        [newP.stat1k||"Stat1"]:newP.stat1v||"—",
        [newP.stat2k||"Stat2"]:newP.stat2v||"—",
        [newP.stat3k||"Stat3"]:newP.stat3v||"—",
      },
    };
    setProjects(prev=>[...prev,p]);
    setShowAdd(false);
    setNewP({icon:"🚀",title:"",desc:"",tags:"",github:"",live:"",stat1k:"",stat1v:"",stat2k:"",stat2v:"",stat3k:"",stat3v:""});
  };

  const handleDelete=(id)=>setProjects(prev=>prev.filter(p=>p.id!==id));

  return(
    <section style={{padding:"100px clamp(16px,5vw,68px)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <FadeUp><div style={{textAlign:"center",marginBottom:50}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",color:t.accent,fontSize:11,letterSpacing:3,fontWeight:700,marginBottom:8}}>// PROJECTS.filter(live===true)</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(22px,4vw,40px)",color:t.text}}>Featured Projects</h2>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:18,flexWrap:"wrap"}}>
            {!isAdmin
              ?<button className="btn btn-ghost btn-sm" onClick={()=>setShowLogin(true)}>🔐 Admin</button>
              :<>
                <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(s=>!s)}>＋ Add Project</button>
                <button className="btn btn-ghost btn-sm" onClick={()=>setIsAdmin(false)}>🔒 Lock</button>
              </>
            }
          </div>
        </div></FadeUp>

        {/* Admin Login Modal */}
        {showLogin&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(6px)",zIndex:1200,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{background:t.card,border:`1px solid ${t.borderHov}`,borderRadius:18,padding:32,width:"min(380px,90vw)"}}>
              <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:16,color:t.text,marginBottom:6}}>Admin Access</h3>
              <p style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:t.textMuted,marginBottom:18}}>Enter your password to manage projects</p>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                placeholder="Password" style={{...inp,marginBottom:10,border:`1px solid ${pwErr?"#ef4444":t.border}`}}/>
              {pwErr&&<p style={{color:"#ef4444",fontFamily:"'Rajdhani',sans-serif",fontSize:12,marginBottom:8}}>❌ Wrong password</p>}
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-primary" style={{flex:1}} onClick={handleLogin}>Unlock</button>
                <button className="btn btn-ghost" onClick={()=>{setShowLogin(false);setPw("");}}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Project Panel */}
        {isAdmin&&showAdd&&(
          <FadeUp>
            <div style={{background:t.card,border:`1px solid ${t.borderHov}`,borderRadius:18,padding:"clamp(18px,4vw,30px)",marginBottom:34}}>
              <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:15,color:t.accent,marginBottom:18}}>＋ New Project</h3>
              <div className="c2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div><label style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,fontWeight:700,letterSpacing:1,display:"block",marginBottom:5}}>ICON (emoji)</label><input value={newP.icon} onChange={e=>setNewP(p=>({...p,icon:e.target.value}))} style={inp}/></div>
                <div><label style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,fontWeight:700,letterSpacing:1,display:"block",marginBottom:5}}>TITLE *</label><input value={newP.title} onChange={e=>setNewP(p=>({...p,title:e.target.value}))} placeholder="Project name" style={inp}/></div>
              </div>
              <div style={{marginBottom:10}}><label style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,fontWeight:700,letterSpacing:1,display:"block",marginBottom:5}}>DESCRIPTION *</label><textarea value={newP.desc} onChange={e=>setNewP(p=>({...p,desc:e.target.value}))} rows={2} placeholder="What this project does..." style={{...inp,resize:"vertical"}}/></div>
              <div className="c2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div><label style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,fontWeight:700,letterSpacing:1,display:"block",marginBottom:5}}>TAGS (comma separated)</label><input value={newP.tags} onChange={e=>setNewP(p=>({...p,tags:e.target.value}))} placeholder="React, Django, PostgreSQL" style={inp}/></div>
                <div><label style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,fontWeight:700,letterSpacing:1,display:"block",marginBottom:5}}>GITHUB URL</label><input value={newP.github} onChange={e=>setNewP(p=>({...p,github:e.target.value}))} placeholder="https://github.com/..." style={inp}/></div>
              </div>
              <div className="c2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div><label style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,fontWeight:700,letterSpacing:1,display:"block",marginBottom:5}}>LIVE URL</label><input value={newP.live} onChange={e=>setNewP(p=>({...p,live:e.target.value}))} placeholder="https://your-app.com" style={inp}/></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
                {[[1],[2],[3]].map(([n])=>(
                  <div key={n}>
                    <label style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:t.textMuted,fontWeight:700,display:"block",marginBottom:4}}>STAT {n} LABEL</label>
                    <input value={newP[`stat${n}k`]} onChange={e=>setNewP(p=>({...p,[`stat${n}k`]:e.target.value}))} placeholder="e.g. Users" style={{...inp,marginBottom:5}}/>
                    <input value={newP[`stat${n}v`]} onChange={e=>setNewP(p=>({...p,[`stat${n}v`]:e.target.value}))} placeholder="e.g. 500+" style={inp}/>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-primary" onClick={handleAdd} disabled={!newP.title||!newP.desc}>✅ Add Project</button>
                <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </FadeUp>
        )}

        <div className="proj-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {projects.map((p,i)=>(
            <FadeUp key={p.id} delay={i*.1}><ProjCard p={p} t={t} isAdmin={isAdmin} onDelete={handleDelete}/></FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── RATINGS (CLIENT TESTIMONIALS) ────────────────────────────────────────────
const Ratings=({t,ratings})=>{
  const[avg,setAvg]=useState(0);
  useEffect(()=>{if(ratings.length)setAvg((ratings.reduce((a,r)=>a+r.stars,0)/ratings.length).toFixed(1))},[ratings]);
  return(
    <section style={{padding:"100px clamp(16px,5vw,68px)",background:t.bg2}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <FadeUp><div style={{textAlign:"center",marginBottom:50}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",color:t.accent,fontSize:11,letterSpacing:3,fontWeight:700,marginBottom:8}}>// CLIENT_FEEDBACK</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(22px,4vw,40px)",color:t.text}}>Testimonials</h2>
        </div></FadeUp>
        <div className="ratings-grid" style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:"clamp(24px,4vw,40px)",alignItems:"start"}}>
          <FadeUp>
            <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:32,textAlign:"center",position:"sticky",top:100}}>
              <div style={{fontSize:48,fontFamily:"'Orbitron',monospace",fontWeight:900,color:t.text,lineHeight:1}}>{avg}</div>
              <div style={{margin:"12px 0 8px"}}><Stars count={Math.round(avg)} size={22} animated/></div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:t.textSub,fontWeight:600}}>{ratings.length} Client Reviews</div>
              <div style={{width:"100%",height:1,background:t.border,margin:"24px 0"}}/>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[5,4,3,2,1].map(star=>{
                  const count=ratings.filter(r=>Math.round(r.stars)===star).length;
                  const pct=ratings.length?(count/ratings.length)*100:0;
                  return(
                    <div key={star} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,color:t.textSub}}>
                      <span style={{width:12}}>{star}</span>
                      <span style={{color:"#f59e0b"}}>★</span>
                      <div style={{flex:1,height:6,background:t.accentDim,borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:t.accent,borderRadius:3}}/>
                      </div>
                      <span style={{width:24,textAlign:"right",fontSize:11}}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeUp>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
            {ratings.map((r,i)=>(
              <FadeUp key={r.id} delay={i*.05}>
                <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:18,padding:24,height:"100%",display:"flex",flexDirection:"column",transition:"transform .2s",cursor:"default"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <div style={{width:42,height:42,borderRadius:"50%",background:t.accentDim,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontFamily:"'Orbitron',monospace",fontWeight:900,color:t.accent}}>
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:700,color:t.text}}>{r.name}</div>
                        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,fontWeight:600}}>{r.role} • {r.country}</div>
                      </div>
                    </div>
                    <Stars count={r.stars} size={14}/>
                  </div>
                  <p style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:t.textSub,lineHeight:1.7,flex:1,margin:"0 0 16px"}}>"{r.text}"</p>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${t.border}`,paddingTop:12,marginTop:"auto"}}>
                    <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.accent,fontWeight:700,background:t.tagBg,padding:"2px 8px",borderRadius:12}}>✓ {r.project}</span>
                    <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,fontWeight:600}}>{r.date}</span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── BLOG ─────────────────────────────────────────────────────────────────────
const Blog=({t,go,setBlog})=>{
  const open=(b)=>{setBlog(b);window.scrollTo(0,0);};
  return(
    <section style={{padding:"100px clamp(16px,5vw,68px)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
         <FadeUp><div style={{textAlign:"center",marginBottom:50}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",color:t.accent,fontSize:11,letterSpacing:3,fontWeight:700,marginBottom:8}}>// TECH_BLOG</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(22px,4vw,40px)",color:t.text}}>Latest Articles</h2>
        </div></FadeUp>
        <div className="blog-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24}}>
          {BLOGS.map((b,i)=>(
            <FadeUp key={b.id} delay={i*.1}>
              <div onClick={()=>open(b)} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:18,padding:24,cursor:"pointer",transition:"all .2s",height:"100%",display:"flex",flexDirection:"column"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor=t.accent;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=t.border;}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,alignItems:"center"}}>
                  <span style={{background:t.tagBg,color:t.tagColor,padding:"4px 10px",borderRadius:20,fontSize:11,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>{b.icon} {b.tag}</span>
                  <span style={{fontSize:11,color:t.textMuted,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{b.date} • {b.rt} read</span>
                </div>
                <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:16,color:t.text,marginBottom:10,lineHeight:1.3}}>{b.title}</h3>
                <p style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:t.textSub,lineHeight:1.6,flex:1}}>{b.desc}</p>
                <div style={{marginTop:16,fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:t.accent,fontWeight:700}}>Read Article →</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── BOOK MEETING ─────────────────────────────────────────────────────────────
const BookMeeting=({t})=>{
  const[step,setStep]=useState(1);
  const[d,setD]=useState("");const[tm,setTm]=useState("");
  const[info,setInfo]=useState({n:"",e:"",p:"",co:""});
  const[msg,setMsg]=useState("");const[sub,setSub]=useState(false);
  const[err,setErr]=useState("");

  const handleSubmit=(e)=>{
    e.preventDefault();setSub(true);setMsg("");setErr("");
    
    // Using EmailJS for Meetings
    const templateParams = {
      to_name: "Mahmud",
      from_name: info.n,
      from_email: info.e,
      meeting_date: d,
      meeting_time: tm,
      project_details: info.p,
      company: info.co || "N/A"
    };

    emailjs.send(
      EMAILJS_CONFIG.bookingServiceId,
      EMAILJS_CONFIG.bookingTemplate,
      templateParams,
      EMAILJS_CONFIG.publicKey
    )
    .then((response) => {
      setMsg("Meeting requested successfully! I will email you to confirm.");
      setSub(false);
      setTimeout(()=>{
        setStep(1);setD("");setTm("");setInfo({n:"",e:"",p:"",co:""});setMsg("");
      },4000);
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      setErr("Failed to send booking request. Please check your config or try emailing directly.");
      setSub(false);
    });
  };

  const inp={background:t.inputBg,border:`1px solid ${t.border}`,borderRadius:10,padding:"12px 16px",color:t.text,fontFamily:"'Rajdhani',sans-serif",fontSize:14,outline:"none",width:"100%",boxSizing:"border-box",transition:"border-color .2s"};
  const lbl={fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:t.textMuted,fontWeight:700,letterSpacing:1,display:"block",marginBottom:6,marginTop:16};

  return(
    <section style={{padding:"100px clamp(16px,5vw,68px)"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <FadeUp><div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",color:t.accent,fontSize:11,letterSpacing:3,fontWeight:700,marginBottom:8}}>// CALENDAR</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(22px,4vw,40px)",color:t.text}}>Book a Discovery Call</h2>
        </div></FadeUp>
        <FadeUp>
          <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:24,padding:"clamp(20px,5vw,40px)",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${t.accent},transparent)`}}/>
            
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:30}}>
              {[1,2].map(s=>(
                <React.Fragment key={s}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:step>=s?t.accent:t.accentDim,color:step>=s?"#fff":t.textMuted,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:900,transition:"all .3s"}}>{s}</div>
                  {s===1&&<div style={{flex:1,height:2,background:step===2?t.accent:t.border,transition:"all .3s"}}/>}
                </React.Fragment>
              ))}
            </div>

            {msg?<div style={{background:t.tagBg,border:`1px solid ${t.border}`,color:t.tagColor,padding:20,borderRadius:12,textAlign:"center",fontFamily:"'Rajdhani',sans-serif",fontSize:16,fontWeight:700}}>{msg}</div>:
             err?<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid #ef4444",color:"#ef4444",padding:20,borderRadius:12,textAlign:"center",fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:600}}>{err}</div>:
            step===1?(
              <div style={{animation:"sbIn .3s ease"}}>
                <h3 style={{fontFamily:"'Rajdhani',sans-serif",fontSize:22,color:t.text,marginBottom:6,fontWeight:700}}>Select Date & Time</h3>
                <p style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:t.textSub,marginBottom:24}}>30-min discovery call to discuss your project.</p>
                
                <label style={lbl}>DATE (Next 14 Days)</label>
                <div className="times-grid" style={{display:"grid",gap:10,marginBottom:20}}>
                  {Array(8).fill(0).map((_,i)=>{
                    const dt=new Date();dt.setDate(dt.getDate()+1+i);
                    const ds=`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
                    const lbl=`${DAYS[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()].slice(0,3)}`;
                    return <button key={ds} onClick={()=>setD(ds)} style={{padding:"12px 10px",background:d===ds?t.accentDim:t.codeBg,border:`1px solid ${d===ds?t.accent:t.border}`,borderRadius:10,color:d===ds?t.accent:t.textSub,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:600,transition:"all .2s"}}>{lbl}</button>;
                  })}
                </div>
                {d&&(
                  <FadeUp>
                    <label style={lbl}>TIME (GMT+1)</label>
                    <div className="times-grid" style={{display:"grid",gap:10,marginBottom:30}}>
                      {TIMES.map(tStr=>(
                        <button key={tStr} onClick={()=>setTm(tStr)} style={{padding:"10px",background:tm===tStr?t.accentDim:t.codeBg,border:`1px solid ${tm===tStr?t.accent:t.border}`,borderRadius:10,color:tm===tStr?t.accent:t.textSub,cursor:"pointer",fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:700,transition:"all .2s"}}>{tStr}</button>
                      ))}
                    </div>
                  </FadeUp>
                )}
                <div style={{display:"flex",justifyContent:"flex-end"}}><button className="btn btn-primary" onClick={()=>setStep(2)} disabled={!d||!tm}>Continue →</button></div>
              </div>
            ):(
              <form onSubmit={handleSubmit} style={{animation:"slideR .3s ease"}}>
                <h3 style={{fontFamily:"'Rajdhani',sans-serif",fontSize:22,color:t.text,marginBottom:6,fontWeight:700}}>Your Details</h3>
                <div style={{background:t.accentDim,border:`1px solid ${t.border}`,padding:"10px 16px",borderRadius:8,marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:t.textSub,fontWeight:600}}>🗓 {d} at {tm}</span>
                  <button type="button" onClick={()=>setStep(1)} style={{background:"none",border:"none",color:t.accent,fontFamily:"'Rajdhani',sans-serif",fontSize:13,cursor:"pointer",fontWeight:700,textDecoration:"underline"}}>Edit</button>
                </div>
                <div className="c2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <div><label style={lbl}>NAME *</label><input required value={info.n} onChange={e=>setInfo(i=>({...i,n:e.target.value}))} style={inp}/></div>
                  <div><label style={lbl}>EMAIL *</label><input required type="email" value={info.e} onChange={e=>setInfo(i=>({...i,e:e.target.value}))} style={inp}/></div>
                </div>
                <label style={lbl}>COMPANY / URL (Optional)</label><input value={info.co} onChange={e=>setInfo(i=>({...i,co:e.target.value}))} style={inp}/>
                <label style={lbl}>PROJECT DETAILS *</label><textarea required rows={4} value={info.p} onChange={e=>setInfo(i=>({...i,p:e.target.value}))} placeholder="What are we building?" style={{...inp,resize:"vertical",marginBottom:30}}/>
                <div style={{display:"flex",gap:12}}>
                  <button type="button" className="btn btn-ghost" onClick={()=>setStep(1)}>← Back</button>
                  <button type="submit" className="btn btn-primary" style={{flex:1}} disabled={sub}>{sub?"Confirming...":"Confirm Booking ✅"}</button>
                </div>
              </form>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

// ─── CONTACT ────────────────────────────────────────────────────────────────
const Contact=({t})=>{
  const[f,setF]=useState({n:"",e:"",m:""});
  const[st,setSt]=useState("idle");const[msg,setMsg]=useState("");

  const handleSub=(e)=>{
    e.preventDefault();setSt("sub");setMsg("");
    
    // Using EmailJS for Contact
    const templateParams = {
      from_name: f.n,
      from_email: f.e,
      message: f.m,
      to_name: "Mahmud"
    };

    emailjs.send(
      EMAILJS_CONFIG.contactServiceId,
      EMAILJS_CONFIG.contactTemplate,
      templateParams,
      EMAILJS_CONFIG.publicKey
    )
    .then((response) => {
      setSt("success");setMsg("Message sent! I'll reply soon.");setF({n:"",e:"",m:""});
      setTimeout(()=>setSt("idle"),4000);
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      setSt("error");setMsg("Failed to send message. Please try emailing directly.");
      setTimeout(()=>setSt("idle"),4000);
    });
  };

  const inp={background:t.inputBg,border:`1px solid ${t.border}`,borderRadius:10,padding:"14px 18px",color:t.text,fontFamily:"'Rajdhani',sans-serif",fontSize:15,outline:"none",width:"100%",boxSizing:"border-box",transition:"all .2s"};
  const lbl={fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:t.textMuted,fontWeight:700,letterSpacing:1,display:"block",marginBottom:8,marginTop:18};

  return(
    <section style={{padding:"100px clamp(16px,5vw,68px)",background:t.bg2}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <FadeUp><div style={{textAlign:"center",marginBottom:50}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",color:t.accent,fontSize:11,letterSpacing:3,fontWeight:700,marginBottom:8}}>// CONTACT</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(22px,4vw,40px)",color:t.text}}>Let's Talk</h2>
        </div></FadeUp>
        <div style={{display:"grid",gridTemplateColumns:"minmax(300px,1fr) minmax(300px,1.5fr)",gap:"clamp(30px,6vw,80px)",alignItems:"start"}}>
          <FadeUp>
            <h3 style={{fontFamily:"'Rajdhani',sans-serif",fontSize:26,color:t.text,marginBottom:16,fontWeight:700}}>Have a project in mind?</h3>
            <p style={{fontFamily:"'Rajdhani',sans-serif",fontSize:15,color:t.textSub,lineHeight:1.8,marginBottom:32}}>
              I'm currently available for freelance projects and full-time opportunities.
              Whether you need a complex Django API, a responsive React frontend, or a full-stack e-commerce platform — I can help.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:20,marginBottom:32}}>
              {[["📧","Email","mahmudolasunkami895@gmail.com","mailto:mahmudolasunkami895@gmail.com"],
                ["📱","WhatsApp","+234 807 241 0373","https://wa.me/2348072410373"],
                ["🐙","GitHub","github.com/Muhamzy-ui","https://github.com/Muhamzy-ui"],
                ["📍","Location","Abuja, Nigeria","#"]].map(([ic,l,v,href])=>(
                <a key={l} href={href} target={href.startsWith("http")?"_blank":"_self"} rel="noreferrer" style={{display:"flex",alignItems:"center",gap:16,textDecoration:"none",background:t.card,border:`1px solid ${t.border}`,padding:"16px",borderRadius:14,transition:"transform .2s",cursor:href==="#"?"default":"pointer"}}
                  onMouseEnter={e=>href!=="#"&&(e.currentTarget.style.transform="translateX(6px)")}
                  onMouseLeave={e=>href!=="#"&&(e.currentTarget.style.transform="none")}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:t.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:`1px solid ${t.border}`}}>{ic}</div>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:t.textMuted,fontWeight:700,letterSpacing:1,marginBottom:4}}>{l.toUpperCase()}</div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:15,color:t.text,fontWeight:600}}>{v}</div>
                  </div>
                </a>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={.2}>
            <form onSubmit={handleSub} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:24,padding:"clamp(24px,4vw,40px)"}}>
              <div className="c2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div><label style={lbl}>NAME</label><input required value={f.n} onChange={e=>setF({...f,n:e.target.value})} style={inp}/></div>
                <div><label style={lbl}>EMAIL</label><input required type="email" value={f.e} onChange={e=>setF({...f,e:e.target.value})} style={inp}/></div>
              </div>
              <div><label style={lbl}>MESSAGE</label><textarea required rows={5} value={f.m} onChange={e=>setF({...f,m:e.target.value})} style={{...inp,resize:"vertical",marginBottom:30}} placeholder="How can I help you?"/></div>
              <button type="submit" className="btn btn-primary btn-block" disabled={st==="sub"} style={{height:54,fontSize:16}}>
                {st==="sub"?"Sending...":st==="success"?"✓ Message Sent":st==="error"?"❌ Error":"Send Message ↗"}
              </button>
              {msg&&<div style={{marginTop:16,textAlign:"center",fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:600,color:st==="success"?"#10b981":"#ef4444"}}>{msg}</div>}
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer=({t,go})=>(
  <footer style={{borderTop:`1px solid ${t.border}`,padding:"60px clamp(16px,5vw,68px) 30px",background:t.navBg}}>
    <div className="foot-grid" style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:60}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><Logo size={32}/>
          <div><div style={{fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:900,color:t.text}}>M.B.O</div><div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:t.accent,fontWeight:700,letterSpacing:2}}>WEBDEV</div></div>
        </div>
        <p style={{color:t.textSub,fontFamily:"'Rajdhani',sans-serif",fontSize:14,lineHeight:1.8,marginBottom:20,maxWidth:300,fontWeight:600}}>
          Building fast, scalable, and modern applications with Python and React.
        </p>
        <a href="mailto:mahmudolasunkami895@gmail.com" style={{display:"inline-flex",alignItems:"center",gap:8,color:t.text,textDecoration:"none",fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:700}} onMouseEnter={e=>e.currentTarget.style.color=t.accent} onMouseLeave={e=>e.currentTarget.style.color=t.text}>
          ✉️ mahmudolasunkami895@gmail.com
        </a>
      </div>
      <div>
        <h4 style={{fontFamily:"'Orbitron',monospace",fontSize:13,color:t.text,marginBottom:20}}>Navigation</h4>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {NAV.slice(0,4).map(n=><button key={n.id} onClick={()=>go(n.id)} className="footlink">{n.label}</button>)}
        </div>
      </div>
      <div>
        <h4 style={{fontFamily:"'Orbitron',monospace",fontSize:13,color:t.text,marginBottom:20}}>Services</h4>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {["Django APIs","React Frontends","Full Stack Dev","Database Design"].map(s=><span key={s} style={{color:t.textSub,fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:600}}>{s}</span>)}
        </div>
      </div>
      <div>
        <h4 style={{fontFamily:"'Orbitron',monospace",fontSize:13,color:t.text,marginBottom:20}}>Connect</h4>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <a href="https://github.com/Muhamzy-ui" target="_blank" rel="noreferrer" className="footlink">GitHub</a>
          <a href="https://linkedin.com/in/mahmud-olasunkanmi" target="_blank" rel="noreferrer" className="footlink">LinkedIn</a>
          <a href="#" className="footlink">Twitter</a>
          <a href="https://wa.me/2348072410373" target="_blank" rel="noreferrer" className="footlink">WhatsApp ↗</a>
        </div>
      </div>
    </div>
    <div style={{maxWidth:1280,margin:"0 auto",borderTop:`1px solid ${t.border}`,paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
      <div style={{color:t.textMuted,fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:600}}>© {new Date().getFullYear()} Mahmud Bashir Olasunkanmi. All rights reserved.</div>
      <div style={{display:"flex",gap:6}}>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",animation:"pulseDot 2s infinite"}}/>
        <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:t.textSub,fontWeight:600}}>System Status: 100% Operational</span>
      </div>
    </div>
  </footer>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const[active,setActive]=useState("home");const[dark,setDark]=useState(true);
  const[sb,setSb]=useState(false);const[blog,setBlog]=useState(null);
  const t=dark?DARK:LIGHT;
  const[projects,setProjects]=useState(INIT_PROJECTS);
  const[ratings,setRatings]=useState(INIT_RATINGS);

  useEffect(()=>{
    document.head.insertAdjacentHTML("beforeend",`<style id="mbo-css">${makeCSS(t)}</style>`);
    return()=>document.getElementById("mbo-css")?.remove();
  },[t]);

  const go=(id)=>{
    setActive(id);setBlog(null);
    const el=document.getElementById(id);if(el){el.scrollIntoView({behavior:"smooth"});}
  };

  useEffect(()=>{
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{if(entry.isIntersecting)setActive(entry.target.id);});
    },{threshold:0.3});
    NAV.forEach(nav=>{
      const el=document.getElementById(nav.id);
      if(el)observer.observe(el);
    });
    return()=>observer.disconnect();
  },[]);

  if(blog)return(
    <div style={{background:t.bg,minHeight:"100vh",color:t.text,transition:"background .3s",fontFamily:"'Rajdhani',sans-serif"}}>
      <Navbar active="blog" go={go} t={t} dark={dark} setDark={setDark} sb={sb} setSb={setSb}/>
      <Sidebar open={sb} onClose={()=>setSb(false)} active="blog" go={go} t={t} dark={dark} setDark={setDark}/>
      <main style={{padding:"120px clamp(16px,5vw,68px) 100px",maxWidth:800,margin:"0 auto",animation:"pageIn .5s ease"}}>
        <button className="btn btn-ghost btn-sm" onClick={()=>setBlog(null)} style={{marginBottom:32}}>← Back to Articles</button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <span style={{background:t.tagBg,color:t.tagColor,padding:"4px 12px",borderRadius:20,fontSize:13,fontWeight:700}}>{blog.icon} {blog.tag}</span>
          <span style={{color:t.textMuted,fontSize:13,fontWeight:600}}>{blog.date} • {blog.rt} read</span>
        </div>
        <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:"clamp(28px,5vw,48px)",color:t.text,marginBottom:24,lineHeight:1.2}}>{blog.title}</h1>
        <p style={{fontSize:"clamp(16px,2vw,18px)",color:t.textSub,lineHeight:1.8,marginBottom:40,fontWeight:600}}>{blog.desc}</p>
        <div style={{height:1,background:t.border,marginBottom:40}}/>
        <div style={{fontSize:16,color:t.text,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{blog.body}</div>
      </main>
      <Footer t={t} go={go}/>
    </div>
  );

  return(
    <div style={{background:t.bg,minHeight:"100vh",color:t.text,transition:"background .3s"}}>
      <Navbar active={active} go={go} t={t} dark={dark} setDark={setDark} sb={sb} setSb={setSb}/>
      <Sidebar open={sb} onClose={()=>setSb(false)} active={active} go={go} t={t} dark={dark} setDark={setDark}/>
      <main>
        <div id="home"><Hero go={go} t={t}/></div>
        <div id="about"><About t={t}/></div>
        <div id="skills"><Skills t={t}/></div>
        <div id="projects"><Projects t={t} projects={projects} setProjects={setProjects}/></div>
        <div id="ratings"><Ratings t={t} ratings={ratings}/></div>
        <div id="blog"><Blog t={t} go={go} setBlog={setBlog}/></div>
        <div id="book-meeting"><BookMeeting t={t}/></div>
        <div id="contact"><Contact t={t}/></div>
      </main>
      <Footer t={t} go={go}/>
    </div>
  );
}

