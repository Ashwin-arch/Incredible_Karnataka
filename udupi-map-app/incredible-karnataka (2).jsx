import { useState, useEffect } from "react";
import {
  MapPin, Search, Bell, Bookmark, User, Star, Compass, Sparkles,
  ArrowLeft, Share2, Plus, Map, ShoppingBag, UtensilsCrossed,
  Landmark, Bed, Gem, Trophy, MessageSquare, Globe, Info,
  ChevronRight, Bot, Clock, CheckCircle, TrendingUp, X,
  Store, TreePine, Camera, Navigation
} from "lucide-react";

// ── Color System ──────────────────────────────────────────────────
const C = {
  bg: "#1A0A2E",
  bgDeep: "#0D0618",
  purple1: "#804A8A",
  purple2: "#3A0353",
  gold1: "#F8D299",
  gold2: "#F59E51",
  surface: "rgba(58,3,83,0.45)",
  glass: "rgba(128,74,138,0.18)",
  text: "#F0E6FF",
  muted: "#B89EC4",
  white: "#FFFFFF",
  card: "rgba(26,10,46,0.7)",
};

const gradPurple = `linear-gradient(145deg, ${C.purple1}, ${C.purple2})`;
const gradGold = `linear-gradient(145deg, ${C.gold1}, ${C.gold2})`;
const gradBg = `linear-gradient(160deg, #2D0A4E 0%, #1A0A2E 40%, #0D0618 100%)`;

const S = {
  app: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: gradBg,
    minHeight: "100vh",
    color: C.text,
    overflowX: "hidden",
  },
  phone: {
    width: 390,
    minHeight: 844,
    margin: "0 auto",
    background: gradBg,
    position: "relative",
    overflow: "hidden",
    borderRadius: 0,
  },
  screen: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "0 0 80px",
  },
};

function GlassCard({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "rgba(128,74,138,0.15)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(128,74,138,0.3)",
      borderRadius: 16,
      ...style,
    }}>
      {children}
    </div>
  );
}

function GoldBadge({ children }) {
  return (
    <span style={{
      background: gradGold, color: "#3A0353", fontSize: 10, fontWeight: 700,
      padding: "2px 8px", borderRadius: 20, letterSpacing: 0.5,
      display: "inline-flex", alignItems: "center", gap: 3,
    }}>
      {children}
    </span>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{ color: C.gold2, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10} fill={i <= Math.floor(rating) ? C.gold2 : "none"} color={C.gold2} />
      ))}
      <span style={{ color: C.muted, marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

function Skeleton({ width = "100%", height = 16, radius = 8, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: "linear-gradient(90deg, rgba(128,74,138,0.2) 25%, rgba(128,74,138,0.35) 50%, rgba(128,74,138,0.2) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      ...style,
    }} />
  );
}

function CategoryIcon({ id, size = 18, color = C.muted }) {
  const p = { size, color };
  switch (id) {
    case "food": return <UtensilsCrossed {...p} />;
    case "handicrafts": return <Gem {...p} />;
    case "shops": return <Store {...p} />;
    case "tourist": return <Landmark {...p} />;
    case "stays": return <Bed {...p} />;
    default: return <Compass {...p} />;
  }
}

function PlaceIcon({ category, size = 40, color }) {
  const p = { size, color: color || C.gold2, strokeWidth: 1.5 };
  switch (category) {
    case "food": return <UtensilsCrossed {...p} />;
    case "handicrafts": return <Gem {...p} />;
    case "shops": return <Store {...p} />;
    case "tourist": return <Landmark {...p} />;
    case "stays": return <Bed {...p} />;
    default: return <Compass {...p} />;
  }
}

