"use client";
import { useState, useEffect, createContext, useContext, useCallback, useRef } from "react";
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
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch"
  },
  phone: {
    width: "100%",
    maxWidth: 1200,
    minHeight: "100vh",
    background: gradBg,
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 0 50px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
  },
  screen: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "0 0 80px",
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    overflow: "hidden"
  },
  mainArea: {
    flex: 1,
    overflowY: "auto",
    position: "relative",
  }
};

function GlassCard({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "rgba(128,74,138,0.15)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
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
      {[1, 2, 3, 4, 5].map(i => (
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

function BottomNav({ active, navigate, lang }) {
  const tabs = [
    { id: "home", Icon: Map, label: t(lang, "explore") },
    { id: "listings", Icon: Search, label: t(lang, "discover") },
    { id: "itinerary", Icon: Sparkles, label: t(lang, "aiPlan") },
    { id: "saved", Icon: Bookmark, label: t(lang, "saved") },
    { id: "profile", Icon: User, label: t(lang, "profile") },
  ];
  return (
    <div className="mobile-nav" style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      width: "100%", background: "rgba(13,6,24,0.92)", backdropFilter: "blur(20px)",
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

function SideNav({ active, navigate, lang }) {
  const tabs = [
    { id: "home", Icon: Map, label: t(lang, "explore") },
    { id: "listings", Icon: Search, label: t(lang, "discover") },
    { id: "itinerary", Icon: Sparkles, label: t(lang, "aiPlan") },
    { id: "saved", Icon: Bookmark, label: t(lang, "saved") },
    { id: "profile", Icon: User, label: t(lang, "profile") },
  ];
  return (
    <div className="desktop-nav" style={{
      width: 240, height: "100vh", background: "rgba(13,6,24,0.6)", backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(128,74,138,0.3)",
      display: "flex", flexDirection: "column", padding: "32px 16px", zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, padding: "0 12px" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: gradGold, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Landmark size={20} color="#3A0353" />
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.white }}>Karnataka</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tabs.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => navigate(id)} style={{
            background: active === id ? "rgba(245,158,81,0.15)" : "none",
            border: active === id ? `1px solid rgba(245,158,81,0.3)` : "1px solid transparent",
            borderRadius: 12, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 16px", color: active === id ? C.gold2 : C.muted, transition: "all 0.2s",
            textAlign: "left"
          }}>
            <Icon size={20} color={active === id ? C.gold2 : C.muted} />
            <span style={{ fontSize: 15, fontWeight: active === id ? 700 : 500, letterSpacing: 0.5, flex: 1 }}>{label}</span>
            {active === id && <ChevronRight size={16} color={C.gold2} />}
          </button>
        ))}
      </div>
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

// ── Translation System ────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    // Splash
    incredible: "Incredible",
    karnataka: "Karnataka",
    splashTagline: "Discover · Explore · Experience",
    // Onboarding
    skip: "Skip",
    continue_: "Continue",
    getStarted: "Get Started",
    onb1Title: "Hidden Gems",
    onb1Sub: "Discover generational businesses and artisan crafts that have been passed down for centuries.",
    onb2Title: "Hyperlocal Map",
    onb2Sub: "See real-time, location-aware recommendations on an interactive map. Every pin tells a unique story.",
    onb3Title: "AI Recommendations",
    onb3Sub: "Our AI learns your specific tastes and builds personalized itineraries for an authentic Karnataka journey.",
    // Auth
    welcomeBack: "Welcome back",
    joinUs: "Join us today",
    loginSub: "Plan. Discover. Experience.",
    registerSub: "Discover Karnataka's true soul",
    fullName: "Full name",
    emailAddress: "Email address",
    password: "Password",
    logIn: "Log In",
    createAccount: "Create Account",
    noAccount: "Don't have an account? ",
    haveAccount: "Already have an account? ",
    createNew: "Create new account",
    logInLink: "Log in",
    validEmail: "Valid email required",
    minChars: "Min 6 characters",
    nameRequired: "Name required",
    // Nav
    explore: "Explore",
    discover: "Discover",
    aiPlan: "AI Plan",
    saved: "Saved",
    profile: "Profile",
    // Home
    locationLabel: "Bengaluru, Karnataka",
    discoverKarnataka: "Discover Karnataka",
    searchPlaceholder: "Search places, food, experiences...",
    interactiveMap: "Interactive Map",
    autoDetected: "Auto-detected",
    nearbyDiscoveries: "Nearby Discoveries",
    seeAll: "See all",
    noPlaces: "No places found for this category",
    authentic: "Authentic",
    // Categories
    catAll: "All",
    catFood: "Food",
    catCrafts: "Crafts",
    catShops: "Shops",
    catTourist: "Tourist",
    catStays: "Stays",
    // Listings
    placesFound: "places found",
    search: "Search...",
    noResults: "No results found",
    // Detail
    authenticityScore: "Authenticity Score",
    popularityScore: "Popularity Score",
    about: "About",
    reviews: "Reviews",
    addToItinerary: "Add to Itinerary",
    getDirections: "Get Directions",
    // Itinerary
    aiItinerary: "AI Itinerary",
    dayPlan: "Bengaluru – 1 Day Plan",
    aiBuilding: "AI is building your perfect Karnataka day...",
    aiRecommendation: "AI RECOMMENDATION",
    aiRecDesc: "Based on your preferences for authentic culture & food, here's your perfect Bengaluru day trip.",
    saveItinerary: "Save This Itinerary",
    itin1Title: "Breakfast at MTR",
    itin1Desc: "Start with Karnataka's most iconic Rava Idli and filter coffee",
    itin2Title: "Lalbagh Botanical Garden",
    itin2Desc: "Morning walk through 240 acres of lush greenery and heritage glasshouse",
    itin3Title: "Shivaji Military Hotel",
    itin3Desc: "Authentic Mutton Biryani and Ragi Mudde lunch experience",
    itin4Title: "Commercial Street",
    itin4Desc: "Browse silk sarees, handicrafts and Karnataka specialties",
    itin5Title: "Sunset at Nandi Hills",
    itin5Desc: "Breathtaking panoramic views of the Deccan plateau",
    itin6Title: "Check-in: ITC Windsor",
    itin6Desc: "Heritage luxury hotel with authentic Karnataka hospitality",
    // Saved
    savedPlaces: "Saved Places",
    nSaved: "saved",
    nothingSaved: "Nothing saved yet",
    bookmarkHint: "Bookmark places you love to find them here",
    // Profile
    explorer: "Explorer",
    karnatakaAdventurer: "Karnataka Adventurer",
    premiumExplorer: "Premium Explorer",
    placesVisited: "Places Visited",
    myReviews: "My Reviews",
    achievements: "Achievements",
    badgesEarned: "3 badges earned",
    reviewsWritten: "8 reviews written",
    language: "Language",
    notifications: "Notifications",
    enabled: "Enabled",
    aboutApp: "About Incredible Karnataka",
    chooseLanguage: "Choose Language",
    // Place data
    place1Name: "MTR – Mavalli Tiffin Rooms",
    place1Loc: "Lalbagh Rd, Bengaluru",
    place1Desc: "Since 1924, MTR has been serving legendary South Indian breakfasts. A 100-year tradition of pure vegetarian Karnataka cuisine that has fed generations.",
    place2Name: "Channapatna Toy Village",
    place2Loc: "Channapatna, Ramanagara",
    place2Desc: "GI-tagged wooden toys crafted using centuries-old techniques. Artisan families pass down this craft, creating vibrant lacquerware pieces unique to Karnataka.",
    place3Name: "Hampi Ruins & Virupaksha Temple",
    place3Loc: "Hampi, Ballari District",
    place3Desc: "UNESCO World Heritage Site. The ruins of the Vijayanagara Empire spread across 26 sq km of otherworldly boulder landscapes. A photographer's paradise.",
    place4Name: "Evolve Back – Coorg Resort",
    place4Loc: "Pollibetta, Coorg",
    place4Desc: "Luxury boutique resort nestled in coffee plantations. Experience Kodava culture, plantation walks, and farm-to-table dining in the misty hills of Coorg.",
    place5Name: "Commercial Street Market",
    place5Loc: "Commercial St, Bengaluru",
    place5Desc: "Bengaluru's most iconic shopping street. From silk sarees and bangles to street food and boutique stores – this 100-year-old market has everything.",
    place6Name: "Coorg Coffee Estates Tour",
    place6Loc: "Madikeri, Coorg",
    place6Desc: "Walk through lush Arabica coffee plantations, learn the harvest process, and taste freshly brewed Coorg coffee straight from the source.",
  },
  hi: {
    incredible: "अतुल्य",
    karnataka: "कर्नाटक",
    splashTagline: "खोजें · देखें · अनुभव करें",
    skip: "छोड़ें",
    continue_: "आगे बढ़ें",
    getStarted: "शुरू करें",
    onb1Title: "छिपे हुए रत्न",
    onb1Sub: "सदियों से चली आ रही पारंपरिक व्यवसायों और कारीगरी की खोज करें।",
    onb2Title: "हाइपरलोकल मैप",
    onb2Sub: "इंटरेक्टिव मैप पर रियल-टाइम, स्थान-आधारित सिफारिशें देखें। हर पिन एक अनोखी कहानी कहता है।",
    onb3Title: "AI सिफारिशें",
    onb3Sub: "हमारा AI आपकी विशेष पसंद को समझता है और एक प्रामाणिक कर्नाटक यात्रा के लिए व्यक्तिगत कार्यक्रम बनाता है।",
    welcomeBack: "वापस स्वागत है",
    joinUs: "आज जुड़ें",
    loginSub: "योजना बनाएं। खोजें। अनुभव करें।",
    registerSub: "कर्नाटक की असली आत्मा खोजें",
    fullName: "पूरा नाम",
    emailAddress: "ईमेल पता",
    password: "पासवर्ड",
    logIn: "लॉग इन",
    createAccount: "खाता बनाएं",
    noAccount: "खाता नहीं है? ",
    haveAccount: "पहले से खाता है? ",
    createNew: "नया खाता बनाएं",
    logInLink: "लॉग इन करें",
    validEmail: "वैध ईमेल आवश्यक",
    minChars: "न्यूनतम 6 अक्षर",
    nameRequired: "नाम आवश्यक",
    explore: "अन्वेषण",
    discover: "खोजें",
    aiPlan: "AI योजना",
    saved: "सहेजा गया",
    profile: "प्रोफ़ाइल",
    locationLabel: "बेंगलुरु, कर्नाटक",
    discoverKarnataka: "कर्नाटक खोजें",
    searchPlaceholder: "स्थान, भोजन, अनुभव खोजें...",
    interactiveMap: "इंटरेक्टिव मैप",
    autoDetected: "स्वतः पहचाना गया",
    nearbyDiscoveries: "आस-पास की खोजें",
    seeAll: "सभी देखें",
    noPlaces: "इस श्रेणी में कोई स्थान नहीं मिला",
    authentic: "प्रामाणिक",
    catAll: "सभी",
    catFood: "भोजन",
    catCrafts: "शिल्प",
    catShops: "दुकानें",
    catTourist: "पर्यटन",
    catStays: "ठहराव",
    placesFound: "स्थान मिले",
    search: "खोजें...",
    noResults: "कोई परिणाम नहीं मिला",
    authenticityScore: "प्रामाणिकता स्कोर",
    popularityScore: "लोकप्रियता स्कोर",
    about: "परिचय",
    reviews: "समीक्षाएं",
    addToItinerary: "यात्रा कार्यक्रम में जोड़ें",
    getDirections: "दिशा-निर्देश प्राप्त करें",
    aiItinerary: "AI यात्रा कार्यक्रम",
    dayPlan: "बेंगलुरु – 1 दिन की योजना",
    aiBuilding: "AI आपका परफेक्ट कर्नाटक दिन बना रहा है...",
    aiRecommendation: "AI सिफारिश",
    aiRecDesc: "प्रामाणिक संस्कृति और भोजन की आपकी पसंद के आधार पर, यह आपकी बेंगलुरु दिन की यात्रा है।",
    saveItinerary: "यह यात्रा कार्यक्रम सहेजें",
    itin1Title: "MTR में नाश्ता",
    itin1Desc: "कर्नाटक की सबसे प्रसिद्ध रवा इडली और फिल्टर कॉफी से शुरुआत करें",
    itin2Title: "लालबाग वनस्पति उद्यान",
    itin2Desc: "240 एकड़ हरियाली और विरासत ग्लासहाउस में सुबह की सैर",
    itin3Title: "शिवाजी मिलिट्री होटल",
    itin3Desc: "प्रामाणिक मटन बिरयानी और रागी मुद्दे का दोपहर का भोजन",
    itin4Title: "कमर्शियल स्ट्रीट",
    itin4Desc: "रेशमी साड़ियां, हस्तशिल्प और कर्नाटक विशेषताएं देखें",
    itin5Title: "नंदी हिल्स पर सूर्यास्त",
    itin5Desc: "दक्कन पठार के लुभावने मनोरम दृश्य",
    itin6Title: "चेक-इन: ITC विंडसर",
    itin6Desc: "प्रामाणिक कर्नाटक आतिथ्य के साथ विरासत लक्जरी होटल",
    savedPlaces: "सहेजे गए स्थान",
    nSaved: "सहेजे गए",
    nothingSaved: "अभी तक कुछ सहेजा नहीं गया",
    bookmarkHint: "अपने पसंदीदा स्थानों को बुकमार्क करें",
    explorer: "अन्वेषक",
    karnatakaAdventurer: "कर्नाटक साहसी",
    premiumExplorer: "प्रीमियम अन्वेषक",
    placesVisited: "स्थान देखे गए",
    myReviews: "मेरी समीक्षाएं",
    achievements: "उपलब्धियां",
    badgesEarned: "3 बैज अर्जित",
    reviewsWritten: "8 समीक्षाएं लिखी",
    language: "भाषा",
    notifications: "सूचनाएं",
    enabled: "सक्षम",
    aboutApp: "अतुल्य कर्नाटक के बारे में",
    chooseLanguage: "भाषा चुनें",
    place1Name: "MTR – मावल्ली टिफिन रूम्स",
    place1Loc: "लालबाग रोड, बेंगलुरु",
    place1Desc: "1924 से, MTR महान दक्षिण भारतीय नाश्ता परोस रहा है। शुद्ध शाकाहारी कर्नाटक व्यंजनों की 100 साल की परंपरा।",
    place2Name: "चन्नपटना खिलौना गांव",
    place2Loc: "चन्नपटना, रामनगर",
    place2Desc: "सदियों पुरानी तकनीकों से बने GI-टैग वाले लकड़ी के खिलौने। कारीगर परिवार कर्नाटक की अनूठी लाक शिल्प विरासत को आगे बढ़ाते हैं।",
    place3Name: "हम्पी खंडहर और विरूपाक्ष मंदिर",
    place3Loc: "हम्पी, बल्लारी",
    place3Desc: "यूनेस्को विश्व धरोहर स्थल। विजयनगर साम्राज्य के खंडहर 26 वर्ग किमी में फैले हैं। एक फोटोग्राफर का स्वर्ग।",
    place4Name: "इवॉल्व बैक – कूर्ग रिसॉर्ट",
    place4Loc: "पोलीबेट्टा, कूर्ग",
    place4Desc: "कॉफी बागानों में बसा लक्जरी बुटीक रिसॉर्ट। कोडवा संस्कृति, बागान सैर और कूर्ग की धुंधली पहाड़ियों में फार्म-टू-टेबल भोजन।",
    place5Name: "कमर्शियल स्ट्रीट मार्केट",
    place5Loc: "कमर्शियल स्ट्रीट, बेंगलुरु",
    place5Desc: "बेंगलुरु की सबसे प्रतिष्ठित खरीदारी सड़क। रेशमी साड़ियों से लेकर स्ट्रीट फूड तक – इस 100 साल पुराने बाज़ार में सब कुछ है।",
    place6Name: "कूर्ग कॉफी एस्टेट टूर",
    place6Loc: "मदिकेरी, कूर्ग",
    place6Desc: "हरे-भरे अरेबिका कॉफी बागानों में चलें, फसल की प्रक्रिया सीखें और सीधे स्रोत से ताज़ा कूर्ग कॉफी का स्वाद लें।",
  },
  kn: {
    incredible: "ಅದ್ಭುತ",
    karnataka: "ಕರ್ನಾಟಕ",
    splashTagline: "ಅನ್ವೇಷಿಸಿ · ಪರಿಶೋಧಿಸಿ · ಅನುಭವಿಸಿ",
    skip: "ಬಿಟ್ಟುಬಿಡಿ",
    continue_: "ಮುಂದುವರಿಸಿ",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ",
    onb1Title: "ಅಡಗಿರುವ ರತ್ನಗಳು",
    onb1Sub: "ಶತಮಾನಗಳಿಂದ ಹಸ್ತಾಂತರಗೊಂಡ ಪಾರಂಪರಿಕ ವ್ಯವಹಾರಗಳು ಮತ್ತು ಕುಶಲಕರ್ಮಿ ಕಲೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
    onb2Title: "ಹೈಪರ್‌ಲೋಕಲ್ ನಕ್ಷೆ",
    onb2Sub: "ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆಯಲ್ಲಿ ನೈಜ-ಸಮಯದ, ಸ್ಥಳ-ಆಧಾರಿತ ಶಿಫಾರಸುಗಳನ್ನು ನೋಡಿ. ಪ್ರತಿ ಪಿನ್ ಒಂದು ವಿಶಿಷ್ಟ ಕಥೆಯನ್ನು ಹೇಳುತ್ತದೆ.",
    onb3Title: "AI ಶಿಫಾರಸುಗಳು",
    onb3Sub: "ನಮ್ಮ AI ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಅಭಿರುಚಿಗಳನ್ನು ಕಲಿಯುತ್ತದೆ ಮತ್ತು ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಪ್ರವಾಸಕ್ಕಾಗಿ ವೈಯಕ್ತಿಕ ಯಾತ್ರಾ ಯೋಜನೆಗಳನ್ನು ರಚಿಸುತ್ತದೆ.",
    welcomeBack: "ಮರಳಿ ಸ್ವಾಗತ",
    joinUs: "ಇಂದು ಸೇರಿ",
    loginSub: "ಯೋಜಿಸಿ. ಅನ್ವೇಷಿಸಿ. ಅನುಭವಿಸಿ.",
    registerSub: "ಕರ್ನಾಟಕದ ನಿಜವಾದ ಆತ್ಮವನ್ನು ಅನ್ವೇಷಿಸಿ",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    emailAddress: "ಇಮೇಲ್ ವಿಳಾಸ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    logIn: "ಲಾಗ್ ಇನ್",
    createAccount: "ಖಾತೆ ರಚಿಸಿ",
    noAccount: "ಖಾತೆ ಇಲ್ಲವೇ? ",
    haveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ",
    createNew: "ಹೊಸ ಖಾತೆ ರಚಿಸಿ",
    logInLink: "ಲಾಗ್ ಇನ್ ಮಾಡಿ",
    validEmail: "ಮಾನ್ಯ ಇಮೇಲ್ ಅಗತ್ಯ",
    minChars: "ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು",
    nameRequired: "ಹೆಸರು ಅಗತ್ಯ",
    explore: "ಅನ್ವೇಷಿಸಿ",
    discover: "ಹುಡುಕಿ",
    aiPlan: "AI ಯೋಜನೆ",
    saved: "ಉಳಿಸಲಾಗಿದೆ",
    profile: "ಪ್ರೊಫೈಲ್",
    locationLabel: "ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ",
    discoverKarnataka: "ಕರ್ನಾಟಕ ಅನ್ವೇಷಿಸಿ",
    searchPlaceholder: "ಸ್ಥಳಗಳು, ಆಹಾರ, ಅನುಭವಗಳನ್ನು ಹುಡುಕಿ...",
    interactiveMap: "ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ",
    autoDetected: "ಸ್ವಯಂ-ಪತ್ತೆ",
    nearbyDiscoveries: "ಹತ್ತಿರದ ಆವಿಷ್ಕಾರಗಳು",
    seeAll: "ಎಲ್ಲಾ ನೋಡಿ",
    noPlaces: "ಈ ವರ್ಗದಲ್ಲಿ ಸ್ಥಳಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    authentic: "ಅಧಿಕೃತ",
    catAll: "ಎಲ್ಲಾ",
    catFood: "ಆಹಾರ",
    catCrafts: "ಕರಕುಶಲ",
    catShops: "ಅಂಗಡಿಗಳು",
    catTourist: "ಪ್ರವಾಸಿ",
    catStays: "ತಂಗುವಿಕೆ",
    placesFound: "ಸ್ಥಳಗಳು ಕಂಡುಬಂದಿವೆ",
    search: "ಹುಡುಕಿ...",
    noResults: "ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    authenticityScore: "ಅಧಿಕೃತತೆ ಅಂಕ",
    popularityScore: "ಜನಪ್ರಿಯತೆ ಅಂಕ",
    about: "ಕುರಿತು",
    reviews: "ವಿಮರ್ಶೆಗಳು",
    addToItinerary: "ಯಾತ್ರಾ ಯೋಜನೆಗೆ ಸೇರಿಸಿ",
    getDirections: "ದಿಕ್ಕುಗಳನ್ನು ಪಡೆಯಿರಿ",
    aiItinerary: "AI ಯಾತ್ರಾ ಯೋಜನೆ",
    dayPlan: "ಬೆಂಗಳೂರು – 1 ದಿನದ ಯೋಜನೆ",
    aiBuilding: "AI ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ಕರ್ನಾಟಕ ದಿನವನ್ನು ರಚಿಸುತ್ತಿದೆ...",
    aiRecommendation: "AI ಶಿಫಾರಸು",
    aiRecDesc: "ಅಧಿಕೃತ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಆಹಾರದ ನಿಮ್ಮ ಆದ್ಯತೆಗಳ ಆಧಾರದ ಮೇಲೆ, ಇಲ್ಲಿ ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ಬೆಂಗಳೂರು ದಿನ ಪ್ರವಾಸ.",
    saveItinerary: "ಈ ಯಾತ್ರಾ ಯೋಜನೆಯನ್ನು ಉಳಿಸಿ",
    itin1Title: "MTR ನಲ್ಲಿ ಉಪಾಹಾರ",
    itin1Desc: "ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ರವಾ ಇಡ್ಲಿ ಮತ್ತು ಫಿಲ್ಟರ್ ಕಾಫಿಯೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಿ",
    itin2Title: "ಲಾಲ್‌ಬಾಗ್ ಸಸ್ಯೋದ್ಯಾನ",
    itin2Desc: "240 ಎಕರೆ ಹಸಿರಿನ ಮಧ್ಯೆ ಬೆಳಗಿನ ನಡಿಗೆ",
    itin3Title: "ಶಿವಾಜಿ ಮಿಲಿಟರಿ ಹೋಟೆಲ್",
    itin3Desc: "ಅಧಿಕೃತ ಮಟನ್ ಬಿರಿಯಾನಿ ಮತ್ತು ರಾಗಿ ಮುದ್ದೆ ಊಟ",
    itin4Title: "ಕಮರ್ಷಿಯಲ್ ಸ್ಟ್ರೀಟ್",
    itin4Desc: "ರೇಷ್ಮೆ ಸೀರೆಗಳು, ಕರಕುಶಲ ವಸ್ತುಗಳು ಮತ್ತು ಕರ್ನಾಟಕ ವಿಶೇಷತೆಗಳು",
    itin5Title: "ನಂದಿ ಬೆಟ್ಟದಲ್ಲಿ ಸೂರ್ಯಾಸ್ತ",
    itin5Desc: "ದಖ್ಖನ್ ಪ್ರಸ್ಥಭೂಮಿಯ ಮನಮೋಹಕ ದೃಶ್ಯಗಳು",
    itin6Title: "ಚೆಕ್-ಇನ್: ITC ವಿಂಡ್ಸರ್",
    itin6Desc: "ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಆತಿಥ್ಯದೊಂದಿಗೆ ಪರಂಪರೆ ಐಷಾರಾಮಿ ಹೋಟೆಲ್",
    savedPlaces: "ಉಳಿಸಿದ ಸ್ಥಳಗಳು",
    nSaved: "ಉಳಿಸಲಾಗಿದೆ",
    nothingSaved: "ಇನ್ನೂ ಏನನ್ನೂ ಉಳಿಸಿಲ್ಲ",
    bookmarkHint: "ನಿಮ್ಮ ನೆಚ್ಚಿನ ಸ್ಥಳಗಳನ್ನು ಬುಕ್‌ಮಾರ್ಕ್ ಮಾಡಿ",
    explorer: "ಅನ್ವೇಷಕ",
    karnatakaAdventurer: "ಕರ್ನಾಟಕ ಸಾಹಸಿ",
    premiumExplorer: "ಪ್ರೀಮಿಯಂ ಅನ್ವೇಷಕ",
    placesVisited: "ಭೇಟಿ ನೀಡಿದ ಸ್ಥಳಗಳು",
    myReviews: "ನನ್ನ ವಿಮರ್ಶೆಗಳು",
    achievements: "ಸಾಧನೆಗಳು",
    badgesEarned: "3 ಬ್ಯಾಡ್ಜ್ ಗಳಿಸಲಾಗಿದೆ",
    reviewsWritten: "8 ವಿಮರ್ಶೆಗಳು ಬರೆಯಲಾಗಿದೆ",
    language: "ಭಾಷೆ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    enabled: "ಸಕ್ರಿಯ",
    aboutApp: "ಅದ್ಭುತ ಕರ್ನಾಟಕ ಬಗ್ಗೆ",
    chooseLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    place1Name: "MTR – ಮಾವಳ್ಳಿ ಟಿಫಿನ್ ರೂಮ್ಸ್",
    place1Loc: "ಲಾಲ್‌ಬಾಗ್ ರಸ್ತೆ, ಬೆಂಗಳೂರು",
    place1Desc: "1924 ರಿಂದ, MTR ದಂತಕಥೆಯ ದಕ್ಷಿಣ ಭಾರತೀಯ ಉಪಾಹಾರವನ್ನು ಬಡಿಸುತ್ತಿದೆ. ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ ಕರ್ನಾಟಕ ಅಡುಗೆಯ 100 ವರ್ಷಗಳ ಸಂಪ್ರದಾಯ.",
    place2Name: "ಚನ್ನಪಟ್ಟಣ ಗೊಂಬೆ ಗ್ರಾಮ",
    place2Loc: "ಚನ್ನಪಟ್ಟಣ, ರಾಮನಗರ",
    place2Desc: "ಶತಮಾನಗಳ ಹಳೆಯ ತಂತ್ರಗಳಿಂದ ತಯಾಸಿದ GI-ಟ್ಯಾಗ್ ಮರದ ಗೊಂಬೆಗಳು. ಕರ್ನಾಟಕಕ್ಕೆ ವಿಶಿಷ್ಟವಾದ ಲಕ್ಕದ ಕಲಾಕೃತಿಗಳು.",
    place3Name: "ಹಂಪಿ ಅವಶೇಷಗಳು ಮತ್ತು ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ",
    place3Loc: "ಹಂಪಿ, ಬಳ್ಳಾರಿ",
    place3Desc: "ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪಾರಂಪರಿಕ ತಾಣ. ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಅವಶೇಷಗಳು 26 ಚದರ ಕಿಮೀ ಉದ್ದಕ್ಕೂ ಹರಡಿವೆ. ಛಾಯಾಗ್ರಾಹಕರ ಸ್ವರ್ಗ.",
    place4Name: "ಇವಾಲ್ವ್ ಬ್ಯಾಕ್ – ಕೊಡಗು ರಿಸಾರ್ಟ್",
    place4Loc: "ಪೊಲ್ಲಿಬೆಟ್ಟ, ಕೊಡಗು",
    place4Desc: "ಕಾಫಿ ತೋಟಗಳಲ್ಲಿ ನೆಲೆಸಿರುವ ಐಷಾರಾಮಿ ರಿಸಾರ್ಟ್. ಕೊಡವ ಸಂಸ್ಕೃತಿ, ತೋಟದ ನಡಿಗೆ ಮತ್ತು ಕೊಡಗಿನ ಮಂಜಿನ ಬೆಟ್ಟಗಳಲ್ಲಿ ಫಾರ್ಮ್-ಟು-ಟೇಬಲ್ ಊಟ.",
    place5Name: "ಕಮರ್ಷಿಯಲ್ ಸ್ಟ್ರೀಟ್ ಮಾರುಕಟ್ಟೆ",
    place5Loc: "ಕಮರ್ಷಿಯಲ್ ಸ್ಟ್ರೀಟ್, ಬೆಂಗಳೂರು",
    place5Desc: "ಬೆಂಗಳೂರಿನ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ಶಾಪಿಂಗ್ ಬೀದಿ. ರೇಷ್ಮೆ ಸೀರೆಗಳಿಂದ ಬೀದಿ ಆಹಾರದವರೆಗೆ – ಈ 100 ವರ್ಷ ಹಳೆಯ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಎಲ್ಲವೂ ಇದೆ.",
    place6Name: "ಕೊಡಗು ಕಾಫಿ ಎಸ್ಟೇಟ್ ಟೂರ್",
    place6Loc: "ಮಡಿಕೇರಿ, ಕೊಡಗು",
    place6Desc: "ಹಸಿರಿನ ಅರೆಬಿಕಾ ಕಾಫಿ ತೋಟಗಳಲ್ಲಿ ನಡೆಯಿರಿ, ಕೊಯ್ಲು ಪ್ರಕ್ರಿಯೆ ಕಲಿಯಿರಿ ಮತ್ತು ನೇರ ಮೂಲದಿಂದ ತಾಜಾ ಕೊಡಗು ಕಾಫಿ ರುಚಿ ನೋಡಿ.",
  },
};

const LANG_LABELS = { en: "English", hi: "हिंदी", kn: "ಕನ್ನಡ" };
const LANG_CODES = { hi: "hi", kn: "kn" };

// ── Smart Translation System ──────────────────────────────────────
// Static dictionary lookup (instant)
function t(lang, key) {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}

// Translation cache in localStorage
function getCachedTranslation(lang, text) {
  if (typeof window === "undefined") return null;
  try {
    const cache = JSON.parse(localStorage.getItem("_translations") || "{}");
    return cache[`${lang}:${text}`] || null;
  } catch { return null; }
}

function setCachedTranslation(lang, text, translated) {
  if (typeof window === "undefined") return;
  try {
    const cache = JSON.parse(localStorage.getItem("_translations") || "{}");
    cache[`${lang}:${text}`] = translated;
    localStorage.setItem("_translations", JSON.stringify(cache));
  } catch { /* localStorage full or unavailable */ }
}

// Free MyMemory Translation API
async function translateText(text, targetLang) {
  if (!text || targetLang === "en") return text;
  const cached = getCachedTranslation(targetLang, text);
  if (cached) return cached;
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      setCachedTranslation(targetLang, text, translated);
      return translated;
    }
  } catch { /* API unavailable, fallback to English */ }
  return text;
}

// React hook for auto-translation of arbitrary text
const TranslationContext = createContext({ lang: "en", setLang: () => { } });

function useAutoTranslate(englishText) {
  const { lang } = useContext(TranslationContext);
  const [apiResults, setApiResults] = useState({});

  // Synchronous: check dictionary/cache in render phase (no effect needed)
  const syncResult = lang === "en"
    ? englishText
    : getCachedTranslation(lang, englishText);

  // Async: fetch from API only when no cached result exists
  useEffect(() => {
    if (lang === "en" || getCachedTranslation(lang, englishText)) return;

    let cancelled = false;
    translateText(englishText, lang).then(result => {
      if (!cancelled) {
        setApiResults(prev => ({ ...prev, [`${lang}:${englishText}`]: result }));
      }
    });
    return () => { cancelled = true; };
  }, [lang, englishText]);

  if (lang === "en") return englishText;
  return syncResult || apiResults[`${lang}:${englishText}`] || englishText;
}

function getLocalizedPlace(place, lang) {
  const idx = place.id;
  return {
    ...place,
    name: t(lang, `place${idx}Name`),
    location: t(lang, `place${idx}Loc`),
    desc: t(lang, `place${idx}Desc`),
  };
}

function getLocalizedCategories(lang) {
  return CATEGORIES.map(cat => ({
    ...cat,
    label: t(lang, `cat${cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}`),
  }));
}

function SplashScreen({ onDone, lang }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => onDone(), 2800);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: gradBg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(128,74,138,0.3) 0%, transparent 70%)", top: -80, right: -80 }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,81,0.2) 0%, transparent 70%)", bottom: 60, left: -50 }} />
      <div style={{ transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)", transform: phase >= 1 ? "scale(1) translateY(0)" : "scale(0.3) translateY(60px)", opacity: phase >= 1 ? 1 : 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 100, height: 100, borderRadius: 28, background: gradGold, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px rgba(245,158,81,0.5)` }}>
          <Landmark size={52} color="#3A0353" strokeWidth={1.5} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, backgroundImage: `linear-gradient(135deg, ${C.gold1}, ${C.gold2})`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>{t(lang, "incredible")}</div>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: C.white, lineHeight: 1 }}>{t(lang, "karnataka")}</div>
        </div>
      </div>
      <div style={{ marginTop: 32, textAlign: "center", transition: "all 0.6s ease", opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(20px)" }}>
        <p style={{ color: C.muted, fontSize: 15, letterSpacing: 2, textTransform: "uppercase" }}>{t(lang, "splashTagline")}</p>
      </div>
      <div style={{ position: "absolute", bottom: 80, display: "flex", gap: 8, opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.5s ease 0.8s" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: i === 1 ? C.gold2 : C.purple1, animation: `pulse ${0.8 + i * 0.2}s ease-in-out infinite alternate` }} />
        ))}
      </div>
    </div>
  );
}

