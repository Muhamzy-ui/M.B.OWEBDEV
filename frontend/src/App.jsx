import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import React from "react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";

// ─── EMAILJS CONFIG ──────────────────────────────────────────────────────────
const EMAILJS_CONFIG = {
  publicKey: "oF4s91skxW3nTyOvG",
  bookingServiceId: "service_bqb0xyg",
  contactServiceId: "service_49my69t",
  bookingTemplate: "template_2eld4xb",
  contactTemplate: "template_e2ss93g",
};

const ADMIN_PASSWORD = "Mahmud12$$";

// ─── DATA REPOSITORIES ───────────────────────────────────────────────────────
const INIT_PROJECTS = [
  {
    id: 1,
    category: "Full Stack",
    title: "E-Commerce UI & API",
    tagline: "End-to-End Enterprise Commerce Engine",
    desc: "Production-grade e-commerce engine with Django REST backend, React reactive frontend, real-time inventory management, Stripe payment processing & admin dashboard.",
    tags: ["Django REST", "React 19", "PostgreSQL", "Stripe", "Redis"],
    stats: { Commits: 240, Users: 500, Uptime: "99.9%" },
    statsDisplay: { Commits: "240+", Users: "500+", Uptime: "99.9%" },
    github: "https://github.com/Muhamzy-ui",
    live: "https://m-b-owebdev.vercel.app/",
  },
  {
    id: 2,
    category: "Backend / API",
    title: "SaaS API & Operations",
    tagline: "Real-Time Mining Operations Platform",
    desc: "Custom industrial IoT platform for real-time equipment tracking, shift telemetry, WebSockets dispatch, and automated compliance reports with sub-50ms query latency.",
    tags: ["Python", "Flask", "PostgreSQL", "WebSockets", "Chart.js"],
    stats: { Sensors: 80, Reports: 1000, Speed: "50ms" },
    statsDisplay: { Sensors: "80+", Reports: "1000+", Speed: "50ms" },
    github: "https://github.com/Muhamzy-ui",
    live: "https://m-b-owebdev.vercel.app/",
  },
  {
    id: 3,
    category: "System Design",
    title: "Titanium Web Architecture",
    tagline: "Ultra-Fast Liquid Glass Web System",
    desc: "Modern Apple Titanium iOS 27 glass portfolio with calendar booking, client reviews engine, dynamic admin panel, and sub-second load times.",
    tags: ["React 19", "Vite", "EmailJS", "Framer Motion", "CSS Glass"],
    stats: { Score: 99, Load: "<0.8s", FPS: 60 },
    statsDisplay: { Score: "99/100", Load: "<0.8s", FPS: "60fps" },
    github: "https://github.com/Muhamzy-ui",
    live: "https://m-b-owebdev.vercel.app/",
  },
];

const MARQUEE_TECH = [
  "Python", "Django", "React 19", "PostgreSQL", "Redis", "Celery",
  "WebSockets", "Paystack", "Stripe", "Render", "Railway", "Docker",
  "TailwindCSS", "Git", "REST APIs", "TypeScript", "Linux", "Vite"
];

const WORK_PROCESS = [
  {
    step: "01",
    title: "Discovery & Architecture",
    desc: "Deconstructing core business requirements, modeling relational PostgreSQL schemas, and mapping robust, versioned REST API contracts before writing code.",
    icon: "📐",
    tag: "Planning & Scoping"
  },
  {
    step: "02",
    title: "Core Backend & Security",
    desc: "Implementing scalable Django REST Framework viewsets, granular JWT authentication, atomic database transactions, and background task queues with Celery + Redis.",
    icon: "⚡",
    tag: "High-Performance API"
  },
  {
    step: "03",
    title: "Reactive Glass Frontend",
    desc: "Crafting fluid, accessible React interfaces with liquid glassmorphism, hardware-accelerated Framer Motion animations, and seamless optimistic API interactions.",
    icon: "💎",
    tag: "Modern UI/UX"
  },
  {
    step: "04",
    title: "Deploy & Reliability",
    desc: "Setting up CI/CD automation, production environment variables, database composite indexing, and deploying to cloud platforms (Render, Railway, Vercel) with 99.9% uptime.",
    icon: "🚀",
    tag: "Cloud & Monitoring"
  },
];

const SKILL_CATEGORIES = [
  {
    name: "Backend Architecture",
    icon: "⚙️",
    items: [
      { name: "Python", level: 94, note: "Async, Concurrency, OOP" },
      { name: "Django & DRF", level: 92, note: "ViewSets, Serializers, JWT" },
      { name: "REST APIs", level: 95, note: "Contract Design & Scalability" },
      { name: "PostgreSQL", level: 90, note: "Composite Indexing & Tuning" },
    ],
  },
  {
    name: "Frontend Engineering",
    icon: "🎨",
    items: [
      { name: "React 19", level: 90, note: "Hooks, State, Fiber" },
      { name: "JavaScript (ES6+)", level: 92, note: "Async/Await, Modern Engine" },
      { name: "Liquid Glass / CSS", level: 94, note: "Specular Shimmer & Physics" },
      { name: "Tailwind & Bootstrap", level: 88, note: "Clean Responsive Layouts" },
    ],
  },
  {
    name: "DevOps & Cloud",
    icon: "☁️",
    items: [
      { name: "Git & GitHub", level: 92, note: "Version Control & Automation" },
      { name: "Render & Railway", level: 88, note: "Zero-Downtime Deployment" },
      { name: "Redis & WebSockets", level: 85, note: "Pub/Sub & Real-Time Sync" },
      { name: "React Native", level: 80, note: "iOS & Android Cross-Platform" },
    ],
  },
];

const INIT_RATINGS = [
  {
    id: 1,
    name: "James O.",
    role: "E-Commerce Client",
    country: "🇬🇧 UK",
    stars: 5,
    text: "Mahmud delivered our full-stack commerce platform 3 days ahead of deadline. The Django API is rock-solid with zero downtime since launch. One of the sharpest engineers I've worked with.",
    project: "FullStack E-Commerce Platform",
    date: "Feb 2026",
  },
  {
    id: 2,
    name: "Sarah M.",
    role: "Startup Founder",
    country: "🇨🇦 Canada",
    stars: 5,
    text: "We needed an engineer who could master both the Django backend and the React frontend seamlessly. Mahmud delivered both with clean code and incredible speed. 10/10.",
    project: "Custom Dashboard App",
    date: "Jan 2026",
  },
  {
    id: 3,
    name: "Chukwuemeka A.",
    role: "Operations Manager",
    country: "🇳🇬 Nigeria",
    stars: 5,
    text: "The mining operations platform saved our team 20+ hours monthly on compliance reports alone. Intuitive interface, responsive across all devices, and fast delivery.",
    project: "Mining Operations Platform",
    date: "Dec 2025",
  },
  {
    id: 4,
    name: "Lena K.",
    role: "Product Lead",
    country: "🇩🇪 Germany",
    stars: 5,
    text: "Hired Mahmud for database performance tuning. He diagnosed the bottleneck in under an hour and brought API response times from 3s down to 50ms. Exceptional technical depth.",
    project: "PostgreSQL Optimization",
    date: "Nov 2025",
  },
  {
    id: 5,
    name: "David T.",
    role: "Technical Client",
    country: "🇦🇺 Australia",
    stars: 5,
    text: "Clean modular architecture, JWT auth, and complete test coverage. Mahmud is responsive across all timezones and very easy to collaborate with.",
    project: "REST API Development",
    date: "Oct 2025",
  },
  {
    id: 6,
    name: "Fatima B.",
    role: "EdTech Founder",
    country: "🇳🇱 Netherlands",
    stars: 5,
    text: "Built our Django API with clean documentation and delivered the React frontend with pixel-perfect design. Highly recommended.",
    project: "EdTech Platform Backend",
    date: "Sep 2025",
  },
];

