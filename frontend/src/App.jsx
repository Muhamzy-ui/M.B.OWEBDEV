import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#080e08", bg2: "#0b150b", surface: "#0d1a0d", card: "#0f1f0f",
  border: "rgba(34,197,94,0.15)", borderHov: "rgba(34,197,94,0.5)",
  text: "#f0fdf4", textSub: "#9ca3af", textMuted: "#4b5563",
  accent: "#22c55e", accentDim: "rgba(34,197,94,0.1)", accentGlow: "rgba(34,197,94,0.3)",
  tagBg: "rgba(34,197,94,0.08)", tagColor: "#86efac",
  inputBg: "rgba(0,0,0,0.4)", codeBg: "#040d04",
  navBg: "rgba(8,14,8,0.96)", shadow: "rgba(0,0,0,0.7)",
  grid: "rgba(34,197,94,0.03)", orb: "rgba(22,163,74,0.12)",
  sidebarBg: "rgba(4,9,4,0.98)",
};
const LIGHT = {
  bg: "#f0fdf4", bg2: "#dcfce7", surface: "#fff", card: "#fff",
  border: "rgba(22,163,74,0.2)", borderHov: "rgba(22,163,74,0.6)",
  text: "#052e16", textSub: "#374151", textMuted: "#6b7280",
  accent: "#16a34a", accentDim: "rgba(22,163,74,0.08)", accentGlow: "rgba(22,163,74,0.25)",
  tagBg: "rgba(22,163,74,0.08)", tagColor: "#15803d",
  inputBg: "rgba(255,255,255,0.9)", codeBg: "#f8fff8",
  navBg: "rgba(240,253,244,0.96)", shadow: "rgba(0,0,0,0.08)",
  grid: "rgba(22,163,74,0.04)", orb: "rgba(22,163,74,0.07)",
  sidebarBg: "rgba(240,253,244,0.99)",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const G = (t) => `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;font-size:16px}
body{background:${t.bg};color:${t.text};overflow-x:hidden;transition:background .35s,color .35s;font-family:'Rajdhani',sans-serif}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:${t.bg}}
::-webkit-scrollbar-thumb{background:linear-gradient(${t.accent},#4ade80);border-radius:3px}

@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideInLeft{from{opacity:0;transform:translateX(-100%)}to{opacity:1;transform:translateX(0)}}
@keyframes slideOutLeft{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-100%)}}
@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:none;opacity:1}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes orbit{from{transform:rotate(0deg) translateX(60px) rotate(0deg)}to{transform:rotate(360deg) translateX(60px) rotate(-360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes scanLine{0%{top:0%}100%{top:100%}}
@keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes neon{0%,100%{text-shadow:0 0 8px ${t.accent}66}50%{text-shadow:0 0 20px ${t.accent},0 0 40px ${t.accent}55}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 ${t.accentGlow}}50%{box-shadow:0 0 0 8px transparent}}
@keyframes ripple{to{transform:scale(4);opacity:0}}
@keyframes menuItemIn{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:none}}
@keyframes pageSlide{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes countUp{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}

.page-enter{animation:pageSlide .45s cubic-bezier(.4,0,.2,1) both}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 24px;border-radius:10px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:15px;cursor:pointer;border:none;transition:all .22s ease;position:relative;overflow:hidden;text-decoration:none;white-space:nowrap;letter-spacing:.4px;-webkit-tap-highlight-color:transparent}
.btn:active{transform:scale(.95)!important}
.btn-primary{background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;box-shadow:0 4px 20px ${t.accentGlow}}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px ${t.accentGlow};filter:brightness(1.07)}
.btn-outline{background:transparent;color:${t.accent};border:1.5px solid ${t.border}}
.btn-outline:hover{background:${t.accentDim};border-color:${t.accent};transform:translateY(-2px)}
.btn-ghost{background:${t.accentDim};color:${t.textSub};border:1px solid ${t.border}}
.btn-ghost:hover{color:${t.accent};border-color:${t.borderHov};transform:translateY(-2px)}
.btn-sm{padding:7px 16px;font-size:13px;border-radius:8px}
.btn-lg{padding:14px 32px;font-size:16px}
.btn-block{width:100%}

/* Sidebar nav links */
.sb-link{display:flex;align-items:center;gap:14px;padding:13px 20px;border-radius:12px;cursor:pointer;border:none;background:transparent;color:${t.textSub};font-family:'Rajdhani',sans-serif;font-weight:700;font-size:16px;width:100%;text-align:left;transition:all .2s ease;position:relative;overflow:hidden}
.sb-link::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(#16a34a,#22c55e);border-radius:0 3px 3px 0;transform:scaleY(0);transition:transform .2s}
.sb-link:hover{background:${t.accentDim};color:${t.text}}
.sb-link:hover::before{transform:scaleY(1)}
.sb-link.active{background:${t.accentDim};color:${t.accent}}
.sb-link.active::before{transform:scaleY(1)}

/* Footer links */
.foot-link{color:${t.textMuted};font-size:13px;font-weight:600;background:none;border:none;cursor:pointer;text-align:left;padding:3px 0;position:relative;display:inline-block;text-decoration:none;font-family:'Rajdhani',sans-serif;transition:color .2s}
.foot-link::after{content:'';position:absolute;left:0;bottom:-1px;width:0;height:1.5px;background:${t.accent};transition:width .25s ease}
.foot-link:hover{color:${t.accent}}
.foot-link:hover::after{width:100%}

@media(max-width:768px){
  .btn{padding:9px 18px;font-size:14px}
  .btn-lg{padding:12px 22px;font-size:15px}
  .hero-grid{grid-template-columns:1fr!important}
  .hero-right{display:none!important}
  .about-grid{grid-template-columns:1fr!important}
  .skills-grid{grid-template-columns:1fr!important}
  .projects-grid{grid-template-columns:1fr!important}
  .blog-grid{grid-template-columns:1fr!important}
  .footer-grid{grid-template-columns:1fr 1fr!important}
  .stat-grid{grid-template-columns:1fr 1fr!important}
  .contact-2col{grid-template-columns:1fr!important}
  .cal-2col{grid-template-columns:1fr!important}
  .card-flip{width:min(340px,92vw)!important;height:210px!important}
}
@media(max-width:480px){
  .footer-grid{grid-template-columns:1fr!important}
  .card-flip{height:240px!important}
}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const useInView = (th = .12) => {
  const ref = useRef(null); const [v, sv] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) sv(true) }, { threshold: th });
    if (ref.current) o.observe(ref.current); return () => o.disconnect();
  }, []);
  return [ref, v];
};

const FadeUp = ({ children, delay = 0, style: s = {} }) => {
  const [ref, v] = useInView();
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(28px)", transition: `opacity .65s ${delay}s ease,transform .65s ${delay}s ease`, ...s }}>{children}</div>;
};

const TypeWriter = ({ texts, speed = 75 }) => {
  const [d, sd] = useState(""); const [i, si] = useState(0); const [c, sc] = useState(0); const [del, sdl] = useState(false);
  useEffect(() => {
    const cur = texts[i];
    if (!del && c < cur.length) { const t = setTimeout(() => { sd(cur.slice(0, c + 1)); sc(x => x + 1) }, speed); return () => clearTimeout(t) }
    if (!del && c === cur.length) { const t = setTimeout(() => sdl(true), 2200); return () => clearTimeout(t) }
    if (del && c > 0) { const t = setTimeout(() => { sd(cur.slice(0, c - 1)); sc(x => x - 1) }, speed / 2); return () => clearTimeout(t) }
    if (del && c === 0) { sdl(false); si(x => (x + 1) % texts.length) }
  }, [c, del, i, texts, speed]);
  return <span>{d}<span style={{ animation: "blink 1s step-end infinite", color: "#22c55e" }}>|</span></span>;
};

const CountUp = ({ end, suffix = "" }) => {
  const [n, sn] = useState(0); const [ref, v] = useInView();
  useEffect(() => {
    if (!v) return;
    let s = 0; const step = end / 125;
    const t = setInterval(() => { s += step; if (s >= end) { sn(end); clearInterval(t) } else sn(Math.floor(s)) }, 16);
    return () => clearInterval(t);
  }, [v, end]);
  return <span ref={ref} style={{ display: "inline-block", animation: v ? "countUp .4s ease" : "none" }}>{n}{suffix}</span>;
};

// ─── SVG LOGO ─────────────────────────────────────────────────────────────────
const Logo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <defs>
      <radialGradient id="lg1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4ade80" /><stop offset="100%" stopColor="#15803d" /></radialGradient>
      <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#bbf7d0" /><stop offset="100%" stopColor="#22c55e" /></linearGradient>
    </defs>
    <circle cx="40" cy="40" r="36" fill="url(#lg1)" opacity=".88" />
    <ellipse cx="40" cy="40" rx="36" ry="16" stroke="#4ade8044" strokeWidth="1.5" fill="none" />
    <ellipse cx="40" cy="40" rx="16" ry="36" stroke="#4ade8044" strokeWidth="1.5" fill="none" />
    <line x1="4" y1="40" x2="76" y2="40" stroke="#4ade8033" strokeWidth="1.5" />
    <path d="M22 54L30 26L40 46L50 26L58 54" stroke="url(#lg2)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M52 24L62 28L58 18" stroke="url(#lg2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SKILLS = [
  { name: "Python", pct: 90, icon: "🐍", c: "#22c55e" }, { name: "Django", pct: 88, icon: "🎸", c: "#16a34a" },
  { name: "CSS", pct: 82, icon: "🎨", c: "#4ade80" }, { name: "React Native", pct: 78, icon: "⚛️", c: "#86efac" },
  { name: "Bootstrap", pct: 72, icon: "🅱️", c: "#34d399" }, { name: "PostgreSQL", pct: 85, icon: "🐘", c: "#22c55e" },
  { name: "JavaScript", pct: 80, icon: "⚡", c: "#a3e635" }, { name: "REST APIs", pct: 92, icon: "🔗", c: "#4ade80" },
  { name: "HTML5", pct: 70, icon: "🌐", c: "#86efac" },
];

const PROJECTS = [
  { id: 1, icon: "🛒", title: "FullStack E-Commerce Platform", desc: "End-to-end e-commerce with Django REST backend, React frontend, real-time inventory, Stripe payments & admin dashboard.", tags: ["Django", "React", "PostgreSQL", "Stripe", "Redis"], stats: { Commits: "240+", Users: "500+", Uptime: "99.9%" } },
  { id: 2, icon: "⛏️", title: "Mining Operations Platform", desc: "Custom client platform for real-time mining ops, equipment tracking, shift management & automated compliance reports.", tags: ["Python", "Flask", "PostgreSQL", "WebSockets", "Chart.js"], stats: { Sensors: "80+", Reports: "1000+", Efficiency: "+35%" } },
  { id: 3, icon: "🌐", title: "M.B.O WebDev Portfolio", desc: "This site — animated dark fintech portfolio with Django backend, meeting booking, blog, business card & animations.", tags: ["React", "Django", "PostgreSQL", "EmailJS", "Vite"], stats: { Animations: "25+", Score: "98/100", Load: "<1s" } },
];

const BLOGS = [
  { id: 1, slug: "django-rest-apis", tag: "Django", date: "Mar 2026", title: "Building REST APIs with Django Rest Framework", desc: "A deep dive into DRF viewsets, serializers, JWT auth and pagination — the patterns I use on every project.", readTime: "8 min", icon: "🎸", content: `Django REST Framework (DRF) is the gold standard for building APIs in Python. After 2+ years shipping production APIs, here are the patterns that actually matter.\n\n## ViewSets vs APIViews\n\nFor simple CRUD operations, ViewSets save you massive amounts of code. But for complex business logic, APIView gives you full control. I use APIView for anything beyond basic CRUD.\n\n## Serializers Are Your Contract\n\nYour serializer IS your API contract. Validate everything at the serializer level — never in views. Use nested serializers sparingly; they kill performance with N+1 queries.\n\n## JWT Authentication\n\nUse djangorestframework-simplejwt. Set access token expiry to 15 minutes, refresh to 7 days. Always blacklist tokens on logout.\n\n## Pagination\n\nAlways paginate. Use PageNumberPagination with a default of 20 items. Your API users will thank you when the dataset grows to 100k records.\n\n## The Patterns I Use Every Project\n\n1. Custom exception handler for consistent error responses\n2. API versioning from day one (/api/v1/)\n3. Throttling on public endpoints\n4. Filtering with django-filter\n5. Swagger docs with drf-yasg` },
  { id: 2, slug: "react-native-journey", tag: "React Native", date: "Feb 2026", title: "From Web Dev to Mobile: My React Native Journey", desc: "How a Django/React developer learned to ship production mobile apps on iOS and Android with a single codebase.", readTime: "6 min", icon: "📱", content: `Making the jump from web to mobile was one of the best decisions I made as a developer. Here's what I learned.\n\n## The Mental Shift\n\nThe biggest shift isn't the code — it's thinking in native constraints. No hover states. No right-click. Touch targets must be at least 44px. Network is unreliable.\n\n## Expo vs Bare React Native\n\nStart with Expo. You can always eject later. Expo Go makes development 10x faster for prototyping. When you need custom native modules, that's when you graduate to bare React Native.\n\n## State Management\n\nZustand is my go-to for React Native. Lightweight, simple, works perfectly. Redux is overkill for most apps. React Query handles server state beautifully.\n\n## Navigation\n\nReact Navigation is the standard. Use a stack navigator for normal flows, tab navigator for main sections, and drawer for settings. Nest them thoughtfully.\n\n## What Surprised Me\n\nStyling with StyleSheet.create() is actually enjoyable. Flexbox everywhere. No CSS cascade to fight. The result is more predictable UI.` },
  { id: 3, slug: "postgresql-indexing", tag: "PostgreSQL", date: "Jan 2026", title: "PostgreSQL Indexing Strategies That Actually Matter", desc: "The indexing mistakes I made early on and the patterns that took my query times from 3s to under 50ms.", readTime: "10 min", icon: "🐘", content: `Database performance is where good apps become great apps. Here's what I learned the hard way.\n\n## The Query That Started It All\n\nA mining operations dashboard query was taking 3.2 seconds. 50,000 rows. No index on the date filter column. Adding a single B-tree index dropped it to 12ms.\n\n## When to Index\n\nIndex columns that appear in WHERE clauses, JOIN conditions, and ORDER BY. Don't index columns with low cardinality (like boolean flags). Every index slows down writes.\n\n## Composite Indexes\n\nOrder matters. Put the highest-cardinality column first. An index on (user_id, created_at) helps queries filtering by user_id, but not queries filtering only by created_at.\n\n## EXPLAIN ANALYZE Is Your Best Friend\n\nRun EXPLAIN ANALYZE before and after every optimization. Look for Sequential Scans on large tables — those are your optimization targets.\n\n## Partial Indexes\n\nFor tables with soft deletes, create partial indexes: CREATE INDEX idx_active ON orders(user_id) WHERE deleted_at IS NULL. Half the size, twice as fast for active record queries.\n\n## Connection Pooling\n\nAlways use PgBouncer in production. Django's connection handling is not designed for thousands of concurrent users. PgBouncer saved one of my clients $200/month in server costs.` },
];

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "about", label: "About", icon: "👤" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "projects", label: "Projects", icon: "🚀" },
  { id: "blog", label: "Blog", icon: "✍️" },
  { id: "book-meeting", label: "Book Meeting", icon: "📅" },
  { id: "contact", label: "Contact", icon: "📬" },
];
const TIMES = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── ANIMATED SIDEBAR ─────────────────────────────────────────────────────────
const Sidebar = ({ open, onClose, active, go, t, dark, setDark }) => {
  const [hovItem, setHov] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const tm = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(tm);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", opacity: open ? 1 : 0, transition: "opacity .35s ease" }} />

      {/* Sidebar panel */}
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 999, width: "min(300px,85vw)", background: t.sidebarBg, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform .38s cubic-bezier(.4,0,.2,1)", boxShadow: `8px 0 40px ${t.shadow}` }}>

        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={34} />
            <div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 14, fontWeight: 900, color: t.text, letterSpacing: 2 }}>M.B.O</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, color: t.accent, fontWeight: 700, letterSpacing: 3 }}>WEBDEV</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: t.accentDim, border: `1px solid ${t.border}`, borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: t.textSub, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.borderHov }}
            onMouseLeave={e => { e.currentTarget.style.color = t.textSub; e.currentTarget.style.borderColor = t.border }}>✕</button>
        </div>

        {/* Scan line effect */}
        <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${t.accent}44,transparent)`, animation: "scanLine 4s linear infinite", pointerEvents: "none" }} />

        {/* Nav links */}
        <div style={{ flex: 1, padding: "12px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item, i) => (
            <button key={item.id}
              className={`sb-link${active === item.label ? " active" : ""}`}
              style={{ animationDelay: `${i * 0.06}s`, animation: open ? `menuItemIn .4s ${i * 0.06}s both` : "none" }}
              onMouseEnter={() => setHov(item.id)} onMouseLeave={() => setHov(null)}
              onClick={() => { go(item.id); onClose() }}>
              <span style={{ fontSize: 18, transition: "transform .2s", transform: hovItem === item.id ? "scale(1.2)" : "none" }}>{item.icon}</span>
              <span>{item.label}</span>
              {active === item.label && (
                <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: t.accent, boxShadow: `0 0 8px ${t.accent}` }} />
              )}
            </button>
          ))}
        </div>

        {/* Bottom section */}
        <div style={{ padding: "16px 12px", borderTop: `1px solid ${t.border}` }}>
          {/* Dark/Light toggle */}
          <button onClick={() => setDark(d => !d)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", background: t.accentDim, border: `1px solid ${t.border}`, borderRadius: 10, cursor: "pointer", marginBottom: 10, transition: "all .2s", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, color: t.textSub, fontSize: 14 }}>
            <span style={{ fontSize: 18 }}>{dark ? "☀️" : "🌙"}</span>
            <span>{dark ? "Light Mode" : "Dark Mode"}</span>
          </button>
          {/* Available badge */}
          <div style={{ background: t.accentDim, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: t.accent, fontWeight: 700, animation: "pulse 2s ease infinite" }}>🟢 Available for Work</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: t.textMuted, marginTop: 3 }}>Abuja, Nigeria 🇳🇬</div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({ active, go, t, dark, setDark, sidebarOpen, setSidebar }) => {
  const [sc, setSc] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h) }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: sc ? t.navBg : "transparent", backdropFilter: sc ? "blur(20px)" : "none", borderBottom: sc ? `1px solid ${t.border}` : "none", transition: "all .4s ease" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(14px,4vw,56px)", display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
        <button onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <Logo size={36} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 15, fontWeight: 900, color: t.text, letterSpacing: 2 }}>M.B.O</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, color: t.accent, fontWeight: 700, letterSpacing: 3, marginTop: -2 }}>WEBDEV</div>
          </div>
        </button>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 2, alignItems: "center" }} className="desk-nav-bar">
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => go(n.id)} style={{ background: active === n.label ? "rgba(34,197,94,0.12)" : "transparent", border: `1px solid ${active === n.label ? "rgba(34,197,94,0.35)" : "transparent"}`, color: active === n.label ? t.accent : t.textSub, padding: "6px 13px", borderRadius: 8, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 700, transition: "all .2s", letterSpacing: .3 }}
              onMouseEnter={e => { if (active !== n.label) { e.currentTarget.style.color = t.text; e.currentTarget.style.background = t.accentDim } }}
              onMouseLeave={e => { if (active !== n.label) { e.currentTarget.style.color = t.textSub; e.currentTarget.style.background = "transparent" } }}>
              {n.label}
            </button>
          ))}
          <button onClick={() => setDark(d => !d)} style={{ marginLeft: 6, background: t.accentDim, border: `1px solid ${t.border}`, borderRadius: 9, padding: "7px 11px", cursor: "pointer", fontSize: 15, transition: "all .2s", color: t.textSub }}>{dark ? "☀️" : "🌙"}</button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setSidebar(s => !s)} className="mob-menu-btn" style={{ background: t.accentDim, border: `1px solid ${t.border}`, borderRadius: 9, width: 40, height: 40, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, transition: "all .2s", padding: 0 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: "block", width: 20, height: 2, background: sidebarOpen && i === 1 ? "transparent" : t.accent, borderRadius: 2, transition: "all .3s", transform: sidebarOpen ? i === 0 ? "rotate(45deg) translateY(7px)" : i === 2 ? "rotate(-45deg) translateY(-7px)" : "none" : "none" }} />
          ))}
        </button>
      </div>
      <style>{`
        @media(min-width:769px){.mob-menu-btn{display:none!important}.desk-nav-bar{display:flex!important}}
        @media(max-width:768px){.mob-menu-btn{display:flex!important}.desk-nav-bar{display:none!important}}
      `}</style>
    </nav>
  );
};

// ─── PAGE TRANSITION WRAPPER ──────────────────────────────────────────────────
const PageWrap = ({ children }) => (
  <div className="page-enter" style={{ minHeight: "100vh" }}>{children}</div>
);

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ go, t }) => (
  <PageWrap>
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px clamp(16px,5vw,72px) 60px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${t.grid} 1px,transparent 1px),linear-gradient(90deg,${t.grid} 1px,transparent 1px)`, backgroundSize: "50px 50px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "15%", right: "5%", width: "min(500px,50vw)", height: "min(500px,50vw)", borderRadius: "50%", background: `radial-gradient(circle,${t.orb} 0%,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,rgba(34,197,94,0.3),transparent)`, animation: "scanLine 6s linear infinite", pointerEvents: "none" }} />

      <div className="hero-grid" style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,72px)", alignItems: "center" }}>
        <div style={{ animation: "fadeUp .7s ease both" }}>
          <div style={{ marginBottom: 18 }}>
            <span style={{ background: t.accentDim, border: `1px solid ${t.border}`, color: t.accent, padding: "5px 15px", borderRadius: 20, fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, animation: "pulse 2.5s ease infinite" }}>
              🟢 &nbsp;Available for Projects
            </span>
          </div>
          <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(26px,4vw,54px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 10, color: t.text }}>
            MAHMUD<br />
            <span style={{ background: "linear-gradient(135deg,#22c55e,#4ade80,#86efac)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradShift 4s ease infinite" }}>BASHIR</span>
            <br /><span style={{ fontSize: "clamp(16px,2.2vw,30px)", color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>OLASUNKANMI</span>
          </h1>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(14px,1.7vw,19px)", color: t.textSub, marginBottom: 22, fontWeight: 600 }}>
            <TypeWriter texts={["Full Stack Developer", "Django Backend Expert", "React Native Engineer", "Flutter Developer", "API Architect", "Frontend Engineer"]} />
          </div>
          <p style={{ color: t.textSub, lineHeight: 1.9, fontSize: "clamp(13px,1.1vw,15px)", maxWidth: 500, marginBottom: 30, fontFamily: "'Rajdhani',sans-serif" }}>
            Turning ideas into fast, elegant web solutions. I build production-grade apps with Python, Django, React Native & Bootstrap — from API design to pixel-perfect UI.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => go("projects")}>View My Work ↗</button>
            <button className="btn btn-outline btn-lg" onClick={() => go("book-meeting")}>📅 Book Meeting</button>
            <button className="btn btn-ghost btn-lg" onClick={() => go("contact")}>Contact</button>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 26, flexWrap: "wrap" }}>
            <a href="https://github.com/Muhamzy-ui/" target="_blank" rel="noreferrer" style={{ color: t.textMuted, fontSize: 11, fontFamily: "'Rajdhani',sans-serif", textDecoration: "none", fontWeight: 700, borderBottom: `1px solid ${t.border}`, paddingBottom: 2, transition: "color .2s,border-color .2s", letterSpacing: .4 }}
              onMouseEnter={e => { e.target.style.color = t.accent; e.target.style.borderColor = t.accent }}
              onMouseLeave={e => { e.target.style.color = t.textMuted; e.target.style.borderColor = t.border }}>GitHub</a>
            <a href="https://www.linkedin.com/in/mahmud-olasunkanmi-29b231384" target="_blank" rel="noreferrer" style={{ color: t.textMuted, fontSize: 11, fontFamily: "'Rajdhani',sans-serif", textDecoration: "none", fontWeight: 700, borderBottom: `1px solid ${t.border}`, paddingBottom: 2, transition: "color .2s,border-color .2s", letterSpacing: .4 }}
              onMouseEnter={e => { e.target.style.color = t.accent; e.target.style.borderColor = t.accent }}
              onMouseLeave={e => { e.target.style.color = t.textMuted; e.target.style.borderColor = t.border }}>LinkedIn</a>
            <a href="https://www.upwork.com/freelancers/~01f2b4dad5de734c99?companyReference=2006793770054802967&mp_source=share" target="_blank" rel="noreferrer" style={{ color: t.textMuted, fontSize: 11, fontFamily: "'Rajdhani',sans-serif", textDecoration: "none", fontWeight: 700, borderBottom: `1px solid ${t.border}`, paddingBottom: 2, transition: "color .2s,border-color .2s", letterSpacing: .4 }}
              onMouseEnter={e => { e.target.style.color = t.accent; e.target.style.borderColor = t.accent }}
              onMouseLeave={e => { e.target.style.color = t.textMuted; e.target.style.borderColor = t.border }}>Upwork</a>
            <a href="https://wa.me/2348072410373" target="_blank" rel="noreferrer" style={{ color: t.textMuted, fontSize: 11, fontFamily: "'Rajdhani',sans-serif", textDecoration: "none", fontWeight: 700, borderBottom: `1px solid ${t.border}`, paddingBottom: 2, transition: "color .2s,border-color .2s", letterSpacing: .4 }}
              onMouseEnter={e => { e.target.style.color = t.accent; e.target.style.borderColor = t.accent }}
              onMouseLeave={e => { e.target.style.color = t.textMuted; e.target.style.borderColor = t.border }}>WhatsApp</a>
          </div>
        </div>

        <div className="hero-right" style={{ display: "flex", justifyContent: "center", animation: "slideInRight .8s ease both" }}>
          <div style={{ position: "relative", width: "clamp(240px,30vw,320px)" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", width: 220, height: 220, marginLeft: -110, marginTop: -110, borderRadius: "50%", border: `1px solid ${t.border}`, pointerEvents: "none" }}>
              <div style={{ position: "absolute", width: 9, height: 9, background: t.accent, borderRadius: "50%", boxShadow: `0 0 12px ${t.accent}`, animation: "orbit 4s linear infinite", top: "50%", left: "50%", marginLeft: -4.5, marginTop: -4.5 }} />
            </div>
            <div style={{ background: t.card, border: `1px solid ${t.borderHov}`, borderRadius: 22, padding: 24, boxShadow: `0 20px 70px ${t.shadow},0 0 36px ${t.accentGlow}`, animation: "floatY 5s ease-in-out infinite" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <Logo size={44} />
                <div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 18, fontWeight: 900, color: t.text }}>M.B.O</div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, color: t.accent, fontWeight: 700, letterSpacing: 3 }}>WEBDEV</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[{ v: "2+", l: "Yrs Exp" }, { v: "3+", l: "Projects" }, { v: "100%", l: "Client Sat." }, { v: "500+", l: "Commits" }].map(s => (
                  <div key={s.l} style={{ background: t.accentDim, border: `1px solid ${t.border}`, borderRadius: 9, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 15, fontWeight: 900, color: t.accent }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", marginTop: 2, fontWeight: 600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 12 }}>
                <div style={{ fontSize: 9, color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", marginBottom: 7, fontWeight: 700, letterSpacing: 2 }}>TECH STACK</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {["🐍 Python", "🎸 Django", "⚛️ React", "🅱️ Bootstrap"].map(tag => (
                    <span key={tag} style={{ background: t.tagBg, border: `1px solid ${t.border}`, color: t.tagColor, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700 }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PageWrap>
);

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const BusinessCard = ({ t }) => {
  const [flip, setFlip] = useState(false);
  return (
    <FadeUp delay={.15}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: t.textMuted, letterSpacing: 2, fontWeight: 700 }}>TAP TO FLIP</p>
        <div className="card-flip" onClick={() => setFlip(f => !f)} style={{ width: "min(460px,90vw)", height: 260, perspective: 1100, cursor: "pointer" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform .7s cubic-bezier(.4,.2,.2,1)", transform: flip ? "rotateY(180deg)" : "none" }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: `linear-gradient(145deg,${t.surface},${t.bg2})`, border: `1px solid ${t.borderHov}`, borderRadius: 16, padding: 24, boxShadow: `0 20px 60px ${t.shadow},0 0 36px ${t.accentGlow}`, overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: -30, right: -30, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(${t.orb},transparent 70%)` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}><Logo size={38} /><div><div style={{ fontFamily: "'Orbitron',monospace", fontSize: 16, fontWeight: 900, color: t.text }}>M.B.O</div><div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, color: t.accent, fontWeight: 700, letterSpacing: 3 }}>WEBDEV</div></div></div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(15px,2.5vw,19px)", fontWeight: 700, color: t.text, marginBottom: 4 }}>Mahmud Bashir Olasunkanmi</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, color: t.accent, fontWeight: 600, marginBottom: 12 }}>Full Stack Developer &nbsp;|&nbsp; Frontend Engineer</div>
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 10, fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: t.textMuted, fontStyle: "italic" }}>"Turning ideas into fast, elegant web solutions"</div>
            </div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: `linear-gradient(145deg,${t.bg2},${t.surface})`, border: `1px solid ${t.border}`, borderRadius: 16, padding: 22, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 14px", marginBottom: 12 }}>
                {[["📞", "08072410373 / 08103205866"], ["📧", "mahmudolasunkami895@gmail.com"], ["📍", "Abuja, Nigeria 🇳🇬"], ["🐙", "GitHub: Muhamzy-ui"], ["💼", "LinkedIn: mahmud-olasunkanmi"]].map(([ic, v]) => (
                  <div key={ic} style={{ display: "flex", gap: 6, fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(10px,1.5vw,12px)", color: t.textSub, fontWeight: 600, alignItems: "flex-start" }}><span style={{ flexShrink: 0 }}>{ic}</span><span>{v}</span></div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 10 }}>
                <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, color: t.textMuted, fontWeight: 700, letterSpacing: 2, marginRight: 8 }}>TECH STACK</span>
                {["JS", "React", "HTML5", "Django", "Python", "Bootstrap"].map(tag => (
                  <span key={tag} style={{ background: t.tagBg, color: t.tagColor, padding: "2px 7px", borderRadius: 4, fontSize: 10, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, marginRight: 4 }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setFlip(f => !f)}>{flip ? "← Show Front" : "Show Back →"}</button>
      </div>
    </FadeUp>
  );
};

const About = ({ t }) => (
  <PageWrap>
    <section id="about" style={{ padding: "100px clamp(16px,5vw,72px)", background: t.bg2 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeUp><div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", color: t.accent, fontSize: 11, letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>// ABOUT_ME</div>
          <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(22px,4vw,40px)", color: t.text }}>Who I Am</h2>
        </div></FadeUp>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)", alignItems: "start" }}>
          <FadeUp delay={.1}>
            <div style={{ background: t.codeBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: 24, fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.2vw,13px)", lineHeight: 2, overflowX: "auto" }}>
              <div style={{ color: t.accent, fontSize: 10, letterSpacing: 2, marginBottom: 4 }}># developer_profile.py</div>
              <div><span style={{ color: "#818cf8" }}>class</span> <span style={{ color: "#fbbf24" }}>MBOWebDev</span>:</div>
              <div style={{ paddingLeft: 16 }}>
                {[["name", "Mahmud Bashir Olasunkanmi"], ["brand", "M.B.O WebDev"], ["location", "Abuja, Nigeria 🇳🇬"], ["experience", "2.5 years"]].map(([k, v]) => (
                  <div key={k}><span style={{ color: t.textSub }}>{k} = </span><span style={{ color: "#4ade80" }}>"{v}"</span></div>
                ))}
                <div><span style={{ color: t.textSub }}>stack = [</span></div>
                <div style={{ paddingLeft: 16 }}>{["Python", "Django", "CSS", "React Native", "Bootstrap", "PostgreSQL", "HTML5"].map(s => (
                  <div key={s}><span style={{ color: "#4ade80" }}>"{s}"</span><span style={{ color: t.textSub }}>,</span></div>
                ))}</div>
                <div><span style={{ color: t.textSub }}>]</span></div>
                <div><span style={{ color: t.textSub }}>available = </span><span style={{ color: t.accent }}>True</span></div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={.2}>
            <h3 style={{ fontFamily: "'Orbitron',monospace", color: t.text, fontSize: "clamp(17px,2.2vw,24px)", marginBottom: 12 }}>Building things that <span style={{ color: t.accent }}>work</span>.</h3>
            <p style={{ color: t.textSub, lineHeight: 1.9, marginBottom: 12, fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(13px,1.1vw,15px)" }}>I'm <strong style={{ color: t.text }}>Mahmud Bashir Olasunkanmi</strong>, founder of <strong style={{ color: t.accent }}>M.B.O WebDev</strong>. Based in Abuja, Nigeria — available globally for remote work, freelance, and full-time.</p>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 22 }}>
              {["Remote-First", "API Design", "Mobile Dev", "DB Architecture", "Client Work", "Agile"].map(tag => (
                <span key={tag} style={{ background: t.tagBg, border: `1px solid ${t.border}`, color: t.tagColor, padding: "4px 11px", borderRadius: 20, fontSize: 11, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700 }}>{tag}</span>
              ))}
            </div>
            <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[{ v: 3, s: "+", l: "Projects" }, { v: 8, s: "+", l: "Tech" }, { v: 100, s: "%", l: "Satisfaction" }].map(s => (
                <div key={s.l} style={{ background: t.accentDim, border: `1px solid ${t.border}`, borderRadius: 11, padding: "13px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 19, fontWeight: 900, color: t.accent }}><CountUp end={s.v} suffix={s.s} /></div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, color: t.textMuted, fontWeight: 700, marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
        <div style={{ marginTop: 68 }}>
          <FadeUp><div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", color: t.accent, fontSize: 11, letterSpacing: 3, fontWeight: 700, marginBottom: 6 }}>// BUSINESS_CARD</div>
            <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(18px,2.5vw,26px)", color: t.text }}>My Card</h3>
          </div></FadeUp>
          <BusinessCard t={t} />
        </div>
      </div>
    </section>
  </PageWrap>
);

// ─── SKILLS ───────────────────────────────────────────────────────────────────
const Skills = ({ t }) => (
  <PageWrap>
    <section id="skills" style={{ padding: "100px clamp(16px,5vw,72px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeUp><div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", color: t.accent, fontSize: 11, letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>// SKILLS.json</div>
          <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(22px,4vw,40px)", color: t.text }}>Tech Stack</h2>
        </div></FadeUp>
        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 13 }}>
          {SKILLS.map((s, i) => <SkillCard key={s.name} s={s} delay={i * .06} t={t} />)}
        </div>
      </div>
    </section>
  </PageWrap>
);

const SkillCard = ({ s, delay, t }) => {
  const [ref, v] = useInView(); const [hov, sh] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{ background: hov ? t.accentDim : t.card, border: `1px solid ${hov ? t.borderHov : t.border}`, borderRadius: 13, padding: "15px 18px", transition: "all .28s ease", transform: hov ? "translateY(-4px)" : "none", boxShadow: hov ? `0 10px 30px ${t.accentGlow}` : "none", opacity: v ? 1 : 0, transitionDelay: `${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 11 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 17 }}>{s.icon}</span><span style={{ fontFamily: "'Rajdhani',sans-serif", color: t.text, fontWeight: 700, fontSize: 14 }}>{s.name}</span></div>
        <span style={{ fontFamily: "'Orbitron',monospace", color: s.c, fontSize: 12, fontWeight: 700 }}>{s.pct}%</span>
      </div>
      <div style={{ background: t.bg, borderRadius: 7, height: 5, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 7, background: `linear-gradient(90deg,${s.c}88,${s.c})`, width: v ? `${s.pct}%` : "0%", transition: `width 1.2s cubic-bezier(.4,0,.2,1) ${delay + .1}s`, boxShadow: `0 0 8px ${s.c}77` }} />
      </div>
    </div>
  );
};

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const Projects = ({ t }) => (
  <PageWrap>
    <section id="projects" style={{ padding: "100px clamp(16px,5vw,72px)", background: t.bg2 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeUp><div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", color: t.accent, fontSize: 11, letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>// PORTFOLIO.py</div>
          <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(22px,4vw,40px)", color: t.text }}>Featured Projects</h2>
        </div></FadeUp>
        <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {PROJECTS.map((p, i) => <FadeUp key={p.id} delay={i * .1}><ProjectCard p={p} t={t} /></FadeUp>)}
        </div>
      </div>
    </section>
  </PageWrap>
);

const ProjectCard = ({ p, t }) => {
  const [hov, sh] = useState(false);
  return (
    <div onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{ background: t.card, border: `1px solid ${hov ? t.borderHov : t.border}`, borderRadius: 18, overflow: "hidden", transition: "all .32s ease", transform: hov ? "translateY(-7px)" : "none", boxShadow: hov ? `0 20px 50px ${t.shadow},0 0 26px ${t.accentGlow}` : `0 4px 16px ${t.shadow}`, display: "flex", flexDirection: "column" }}>
      <div style={{ background: t.accentDim, borderBottom: `1px solid ${t.border}`, padding: "18px 22px", display: "flex", gap: 13, alignItems: "center" }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: t.accentDim, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{p.icon}</div>
        <div><div style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(11px,1.3vw,13px)", fontWeight: 700, color: t.text }}>{p.title}</div><div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, color: t.textMuted, fontWeight: 600, marginTop: 2 }}>M.B.O WEBDEV</div></div>
      </div>
      <div style={{ padding: "18px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ color: t.textSub, lineHeight: 1.8, fontSize: "clamp(12px,1vw,13px)", marginBottom: 14, fontFamily: "'Rajdhani',sans-serif" }}>{p.desc}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 13 }}>
          {Object.entries(p.stats).map(([k, v]) => (
            <div key={k} style={{ background: t.accentDim, borderRadius: 7, padding: "7px 9px", flex: 1, textAlign: "center" }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 12, fontWeight: 900, color: t.accent }}>{v}</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, color: t.textMuted, fontWeight: 600 }}>{k}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
          {p.tags.map(tag => <span key={tag} style={{ background: t.tagBg, border: `1px solid ${t.border}`, color: t.tagColor, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700 }}>{tag}</span>)}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <a href="#" className="btn btn-ghost btn-sm" style={{ flex: 1 }}>GitHub ↗</a>
          <a href="#" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Live Demo ↗</a>
        </div>
      </div>
    </div>
  );
};

// ─── BLOG LIST PAGE ───────────────────────────────────────────────────────────
const Blog = ({ t, go }) => {
  const [filter, setFilter] = useState("All");
  const tags = ["All", ...[...new Set(BLOGS.map(b => b.tag))]];
  const shown = filter === "All" ? BLOGS : BLOGS.filter(b => b.tag === filter);

  return (
    <PageWrap>
      <section id="blog" style={{ padding: "100px clamp(16px,5vw,72px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeUp><div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", color: t.accent, fontSize: 11, letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>// BLOG.posts()</div>
            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(22px,4vw,40px)", color: t.text }}>Latest Articles</h2>
            <p style={{ color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", marginTop: 10, fontSize: 14 }}>Technical write-ups & lessons from production</p>
          </div></FadeUp>

          {/* Filter tabs */}
          <FadeUp delay={.1}>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
              {tags.map(tag => (
                <button key={tag} onClick={() => setFilter(tag)} className={filter === tag ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"} style={{ minWidth: 70 }}>{tag}</button>
              ))}
            </div>
          </FadeUp>

          <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {shown.map((b, i) => (
              <FadeUp key={b.id} delay={i * .08}>
                <BlogCard b={b} t={t} go={go} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </PageWrap>
  );
};

const BlogCard = ({ b, t, go }) => {
  const [hov, sh] = useState(false);
  return (
    <div onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{ background: t.card, border: `1px solid ${hov ? t.borderHov : t.border}`, borderRadius: 18, padding: "22px 24px", transition: "all .32s ease", transform: hov ? "translateY(-6px)" : "none", boxShadow: hov ? `0 18px 48px ${t.shadow},0 0 22px ${t.accentGlow}` : `0 4px 14px ${t.shadow}`, cursor: "pointer", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "flex-start" }}>
        <span style={{ background: t.tagBg, border: `1px solid ${t.border}`, color: t.tagColor, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700 }}>{b.tag}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>{b.readTime} read</span><span style={{ fontSize: 17 }}>{b.icon}</span></div>
      </div>
      <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(12px,1.3vw,13px)", fontWeight: 700, color: t.text, marginBottom: 10, lineHeight: 1.45 }}>{b.title}</h3>
      <p style={{ color: t.textSub, lineHeight: 1.8, fontSize: "clamp(12px,1vw,13px)", marginBottom: 18, fontFamily: "'Rajdhani',sans-serif", flex: 1 }}>{b.desc}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>{b.date}</span>
        <button className="btn btn-outline btn-sm" onClick={() => go(`blog/${b.slug}`)}>Read More →</button>
      </div>
    </div>
  );
};

// ─── BLOG DETAIL PAGE ─────────────────────────────────────────────────────────
const BlogDetail = ({ slug, t, go }) => {
  const post = BLOGS.find(b => b.slug === slug);
  useEffect(() => { window.scrollTo(0, 0) }, [slug]);
  if (!post) return <PageWrap><div style={{ padding: "120px 24px", textAlign: "center" }}><h2 style={{ color: t.text }}>Post not found</h2><button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => go("blog")}>← Back to Blog</button></div></PageWrap>;

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <PageWrap>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "100px clamp(16px,5vw,40px) 80px" }}>
        <FadeUp>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 28 }} onClick={() => go("blog")}>← Back to Blog</button>
        </FadeUp>
        <FadeUp delay={.05}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
            <span style={{ background: t.tagBg, border: `1px solid ${t.border}`, color: t.tagColor, padding: "3px 12px", borderRadius: 20, fontSize: 12, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700 }}>{post.tag}</span>
            <span style={{ color: t.textMuted, fontSize: 12, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>{post.date}</span>
            <span style={{ color: t.textMuted, fontSize: 12, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>· {post.readTime} read</span>
          </div>
        </FadeUp>
        <FadeUp delay={.1}>
          <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(20px,3.5vw,34px)", fontWeight: 900, color: t.text, lineHeight: 1.25, marginBottom: 24 }}>{post.icon} {post.title}</h1>
        </FadeUp>
        <FadeUp delay={.15}>
          <p style={{ color: t.textSub, fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(14px,1.3vw,16px)", lineHeight: 1.9, marginBottom: 28, fontStyle: "italic", borderLeft: `3px solid ${t.accent}`, paddingLeft: 16 }}>{post.desc}</p>
        </FadeUp>
        <FadeUp delay={.2}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: "clamp(20px,4vw,36px)" }}>
            {paragraphs.map((para, i) => {
              if (para.startsWith("## ")) {
                return <h2 key={i} style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(14px,1.8vw,18px)", color: t.accent, fontWeight: 700, margin: "24px 0 12px", borderBottom: `1px solid ${t.border}`, paddingBottom: 8 }}>{para.replace("## ", "")}</h2>;
              }
              return <p key={i} style={{ color: t.textSub, fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(13px,1.1vw,15px)", lineHeight: 1.9, marginBottom: 16 }}>{para}</p>;
            })}
          </div>
        </FadeUp>
        <FadeUp delay={.25}>
          <div style={{ marginTop: 32, padding: "20px 24px", background: t.accentDim, border: `1px solid ${t.border}`, borderRadius: 14, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <Logo size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 13, fontWeight: 900, color: t.text }}>Mahmud Bashir Olasunkanmi</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: t.textMuted, marginTop: 2 }}>Full Stack Developer · M.B.O WebDev</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => go("contact")}>Hire Me →</button>
          </div>
        </FadeUp>
        <FadeUp delay={.3}>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: t.textMuted, fontWeight: 700, letterSpacing: 2, marginBottom: 14 }}>MORE ARTICLES</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {BLOGS.filter(b => b.slug !== slug).map(b => (
                <button key={b.id} className="btn btn-ghost btn-sm" onClick={() => go(`blog/${b.slug}`)} style={{ textAlign: "left", maxWidth: 280 }}>{b.icon} {b.title.substring(0, 45)}...</button>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </PageWrap>
  );
};

// ─── ALL ARTICLES PAGE ────────────────────────────────────────────────────────
const AllArticles = ({ t, go }) => (
  <PageWrap>
    <div style={{ padding: "100px clamp(16px,5vw,72px) 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeUp>
          <div style={{ marginBottom: 16 }}><button className="btn btn-ghost btn-sm" onClick={() => go("blog")}>← Back to Blog</button></div>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", color: t.accent, fontSize: 11, letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>// ALL_POSTS</div>
            <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(22px,4vw,40px)", color: t.text }}>All Articles</h1>
            <p style={{ color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", marginTop: 10, fontSize: 14 }}>{BLOGS.length} articles published</p>
          </div>
        </FadeUp>
        <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {BLOGS.map((b, i) => <FadeUp key={b.id} delay={i * .08}><BlogCard b={b} t={t} go={go} /></FadeUp>)}
        </div>
      </div>
    </div>
  </PageWrap>
);

// ─── BOOKING ──────────────────────────────────────────────────────────────────
const BookMeeting = ({ t }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selDate, setSel] = useState(null);
  const [selTime, setSelT] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", topic: "", notes: "" });
  const [step, setStep] = useState(1);
  const [booked, setBooked] = useState(false);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array(daysInMonth).fill(0).map((_, i) => i + 1)];
  const isPast = d => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isWknd = d => { const dy = new Date(year, month, d).getDay(); return dy === 0 || dy === 6 };

  const inp = { background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 9, padding: "11px 14px", color: t.text, fontFamily: "'Rajdhani',sans-serif", fontSize: 14, outline: "none", width: "100%", transition: "border-color .2s", boxSizing: "border-box" };
  const lbl = { fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: t.textMuted, fontWeight: 700, letterSpacing: 1.5, display: "block", marginBottom: 6 };
  const reset = () => { setSel(null); setSelT(null); setForm({ name: "", email: "", topic: "", notes: "" }); setStep(1); setBooked(false) };

  return (
    <PageWrap>
      <section id="book-meeting" style={{ padding: "100px clamp(16px,5vw,72px)", background: t.bg2 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeUp><div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", color: t.accent, fontSize: 11, letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>// CALENDAR.schedule()</div>
            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(22px,4vw,40px)", color: t.text }}>Book a Meeting</h2>
            <p style={{ color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", marginTop: 10, fontSize: 14 }}>Mon–Fri · 9AM–5PM WAT · Abuja, Nigeria</p>
          </div></FadeUp>

          {booked ? (
            <FadeUp><div style={{ background: t.card, border: `1px solid ${t.borderHov}`, borderRadius: 22, padding: "clamp(28px,5vw,52px)", textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "'Orbitron',monospace", color: t.accent, fontSize: "clamp(16px,2.5vw,22px)", marginBottom: 10 }}>Meeting Booked!</h3>
              <p style={{ color: t.textSub, fontFamily: "'Rajdhani',sans-serif", fontSize: 15, lineHeight: 2 }}>
                <strong style={{ color: t.text }}>{form.name}</strong> · {MONTHS[month]} {selDate}, {year} · {selTime}<br />
                Confirmation → <strong style={{ color: t.accent }}>{form.email}</strong>
              </p>
              <button className="btn btn-outline" style={{ marginTop: 22 }} onClick={reset}>← Book Another</button>
            </div></FadeUp>
          ) : (
            <FadeUp delay={.1}>
              <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 22, padding: "clamp(18px,4vw,36px)" }}>
                {/* Steps indicator */}
                <div style={{ display: "flex", justifyContent: "center", gap: "clamp(10px,2vw,22px)", marginBottom: 28, flexWrap: "wrap" }}>
                  {[["1", "Date"], ["2", "Time"], ["3", "Details"]].map(([n, l], idx) => (
                    <div key={n} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: step > idx || step === idx + 1 ? "linear-gradient(135deg,#16a34a,#22c55e)" : "transparent", border: step <= idx ? `1px solid ${t.border}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron',monospace", fontSize: 11, fontWeight: 900, color: step > idx || step === idx + 1 ? "#fff" : t.textMuted }}>
                        {step > idx + 1 ? "✓" : n}
                      </div>
                      <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 700, color: step === idx + 1 ? t.accent : t.textMuted }}>{l}</span>
                      {idx < 2 && <span style={{ color: t.border, fontSize: 14 }}>›</span>}
                    </div>
                  ))}
                </div>

                {step === 1 && <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }}>‹</button>
                    <span style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(12px,1.8vw,14px)", fontWeight: 700, color: t.text }}>{MONTHS[month]} {year}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }}>›</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 6 }}>
                    {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: t.textMuted, fontWeight: 700, padding: "4px 0" }}>{d}</div>)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
                    {cells.map((d, i) => (
                      <button key={i} disabled={!d || isPast(d) || isWknd(d)} onClick={() => { setSel(d); setStep(2) }}
                        style={{ background: selDate === d ? "linear-gradient(135deg,#16a34a,#22c55e)" : !d || isPast(d) || isWknd(d) ? "transparent" : t.accentDim, border: `1px solid ${selDate === d ? "transparent" : !d || isPast(d) || isWknd(d) ? "transparent" : t.border}`, borderRadius: 7, padding: "clamp(5px,1.5vw,9px) 0", cursor: !d || isPast(d) || isWknd(d) ? "default" : "pointer", color: !d ? "transparent" : isPast(d) || isWknd(d) ? t.border : selDate === d ? "#fff" : t.textSub, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "clamp(11px,1.4vw,13px)", transition: "all .18s" }}>
                        {d || ""}
                      </button>
                    ))}
                  </div>
                  <p style={{ marginTop: 12, fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: t.textMuted, textAlign: "center" }}>Weekends & past dates unavailable</p>
                </>}

                {step === 2 && <>
                  <div style={{ textAlign: "center", marginBottom: 18 }}><span style={{ fontFamily: "'Rajdhani',sans-serif", color: t.accent, fontSize: 14, fontWeight: 700 }}>📅 {MONTHS[month]} {selDate}, {year}</span></div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 9, marginBottom: 20 }}>
                    {TIMES.map(time => (
                      <button key={time} onClick={() => { setSelT(time); setStep(3) }} className={selTime === time ? "btn btn-primary" : "btn btn-ghost"} style={{ width: "100%", fontSize: 13, padding: "9px 8px" }}>{time}</button>
                    ))}
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>← Back</button>
                </>}

                {step === 3 && <>
                  <div style={{ textAlign: "center", marginBottom: 18 }}><span style={{ fontFamily: "'Rajdhani',sans-serif", color: t.accent, fontSize: 14, fontWeight: 700 }}>📅 {MONTHS[month]} {selDate} · 🕐 {selTime}</span></div>
                  <div className="contact-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div><label style={lbl}>NAME *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={inp} onFocus={e => e.target.style.borderColor = t.accent} onBlur={e => e.target.style.borderColor = t.border} /></div>
                    <div><label style={lbl}>EMAIL *</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" style={inp} onFocus={e => e.target.style.borderColor = t.accent} onBlur={e => e.target.style.borderColor = t.border} /></div>
                  </div>
                  <div style={{ marginBottom: 12 }}><label style={lbl}>TOPIC *</label><input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="Discuss a project, consulting..." style={inp} onFocus={e => e.target.style.borderColor = t.accent} onBlur={e => e.target.style.borderColor = t.border} /></div>
                  <div style={{ marginBottom: 20 }}><label style={lbl}>NOTES</label><textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional context..." rows={3} style={{ ...inp, resize: "vertical" }} onFocus={e => e.target.style.borderColor = t.accent} onBlur={e => e.target.style.borderColor = t.border} /></div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => { if (form.name && form.email && form.topic) setBooked(true) }} disabled={!form.name || !form.email || !form.topic}>✅ Confirm Booking</button>
                  </div>
                </>}
              </div>
            </FadeUp>
          )}
        </div>
      </section>
    </PageWrap>
  );
};

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const Contact = ({ t }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setL] = useState(false);
  const [foc, sf] = useState(null);

  const submit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setL(true);
    // TODO: replace with real API call
    // await sendContact(form);
    await new Promise(r => setTimeout(r, 1200));
    setL(false); setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }, 5000);
  };

  const inp = f => ({ background: t.inputBg, border: `1px solid ${foc === f ? t.accent : t.border}`, borderRadius: 9, padding: "11px 14px", color: t.text, fontFamily: "'Rajdhani',sans-serif", fontSize: 14, outline: "none", width: "100%", transition: "all .2s", boxSizing: "border-box", boxShadow: foc === f ? `0 0 16px ${t.accentGlow}` : "none" });
  const lbl = { fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: t.textMuted, fontWeight: 700, letterSpacing: 1.5, display: "block", marginBottom: 6 };

  return (
    <PageWrap>
      <section id="contact" style={{ padding: "100px clamp(16px,5vw,72px)", background: t.bg2 }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <FadeUp><div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", color: t.accent, fontSize: 11, letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>// CONTACT.post()</div>
            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(22px,4vw,40px)", color: t.text }}>Let's Work Together</h2>
            <p style={{ color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", marginTop: 10, fontSize: 14 }}>Freelance · Remote · Full-Time</p>
          </div></FadeUp>
          <FadeUp delay={.12}>
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 22, padding: "clamp(20px,5vw,40px)" }}>
              {sent && <div style={{ background: t.accentDim, border: `1px solid ${t.border}`, borderRadius: 9, padding: "12px 16px", marginBottom: 20, color: t.accent, fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, textAlign: "center" }}>✅ Message sent! Mahmud will reply within 24hrs.</div>}
              <div className="contact-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div><label style={lbl}>NAME *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onFocus={() => sf("n")} onBlur={() => sf(null)} placeholder="Your name" style={inp("n")} /></div>
                <div><label style={lbl}>EMAIL *</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onFocus={() => sf("e")} onBlur={() => sf(null)} placeholder="your@email.com" style={inp("e")} /></div>
              </div>
              <div style={{ marginBottom: 12 }}><label style={lbl}>SUBJECT</label><input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} onFocus={() => sf("s")} onBlur={() => sf(null)} placeholder="Project inquiry..." style={inp("s")} /></div>
              <div style={{ marginBottom: 22 }}><label style={lbl}>MESSAGE *</label><textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} onFocus={() => sf("m")} onBlur={() => sf(null)} placeholder="Tell me about your project..." rows={5} style={{ ...inp("m"), resize: "vertical" }} /></div>
              <button className="btn btn-primary btn-lg btn-block" onClick={submit} disabled={loading || !form.name || !form.email || !form.message}>
                {loading ? "⏳ Sending..." : "SEND MESSAGE →"}
              </button>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8, marginTop: 22, paddingTop: 22, borderTop: `1px solid ${t.border}` }}>
                {[["📞", "Phone", "08072410373"], ["📧", "Email", "mahmudolasunkami895"], ["📍", "Location", "Abuja, Nigeria"], ["🐙", "GitHub", "Muhamzy-ui"]].map(([ic, l, v]) => (
                  <div key={l} style={{ textAlign: "center", background: t.accentDim, borderRadius: 9, padding: "10px 6px" }}>
                    <div style={{ fontSize: 15, marginBottom: 3 }}>{ic}</div>
                    <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, color: t.textMuted, fontWeight: 700, letterSpacing: 1 }}>{l}</div>
                    <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: t.tagColor, fontWeight: 600, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </PageWrap>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = ({ go, t }) => {
  const cols = {
    "Quick Links": ["Home", "About", "Skills", "Projects", "Blog", "Book Meeting", "Contact"],
    "Services": ["Web Development", "Mobile Apps", "API Design", "Database Architecture", "Code Review"],
    "Connect": ["GitHub / Muhamzy-ui", "LinkedIn / mahmud-olasunkanmi", "Upwork", "Freelancer.com"],
  };
  return (
    <footer style={{ borderTop: `1px solid ${t.border}`, padding: "48px clamp(16px,5vw,72px) 26px", background: t.bg }}>
      <div className="footer-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "clamp(20px,3vw,40px)", marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><Logo size={32} /><div><div style={{ fontFamily: "'Orbitron',monospace", fontSize: 13, fontWeight: 900, color: t.text }}>M.B.O</div><div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, color: t.accent, fontWeight: 700, letterSpacing: 3 }}>WEBDEV</div></div></div>
          <p style={{ color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", fontSize: 13, lineHeight: 1.8, maxWidth: 220, marginBottom: 10 }}>Turning ideas into fast, elegant web solutions. Available globally.</p>
          <p style={{ color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", fontSize: 12, marginBottom: 4 }}>📧 mahmudolasunkami895@gmail.com</p>
          <p style={{ color: t.textMuted, fontFamily: "'Rajdhani',sans-serif", fontSize: 12 }}>📞 08072410373</p>
        </div>
        {Object.entries(cols).map(([heading, items]) => (
          <div key={heading}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, color: t.accent, fontWeight: 700, letterSpacing: 2, marginBottom: 14 }}>{heading.toUpperCase()}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {items.map(item => (
                <button key={item} className="foot-link" onClick={() => go(item.toLowerCase().split("/")[0].trim().replace(/ /g, "-"))}>{item}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: t.textMuted }}>© {new Date().getFullYear()} M.B.O WebDev · Mahmud Bashir Olasunkanmi</div>
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: t.textMuted }}>React · Django · PostgreSQL</div>
      </div>
    </footer>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebar] = useState(false);
  const t = dark ? DARK : LIGHT;

  // Active nav label from page
  const pageToLabel = { home: "Home", about: "About", skills: "Skills", projects: "Projects", blog: "Blog", "book-meeting": "Book Meeting", contact: "Contact" };
  const activeLabel = pageToLabel[page] || pageToLabel[page.split("/")[0]] || "Blog";

  const go = useCallback((id) => {
    setPage(id);
    setSidebar(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Inject CSS
  useEffect(() => {
    let el = document.getElementById("__mbo_css");
    if (!el) { el = document.createElement("style"); el.id = "__mbo_css"; document.head.appendChild(el) }
    el.textContent = G(t);
  }, [dark]);

  // Scroll spy (only for single-page sections)
  useEffect(() => {
    if (!["home", "about", "skills", "projects", "contact"].includes(page)) return;
    const sections = ["home", "about", "skills", "projects", "contact"];
    const h = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) { const r = el.getBoundingClientRect(); if (r.top <= 120 && r.bottom >= 120) { setPage(id); break } }
      }
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, [page]);

  const renderPage = () => {
    if (page === "home") return <Hero go={go} t={t} />;
    if (page === "about") return <About t={t} />;
    if (page === "skills") return <Skills t={t} />;
    if (page === "projects") return <Projects t={t} />;
    if (page === "blog") return <Blog t={t} go={go} />;
    if (page === "all-articles") return <AllArticles t={t} go={go} />;
    if (page.startsWith("blog/")) return <BlogDetail slug={page.replace("blog/", "")} t={t} go={go} />;
    if (page === "book-meeting") return <BookMeeting t={t} />;
    if (page === "contact") return <Contact t={t} />;
    return <Hero go={go} t={t} />;
  };

  return (
    <div style={{ background: t.bg, minHeight: "100vh" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebar(false)} active={activeLabel} go={go} t={t} dark={dark} setDark={setDark} />
      <Navbar active={activeLabel} go={go} t={t} dark={dark} setDark={setDark} sidebarOpen={sidebarOpen} setSidebar={setSidebar} />
      <main key={page} style={{ animation: "pageSlide .42s cubic-bezier(.4,0,.2,1) both" }}>
        {renderPage()}
      </main>
      <Footer go={go} t={t} />
    </div>
  );
}