function BottomNav({ active, navigate }) {
  const tabs = [
    { id: "home", Icon: Map, label: "Explore" },
    { id: "listings", Icon: Search, label: "Discover" },
    { id: "itinerary", Icon: Sparkles, label: "AI Plan" },
    { id: "saved", Icon: Bookmark, label: "Saved" },
    { id: "profile", Icon: User, label: "Profile" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: 390, background: "rgba(13,6,24,0.92)", backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(128,74,138,0.3)",
      display: "flex", justifyContent: "space-around", padding: "10px 0 16px", zIndex: 100,
    }}>
      {tabs.map(({ id, Icon, label }) => (
        <button key={id} onClick={() => navigate(id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          padding: "4px 8px", color: active === id ? C.gold2 : C.muted, transition: "all 0.2s",
        }}>
          <Icon size={active === id ? 22 : 20} color={active === id ? C.gold2 : C.muted} />
          <span style={{ fontSize: 9, fontWeight: active === id ? 700 : 400, letterSpacing: 0.5 }}>{label}</span>
          {active === id && <div style={{ width: 4, height: 4, borderRadius: 2, background: C.gold2, marginTop: 2 }} />}
        </button>
      ))}
    </div>
  );
}

const PLACES = [
  { id: 1, name: "MTR – Mavalli Tiffin Rooms", category: "food", location: "Lalbagh Rd, Bengaluru", distance: "0.8 km", rating: 4.8, authenticity: 96, popularity: 94, desc: "Since 1924, MTR has been serving legendary South Indian breakfasts. A 100-year tradition of pure vegetarian Karnataka cuisine that has fed generations.", tags: ["Heritage", "Vegetarian", "Breakfast"], color: "#FF6B6B", reviews: [{ user: "Priya K.", text: "Best Rava Idli in the world. No exaggeration.", stars: 5 }, { user: "Arjun M.", text: "The masala dosa here is legendary. Must visit!", stars: 5 }] },
  { id: 2, name: "Channapatna Toy Village", category: "handicrafts", location: "Channapatna, Ramanagara", distance: "58 km", rating: 4.6, authenticity: 98, popularity: 82, desc: "GI-tagged wooden toys crafted using centuries-old techniques. Artisan families pass down this craft, creating vibrant lacquerware pieces unique to Karnataka.", tags: ["GI Tag", "Artisan", "Heritage Craft"], color: "#4ECDC4", reviews: [{ user: "Sneha R.", text: "Incredible craftsmanship. Bought toys for entire family!", stars: 5 }, { user: "Dev P.", text: "Authentic experience, straight from the artisans.", stars: 4 }] },
  { id: 3, name: "Hampi Ruins & Virupaksha Temple", category: "tourist", location: "Hampi, Ballari District", distance: "340 km", rating: 4.9, authenticity: 99, popularity: 97, desc: "UNESCO World Heritage Site. The ruins of the Vijayanagara Empire spread across 26 sq km of otherworldly boulder landscapes. A photographer's paradise.", tags: ["UNESCO", "Ancient", "Must Visit"], color: "#F59E51", reviews: [{ user: "Rahul S.", text: "Absolutely breathtaking. Best place I've visited in India.", stars: 5 }, { user: "Meera T.", text: "The sunrise at Matanga Hill is life-changing.", stars: 5 }] },
  { id: 4, name: "Evolve Back – Coorg Resort", category: "stays", location: "Pollibetta, Coorg", distance: "255 km", rating: 4.7, authenticity: 89, popularity: 91, desc: "Luxury boutique resort nestled in coffee plantations. Experience Kodava culture, plantation walks, and farm-to-table dining in the misty hills of Coorg.", tags: ["Luxury", "Nature", "Coffee Country"], color: "#A8E6CF", reviews: [{ user: "Vikram N.", text: "Perfect honeymoon destination. Magical atmosphere.", stars: 5 }, { user: "Ananya B.", text: "The coffee estate walk is simply beautiful.", stars: 4 }] },
  { id: 5, name: "Commercial Street Market", category: "shops", location: "Commercial St, Bengaluru", distance: "2.1 km", rating: 4.3, authenticity: 78, popularity: 93, desc: "Bengaluru's most iconic shopping street. From silk sarees and bangles to street food and boutique stores – this 100-year-old market has everything.", tags: ["Shopping", "Iconic", "Street Market"], color: "#C7A2FF", reviews: [{ user: "Lavanya K.", text: "Best place for ethnic wear shopping!", stars: 4 }, { user: "Rohan D.", text: "Bargaining skills required. Worth every penny.", stars: 4 }] },
  { id: 6, name: "Coorg Coffee Estates Tour", category: "tourist", location: "Madikeri, Coorg", distance: "260 km", rating: 4.8, authenticity: 95, popularity: 88, desc: "Walk through lush Arabica coffee plantations, learn the harvest process, and taste freshly brewed Coorg coffee straight from the source.", tags: ["Nature", "Experience", "Coffee"], color: "#8B5E3C", reviews: [{ user: "Nisha M.", text: "Best coffee experience of my life!", stars: 5 }] },
];