const BLOGS = [
  {
    id: 1,
    slug: "django-rest-apis",
    tag: "Django",
    date: "Mar 2026",
    rt: "8 min",
    title: "Building High-Throughput REST APIs with Django & DRF",
    desc: "Essential patterns for DRF viewsets, serializers, JWT token revocation, and pagination when scaling past 100k requests.",
    body: `Django REST Framework is the gold standard for Python APIs. Here are the core architectural patterns that matter in production:

## 1. ViewSets vs APIViews
For standard CRUD operations, ViewSets save immense boilerplate. However, for custom business workflows with multi-step transactions, APIView provides surgical control. Defaulting to explicit APIViews for sensitive workflows prevents hidden ORM overhead.

## 2. Serializers As Your Security Contract
Your serializer is your public contract. Validate aggressively at the serializer level. Always use select_related and prefetch_related on QuerySets to avoid the dreaded N+1 database queries.

## 3. JWT Strategy
Use djangorestframework-simplejwt with short-lived access tokens (15 minutes) and 7-day refresh tokens. Always implement token blacklisting upon logout for security compliance.

## 4. Pagination
Never return unbounded lists. Standardize on PageNumberPagination with page_size=20 to ensure sub-50ms API response times even as tables scale.`,
  },
  {
    id: 2,
    slug: "react-architecture",
    tag: "React",
    date: "Feb 2026",
    rt: "6 min",
    title: "Clean React 19 State Architecture & Modern UI Patterns",
    desc: "How to maintain high velocity and zero lag in large React frontends using modern hooks, clean component isolation, and glassmorphic styling.",
    body: `Writing clean frontend code requires discipline around component boundaries and rendering budgets.

## 1. Minimal State Footprint
Derive values wherever possible instead of syncing state between components. Less state means fewer synchronization bugs and faster paint cycles.

## 2. Liquid Glass & CSS Performance
When building frosted glass and backdrop-blur interfaces, always use transform3d and will-change sparingly to ensure hardware acceleration without blowing GPU memory.

## 3. Optimistic Updates
Give users instant feedback by updating UI state before the network round-trip finishes, rolling back gracefully if the API fails.`,
  },
  {
    id: 3,
    slug: "postgresql-indexing",
    tag: "Database",
    date: "Jan 2026",
    rt: "10 min",
    title: "PostgreSQL Indexing Strategies That Cut Latency by 95%",
    desc: "The real-world indexing mistakes and patterns that dropped production query times from 3.2s down to 12ms.",
    body: `Database performance is where good apps become great apps.

## 1. The Bottleneck Query
A dashboard endpoint was taking 3.2s over 50,000 telemetry rows. Running EXPLAIN ANALYZE revealed a sequential table scan. Adding a single composite B-tree index brought query execution down to 12ms.

## 2. Composite Index Column Ordering
Put highest-cardinality equality columns first, followed by range or ORDER BY columns.

## 3. Avoid Over-Indexing
Every index slows down INSERT and UPDATE operations. Only index columns actively filtered or joined in production workloads.`,
  },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMES = [
  "09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM",
];

// ─── STARDUST PARTICLES DATA ─────────────────────────────────────────────────
const STARDUST = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  top: `${(i * 17) % 96}%`,
  left: `${(i * 29) % 96}%`,
  size: (i % 3) + 1.5,
  delay: `${(i * 0.4) % 4}s`,
  duration: `${3.5 + ((i * 0.6) % 3)}s`,
}));

// ─── TITANIUM LOGO ───────────────────────────────────────────────────────────
const TitaniumLogo = ({ size = 38 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: "linear-gradient(145deg, #2a2c38 0%, #0d0f18 100%)",
      border: "1px solid rgba(255, 255, 255, 0.35)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 0 14px rgba(99, 102, 241, 0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "45%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
      }}
    />
    <span
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800,
        fontSize: size * 0.38,
        letterSpacing: "-0.5px",
        background: "linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
      }}
    >
      MBO
    </span>
  </div>
);

// ─── ANIMATED COUNT UP COMPONENT ─────────────────────────────────────────────
const CountUp = ({ target, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const num = typeof target === "number" ? target : parseInt(target, 10);
          if (isNaN(num)) {
            setVal(target);
            return;
          }
          let start = 0;
          const step = Math.max(1, Math.floor(num / 30));
          const timer = setInterval(() => {
            start += step;
            if (start >= num) {
              setVal(num);
              clearInterval(timer);
            } else {
              setVal(start);
            }
          }, 35);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
};

// ─── HIGH PERFORMANCE TITANIUM CARD (ZERO MOUSE RE-RENDER LAG) ─────────────
const SpotlightCard = ({ children, style = {}, className = "", ...props }) => {
  return (
    <div
      className={`border-beam-card ${className}`}
      style={{
        ...style,
      }}
      {...props}
    >
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
};

// ─── STARS RATING ────────────────────────────────────────────────────────────
const Stars = ({ count = 5, size = 15 }) => (
  <div style={{ display: "inline-flex", gap: 3 }}>
    {Array(5)
      .fill(0)
      .map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: size,
            color: i < count ? "#ffffff" : "rgba(255,255,255,0.18)",
            filter: i < count ? "drop-shadow(0 0 8px rgba(255,255,255,0.75))" : "none",
            display: "inline-block",
            transition: "all 0.2s",
          }}
        >
          ★
        </span>
      ))}
  </div>
);

// ─── TYPEWRITER COMPONENT ────────────────────────────────────────────────────
const Typewriter = ({ phrases, speed = 80 }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === phrases[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1600);
      return () => clearTimeout(timeout);
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 35 : speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases, speed]);

  return (
    <span>
      {phrases[index].substring(0, subIndex)}
      <span style={{ borderRight: "2px solid #ffffff", marginLeft: 2, animation: "sparkleTwinkle 0.8s infinite" }} />
    </span>
  );
};