function OnboardingScreen({ onDone, lang }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { Icon: Gem, title: t(lang, "onb1Title"), subtitle: t(lang, "onb1Sub"), color: C.purple1 },
    { Icon: Map, title: t(lang, "onb2Title"), subtitle: t(lang, "onb2Sub"), color: "#4ECDC4" },
    { Icon: Bot, title: t(lang, "onb3Title"), subtitle: t(lang, "onb3Sub"), color: C.gold2 },
  ];
  const current = slides[slide];

  return (
    <div style={{ width: "100%", height: "100vh", background: gradBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "60px 28px 48px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onDone} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
          {t(lang, "skip")} <ChevronRight size={14} />
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, flex: 1, justifyContent: "center" }}>
        <div style={{ width: 160, height: 160, borderRadius: 48, background: `linear-gradient(145deg, ${current.color}33, ${current.color}11)`, border: `2px solid ${current.color}44`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${current.color}33`, transition: "all 0.4s ease" }}>
          <current.Icon size={72} color={current.color} strokeWidth={1.2} />
        </div>
        <div style={{ textAlign: "center", maxWidth: 300 }}>
          <h2 style={{ fontSize: 30, lineHeight: 1.2, fontWeight: 800, marginBottom: 16, backgroundImage: `linear-gradient(135deg, ${C.white}, ${current.color})`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>{current.title}</h2>
          <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.6 }}>{current.subtitle}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, background: i === slide ? C.gold2 : C.purple1, transition: "all 0.3s ease", cursor: "pointer" }} />
        ))}
      </div>
      <button onClick={() => slide < slides.length - 1 ? setSlide(slide + 1) : onDone()} style={{ width: "100%", padding: "16px", borderRadius: 16, background: gradGold, border: "none", cursor: "pointer", color: "#3A0353", fontSize: 16, fontWeight: 700, letterSpacing: 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {slide < slides.length - 1 ? <><span>{t(lang, "continue_")}</span><ChevronRight size={18} /></> : <><span>{t(lang, "getStarted")}</span><Navigation size={18} /></>}
      </button>
    </div>
  );
}

function AuthScreen({ onLogin, lang }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = t(lang, "validEmail");
    if (form.password.length < 6) e.password = t(lang, "minChars");
    if (mode === "register" && !form.name) e.name = t(lang, "nameRequired");
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
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.white, margin: 0 }}>{mode === "login" ? t(lang, "welcomeBack") : t(lang, "joinUs")}</h1>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>{mode === "login" ? t(lang, "loginSub") : t(lang, "registerSub")}</p>
      </div>
      <GlassCard style={{ width: "100%", padding: 28, boxSizing: "border-box" }}>
        {mode === "register" && <div style={{ marginBottom: 16 }}><InputField Icon={User} placeholder={t(lang, "fullName")} value={form.name} onChange={v => setForm({ ...form, name: v })} error={errors.name} /></div>}
        <div style={{ marginBottom: 16 }}><InputField Icon={Globe} placeholder={t(lang, "emailAddress")} value={form.email} onChange={v => setForm({ ...form, email: v })} error={errors.email} type="email" /></div>
        <div style={{ marginBottom: 24 }}><InputField Icon={CheckCircle} placeholder={t(lang, "password")} value={form.password} onChange={v => setForm({ ...form, password: v })} error={errors.password} type="password" /></div>
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: 12, background: loading ? "rgba(245,158,81,0.5)" : gradPurple, border: "none", cursor: loading ? "not-allowed" : "pointer", color: C.white, fontSize: 16, fontWeight: 700, transition: "all 0.2s" }}>
          {loading ? "..." : mode === "login" ? t(lang, "logIn") : t(lang, "createAccount")}
        </button>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ color: C.muted, fontSize: 14 }}>{mode === "login" ? t(lang, "noAccount") : t(lang, "haveAccount")}</span>
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", cursor: "pointer", color: C.gold2, fontSize: 14, fontWeight: 600 }}>
            {mode === "login" ? t(lang, "createNew") : t(lang, "logInLink")}
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
        <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 15, flex: 1, width: "100%" }} />
      </div>
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 4, paddingLeft: 8 }}>{error}</div>}
    </div>
  );
}

function HomeScreen({ navigate, onSelectPlace, lang }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tm = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(tm);
  }, []);

  const filtered = activeFilter === "all" ? PLACES : PLACES.filter(p => p.category === activeFilter);
  const localCats = getLocalizedCategories(lang);

  return (
    <div style={{ ...S.screen, padding: 0 }}>
      <div style={{ padding: "52px 20px 16px", background: "linear-gradient(180deg, rgba(13,6,24,0.95) 0%, transparent 100%)", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: C.muted, fontSize: 13, margin: 0, letterSpacing: 1, display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} color={C.muted} /> {t(lang, "locationLabel")}
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: C.white }}>{t(lang, "discoverKarnataka")}</h1>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: gradGold, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell size={20} color="#3A0353" />
          </div>
        </div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, background: "rgba(128,74,138,0.15)", borderRadius: 14, padding: "12px 16px", border: "1px solid rgba(128,74,138,0.3)" }}>
          <Search size={16} color={C.muted} />
          <span style={{ color: C.muted, fontSize: 15 }}>{t(lang, "searchPlaceholder")}</span>
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
          <Map size={12} color={C.muted} /> {t(lang, "interactiveMap")}
        </div>
        <div style={{ position: "absolute", bottom: 12, left: 12, background: gradGold, borderRadius: 10, padding: "6px 12px", fontSize: 11, color: "#3A0353", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin size={11} color="#3A0353" /> {t(lang, "autoDetected")}
        </div>
      </div>

      <div style={{ padding: "16px 0 8px", overflowX: "auto", display: "flex", gap: 10, paddingLeft: 20 }}>
        {localCats.map(cat => (
          <button key={cat.id} onClick={() => setActiveFilter(cat.id)} style={{ padding: "8px 16px", borderRadius: 24, whiteSpace: "nowrap", border: `1px solid ${activeFilter === cat.id ? cat.color : "rgba(128,74,138,0.3)"}`, background: activeFilter === cat.id ? `${cat.color}22` : "transparent", color: activeFilter === cat.id ? cat.color : C.muted, fontSize: 13, fontWeight: activeFilter === cat.id ? 700 : 400, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
            <CategoryIcon id={cat.id} size={13} color={activeFilter === cat.id ? cat.color : C.muted} />
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "8px 20px 100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{t(lang, "nearbyDiscoveries")}</h2>
          <button onClick={() => navigate("listings")} style={{ background: "none", border: "none", color: C.gold2, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            {t(lang, "seeAll")} <ChevronRight size={13} color={C.gold2} />
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
            <p>{t(lang, "noPlaces")}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(place => <PlaceCard key={place.id} place={getLocalizedPlace(place, lang)} lang={lang} onClick={() => onSelectPlace(place)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceCard({ place, onClick, lang }) {
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
          <GoldBadge><CheckCircle size={9} color="#3A0353" /> {t(lang || "en", "authentic")}</GoldBadge>
          <span style={{ background: "rgba(128,74,138,0.3)", color: C.muted, fontSize: 10, padding: "2px 8px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 3 }}>
            <Navigation size={9} color={C.muted} /> {place.distance}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

function ListingScreen({ onSelectPlace, lang }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = PLACES.filter(p => (activeFilter === "all" || p.category === activeFilter) && (!search || p.name.toLowerCase().includes(search.toLowerCase())));
  const localCats = getLocalizedCategories(lang);

  return (
    <div style={S.screen}>
      <div style={{ padding: "52px 20px 12px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>{t(lang, "discover")}</h1>
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 16px" }}>{filtered.length} {t(lang, "placesFound")}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(128,74,138,0.15)", borderRadius: 14, padding: "12px 16px", border: "1px solid rgba(128,74,138,0.3)", marginBottom: 16 }}>
          <Search size={16} color={C.muted} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t(lang, "search")} style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 15, flex: 1, width: "100%" }} />
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {localCats.map(cat => (
            <button key={cat.id} onClick={() => setActiveFilter(cat.id)} style={{ padding: "6px 14px", borderRadius: 24, whiteSpace: "nowrap", border: `1px solid ${activeFilter === cat.id ? cat.color : "rgba(128,74,138,0.3)"}`, background: activeFilter === cat.id ? `${cat.color}22` : "transparent", color: activeFilter === cat.id ? cat.color : C.muted, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <CategoryIcon id={cat.id} size={14} color={activeFilter === cat.id ? cat.color : C.muted} />
            </button>
          ))}
        </div>
      </div>
      <div className="grid-responsive" style={{ padding: "0 20px" }}>
        {filtered.map(place => <GridCard key={place.id} place={getLocalizedPlace(place, lang)} onClick={() => onSelectPlace(place)} />)}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "span 2", textAlign: "center", padding: 40, color: C.muted }}>
            <Search size={48} color={C.muted} style={{ margin: "0 auto 12px", display: "block" }} />
            <p>{t(lang, "noResults")}</p>
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

function DetailScreen({ place, onBack, onSave, saved, lang }) {
  const [activeTab, setActiveTab] = useState("about");
  const isSaved = saved.includes(place.id);
  const lp = getLocalizedPlace(place, lang);
  const localCats = getLocalizedCategories(lang);

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
          {localCats.find(c => c.id === place.category)?.label || place.category}
        </div>
      </div>
      <div style={{ padding: "0 20px 100px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "16px 0 4px" }}>{lp.name}</h1>
          <p style={{ color: C.muted, fontSize: 14, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={13} color={C.muted} /> {lp.location} · {place.distance}
          </p>
          <div style={{ marginTop: 8 }}><StarRating rating={place.rating} /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {place.tags.map(tag => <span key={tag} style={{ background: "rgba(128,74,138,0.2)", color: C.muted, fontSize: 12, padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(128,74,138,0.3)" }}>{tag}</span>)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <ScoreCard label={t(lang, "authenticityScore")} value={place.authenticity} color={C.gold2} Icon={Star} />
          <ScoreCard label={t(lang, "popularityScore")} value={place.popularity} color={C.purple1} Icon={TrendingUp} />
        </div>
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid rgba(128,74,138,0.3)" }}>
          {["about", "reviews"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 20px", background: "none", border: "none", color: activeTab === tab ? C.gold2 : C.muted, fontSize: 14, fontWeight: activeTab === tab ? 700 : 400, cursor: "pointer", borderBottom: activeTab === tab ? `2px solid ${C.gold2}` : "2px solid transparent", marginBottom: -1 }}>
              {tab === "about" ? t(lang, "about") : t(lang, "reviews")}
            </button>
          ))}
        </div>
        {activeTab === "about" ? (
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7 }}>{lp.desc}</p>
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
            <Plus size={16} color="#3A0353" /> {t(lang, "addToItinerary")}
          </button>
          <button style={{ flex: 1, padding: "14px", borderRadius: 14, background: gradPurple, border: "none", cursor: "pointer", color: C.white, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Navigation size={16} color={C.white} /> {t(lang, "getDirections")}
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
      <div style={{ fontSize: 28, fontWeight: 800, backgroundImage: `linear-gradient(135deg, ${color}, ${color}99)`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>{value}%</div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</div>
      <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: "rgba(128,74,138,0.2)", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 2 }} />
      </div>
    </GlassCard>
  );
}

function SavedScreen({ savedIds, onUnsave, onSelectPlace, lang }) {
  const savedPlaces = PLACES.filter(p => savedIds.includes(p.id));
  return (
    <div style={S.screen}>
      <div style={{ padding: "52px 20px 20px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>{t(lang, "savedPlaces")}</h1>
        <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>{savedPlaces.length} {t(lang, "nSaved")}</p>
      </div>
      <div style={{ padding: "0 20px" }}>
        {savedPlaces.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted }}>
            <Bookmark size={64} color={C.muted} style={{ margin: "0 auto 16px", display: "block" }} />
            <h3 style={{ color: C.text }}>{t(lang, "nothingSaved")}</h3>
            <p>{t(lang, "bookmarkHint")}</p>
          </div>
        ) : (
          savedPlaces.map(place => (
            <div key={place.id} style={{ position: "relative", marginBottom: 12 }}>
              <PlaceCard place={getLocalizedPlace(place, lang)} lang={lang} onClick={() => onSelectPlace(place)} />
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

function ItineraryScreen({ lang }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const tm = setTimeout(() => setLoading(false), 2000); return () => clearTimeout(tm); }, []);

  const itinerary = [
    { time: "7:30 AM", title: t(lang, "itin1Title"), desc: t(lang, "itin1Desc"), Icon: UtensilsCrossed, color: "#FF6B6B", type: "food" },
    { time: "10:00 AM", title: t(lang, "itin2Title"), desc: t(lang, "itin2Desc"), Icon: TreePine, color: "#4ECDC4", type: "tourist" },
    { time: "12:30 PM", title: t(lang, "itin3Title"), desc: t(lang, "itin3Desc"), Icon: UtensilsCrossed, color: "#F59E51", type: "food" },
    { time: "2:30 PM", title: t(lang, "itin4Title"), desc: t(lang, "itin4Desc"), Icon: ShoppingBag, color: "#C7A2FF", type: "shops" },
    { time: "5:00 PM", title: t(lang, "itin5Title"), desc: t(lang, "itin5Desc"), Icon: Camera, color: "#F8D299", type: "tourist" },
    { time: "8:00 PM", title: t(lang, "itin6Title"), desc: t(lang, "itin6Desc"), Icon: Bed, color: "#A8E6CF", type: "stays" },
  ];

  return (
    <div style={S.screen}>
      <div style={{ padding: "52px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: gradGold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={18} color="#3A0353" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{t(lang, "aiItinerary")}</h1>
            <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>{t(lang, "dayPlan")}</p>
          </div>
        </div>
      </div>
      {loading ? (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradGold, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1s ease-in-out infinite alternate" }}>
              <Bot size={28} color="#3A0353" />
            </div>
            <p style={{ color: C.muted }}>{t(lang, "aiBuilding")}</p>
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
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold2 }}>{t(lang, "aiRecommendation")}</div>
              <p style={{ color: C.text, fontSize: 13, margin: "2px 0 0", lineHeight: 1.5 }}>{t(lang, "aiRecDesc")}</p>
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
            <Bookmark size={16} color="#3A0353" /> {t(lang, "saveItinerary")}
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileScreen({ lang, onChangeLang }) {
  const [showLangPicker, setShowLangPicker] = useState(false);
  return (
    <div style={S.screen}>
      <div style={{ padding: "52px 20px 20px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 24px" }}>{t(lang, "profile")}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: gradGold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={32} color="#3A0353" />
          </div>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>{t(lang, "explorer")}</h2>
            <p style={{ color: C.muted, fontSize: 14, margin: "0 0 6px" }}>{t(lang, "karnatakaAdventurer")}</p>
            <GoldBadge><Star size={9} color="#3A0353" fill="#3A0353" /> {t(lang, "premiumExplorer")}</GoldBadge>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[{ label: t(lang, "placesVisited"), value: 12, Icon: Map }, { label: t(lang, "reviews"), value: 8, Icon: Star }, { label: t(lang, "saved"), value: 5, Icon: Bookmark }].map(s => (
            <GlassCard key={s.label} style={{ padding: "14px 10px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}><s.Icon size={22} color={C.gold2} /></div>
              <div style={{ fontSize: 22, fontWeight: 800, backgroundImage: gradGold, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{s.label}</div>
            </GlassCard>
          ))}
        </div>
        {[
          { Icon: Trophy, label: t(lang, "achievements"), sub: t(lang, "badgesEarned") },
          { Icon: MessageSquare, label: t(lang, "myReviews"), sub: t(lang, "reviewsWritten") },
          { Icon: Globe, label: t(lang, "language"), sub: LANG_LABELS[lang], action: () => setShowLangPicker(true) },
          { Icon: Bell, label: t(lang, "notifications"), sub: t(lang, "enabled") },
          { Icon: Info, label: t(lang, "aboutApp"), sub: "v1.0.0" },
        ].map(item => (
          <GlassCard key={item.label} onClick={item.action} style={{ padding: "14px 16px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
            <item.Icon size={22} color={C.gold2} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{item.sub}</div>
            </div>
            <ChevronRight size={16} color={C.muted} />
          </GlassCard>
        ))}
      </div>

      {showLangPicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowLangPicker(false)}>
          <GlassCard onClick={e => e.stopPropagation()} style={{ padding: 28, width: "90%", maxWidth: 360, background: "rgba(26,10,46,0.95)", border: "1px solid rgba(128,74,138,0.4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{t(lang, "chooseLanguage")}</h3>
              <button onClick={() => setShowLangPicker(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={C.muted} /></button>
            </div>
            {Object.entries(LANG_LABELS).map(([code, label]) => (
              <button key={code} onClick={() => { onChangeLang(code); setShowLangPicker(false); }} style={{
                width: "100%", padding: "14px 16px", marginBottom: 8, borderRadius: 12, cursor: "pointer",
                background: lang === code ? "rgba(245,158,81,0.15)" : "rgba(128,74,138,0.1)",
                border: lang === code ? "1px solid rgba(245,158,81,0.4)" : "1px solid rgba(128,74,138,0.2)",
                color: lang === code ? C.gold2 : C.text, fontSize: 16, fontWeight: lang === code ? 700 : 400,
                display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left",
              }}>
                <span>{label}</span>
                {lang === code && <CheckCircle size={18} color={C.gold2} />}
              </button>
            ))}
          </GlassCard>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [appState, setAppState] = useState("splash");
  const [screen, setScreen] = useState("home");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [savedIds, setSavedIds] = useState([1, 3]);
  const [lang, setLang] = useState("en");

  // Handle client-side hydration issues since there's an animation/shimmer, but not strict necessity if we don't have mismatching DOM on first render.

  const navigate = (s) => { setSelectedPlace(null); setScreen(s); };
  const toggleSave = (id) => setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const appContent = () => {
    if (appState === "splash") return <div style={S.phone}><SplashScreen lang={lang} onDone={() => setAppState("onboarding")} /></div>;
    if (appState === "onboarding") return <div style={S.phone}><OnboardingScreen lang={lang} onDone={() => setAppState("auth")} /></div>;
    if (appState === "auth") return <div style={S.phone}><AuthScreen lang={lang} onLogin={() => setAppState("main")} /></div>;

    return (
      <div style={S.phone}>
        <div style={S.contentWrapper}>
          {appState === "main" && !selectedPlace && <SideNav active={screen} navigate={navigate} lang={lang} />}
          <div style={S.mainArea}>
            {selectedPlace ? (
              <DetailScreen place={selectedPlace} onBack={() => setSelectedPlace(null)} onSave={toggleSave} saved={savedIds} lang={lang} />
            ) : (
              <>
                {screen === "home" && <HomeScreen navigate={navigate} onSelectPlace={p => setSelectedPlace(p)} lang={lang} />}
                {screen === "listings" && <ListingScreen onSelectPlace={p => setSelectedPlace(p)} lang={lang} />}
                {screen === "itinerary" && <ItineraryScreen lang={lang} />}
                {screen === "saved" && <SavedScreen savedIds={savedIds} onUnsave={toggleSave} onSelectPlace={p => setSelectedPlace(p)} lang={lang} />}
                {screen === "profile" && <ProfileScreen lang={lang} onChangeLang={setLang} />}
              </>
            )}
          </div>
        </div>
        {appState === "main" && !selectedPlace && <BottomNav active={screen} navigate={navigate} lang={lang} />}
      </div>
    );
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang }}>
      <div style={S.app}>
        {appContent()}
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #0D0618; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: rgba(128,74,138,0.4); border-radius: 2px; }
          @keyframes pulse { from { transform: scale(1); opacity: 0.7; } to { transform: scale(1.15); opacity: 1; } }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          input::placeholder { color: rgba(184,158,196,0.6); }
          input { font-family: inherit; }
          
          .desktop-nav { display: none !important; }
          .grid-responsive { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          
          @media (min-width: 768px) {
            .mobile-nav { display: none !important; }
            .desktop-nav { display: flex !important; }
            .grid-responsive { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
          }
        `}</style>
      </div>
    </TranslationContext.Provider>
  );
}