const CATEGORIES = [
  { id: "all", label: "All", color: C.gold2 },
  { id: "food", label: "Food", color: "#FF6B6B" },
  { id: "handicrafts", label: "Crafts", color: "#4ECDC4" },
  { id: "shops", label: "Shops", color: "#C7A2FF" },
  { id: "tourist", label: "Tourist", color: "#F59E51" },
  { id: "stays", label: "Stays", color: "#A8E6CF" },
];

function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => onDone(), 2800);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: gradBg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(128,74,138,0.3) 0%, transparent 70%)", top: -80, right: -80 }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,81,0.2) 0%, transparent 70%)", bottom: 60, left: -50 }} />
      <div style={{ transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)", transform: phase >= 1 ? "scale(1) translateY(0)" : "scale(0.3) translateY(60px)", opacity: phase >= 1 ? 1 : 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 100, height: 100, borderRadius: 28, background: gradGold, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px rgba(245,158,81,0.5)` }}>
          <Landmark size={52} color="#3A0353" strokeWidth={1.5} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, background: `linear-gradient(135deg, ${C.gold1}, ${C.gold2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Incredible</div>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: C.white, lineHeight: 1 }}>Karnataka</div>
        </div>
      </div>
      <div style={{ marginTop: 32, textAlign: "center", transition: "all 0.6s ease", opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(20px)" }}>
        <p style={{ color: C.muted, fontSize: 15, letterSpacing: 2, textTransform: "uppercase" }}>Discover · Explore · Experience</p>
      </div>
      <div style={{ position: "absolute", bottom: 80, display: "flex", gap: 8, opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.5s ease 0.8s" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: i === 1 ? C.gold2 : C.purple1, animation: `pulse ${0.8 + i * 0.2}s ease-in-out infinite alternate` }} />
        ))}
      </div>
      <style>{`@keyframes pulse { from { transform: scale(1); opacity: 0.5; } to { transform: scale(1.4); opacity: 1; } } @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  );
}