// ─── MAIN APP COMPONENT ──────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("code"); // 'code' | 'projects' | 'info'
  const [activeSection, setActiveSection] = useState("hero");
  const [copiedCode, setCopiedCode] = useState(false);
  const [projects, setProjects] = useState(INIT_PROJECTS);
  const [ratings, setRatings] = useState(INIT_RATINGS);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [projectFilter, setProjectFilter] = useState("All");

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    tagline: "",
    desc: "",
    category: "Full Stack",
    tags: "",
    github: "",
    live: "",
    stat1k: "Uptime",
    stat1v: "99.9%",
    stat2k: "Users",
    stat2v: "500+",
  });

  // Booking State
  const [bookingStep, setBookingStep] = useState(1);
  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [bookInfo, setBookInfo] = useState({ name: "", email: "", project: "", company: "" });
  const [bookingStatus, setBookingStatus] = useState({ submitting: false, msg: "", err: "" });

  // Contact State
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState({ state: "idle", msg: "" });

  // New Review State
  const [newReview, setNewReview] = useState({ name: "", role: "", country: "", stars: 5, text: "", project: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Mobile menu & Nav Scroll State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // Framer Motion Scroll Progress & Reduced Motion
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const shouldReduceMotion = useReducedMotion();


  // Scroll spy & Nav blur trigger
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 40);
      const sections = ["hero", "about", "projects", "skills", "process", "reviews", "blog", "booking", "contact"];
      const scrollPos = window.scrollY + 200;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    setSelectedBlog(null);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const copyCodeProfile = () => {
    const codeSnippet = `# Mahmud Bashir Olasunkanmi
ROLE = "Full Stack Developer & Systems Engineer"
LOCATION = "Abuja, Nigeria"
STACK = ["Python", "Django", "React", "PostgreSQL", "REST APIs"]
AVAILABILITY = "Ready for Contract & Full-time"
CONTACT = "mahmudolasunkami895@gmail.com"`;
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  // Booking handler
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingStatus({ submitting: true, msg: "", err: "" });

    const templateParams = {
      to_name: "Mahmud",
      from_name: bookInfo.name,
      from_email: bookInfo.email,
      meeting_date: bookDate,
      meeting_time: bookTime,
      project_details: bookInfo.project,
      company: bookInfo.company || "N/A",
    };

    emailjs
      .send(
        EMAILJS_CONFIG.bookingServiceId,
        EMAILJS_CONFIG.bookingTemplate,
        templateParams,
        EMAILJS_CONFIG.publicKey
      )
      .then(() => {
        setBookingStatus({
          submitting: false,
          msg: "Discovery call scheduled! Confirmation email dispatched.",
          err: "",
        });
        setTimeout(() => {
          setBookingStep(1);
          setBookDate("");
          setBookTime("");
          setBookInfo({ name: "", email: "", project: "", company: "" });
          setBookingStatus({ submitting: false, msg: "", err: "" });
        }, 4500);
      })
      .catch((err) => {
        console.error("Booking error:", err);
        setBookingStatus({
          submitting: false,
          msg: "",
          err: "Please email Mahmud directly at mahmudolasunkami895@gmail.com",
        });
      });
  };

  // Contact handler
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactStatus({ state: "submitting", msg: "" });

    const templateParams = {
      from_name: contactForm.name,
      from_email: contactForm.email,
      message: contactForm.message,
      to_name: "Mahmud",
    };

    emailjs
      .send(
        EMAILJS_CONFIG.contactServiceId,
        EMAILJS_CONFIG.contactTemplate,
        templateParams,
        EMAILJS_CONFIG.publicKey
      )
      .then(() => {
        setContactStatus({ state: "success", msg: "Message delivered directly. Expect a reply within 24h." });
        setContactForm({ name: "", email: "", message: "" });
        setTimeout(() => setContactStatus({ state: "idle", msg: "" }), 5000);
      })
      .catch((err) => {
        console.error("Contact error:", err);
        setContactStatus({
          state: "error",
          msg: "Failed to dispatch. Please connect on WhatsApp (+234 807 241 0373) or email directly.",
        });
      });
  };

  // Admin login
  const handleAdminLogin = () => {
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPasswordInput("");
    } else {
      setAdminError(true);
      setTimeout(() => setAdminError(false), 2000);
    }
  };

  // Add Project
  const handleAddProject = () => {
    if (!newProject.title || !newProject.desc) return;
    const p = {
      id: Date.now(),
      category: newProject.category,
      title: newProject.title,
      tagline: newProject.tagline || "Custom Software Architecture",
      desc: newProject.desc,
      tags: newProject.tags.split(",").map((t) => t.trim()).filter(Boolean),
      github: newProject.github || "https://github.com/Muhamzy-ui",
      live: newProject.live || "#",
      stats: {
        [newProject.stat1k || "Metric"]: newProject.stat1v || "Active",
        [newProject.stat2k || "Speed"]: newProject.stat2v || "Fast",
      },
      statsDisplay: {
        [newProject.stat1k || "Metric"]: newProject.stat1v || "Active",
        [newProject.stat2k || "Speed"]: newProject.stat2v || "Fast",
      },
    };
    setProjects((prev) => [p, ...prev]);
    setShowAddProject(false);
    setNewProject({
      title: "",
      tagline: "",
      desc: "",
      category: "Full Stack",
      tags: "",
      github: "",
      live: "",
      stat1k: "Uptime",
      stat1v: "99.9%",
      stat2k: "Users",
      stat2v: "500+",
    });
  };

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Review submission
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    setRatings((prev) => [
      {
        id: Date.now(),
        ...newReview,
        date: "Just now",
      },
      ...prev,
    ]);
    setReviewSubmitted(true);
    setNewReview({ name: "", role: "", country: "", stars: 5, text: "", project: "" });
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const filteredProjects =
    projectFilter === "All"
      ? projects
      : projects.filter((p) => p.category.toLowerCase().includes(projectFilter.toLowerCase()));

  // ─── BLOG POST MODAL VIEW ──────────────────────────────────────────────────
  if (selectedBlog) {
    return (
      <div style={{ background: "#05060a", minHeight: "100vh", color: "#ffffff", padding: "40px 20px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <button
            onClick={() => setSelectedBlog(null)}
            className="btn-shining-glass"
            style={{ marginBottom: 30 }}
          >
            ← Back to Overview
          </button>
          <div className="border-beam-card" style={{ padding: "clamp(24px, 5vw, 56px)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
              <span
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  padding: "4px 14px",
                  borderRadius: 9999,
                  fontSize: 12,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                }}
              >
                {selectedBlog.tag}
              </span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                {selectedBlog.date} • {selectedBlog.rt} read
              </span>
            </div>
            <h1
              className="text-shining-titanium"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 20,
              }}
            >
              {selectedBlog.title}
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#a1a1aa",
                lineHeight: 1.6,
                marginBottom: 36,
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                paddingBottom: 24,
              }}
            >
              {selectedBlog.desc}
            </p>
            <div
              style={{
                fontSize: "16px",
                lineHeight: 1.9,
                color: "#e4e4e7",
                whiteSpace: "pre-wrap",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {selectedBlog.body}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff", overflowX: "hidden", position: "relative" }}>
      {/* ─── SCROLL PROGRESS BAR ─── */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      {/* ─── CLEAN SUBTLE PERSPECTIVE GRID ON SOLID BLACK ─── */}
      <div className="animated-grid-overlay" />

      {/* ─── FLOATING TOP NAVIGATION (iOS 27 Glass Dock) ─── */}
      <header
        style={{
          position: "fixed",
          top: 18,
          left: 0,
          right: 0,
          zIndex: 990,
          display: "flex",
          justifyContent: "center",
          padding: "0 16px",
          pointerEvents: "none",
        }}
      >
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: "clamp(8px, 1.6vw, 24px)",
            padding: "8px 16px",
            maxWidth: 980,
            width: "100%",
            justifyContent: "space-between",
            background: navScrolled ? "rgba(10, 12, 20, 0.9)" : "rgba(14, 16, 26, 0.72)",
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: 9999,
            boxShadow: navScrolled
              ? "0 20px 50px rgba(0, 0, 0, 0.95), 0 0 30px rgba(255, 255, 255, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.4)"
              : "0 14px 40px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
            transition: "background 0.3s, box-shadow 0.3s",
          }}
          className="nav-header-dock"
        >
          {/* Logo Monogram */}
          <div
            onClick={() => scrollTo("hero")}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          >
            <TitaniumLogo size={30} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "0.2px",
                }}
              >
                MAHMUD BASHIR
              </span>
              <span className="nav-sub-role" style={{ fontSize: 9, color: "#a1a1aa", letterSpacing: "1.2px", fontWeight: 700 }}>
                FULL-STACK DEV
              </span>
            </div>
          </div>

          {/* Desktop Center Links with Sliding Pill Indicator */}
          <div
            className="desk-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              position: "relative",
            }}
          >
            {[
              { id: "hero", label: "Overview" },
              { id: "about", label: "About" },
              { id: "projects", label: "Projects" },
              { id: "skills", label: "Stack" },
              { id: "process", label: "Process" },
              { id: "reviews", label: "Reviews" },
              { id: "contact", label: "Contact" },
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  style={{
                    position: "relative",
                    background: "transparent",
                    border: "none",
                    color: isActive ? "#ffffff" : "#a1a1aa",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "7px 14px",
                    borderRadius: 9999,
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    zIndex: 2,
                    minHeight: 44,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#a1a1aa";
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 9999,
                        background: "rgba(255, 255, 255, 0.18)",
                        border: "1px solid rgba(255, 255, 255, 0.35)",
                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.45)",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Action CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => scrollTo("booking")}
              className="btn-shining-primary nav-book-btn"
            >
              📅 <span className="nav-book-text">Book Call</span>
            </motion.button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mob-menu-btn"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#ffffff",
                padding: "8px 14px",
                borderRadius: 9999,
                fontSize: 16,
                cursor: "pointer",
                minHeight: 40,
                minWidth: 40,
                display: "none",
              }}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Drawer (Animated Glass) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                zIndex: 995,
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: 75,
                left: 14,
                right: 14,
                maxHeight: "calc(100vh - 95px)",
                overflowY: "auto",
                zIndex: 999,
                background: "rgba(10, 12, 20, 0.97)",
                backdropFilter: "blur(36px)",
                WebkitBackdropFilter: "blur(36px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 20,
                padding: "16px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                boxShadow: "0 25px 70px rgba(0,0,0,0.98), 0 0 30px rgba(99,102,241,0.2)",
              }}
            >
              {[
                { id: "hero", label: "Overview" },
                { id: "about", label: "About & Stack" },
                { id: "projects", label: "Projects" },
                { id: "skills", label: "Capabilities" },
                { id: "process", label: "Engineering Process" },
                { id: "reviews", label: "Client Reviews" },
                { id: "blog", label: "Technical Articles" },
                { id: "booking", label: "Book Discovery Call" },
                { id: "contact", label: "Get in Touch" },
              ].map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    color: "#ffffff",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    padding: "10px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    minHeight: 44,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {n.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── HERO SECTION ─── */}
      <section
        id="hero"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(90px, 11vw, 115px) clamp(16px, 3.5vw, 36px) 36px",
          maxWidth: 1040,
          margin: "0 auto",
        }}
      >
        {/* Floating Ambient Chips */}
        <div className="hero-chips-bar">
          <div className="floating-chip">
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            <span>⚡ Sub-50ms API Latency</span>
          </div>

          <div className="floating-chip">
            <span>★ 5.0 Star Verified Rating</span>
          </div>
        </div>

        {/* ─── HERO WINDOW CARD (COMPACT & SLEEK) ─── */}
        <div
          className="border-beam-card"
          style={{
            padding: "clamp(20px, 3.2vw, 36px)",
            marginBottom: 28,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
          }}
        >
          {/* Window Traffic Lights Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: 10,
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", opacity: 0.85 }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308", opacity: 0.85 }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", opacity: 0.85 }} />
            </div>

            <div className="hero-window-header-title">
              M.B.O WEBDEV // SOFTWARE ARCHITECT
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 8px #22c55e",
                }}
              />
              <span style={{ fontSize: 11, color: "#d4d4d8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                ONLINE
              </span>
            </div>
          </div>

          {/* Main Hero Headline */}
          <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto" }}>
            <h1 className="text-shining-titanium hero-main-title">
              Mahmud Bashir Olasunkanmi
            </h1>

            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(15px, 2.2vw, 21px)",
                fontWeight: 700,
                color: "#e2e8f0",
                letterSpacing: "-0.2px",
                marginBottom: 12,
              }}
            >
              Full-Stack Developer & Systems Architect
            </div>

            {/* Dynamic Typewriter Subheader */}
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(13px, 1.5vw, 15px)",
                color: "#94a3b8",
                fontWeight: 600,
                marginBottom: 14,
                minHeight: 24,
              }}
            >
              <span style={{ color: "#ffffff", fontWeight: 700 }}>Expertise: </span>
              <Typewriter
                phrases={[
                  "High-Throughput Django REST Framework APIs",
                  "Modern Reactive React 19 Architectures",
                  "PostgreSQL Index Optimization & Sub-50ms Latency",
                  "Production-Grade Cloud Deployments & Security",
                ]}
              />
            </div>

            <p
              style={{
                fontSize: "clamp(13px, 1.3vw, 15px)",
                color: "#a1a1aa",
                lineHeight: 1.65,
                maxWidth: 600,
                margin: "0 auto 18px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Transforming complex product roadmaps into lightning-fast, production-grade applications. Clean Python backends, fluid React frontends, and zero-compromise security.
            </p>

            {/* Specular Direction Indicator Line */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                color: "rgba(255, 255, 255, 0.4)",
                marginBottom: 18,
              }}
            >
              <span style={{ width: 36, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6))" }} />
              <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: 11, letterSpacing: 2, color: "#ffffff", fontWeight: 700 }}>
                ABUJA, NIGERIA 🇳🇬
              </span>
              <span style={{ width: 36, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.6), transparent)" }} />
            </div>

            {/* ─── INTERACTIVE PILL DOCK (Code | Projects | Info) ─── */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  padding: 4,
                  gap: 4,
                  background: "rgba(18, 18, 24, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 9999,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.8)",
                }}
              >
                {[
                  { key: "code", label: "Code" },
                  { key: "projects", label: "Projects" },
                  { key: "info", label: "Info" },
                ].map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        if (tab.key === "projects") scrollTo("projects");
                        if (tab.key === "info") scrollTo("about");
                      }}
                      style={{
                        position: "relative",
                        padding: "7px 20px",
                        borderRadius: 9999,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        background: "transparent",
                        color: isActive ? "#000000" : "#a1a1aa",
                        transition: "color 0.15s ease",
                        minHeight: 38,
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="heroTabPill"
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 9999,
                            background: "#ffffff",
                            boxShadow: "0 2px 10px rgba(255, 255, 255, 0.5)",
                            zIndex: -1,
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        />
                      )}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="hero-cta-group">
              <button
                onClick={() => scrollTo("projects")}
                className="btn-shining-primary hero-btn-main"
              >
                ⚡ Explore Work ↗
              </button>
              <button
                onClick={() => scrollTo("booking")}
                className="btn-shining-glass hero-btn-sub"
              >
                📅 Schedule Call
              </button>
              <a
                href="/Mahmud_Bashir_Resume_v2.docx"
                download="Mahmud_Bashir_Olasunkanmi_Resume.docx"
                className="btn-shining-glass hero-btn-sub"
              >
                📄 Resume
              </a>
            </div>
          </div>
        </div>

        {/* ─── DYNAMIC CODE TERMINAL WITH SYNTAX HIGHLIGHTING & STRAIGHT QUOTES ─── */}
        {activeTab === "code" && (
          <SpotlightCard
            style={{
              padding: "clamp(22px, 3.5vw, 36px)",
              fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
              fontSize: "clamp(12px, 1.4vw, 14px)",
              lineHeight: 1.9,
            }}
          >
            <div className="code-terminal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#a1a1aa", fontSize: 13 }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <span style={{ color: "#ffffff", fontWeight: 800 }}>mahmud_architecture.py</span>
                <span className="code-sub-badge" style={{ opacity: 0.5 }}>— Python 3.12 / Async FastEngine</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyCodeProfile}
                className="btn-shining-glass"
                style={{ padding: "5px 16px", fontSize: 12 }}
              >
                {copiedCode ? "✓ Copied!" : "Copy Snippet"}
              </motion.button>
            </div>

            {/* Horizontal Scrollable Code Container with Straight Quotes */}
            <div className="code-scroll-pane" style={{ paddingBottom: 4 }}>
              <pre style={{ margin: 0, whiteSpace: "pre", fontFamily: "inherit" }}>
                <code>
                  <span style={{ color: "#71717a" }}># Production Systems & Architectural Blueprint</span>{"\n"}
                  <span style={{ color: "#818cf8", fontWeight: 700 }}>class</span> <span style={{ color: "#ffffff", fontWeight: 800 }}>FullStackEngineer</span>:{"\n"}
                  {"    "}developer = <span style={{ color: "#38bdf8" }}>"Mahmud Bashir Olasunkanmi"</span>{"\n"}
                  {"    "}headquarters = <span style={{ color: "#38bdf8" }}>"Abuja, Nigeria"</span>{"\n"}
                  {"    "}core_stack = [
                  {"\n        "}<span style={{ color: "#38bdf8" }}>"Python"</span>, <span style={{ color: "#38bdf8" }}>"Django REST Framework"</span>, <span style={{ color: "#38bdf8" }}>"React 19"</span>, <span style={{ color: "#38bdf8" }}>"PostgreSQL"</span>, <span style={{ color: "#38bdf8" }}>"Stripe"</span>
                  {"\n    "}]
                  {"\n    "}metrics = &#123; <span style={{ color: "#e4e4e7" }}>"latency"</span>: <span style={{ color: "#34d399", fontWeight: 700 }}>"&lt;50ms"</span>, <span style={{ color: "#e4e4e7" }}>"uptime"</span>: <span style={{ color: "#34d399", fontWeight: 700 }}>"99.9%"</span>, <span style={{ color: "#e4e4e7" }}>"satisfaction"</span>: <span style={{ color: "#34d399", fontWeight: 700 }}>"100%"</span> &#125;
                  {"\n    "}status = <span style={{ color: "#38bdf8", fontWeight: 700 }}>"Available for High-Impact Projects"</span>
                </code>
              </pre>
            </div>
          </SpotlightCard>
        )}
      </section>

      {/* ─── STATS STRIP ─── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "20px clamp(16px, 4vw, 40px) 60px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div className="stats-grid">
          {[
            { label: "Production Experience", num: 2, suffix: ".5+ Years", note: "Python & React Architectures" },
            { label: "Deployed Deliveries", num: 15, suffix: "+ Live Apps", note: "From SaaS to E-Commerce" },
            { label: "On-Time Completion", num: 100, suffix: "% Rate", note: "Zero Missed Deadlines" },
            { label: "Engineering Commits", num: 500, suffix: "+ Updates", note: "Clean Modular Repositories" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="border-beam-card"
              style={{
                padding: "22px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="stats-num"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(26px, 3.5vw, 36px)",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-1px",
                  marginBottom: 4,
                  filter: "drop-shadow(0 0 16px rgba(255,255,255,0.4))",
                }}
              >
                <CountUp target={item.num} suffix={item.suffix} />
              </div>
              <div className="stats-label" style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 11, color: "#a1a1aa" }}>{item.note}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── BENTO-GRID ABOUT & TECH MARQUEE ─── */}
      <section
        id="about"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "60px clamp(16px, 4vw, 40px)",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              color: "#a1a1aa",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            // ARCHITECT PROFILE
          </div>
          <h2
            className="text-shining-titanium"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            Engineering Foundation
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {/* Bento Card 1: Core Bio */}
          <SpotlightCard style={{ padding: "clamp(24px, 4vw, 36px)", gridColumn: "span 1" }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>🚀</div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 12, color: "#ffffff" }}>
              Full-Stack Discipline
            </h3>
            <p style={{ color: "#a1a1aa", lineHeight: 1.75, fontSize: 14, marginBottom: 16 }}>
              Based in Abuja, Nigeria, I engineer end-to-end applications designed for stability under load. From crafting complex Django ORM queries and async viewsets to building fluid React frontends with glassmorphism, I bridge the gap between heavy backend logic and elegant user experiences.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "auto" }}>
              <span className="floating-chip" style={{ fontSize: 11, padding: "5px 12px" }}>⚡ Django REST Expert</span>
              <span className="floating-chip" style={{ fontSize: 11, padding: "5px 12px" }}>⚛️ React 19 Architect</span>
            </div>
          </SpotlightCard>

          {/* Bento Card 2: Systems & Telemetry */}
          <SpotlightCard style={{ padding: "clamp(24px, 4vw, 36px)", gridColumn: "span 1" }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>🛡️</div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 12, color: "#ffffff" }}>
              High-Concurrency Focus
            </h3>
            <p style={{ color: "#a1a1aa", lineHeight: 1.75, fontSize: 14, marginBottom: 16 }}>
              Writing code is easy; building architectures that survive high traffic without crashing takes engineering precision. I prioritize query profiling with <code style={{ color: "#fff", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4 }}>EXPLAIN ANALYZE</code>, JWT security lifecycle compliance, and non-blocking I/O.
            </p>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 16px", marginTop: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "#a1a1aa" }}>Database Query Overhead</span>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>&lt; 50ms</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#a1a1aa" }}>API Contract Testing</span>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>100% Validated</span>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* ─── ANIMATED TECH STACK MARQUEE ─── */}
        <div
          className="border-beam-card"
          style={{
            padding: "20px 0",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="marquee-edge-gradient"
            style={{
              left: 0,
              background: "linear-gradient(90deg, #000000 0%, transparent 100%)",
            }}
          />
          <div
            className="marquee-edge-gradient"
            style={{
              right: 0,
              background: "linear-gradient(270deg, #000000 0%, transparent 100%)",
            }}
          />

          <div className="marquee-track">
            {[...MARQUEE_TECH, ...MARQUEE_TECH].map((tech, i) => (
              <div
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 22px",
                  margin: "0 8px",
                  borderRadius: 9999,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS (CARDS WITH FILTER LAYOUT ANIMATION) ─── */}
      <section
        id="projects"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "70px clamp(16px, 4vw, 40px)",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              color: "#a1a1aa",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            // CURATED REPOSITORY
          </div>
          <h2
            className="text-shining-titanium"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              marginBottom: 16,
            }}
          >
            Selected Works
          </h2>

          {/* Category Filter Tabs with Sliding Active Pill */}
          <div className="filter-tabs-wrapper">
            {["All", "Full Stack", "Backend / API", "System Design"].map((cat) => {
              const isSelected = projectFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setProjectFilter(cat)}
                  style={{
                    position: "relative",
                    padding: "8px 22px",
                    borderRadius: 9999,
                    border: "none",
                    background: "transparent",
                    color: isSelected ? "#05060a" : "#a1a1aa",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "color 0.2s",
                    whiteSpace: "nowrap",
                    minHeight: 44,
                  }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeFilterPill"
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 9999,
                        background: "#ffffff",
                        boxShadow: "0 4px 20px rgba(255, 255, 255, 0.45), inset 0 1px 0 #ffffff",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {cat}
                </button>
              );
            })}

            {!isAdmin ? (
              <button
                onClick={() => setShowAdminModal(true)}
                className="btn-shining-glass"
                style={{ padding: "8px 16px", fontSize: 12, minHeight: 44 }}
              >
                🔐 Admin
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowAddProject(!showAddProject)}
                  className="btn-shining-primary"
                  style={{ padding: "8px 16px", fontSize: 12, minHeight: 44 }}
                >
                  ＋ Add Work
                </button>
                <button
                  onClick={() => setIsAdmin(false)}
                  className="btn-shining-glass"
                  style={{ padding: "8px 16px", fontSize: 12, minHeight: 44 }}
                >
                  🔒 Lock
                </button>
              </>
            )}
          </div>
        </div>

        {/* Admin Login Modal */}
        {showAdminModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.88)",
              backdropFilter: "blur(16px)",
              zIndex: 1200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div className="border-beam-card" style={{ padding: 32, width: "min(380px, 95vw)" }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, marginBottom: 8 }}>
                Admin Authentication
              </h3>
              <p style={{ color: "#a1a1aa", fontSize: 13, marginBottom: 18 }}>
                Enter your administrative key to manage live projects.
              </p>
              <input
                type="password"
                placeholder="Password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${adminError ? "#ef4444" : "rgba(255,255,255,0.25)"}`,
                  borderRadius: 12,
                  color: "#ffffff",
                  fontSize: 14,
                  outline: "none",
                  marginBottom: 12,
                  minHeight: 44,
                }}
              />
              {adminError && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>Incorrect passcode</div>}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleAdminLogin} className="btn-shining-primary" style={{ flex: 1 }}>
                  Unlock
                </button>
                <button onClick={() => setShowAdminModal(false)} className="btn-shining-glass">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Project Form (Admin) */}
        {isAdmin && showAddProject && (
          <div className="border-beam-card" style={{ padding: 28, marginBottom: 30 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, marginBottom: 16 }}>
              Publish New Project
            </h3>
            <div className="form-two-col">
              <input
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                style={{ padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", minHeight: 44 }}
              />
              <input
                placeholder="Tagline / Short Subtitle"
                value={newProject.tagline}
                onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                style={{ padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", minHeight: 44 }}
              />
            </div>
            <textarea
              rows={3}
              placeholder="Detailed description of architecture and results..."
              value={newProject.desc}
              onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
              style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", marginBottom: 12 }}
            />
            <div className="form-two-col">
              <input
                placeholder="Tech Tags (comma separated)"
                value={newProject.tags}
                onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                style={{ padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", minHeight: 44 }}
              />
              <input
                placeholder="Live URL"
                value={newProject.live}
                onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
                style={{ padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", minHeight: 44 }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleAddProject} className="btn-shining-primary">
                Save & Deploy Project
              </button>
              <button onClick={() => setShowAddProject(false)} className="btn-shining-glass">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ─── PROJECT CARDS GRID WITH ANIMATEPRESENCE ─── */}
        <motion.div
          layout
          className="projects-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4 }}
                style={{ height: "100%" }}
              >
                <SpotlightCard
                  style={{
                    padding: "clamp(22px, 3vw, 32px)",
                    height: "100%",
                  }}
                >
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: "rgba(239,68,68,0.2)",
                        border: "1px solid #ef4444",
                        color: "#ef4444",
                        borderRadius: 9999,
                        padding: "4px 10px",
                        fontSize: 11,
                        cursor: "pointer",
                        zIndex: 10,
                      }}
                    >
                      ✕ Remove
                    </button>
                  )}

                  {/* Top macOS/iOS Mini Window Bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                      paddingBottom: 12,
                      marginBottom: 18,
                    }}
                  >
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.6)",
                        letterSpacing: 1.2,
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      {proj.category}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#ffffff",
                      marginBottom: 6,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {proj.title}
                  </h3>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#a1a1aa",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      marginBottom: 16,
                      fontWeight: 500,
                    }}
                  >
                    {proj.tagline}
                  </div>

                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.75)",
                      lineHeight: 1.7,
                      marginBottom: 20,
                      flex: 1,
                    }}
                  >
                    {proj.desc}
                  </p>

                  {/* Tech Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.16)",
                          borderRadius: 9999,
                          padding: "4px 12px",
                          fontSize: 11,
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          color: "#ffffff",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Animated Stats Bar */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${Object.keys(proj.stats).length}, 1fr)`,
                      gap: 8,
                      marginBottom: 20,
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 14,
                      padding: "12px 8px",
                      textAlign: "center",
                    }}
                  >
                    {Object.entries(proj.stats).map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 800, color: "#ffffff" }}>
                          {typeof v === "number" ? <CountUp target={v} suffix="+" /> : v}
                        </div>
                        <div style={{ fontSize: 10, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 2 }}>
                          {k}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-shining-glass"
                      style={{ flex: 1, textDecoration: "none", fontSize: 13, padding: "9px 14px" }}
                    >
                      🐙 GitHub
                    </a>
                    <a
                      href={proj.live}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-shining-primary"
                      style={{ flex: 1, textDecoration: "none", fontSize: 13, padding: "9px 14px" }}
                    >
                      Live Demo ↗
                    </a>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ─── ENGINEERING PROCESS & HOW I WORK ─── */}
      <section
        id="process"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "70px clamp(16px, 4vw, 40px)",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              color: "#a1a1aa",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            // METHODOLOGY
          </div>
          <h2
            className="text-shining-titanium"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            How I Build & Ship
          </h2>
        </div>

        <div className="process-grid">
          {WORK_PROCESS.map((proc, i) => (
            <motion.div
              key={proc.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              style={{ height: "100%" }}
            >
              <SpotlightCard style={{ padding: "26px 22px", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 26 }}>{proc.icon}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 900, color: "rgba(255,255,255,0.25)" }}>
                    {proc.step}
                  </span>
                </div>
                <div style={{ fontSize: 11, fontFamily: "'Space Grotesk', sans-serif", color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  {proc.tag}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 800, color: "#ffffff", marginBottom: 10 }}>
                  {proc.title}
                </h3>
                <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, margin: 0 }}>
                  {proc.desc}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TECHNICAL SKILLS MATRIX ─── */}
      <section
        id="skills"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "70px clamp(16px, 4vw, 40px)",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              color: "#a1a1aa",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            // TECHNICAL DEPTH
          </div>
          <h2
            className="text-shining-titanium"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            Engineered Capabilities
          </h2>
        </div>

        <div className="skills-grid">
          {SKILL_CATEGORIES.map((category) => (
            <SpotlightCard
              key={category.name}
              style={{ padding: "clamp(22px, 3.5vw, 32px)" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: 12 }}>
                <span style={{ fontSize: 18 }}>{category.icon}</span>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {category.name}
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {category.items.map((skill) => (
                  <div key={skill.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{skill.name}</span>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#ffffff", fontWeight: 800 }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 5,
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 9999,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        style={{
                          height: "100%",
                          background: "linear-gradient(90deg, rgba(99, 102, 241, 0.6), #ffffff)",
                          boxShadow: "0 0 12px rgba(255,255,255,0.9)",
                          borderRadius: 9999,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: "#a1a1aa", marginTop: 4 }}>{skill.note}</div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ─── CLIENT REVIEWS & TESTIMONIALS ─── */}
      <section
        id="reviews"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "70px clamp(16px, 4vw, 40px)",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              color: "#a1a1aa",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            // VERIFIED REPUTATION
          </div>
          <h2
            className="text-shining-titanium"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              marginBottom: 10,
            }}
          >
            Client Reviews
          </h2>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <Stars count={5} size={18} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 16 }}>
              5.0 / 5.0 Rating (6+ Global Deliveries)
            </span>
          </div>
        </div>

        <div className="reviews-grid">
          {ratings.map((rev) => (
            <SpotlightCard
              key={rev.id}
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{rev.name}</div>
                    <div style={{ fontSize: 12, color: "#a1a1aa" }}>{rev.role} • {rev.country}</div>
                  </div>
                  <Stars count={rev.stars} size={14} />
                </div>
                <p style={{ fontSize: 14, color: "#e4e4e7", lineHeight: 1.75, marginBottom: 16 }}>
                  "{rev.text}"
                </p>
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  paddingTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "#a1a1aa",
                }}
              >
                <span>✓ {rev.project}</span>
                <span>{rev.date}</span>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Leave a Review Form */}
        <div className="border-beam-card" style={{ maxWidth: 640, margin: "0 auto", padding: "clamp(24px, 4vw, 36px)" }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, marginBottom: 6 }}>
            Leave a Client Review
          </h3>
          <p style={{ color: "#a1a1aa", fontSize: 13, marginBottom: 20 }}>
            Have we partnered on a project? Share your feedback for the public registry.
          </p>
          {reviewSubmitted ? (
            <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid #ffffff", padding: 18, borderRadius: 14, textAlign: "center", fontWeight: 700 }}>
              ✓ Thank you! Your review has been recorded.
            </div>
          ) : (
            <form onSubmit={handleAddReview}>
              <div className="form-two-col">
                <input
                  required
                  placeholder="Your Name *"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  style={{ padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", fontSize: 13, minHeight: 44 }}
                />
                <input
                  placeholder="Role / Title"
                  value={newReview.role}
                  onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                  style={{ padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", fontSize: 13, minHeight: 44 }}
                />
              </div>
              <div className="form-two-col">
                <input
                  placeholder="Country (e.g. 🇳🇬 Nigeria, 🇬🇧 UK)"
                  value={newReview.country}
                  onChange={(e) => setNewReview({ ...newReview, country: e.target.value })}
                  style={{ padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", fontSize: 13, minHeight: 44 }}
                />
                <input
                  placeholder="Service / Project Delivered"
                  value={newReview.project}
                  onChange={(e) => setNewReview({ ...newReview, project: e.target.value })}
                  style={{ padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", fontSize: 13, minHeight: 44 }}
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder="Share your experience working with Mahmud..."
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", fontSize: 13, marginBottom: 16 }}
              />
              <button type="submit" className="btn-shining-primary" style={{ width: "100%" }}>
                Submit Public Review ★
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── TECH BLOG & THOUGHTS ─── */}
      <section
        id="blog"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "70px clamp(16px, 4vw, 40px)",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              color: "#a1a1aa",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            // ENGINEERING LOGS
          </div>
          <h2
            className="text-shining-titanium"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            Technical Articles
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
            gap: 24,
          }}
        >
          {BLOGS.map((article) => (
            <SpotlightCard
              key={article.id}
              onClick={() => setSelectedBlog(article)}
              style={{
                padding: "24px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.22)",
                      borderRadius: 9999,
                      padding: "4px 12px",
                      fontSize: 11,
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {article.tag}
                  </span>
                  <span style={{ fontSize: 12, color: "#a1a1aa" }}>
                    {article.date} • {article.rt}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    lineHeight: 1.3,
                    marginBottom: 10,
                    color: "#ffffff",
                  }}
                >
                  {article.title}
                </h3>
                <p style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.65, marginBottom: 18 }}>
                  {article.desc}
                </p>
              </div>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Read Specification ↗
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ─── MEETING BOOKING SECTION ─── */}
      <section
        id="booking"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "70px clamp(16px, 4vw, 40px)",
          maxWidth: 820,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              color: "#a1a1aa",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            // DIRECT COLLABORATION
          </div>
          <h2
            className="text-shining-titanium"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              marginBottom: 10,
            }}
          >
            Schedule a Discovery Call
          </h2>
          <p style={{ color: "#a1a1aa", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
            Book a 30-minute direct session to review architecture, project scope, or technical advisory.
          </p>
        </div>

        <SpotlightCard style={{ padding: "clamp(24px, 5vw, 44px)" }}>
          {/* Step Indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: bookingStep >= 1 ? "#ffffff" : "rgba(255,255,255,0.1)",
                color: bookingStep >= 1 ? "#05060a" : "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 12,
                boxShadow: bookingStep >= 1 ? "0 0 15px rgba(255,255,255,0.6)" : "none",
              }}
            >
              1
            </div>
            <div style={{ flex: 1, height: 1, background: bookingStep === 2 ? "#ffffff" : "rgba(255,255,255,0.18)" }} />
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: bookingStep >= 2 ? "#ffffff" : "rgba(255,255,255,0.1)",
                color: bookingStep >= 2 ? "#05060a" : "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 12,
                boxShadow: bookingStep >= 2 ? "0 0 15px rgba(255,255,255,0.6)" : "none",
              }}
            >
              2
            </div>
          </div>

          {bookingStatus.msg ? (
            <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid #ffffff", padding: 24, borderRadius: 16, textAlign: "center", fontWeight: 700 }}>
              {bookingStatus.msg}
            </div>
          ) : bookingStatus.err ? (
            <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", color: "#fca5a5", padding: 20, borderRadius: 16, textAlign: "center" }}>
              {bookingStatus.err}
            </div>
          ) : bookingStep === 1 ? (
            <div>
              <div style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>
                1. Select Available Date
              </div>
              <div className="calendar-dates-grid">
                {Array(8)
                  .fill(0)
                  .map((_, i) => {
                    const dt = new Date();
                    dt.setDate(dt.getDate() + 1 + i);
                    const ds = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
                    const label = `${DAYS[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()].slice(0, 3)}`;
                    const isSelected = bookDate === ds;
                    return (
                      <button
                        key={ds}
                        onClick={() => setBookDate(ds)}
                        style={{
                          padding: "13px 6px",
                          borderRadius: 14,
                          border: isSelected ? "1px solid #ffffff" : "1px solid rgba(255,255,255,0.18)",
                          background: isSelected ? "#ffffff" : "rgba(255,255,255,0.05)",
                          color: isSelected ? "#05060a" : "#ffffff",
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 800,
                          fontSize: 12,
                          cursor: "pointer",
                          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                          boxShadow: isSelected ? "0 4px 18px rgba(255,255,255,0.5)" : "none",
                          minHeight: 44,
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
              </div>

              {bookDate && (
                <div>
                  <div style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>
                    2. Select Time (GMT+1 / West Africa Time)
                  </div>
                  <div className="calendar-times-grid">
                    {TIMES.map((time) => {
                      const isSelected = bookTime === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setBookTime(time)}
                          style={{
                            padding: "11px",
                            borderRadius: 12,
                            border: isSelected ? "1px solid #ffffff" : "1px solid rgba(255,255,255,0.18)",
                            background: isSelected ? "#ffffff" : "rgba(255,255,255,0.05)",
                            color: isSelected ? "#05060a" : "#ffffff",
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 800,
                            fontSize: 12,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: isSelected ? "0 4px 18px rgba(255,255,255,0.5)" : "none",
                            minHeight: 44,
                          }}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setBookingStep(2)}
                  disabled={!bookDate || !bookTime}
                  className="btn-shining-primary"
                  style={{ opacity: !bookDate || !bookTime ? 0.35 : 1 }}
                >
                  Continue to Confirmation →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit}>
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: 14,
                  padding: "14px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 22,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700 }}>
                  🗓 {bookDate} at {bookTime} (GMT+1)
                </span>
                <button
                  type="button"
                  onClick={() => setBookingStep(1)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ffffff",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    minHeight: 44,
                  }}
                >
                  Change
                </button>
              </div>

              <div className="form-two-col">
                <input
                  required
                  placeholder="Your Full Name *"
                  value={bookInfo.name}
                  onChange={(e) => setBookInfo({ ...bookInfo, name: e.target.value })}
                  style={{ padding: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 12, color: "#fff", outline: "none", fontSize: 14, minHeight: 44 }}
                />
                <input
                  required
                  type="email"
                  placeholder="Your Work Email *"
                  value={bookInfo.email}
                  onChange={(e) => setBookInfo({ ...bookInfo, email: e.target.value })}
                  style={{ padding: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 12, color: "#fff", outline: "none", fontSize: 14, minHeight: 44 }}
                />
              </div>

              <input
                placeholder="Company / Organization (Optional)"
                value={bookInfo.company}
                onChange={(e) => setBookInfo({ ...bookInfo, company: e.target.value })}
                style={{ width: "100%", padding: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 12, color: "#fff", outline: "none", fontSize: 14, marginBottom: 14, minHeight: 44 }}
              />

              <textarea
                required
                rows={4}
                placeholder="Briefly describe what you'd like to build or solve..."
                value={bookInfo.project}
                onChange={(e) => setBookInfo({ ...bookInfo, project: e.target.value })}
                style={{ width: "100%", padding: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 12, color: "#fff", outline: "none", fontSize: 14, marginBottom: 20 }}
              />

              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setBookingStep(1)} className="btn-shining-glass">
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={bookingStatus.submitting}
                  className="btn-shining-primary"
                  style={{ flex: 1 }}
                >
                  {bookingStatus.submitting ? "Booking..." : "Confirm Discovery Session ✅"}
                </button>
              </div>
            </form>
          )}
        </SpotlightCard>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section
        id="contact"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "70px clamp(16px, 4vw, 40px) 100px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              color: "#a1a1aa",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            // DIRECT CONTACT
          </div>
          <h2
            className="text-shining-titanium"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            Let's Build Something Exceptional
          </h2>
        </div>

        <div className="contact-layout-grid">
          {/* Left Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                icon: "✉️",
                label: "Email",
                val: "mahmudolasunkami895@gmail.com",
                href: "mailto:mahmudolasunkami895@gmail.com",
              },
              {
                icon: "💬",
                label: "WhatsApp",
                val: "+234 807 241 0373",
                href: "https://wa.me/2348072410373",
              },
              {
                icon: "🐙",
                label: "GitHub",
                val: "github.com/Muhamzy-ui",
                href: "https://github.com/Muhamzy-ui",
              },
              {
                icon: "💼",
                label: "LinkedIn",
                val: "linkedin.com/in/mahmud-olasunkanmi",
                href: "https://linkedin.com/in/mahmud-olasunkanmi",
              },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="border-beam-card"
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  textDecoration: "none",
                  color: "#ffffff",
                  minHeight: 44,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 800 }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{c.val}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Right Form */}
          <SpotlightCard style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <form onSubmit={handleContactSubmit}>
              <div className="form-two-col">
                <input
                  required
                  placeholder="Your Name *"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  style={{ padding: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 12, color: "#fff", outline: "none", fontSize: 14, minHeight: 44 }}
                />
                <input
                  required
                  type="email"
                  placeholder="Your Email *"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  style={{ padding: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 12, color: "#fff", outline: "none", fontSize: 14, minHeight: 44 }}
                />
              </div>

              <textarea
                required
                rows={5}
                placeholder="Tell me about your project, timeline, and goals..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                style={{ width: "100%", padding: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 12, color: "#fff", outline: "none", fontSize: 14, marginBottom: 20 }}
              />

              <button
                type="submit"
                disabled={contactStatus.state === "submitting"}
                className="btn-shining-primary"
                style={{ width: "100%", height: 52, fontSize: 15 }}
              >
                {contactStatus.state === "submitting" ? "Transmitting..." : "Send Message ↗"}
              </button>

              {contactStatus.msg && (
                <div
                  style={{
                    marginTop: 14,
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: contactStatus.state === "success" ? "#4ade80" : "#f87171",
                  }}
                >
                  {contactStatus.msg}
                </div>
              )}
            </form>
          </SpotlightCard>
        </div>
      </section>

      {/* ─── FOOTER WITH BACK-TO-TOP BUTTON ─── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "44px clamp(16px, 4vw, 40px)",
          background: "rgba(8, 10, 16, 0.92)",
          backdropFilter: "blur(24px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="footer-container"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <TitaniumLogo size={28} />
            <span style={{ fontSize: 13, color: "#a1a1aa" }}>
              © {new Date().getFullYear()} Mahmud Bashir Olasunkanmi. All rights reserved.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 10px #22c55e",
                  animation: "pulseGlowRing 2s infinite",
                }}
              />
              <span style={{ fontSize: 12, color: "#a1a1aa", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                Engine Status: 100% Operational
              </span>
            </div>

            {/* Back to Top Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="btn-shining-glass"
              style={{ padding: "6px 14px", fontSize: 12, minHeight: 38 }}
            >
              ↑ Top
            </motion.button>
          </div>
        </div>
      </footer>
    </div>
  );
}