function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { Icon: Gem, title: "Hidden Gems", subtitle: "Discover generational businesses and artisan workshops that have been passed down for centuries.", color: C.purple1 },
    { Icon: Map, title: "Hyperlocal Map", subtitle: "See real-time, location-aware recommendations on an interactive map. Every pin tells a story.", color: "#4ECDC4" },
    { Icon: Bot, title: "AI Recommendations", subtitle: "Our AI learns your taste and builds personalized itineraries for an authentic Karnataka journey.", color: C.gold2 },
  ];
  const current = slides[slide];

  return (
    <div style={{ width: "100%", height: "100vh", background: gradBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "60px 28px 48px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onDone} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
          Skip <ChevronRight size={14} />
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, flex: 1, justifyContent: "center" }}>
        <div style={{ width: 160, height: 160, borderRadius: 48, background: `linear-gradient(145deg, ${current.color}33, ${current.color}11)`, border: `2px solid ${current.color}44`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${current.color}33`, transition: "all 0.4s ease" }}>
          <current.Icon size={72} color={current.color} strokeWidth={1.2} />
        </div>
        <div style={{ textAlign: "center", maxWidth: 300 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 16, background: `linear-gradient(135deg, ${C.white}, ${current.color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{current.title}</h2>
          <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.6 }}>{current.subtitle}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, background: i === slide ? C.gold2 : C.purple1, transition: "all 0.3s ease", cursor: "pointer" }} />
        ))}
      </div>
      <button onClick={() => slide < slides.length - 1 ? setSlide(slide + 1) : onDone()} style={{ width: "100%", padding: "16px", borderRadius: 16, background: gradGold, border: "none", cursor: "pointer", color: "#3A0353", fontSize: 16, fontWeight: 700, letterSpacing: 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {slide < slides.length - 1 ? <><span>Continue</span><ChevronRight size={18} /></> : <><span>Get Started</span><Navigation size={18} /></>}
      </button>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (mode === "register" && !form.name) e.name = "Name required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: gradBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: gradGold, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 8px 32px rgba(245,158,81,0.4)` }}>
          <Landmark size={38} color="#3A0353" strokeWidth={1.5} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.white, margin: 0 }}>{mode === "login" ? "Welcome back" : "Join us"}</h1>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>{mode === "login" ? "Report. Track. Improve." : "Discover Karnataka's soul"}</p>
      </div>
      <GlassCard style={{ width: "100%", padding: 28, boxSizing: "border-box" }}>
        {mode === "register" && <div style={{ marginBottom: 16 }}><InputField Icon={User} placeholder="Full name" value={form.name} onChange={v => setForm({ ...form, name: v })} error={errors.name} /></div>}
        <div style={{ marginBottom: 16 }}><InputField Icon={Globe} placeholder="Email address" value={form.email} onChange={v => setForm({ ...form, email: v })} error={errors.email} type="email" /></div>
        <div style={{ marginBottom: 24 }}><InputField Icon={CheckCircle} placeholder="Password" value={form.password} onChange={v => setForm({ ...form, password: v })} error={errors.password} type="password" /></div>
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: 12, background: loading ? "rgba(245,158,81,0.5)" : gradPurple, border: "none", cursor: loading ? "not-allowed" : "pointer", color: C.white, fontSize: 16, fontWeight: 700, transition: "all 0.2s" }}>
          {loading ? "..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ color: C.muted, fontSize: 14 }}>{mode === "login" ? "Don't have an account? " : "Already have an account? "}</span>
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", cursor: "pointer", color: C.gold2, fontSize: 14, fontWeight: 600 }}>
            {mode === "login" ? "Create new account" : "Log in"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

function InputField({ Icon, placeholder, value, onChange, error, type = "text" }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(13,6,24,0.6)", borderRadius: 12, padding: "14px 16px", border: `1px solid ${error ? "#FF6B6B55" : "rgba(128,74,138,0.3)"}` }}>
        <Icon size={16} color={C.muted} />
        <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 15, flex: 1 }} />
      </div>
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 4, paddingLeft: 8 }}>{error}</div>}
    </div>
  );
}

function HomeScreen({ navigate, onSelectPlace }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const filtered = activeFilter === "all" ? PLACES : PLACES.filter(p => p.category === activeFilter);

  return (
    <div style={{ ...S.screen, padding: 0 }}>
      <div style={{ padding: "52px 20px 16px", background: "linear-gradient(180deg, rgba(13,6,24,0.95) 0%, transparent 100%)", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: C.muted, fontSize: 13, margin: 0, letterSpacing: 1, display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} color={C.muted} /> Bengaluru, Karnataka
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: C.white }}>Discover Karnataka</h1>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: gradGold, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell size={20} color="#3A0353" />
          </div>
        </div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, background: "rgba(128,74,138,0.15)", borderRadius: 14, padding: "12px 16px", border: "1px solid rgba(128,74,138,0.3)" }}>
          <Search size={16} color={C.muted} />
          <span style={{ color: C.muted, fontSize: 15 }}>Search places, food, experiences...</span>
        </div>
      </div>

      <div style={{ height: 240, background: "linear-gradient(135deg, #1a2744, #0d1929)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * 35, height: 1, background: "rgba(128,74,138,0.5)" }} />)}
          {[...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: i * 42, width: 1, background: "rgba(128,74,138,0.3)" }} />)}
        </div>
        {filtered.slice(0, 5).map((p, i) => (
          <div key={p.id} onClick={() => onSelectPlace(p)} style={{ position: "absolute", left: `${20 + (i * 18) % 65}%`, top: `${15 + (i * 23) % 60}%`, cursor: "pointer", animation: `pulse ${1 + i * 0.3}s ease-in-out infinite alternate` }}>
            <div style={{ width: 36, height: 36, borderRadius: "50% 50% 50% 0", background: p.color, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-45deg)", boxShadow: `0 4px 12px ${p.color}66` }}>
              <div style={{ transform: "rotate(45deg)" }}><CategoryIcon id={p.category} size={14} color="#fff" /></div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(13,6,24,0.8)", borderRadius: 10, padding: "6px 12px", fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 6 }}>
          <Map size={12} color={C.muted} /> Interactive Map
        </div>
        <div style={{ position: "absolute", bottom: 12, left: 12, background: gradGold, borderRadius: 10, padding: "6px 12px", fontSize: 11, color: "#3A0353", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin size={11} color="#3A0353" /> Auto-detected
        </div>
      </div>

      <div style={{ padding: "16px 0 8px", overflowX: "auto", display: "flex", gap: 10, paddingLeft: 20 }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveFilter(cat.id)} style={{ padding: "8px 16px", borderRadius: 24, whiteSpace: "nowrap", border: `1px solid ${activeFilter === cat.id ? cat.color : "rgba(128,74,138,0.3)"}`, background: activeFilter === cat.id ? `${cat.color}22` : "transparent", color: activeFilter === cat.id ? cat.color : C.muted, fontSize: 13, fontWeight: activeFilter === cat.id ? 700 : 400, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
            <CategoryIcon id={cat.id} size={13} color={activeFilter === cat.id ? cat.color : C.muted} />
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "8px 20px 100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Nearby Discoveries</h2>
          <button onClick={() => navigate("listings")} style={{ background: "none", border: "none", color: C.gold2, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            See all <ChevronRight size={13} color={C.gold2} />
          </button>
        </div>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2].map(i => (
              <div key={i} style={{ height: 140, borderRadius: 16, background: "rgba(128,74,138,0.1)", display: "flex", gap: 16, padding: 16, alignItems: "center" }}>
                <Skeleton width={110} height={110} radius={12} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Skeleton width="70%" /><Skeleton width="50%" height={12} /><Skeleton width="90%" height={12} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: C.muted }}>
            <Search size={48} color={C.muted} style={{ margin: "0 auto 12px", display: "block" }} />
            <p>No places found for this category</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(place => <PlaceCard key={place.id} place={place} onClick={() => onSelectPlace(place)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceCard({ place, onClick }) {
  return (
    <GlassCard onClick={onClick} style={{ display: "flex", gap: 14, padding: 14, cursor: "pointer", transition: "transform 0.2s" }}>
      <div style={{ width: 100, height: 100, borderRadius: 12, flexShrink: 0, background: `linear-gradient(145deg, ${place.color}44, ${place.color}22)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${place.color}33` }}>
        <PlaceIcon category={place.category} size={40} color={place.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: C.white, lineHeight: 1.3 }}>{place.name}</h3>
        <p style={{ color: C.muted, fontSize: 12, margin: "4px 0", display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin size={11} color={C.muted} /> {place.location}
        </p>
        <StarRating rating={place.rating} />
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          <GoldBadge><CheckCircle size={9} color="#3A0353" /> Authentic</GoldBadge>
          <span style={{ background: "rgba(128,74,138,0.3)", color: C.muted, fontSize: 10, padding: "2px 8px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 3 }}>
            <Navigation size={9} color={C.muted} /> {place.distance}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

function ListingScreen({ onSelectPlace }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = PLACES.filter(p => (activeFilter === "all" || p.category === activeFilter) && (!search || p.name.toLowerCase().includes(search.toLowerCase())));

  return (
    <div style={S.screen}>
      <div style={{ padding: "52px 20px 12px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>Discover</h1>
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 16px" }}>{filtered.length} places found</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(128,74,138,0.15)", borderRadius: 14, padding: "12px 16px", border: "1px solid rgba(128,74,138,0.3)", marginBottom: 16 }}>
          <Search size={16} color={C.muted} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 15, flex: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveFilter(cat.id)} style={{ padding: "6px 14px", borderRadius: 24, whiteSpace: "nowrap", border: `1px solid ${activeFilter === cat.id ? cat.color : "rgba(128,74,138,0.3)"}`, background: activeFilter === cat.id ? `${cat.color}22` : "transparent", color: activeFilter === cat.id ? cat.color : C.muted, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <CategoryIcon id={cat.id} size={14} color={activeFilter === cat.id ? cat.color : C.muted} />
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {filtered.map(place => <GridCard key={place.id} place={place} onClick={() => onSelectPlace(place)} />)}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "span 2", textAlign: "center", padding: 40, color: C.muted }}>
            <Search size={48} color={C.muted} style={{ margin: "0 auto 12px", display: "block" }} />
            <p>No results found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GridCard({ place, onClick }) {
  return (
    <GlassCard onClick={onClick} style={{ cursor: "pointer", overflow: "hidden" }}>
      <div style={{ height: 100, background: `linear-gradient(145deg, ${place.color}44, ${place.color}11)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <PlaceIcon category={place.category} size={44} color={place.color} />
      </div>
      <div style={{ padding: "10px 12px" }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, margin: "0 0 4px", color: C.white, lineHeight: 1.3 }}>{place.name}</h3>
        <StarRating rating={place.rating} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span style={{ color: C.muted, fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} color={C.muted} /> {place.distance}</span>
          <GoldBadge><CheckCircle size={9} color="#3A0353" /></GoldBadge>
        </div>
      </div>
    </GlassCard>
  );
}

function DetailScreen({ place, onBack, onSave, saved }) {
  const [activeTab, setActiveTab] = useState("about");
  const isSaved = saved.includes(place.id);

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: gradBg }}>
      <div style={{ height: 280, background: `linear-gradient(180deg, ${place.color}33 0%, ${C.bgDeep} 100%)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <PlaceIcon category={place.category} size={100} color={place.color} />
        <button onClick={onBack} style={{ position: "absolute", top: 52, left: 20, width: 40, height: 40, borderRadius: 12, background: "rgba(13,6,24,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={18} color={C.white} />
        </button>
        <div style={{ position: "absolute", top: 52, right: 20, display: "flex", gap: 8 }}>
          <button onClick={() => onSave(place.id)} style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(13,6,24,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bookmark size={18} color={isSaved ? C.gold2 : C.white} fill={isSaved ? C.gold2 : "none"} />
          </button>
          <button style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(13,6,24,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Share2 size={18} color={C.white} />
          </button>
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 20, background: `${place.color}33`, borderRadius: 10, padding: "4px 12px", border: `1px solid ${place.color}55`, fontSize: 12, color: place.color, display: "flex", alignItems: "center", gap: 6 }}>
          <CategoryIcon id={place.category} size={11} color={place.color} />
          {CATEGORIES.find(c => c.id === place.category)?.label || place.category}
        </div>
      </div>
      <div style={{ padding: "0 20px 100px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "16px 0 4px" }}>{place.name}</h1>
          <p style={{ color: C.muted, fontSize: 14, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={13} color={C.muted} /> {place.location} · {place.distance}
          </p>
          <div style={{ marginTop: 8 }}><StarRating rating={place.rating} /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {place.tags.map(tag => <span key={tag} style={{ background: "rgba(128,74,138,0.2)", color: C.muted, fontSize: 12, padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(128,74,138,0.3)" }}>{tag}</span>)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <ScoreCard label="Authenticity Score" value={place.authenticity} color={C.gold2} Icon={Star} />
          <ScoreCard label="Popularity Score" value={place.popularity} color={C.purple1} Icon={TrendingUp} />
        </div>
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid rgba(128,74,138,0.3)" }}>
          {["about", "reviews"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 20px", background: "none", border: "none", color: activeTab === tab ? C.gold2 : C.muted, fontSize: 14, fontWeight: activeTab === tab ? 700 : 400, cursor: "pointer", borderBottom: activeTab === tab ? `2px solid ${C.gold2}` : "2px solid transparent", marginBottom: -1 }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {activeTab === "about" ? (
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7 }}>{place.desc}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {place.reviews.map((r, i) => (
              <GlassCard key={i} style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{r.user}</span>
                  <span style={{ display: "flex", gap: 2 }}>{[...Array(r.stars)].map((_, j) => <Star key={j} size={12} fill={C.gold2} color={C.gold2} />)}</span>
                </div>
                <p style={{ color: C.muted, fontSize: 14, margin: 0, lineHeight: 1.5 }}>{r.text}</p>
              </GlassCard>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button style={{ flex: 1, padding: "14px", borderRadius: 14, background: gradGold, border: "none", cursor: "pointer", color: "#3A0353", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Plus size={16} color="#3A0353" /> Add to Itinerary
          </button>
          <button style={{ flex: 1, padding: "14px", borderRadius: 14, background: gradPurple, border: "none", cursor: "pointer", color: C.white, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Navigation size={16} color={C.white} /> Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, value, color, Icon }) {
  return (
    <GlassCard style={{ padding: 16, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}><Icon size={24} color={color} /></div>
      <div style={{ fontSize: 28, fontWeight: 800, color, background: `linear-gradient(135deg, ${color}, ${color}99)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{value}%</div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</div>
      <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: "rgba(128,74,138,0.2)", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 2 }} />
      </div>
    </GlassCard>
  );
}

function SavedScreen({ savedIds, onUnsave, onSelectPlace }) {
  const savedPlaces = PLACES.filter(p => savedIds.includes(p.id));
  return (
    <div style={S.screen}>
      <div style={{ padding: "52px 20px 20px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>Saved Places</h1>
        <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>{savedPlaces.length} saved</p>
      </div>
      <div style={{ padding: "0 20px" }}>
        {savedPlaces.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted }}>
            <Bookmark size={64} color={C.muted} style={{ margin: "0 auto 16px", display: "block" }} />
            <h3 style={{ color: C.text }}>Nothing saved yet</h3>
            <p>Bookmark places you love to find them here</p>
          </div>
        ) : (
          savedPlaces.map(place => (
            <div key={place.id} style={{ position: "relative", marginBottom: 12 }}>
              <PlaceCard place={place} onClick={() => onSelectPlace(place)} />
              <button onClick={() => onUnsave(place.id)} style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: 8, background: "rgba(255,107,107,0.2)", border: "1px solid rgba(255,107,107,0.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={14} color="#FF6B6B" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ItineraryScreen() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 2000); return () => clearTimeout(t); }, []);

  const itinerary = [
    { time: "7:30 AM", title: "Breakfast at MTR", desc: "Start with Karnataka's most iconic Rava Idli and filter coffee", Icon: UtensilsCrossed, color: "#FF6B6B", type: "food" },
    { time: "10:00 AM", title: "Lalbagh Botanical Garden", desc: "Morning walk through 240 acres of lush greenery and heritage glasshouse", Icon: TreePine, color: "#4ECDC4", type: "tourist" },
    { time: "12:30 PM", title: "Shivaji Military Hotel", desc: "Authentic Mutton Biryani and Ragi Mudde lunch experience", Icon: UtensilsCrossed, color: "#F59E51", type: "food" },
    { time: "2:30 PM", title: "Commercial Street", desc: "Browse silk sarees, handicrafts and Karnataka specialties", Icon: ShoppingBag, color: "#C7A2FF", type: "shops" },
    { time: "5:00 PM", title: "Sunset at Nandi Hills", desc: "Breathtaking panoramic views of the Deccan plateau", Icon: Camera, color: "#F8D299", type: "tourist" },
    { time: "8:00 PM", title: "Check-in: ITC Windsor", desc: "Heritage luxury hotel with authentic Karnataka hospitality", Icon: Bed, color: "#A8E6CF", type: "stays" },
  ];

  return (
    <div style={S.screen}>
      <div style={{ padding: "52px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: gradGold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={18} color="#3A0353" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>AI Itinerary</h1>
            <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>Bengaluru – 1 Day Plan</p>
          </div>
        </div>
      </div>
      {loading ? (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradGold, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1s ease-in-out infinite alternate" }}>
              <Bot size={28} color="#3A0353" />
            </div>
            <p style={{ color: C.muted }}>AI is building your perfect Karnataka day...</p>
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <Skeleton width={50} height={50} radius={12} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}><Skeleton width="60%" /><Skeleton width="90%" height={12} /></div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "0 20px" }}>
          <GlassCard style={{ padding: "12px 16px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
            <Bot size={28} color={C.gold2} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold2 }}>AI RECOMMENDATION</div>
              <p style={{ color: C.text, fontSize: 13, margin: "2px 0 0", lineHeight: 1.5 }}>Based on your preferences for authentic culture & food, here's your perfect Bengaluru day trip.</p>
            </div>
          </GlassCard>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 23, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg, rgba(128,74,138,0.5), transparent)" }} />
            {itinerary.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${item.color}22`, border: `1.5px solid ${item.color}44`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                    <item.Icon size={22} color={item.color} strokeWidth={1.5} />
                  </div>
                </div>
                <GlassCard style={{ flex: 1, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: C.gold2, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={10} color={C.gold2} /> {item.time}
                    </span>
                    <span style={{ fontSize: 10, background: `${item.color}22`, color: item.color, padding: "2px 8px", borderRadius: 10 }}>
                      {CATEGORIES.find(c => c.id === item.type)?.label}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: "4px 0", color: C.white }}>{item.title}</h3>
                  <p style={{ color: C.muted, fontSize: 13, margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
                </GlassCard>
              </div>
            ))}
          </div>
          <button style={{ width: "100%", padding: "16px", borderRadius: 14, background: gradGold, border: "none", cursor: "pointer", color: "#3A0353", fontSize: 15, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Bookmark size={16} color="#3A0353" /> Save This Itinerary
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileScreen() {
  return (
    <div style={S.screen}>
      <div style={{ padding: "52px 20px 20px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 24px" }}>Profile</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: gradGold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={32} color="#3A0353" />
          </div>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Explorer</h2>
            <p style={{ color: C.muted, fontSize: 14, margin: "0 0 6px" }}>Karnataka Adventurer</p>
            <GoldBadge><Star size={9} color="#3A0353" fill="#3A0353" /> Premium Explorer</GoldBadge>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[{ label: "Places Visited", value: 12, Icon: Map }, { label: "Reviews", value: 8, Icon: Star }, { label: "Saved", value: 5, Icon: Bookmark }].map(s => (
            <GlassCard key={s.label} style={{ padding: "14px 10px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}><s.Icon size={22} color={C.gold2} /></div>
              <div style={{ fontSize: 22, fontWeight: 800, background: gradGold, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{s.label}</div>
            </GlassCard>
          ))}
        </div>
        {[
          { Icon: Trophy, label: "Achievements", sub: "3 badges earned" },
          { Icon: MessageSquare, label: "My Reviews", sub: "8 reviews written" },
          { Icon: Globe, label: "Language", sub: "English" },
          { Icon: Bell, label: "Notifications", sub: "Enabled" },
          { Icon: Info, label: "About Incredible Karnataka", sub: "v1.0.0" },
        ].map(item => (
          <GlassCard key={item.label} style={{ padding: "14px 16px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
            <item.Icon size={22} color={C.gold2} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{item.sub}</div>
            </div>
            <ChevronRight size={16} color={C.muted} />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [appState, setAppState] = useState("splash");
  const [screen, setScreen] = useState("home");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [savedIds, setSavedIds] = useState([1, 3]);

  const navigate = (s) => { setSelectedPlace(null); setScreen(s); };
  const toggleSave = (id) => setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  if (appState === "splash") return <div style={S.app}><div style={S.phone}><SplashScreen onDone={() => setAppState("onboarding")} /></div></div>;
  if (appState === "onboarding") return <div style={S.app}><div style={S.phone}><OnboardingScreen onDone={() => setAppState("auth")} /></div></div>;
  if (appState === "auth") return <div style={S.app}><div style={S.phone}><AuthScreen onLogin={() => setAppState("main")} /></div></div>;

  return (
    <div style={S.app}>
      <div style={S.phone}>
        {selectedPlace ? (
          <DetailScreen place={selectedPlace} onBack={() => setSelectedPlace(null)} onSave={toggleSave} saved={savedIds} />
        ) : (
          <>
            {screen === "home" && <HomeScreen navigate={navigate} onSelectPlace={p => setSelectedPlace(p)} />}
            {screen === "listings" && <ListingScreen onSelectPlace={p => setSelectedPlace(p)} />}
            {screen === "itinerary" && <ItineraryScreen />}
            {screen === "saved" && <SavedScreen savedIds={savedIds} onUnsave={toggleSave} onSelectPlace={p => setSelectedPlace(p)} />}
            {screen === "profile" && <ProfileScreen />}
          </>
        )}
        {appState === "main" && !selectedPlace && <BottomNav active={screen} navigate={navigate} />}
      </div>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0D0618; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(128,74,138,0.4); border-radius: 2px; }
        @keyframes pulse { from { transform: scale(1); opacity: 0.7; } to { transform: scale(1.15); opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        input::placeholder { color: rgba(184,158,196,0.6); }
      `}</style>
    </div>
  );
}
