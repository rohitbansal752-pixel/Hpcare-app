import { useState, useEffect } from "react";

// ============================================================
// COLORS - Warm, trustworthy medical theme
// ============================================================
const C = {
  bg: "#F5F8FF",
  white: "#FFFFFF",
  card: "#FFFFFF",
  cardBg: "#F0F5FF",
  primary: "#0E76D8",
  primaryDark: "#0A56A0",
  primaryLight: "#EBF4FF",
  accent: "#FF6B2C",
  accentLight: "#FFF2EC",
  success: "#10B981",
  successLight: "#ECFDF5",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  danger: "#EF4444",
  text: "#0D1B2A",
  textSec: "#4A6080",
  textMuted: "#94A8BC",
  border: "#DDE8F5",
  shadow: "0 4px 24px rgba(14,118,216,0.10)",
  shadowSm: "0 2px 10px rgba(14,118,216,0.07)",
};

// ============================================================
// DATA
// ============================================================
const TESTS = [
  { id: 1, name: "Complete Blood Count", shortName: "CBC", category: "Blood", price: 299, time: "4-6 hrs", icon: "🩸", popular: true },
  { id: 2, name: "HbA1c (Glycated Hemoglobin)", shortName: "HbA1c", category: "Diabetes", price: 499, time: "24 hrs", icon: "💉", popular: true },
  { id: 3, name: "Thyroid Profile (T3,T4,TSH)", shortName: "Thyroid", category: "Hormones", price: 799, time: "24 hrs", icon: "🫀", popular: true },
  { id: 4, name: "Lipid Profile", shortName: "Lipid", category: "Heart", price: 599, time: "12 hrs", icon: "❤️", popular: false },
  { id: 5, name: "Vitamin D (25-OH)", shortName: "Vit D", category: "Vitamins", price: 999, time: "48 hrs", icon: "☀️", popular: true },
  { id: 6, name: "Vitamin B12", shortName: "B12", category: "Vitamins", price: 799, time: "48 hrs", icon: "🧬", popular: false },
  { id: 7, name: "Liver Function Test", shortName: "LFT", category: "Organs", price: 699, time: "24 hrs", icon: "🫁", popular: false },
  { id: 8, name: "Kidney Function Test", shortName: "KFT", category: "Organs", price: 699, time: "24 hrs", icon: "💊", popular: false },
];

const PACKAGES = [
  { id: 101, name: "HP Care Basic", tests: 28, price: 999, original: 2500, color: C.primary, icon: "🥈", desc: "Essential 28-test health checkup" },
  { id: 102, name: "HP Care Gold", tests: 58, price: 1999, original: 5500, color: "#F59E0B", icon: "🥇", desc: "Comprehensive 58-test panel", popular: true },
  { id: 103, name: "HP Care Platinum", tests: 89, price: 3499, original: 9000, color: "#8B5CF6", icon: "💎", desc: "Premium 89-test full body screening" },
  { id: 104, name: "Women's Wellness", tests: 42, price: 1499, original: 3800, color: "#EC4899", icon: "🌸", desc: "Designed for women's health" },
];

const SLOTS = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

// ============================================================
// SHARED COMPONENTS
// ============================================================
const Btn = ({ children, onClick, v = "primary", full = false, small = false, style = {}, disabled = false }) => {
  const variants = {
    primary: { background: `linear-gradient(135deg, #3A9AFF, ${C.primaryDark})`, color: "#fff", border: "none" },
    accent: { background: `linear-gradient(135deg, #FF8F5A, ${C.accent})`, color: "#fff", border: "none" },
    success: { background: `linear-gradient(135deg, #34D399, ${C.success})`, color: "#fff", border: "none" },
    outline: { background: "transparent", color: C.primary, border: `2px solid ${C.primary}` },
    ghost: { background: C.primaryLight, color: C.primary, border: "none" },
    white: { background: C.white, color: C.text, border: `1px solid ${C.border}`, boxShadow: C.shadowSm },
    danger: { background: `linear-gradient(135deg, #F87171, ${C.danger})`, color: "#fff", border: "none" },
  };
  const v2 = variants[v] || variants.primary;
  return (
    <button disabled={disabled} onClick={onClick} style={{
      ...v2,
      borderRadius: 14, padding: small ? "8px 16px" : "14px 24px",
      fontSize: small ? 12 : 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      fontFamily: "inherit", width: full ? "100%" : "auto",
      opacity: disabled ? 0.5 : 1, transition: "all 0.2s",
      letterSpacing: "0.01em",
      ...style,
    }}>{children}</button>
  );
};

const PhoneInput = ({ value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
    <div style={{
      background: C.cardBg, border: `2px solid ${C.border}`, borderRight: "none",
      borderRadius: "14px 0 0 14px", padding: "14px 14px",
      fontSize: 14, fontWeight: 700, color: C.textSec, display: "flex", alignItems: "center", gap: 6,
      flexShrink: 0,
    }}>🇮🇳 +91</div>
    <input
      type="tel" placeholder="10-digit mobile number"
      value={value} onChange={onChange} maxLength={10}
      style={{
        flex: 1, background: C.white, border: `2px solid ${C.border}`,
        borderLeft: "none", borderRadius: "0 14px 14px 0",
        padding: "14px", fontSize: 16, color: C.text, outline: "none",
        fontFamily: "inherit", fontWeight: 600,
      }}
    />
  </div>
);

// ============================================================
// SCREEN 1: LOGIN
// ============================================================
const LoginScreen = ({ onLogin }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [name, setName] = useState("");
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (timer > 0) { const t = setTimeout(() => setTimer(timer - 1), 1000); return () => clearTimeout(t); }
  }, [timer]);

  const sendOtp = () => {
    setError("");
    if (phone.length !== 10) { setError("Sahi 10-digit number daalo"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setOtpSent(true); setTimer(30); setIsNew(phone === "9999999999"); }, 1500);
  };

  const verifyOtp = () => {
    setError("");
    if (otp.length !== 4) { setError("4-digit OTP daalo"); return; }
    if (otp !== "1234") { setError("OTP galat hai. Demo ke liye: 1234"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ phone, name: name || "Patient" }); }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.primary} 0%, #0A56A0 40%, #062F5A 100%)`, display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Top decoration */}
      <div style={{ position: "relative", padding: "48px 24px 0", textAlign: "center" }}>
        <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, margin: "0 auto 16px", border: "1px solid rgba(255,255,255,0.2)" }}>🔬</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>HP Care</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Diagnostics</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Ghar baithe test book karo · Report online paao</div>
      </div>

      {/* Benefits Strip */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "20px 24px", flexWrap: "wrap" }}>
        {["🏠 Home Collection", "📄 Digital Report", "⚡ Fast Results", "💳 UPI Payment"].map((b, i) => (
          <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>{b}</div>
        ))}
      </div>

      {/* Login Card */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0" }}>
        <div style={{
          background: C.white, borderRadius: "28px 28px 0 0",
          padding: "28px 24px 40px", width: "100%", maxWidth: 480,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 6 }}>
            {otpSent ? "OTP Verify Karo" : "Login / Register"}
          </div>
          <div style={{ fontSize: 13, color: C.textSec, marginBottom: 22 }}>
            {otpSent
              ? `OTP bheja gaya +91 ${phone} par`
              : "Apna mobile number daalo — OTP aayega"
            }
          </div>

          {!otpSent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <PhoneInput value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} />
              <Btn v="primary" full onClick={sendOtp} disabled={loading}>
                {loading ? "⏳ OTP Bheja ja raha hai..." : "📨 OTP Bhejo"}
              </Btn>
              <div style={{ textAlign: "center", fontSize: 11, color: C.textMuted }}>
                Demo: koi bhi number · OTP: <strong style={{ color: C.accent }}>1234</strong>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {isNew && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.textSec, display: "block", marginBottom: 6 }}>Aapka Naam</label>
                  <input placeholder="Poora naam likhein" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", background: C.cardBg, border: `2px solid ${C.border}`, borderRadius: 14, padding: 14, fontSize: 15, color: C.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              )}

              {/* OTP boxes */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.textSec, display: "block", marginBottom: 8 }}>Enter 4-Digit OTP</label>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                      width: 64, height: 64, borderRadius: 16,
                      background: otp[i] ? C.primaryLight : C.cardBg,
                      border: `2px solid ${otp[i] ? C.primary : C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26, fontWeight: 800, color: C.primary,
                    }}>{otp[i] || ""}</div>
                  ))}
                </div>
                <input
                  type="number" placeholder="Type OTP here" value={otp}
                  onChange={e => setOtp(e.target.value.slice(0, 4))} maxLength={4}
                  style={{
                    width: "100%", marginTop: 12, background: C.cardBg, border: `2px solid ${C.border}`,
                    borderRadius: 14, padding: 14, fontSize: 18, color: C.text, textAlign: "center",
                    fontFamily: "inherit", outline: "none", fontWeight: 700, boxSizing: "border-box",
                  }}
                />
              </div>

              <Btn v="success" full onClick={verifyOtp} disabled={loading}>
                {loading ? "⏳ Verify ho raha hai..." : "✅ Verify & Login"}
              </Btn>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => { setOtpSent(false); setOtp(""); setError(""); }} style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>← Number Badlo</button>
                {timer > 0
                  ? <span style={{ fontSize: 12, color: C.textMuted }}>Resend in {timer}s</span>
                  : <button onClick={sendOtp} style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🔄 Resend OTP</button>
                }
              </div>
            </div>
          )}

          {error && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: C.danger + "12", border: `1px solid ${C.danger}33`, borderRadius: 10, fontSize: 12, color: C.danger, fontWeight: 600 }}>{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CUSTOMER APP (after login)
// ============================================================
const CustomerApp = ({ user, onLogout }) => {
  const [screen, setScreen] = useState("home"); // home | tests | cart | booking | reports | profile
  const [cart, setCart] = useState([]);
  const [bookingStep, setBookingStep] = useState(1);
  const [collectionType, setCollectionType] = useState("home");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [address, setAddress] = useState("");
  const [payMethod, setPayMethod] = useState("upi");
  const [bookingDone, setBookingDone] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [tab, setTab] = useState("tests");

  const addToCart = (item) => { if (!cart.find(c => c.id === item.id)) setCart([...cart, item]); };
  const removeFromCart = (id) => setCart(cart.filter(c => c.id !== id));
  const inCart = (id) => cart.some(c => c.id === id);
  const total = cart.reduce((s, t) => s + t.price, 0);
  const gst = Math.round(total * 0.18);

  const categories = ["All", "Blood", "Diabetes", "Hormones", "Heart", "Vitamins", "Organs"];
  const filteredTests = TESTS.filter(t =>
    (activeCategory === "All" || t.category === activeCategory) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const BottomNav = () => (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: C.white, borderTop: `1px solid ${C.border}`,
      display: "flex", justifyContent: "space-around",
      padding: "10px 0 16px", zIndex: 100,
      boxShadow: "0 -4px 20px rgba(14,118,216,0.08)",
      maxWidth: 480, margin: "0 auto",
    }}>
      {[
        { id: "home", icon: "🏠", label: "Home" },
        { id: "tests", icon: "🧪", label: "Tests" },
        { id: "cart", icon: "🛒", label: "Cart", badge: cart.length },
        { id: "reports", icon: "📄", label: "Reports" },
        { id: "profile", icon: "👤", label: "Profile" },
      ].map(n => (
        <button key={n.id} onClick={() => setScreen(n.id)} style={{
          background: "none", border: "none", cursor: "pointer", display: "flex",
          flexDirection: "column", alignItems: "center", gap: 4, fontFamily: "inherit",
          position: "relative", padding: "0 12px",
        }}>
          {n.badge > 0 && (
            <div style={{
              position: "absolute", top: -4, right: 6, background: C.accent,
              color: "#fff", borderRadius: "50%", width: 16, height: 16,
              fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{n.badge}</div>
          )}
          <span style={{ fontSize: 22 }}>{n.icon}</span>
          <span style={{ fontSize: 10, fontWeight: screen === n.id ? 800 : 500, color: screen === n.id ? C.primary : C.textMuted }}>{n.label}</span>
          {screen === n.id && <div style={{ width: 20, height: 3, background: C.primary, borderRadius: 2, marginTop: 2 }} />}
        </button>
      ))}
    </div>
  );

  // HOME
  if (screen === "home") return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingBottom: 80, maxWidth: 480, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, padding: "20px 20px 28px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>Namaste 🙏</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>+91 {user.phone}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🔔</div>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>
              {(user.name || "P")[0].toUpperCase()}
            </div>
          </div>
        </div>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input placeholder="Test ya package search karo..." onClick={() => setScreen("tests")} readOnly style={{
            width: "100%", background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 14,
            padding: "13px 14px 13px 42px", fontSize: 14, fontFamily: "inherit", outline: "none",
            color: C.text, boxSizing: "border-box", cursor: "pointer",
          }} />
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { icon: "🏠", label: "Home\nCollection", color: C.accent, bg: C.accentLight },
            { icon: "🧪", label: "Book\nTest", color: C.primary, bg: C.primaryLight },
            { icon: "📄", label: "Meri\nReport", color: C.success, bg: C.successLight },
            { icon: "📦", label: "Packages\nDekhein", color: "#8B5CF6", bg: "#F5F3FF" },
          ].map((a, i) => (
            <button key={i} onClick={() => setScreen(i === 2 ? "reports" : "tests")} style={{
              background: a.bg, borderRadius: 16, padding: "14px 8px",
              border: `1px solid ${a.color}22`, cursor: "pointer", fontFamily: "inherit",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              boxShadow: C.shadowSm,
            }}>
              <span style={{ fontSize: 24 }}>{a.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: a.color, textAlign: "center", lineHeight: 1.3, whiteSpace: "pre-line" }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${C.accent}, #FF8F5A)`,
          borderRadius: 18, padding: "18px 20px", marginBottom: 22,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: `0 6px 24px ${C.accent}33`,
        }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600, marginBottom: 4 }}>🔥 LIMITED OFFER</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>HP Care Gold</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)" }}>58 tests sirf ₹1,999</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", textDecoration: "line-through" }}>₹5,500</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28 }}>🥇</div>
            <Btn v="white" small onClick={() => setScreen("tests")} style={{ marginTop: 8, fontSize: 11, padding: "8px 14px", color: C.accent }}>Book Now</Btn>
          </div>
        </div>

        {/* Popular Tests */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Popular Tests</div>
            <button onClick={() => setScreen("tests")} style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Sab Dekho →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {TESTS.filter(t => t.popular).slice(0, 4).map(t => (
              <div key={t.id} style={{ background: C.white, borderRadius: 16, padding: 14, border: `1px solid ${C.border}`, boxShadow: C.shadowSm }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 3, lineHeight: 1.3 }}>{t.name}</div>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 10 }}>⏱ {t.time}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.primary }}>₹{t.price}</span>
                  <Btn small v={inCart(t.id) ? "success" : "ghost"} onClick={() => addToCart(t)} style={{ fontSize: 10, padding: "6px 12px" }}>
                    {inCart(t.id) ? "✓ Added" : "+ Add"}
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why HP Care */}
        <div style={{ background: C.white, borderRadius: 18, padding: 18, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 14 }}>HP Care क्यों चुनें?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "🏠", title: "Home Collection", desc: "Free home sample pickup" },
              { icon: "⚡", title: "Fast Reports", desc: "Same day results" },
              { icon: "✅", title: "NABL Certified", desc: "Trusted quality" },
              { icon: "💳", title: "Easy Payment", desc: "UPI, Card, Cash" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{f.title}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );

  // TESTS PAGE
  if (screen === "tests") return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingBottom: 80, maxWidth: 480, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {/* Header */}
      <div style={{ background: C.white, padding: "16px 16px 12px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Tests & Packages</div>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
          <input placeholder="Test search karo..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", background: C.cardBg, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "10px 12px 10px 36px", fontSize: 14, fontFamily: "inherit", outline: "none", color: C.text, boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[{ id: "tests", label: "🧪 Individual Tests" }, { id: "packages", label: "📦 Packages" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px", borderRadius: 12, border: `2px solid ${tab === t.id ? C.primary : C.border}`,
              background: tab === t.id ? C.primaryLight : C.white, color: tab === t.id ? C.primary : C.textSec,
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}>{t.label}</button>
          ))}
        </div>

        {tab === "tests" && (
          <>
            {/* Categories */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 14 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  background: activeCategory === cat ? C.primary : C.white,
                  border: `1.5px solid ${activeCategory === cat ? C.primary : C.border}`,
                  color: activeCategory === cat ? "#fff" : C.textSec,
                  borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
                }}>{cat}</button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredTests.map(t => (
                <div key={t.id} style={{ background: C.white, borderRadius: 16, padding: "14px 16px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, boxShadow: C.shadowSm }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>⏱ {t.time} · {t.category}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.primary, marginBottom: 5 }}>₹{t.price}</div>
                    <Btn small v={inCart(t.id) ? "success" : "ghost"} onClick={() => addToCart(t)} style={{ fontSize: 11, padding: "6px 14px" }}>
                      {inCart(t.id) ? "✓ Added" : "+ Add"}
                    </Btn>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "packages" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PACKAGES.map(pkg => (
              <div key={pkg.id} style={{ background: C.white, borderRadius: 20, overflow: "hidden", border: `1.5px solid ${pkg.popular ? pkg.color : C.border}`, boxShadow: pkg.popular ? `0 4px 20px ${pkg.color}22` : C.shadowSm }}>
                {pkg.popular && <div style={{ background: pkg.color, padding: "6px", textAlign: "center", fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>⭐ BEST SELLER</div>}
                <div style={{ height: 4, background: pkg.color }} />
                <div style={{ padding: 18 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ fontSize: 32 }}>{pkg.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{pkg.name}</div>
                      <div style={{ fontSize: 11, color: C.textSec, marginTop: 3 }}>{pkg.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: pkg.color }}>₹{pkg.price.toLocaleString()}</span>
                    <span style={{ fontSize: 13, color: C.textMuted, textDecoration: "line-through" }}>₹{pkg.original.toLocaleString()}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, background: C.successLight, color: C.success, padding: "3px 8px", borderRadius: 20, border: `1px solid ${C.success}33` }}>
                      {Math.round((1 - pkg.price / pkg.original) * 100)}% OFF
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: C.textSec, marginBottom: 14 }}>🧪 {pkg.tests} tests included · 🏠 Home collection available</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <Btn v="outline" small style={{ flex: 1 }}>Tests Dekho</Btn>
                    <Btn v="accent" small onClick={() => { addToCart(pkg); setScreen("cart"); }} style={{ flex: 1 }}>Book Now 🚀</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart floating button */}
      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: 80, left: 16, right: 16, maxWidth: 448, margin: "0 auto" }}>
          <button onClick={() => setScreen("cart")} style={{
            width: "100%", background: `linear-gradient(135deg, ${C.accent}, ${C.primaryDark})`,
            border: "none", borderRadius: 16, padding: "14px 20px", cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: `0 8px 28px ${C.accent}44`, fontFamily: "inherit",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>🛒 {cart.length} test{cart.length > 1 ? "s" : ""} added</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>₹{total.toLocaleString()} → Book</span>
          </button>
        </div>
      )}
      <BottomNav />
    </div>
  );

  // CART + BOOKING
  if (screen === "cart") return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingBottom: 80, maxWidth: 480, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ background: C.white, padding: "16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => setScreen("tests")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>
          {bookingDone ? "✅ Booking Confirmed!" : bookingStep === 1 ? "Cart" : bookingStep === 2 ? "Appointment Details" : "Payment"}
        </div>
      </div>

      {bookingDone ? (
        <div style={{ padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.success, marginBottom: 8 }}>Booking Ho Gayi!</div>
          <div style={{ fontSize: 14, color: C.textSec, marginBottom: 24, lineHeight: 1.6 }}>
            Aapki booking confirm ho gayi hai.<br />
            HP Care team aapke ghar aayegi aur report WhatsApp pe milegi.
          </div>
          <div style={{ background: C.successLight, border: `1px solid ${C.success}33`, borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.success, marginBottom: 12 }}>Booking Details</div>
            {[
              { label: "Booking ID", value: "HP" + Math.random().toString(36).substr(2, 7).toUpperCase() },
              { label: "Date", value: selectedDate || "16 May 2026" },
              { label: "Time", value: selectedSlot || "9:00 AM" },
              { label: "Type", value: collectionType === "home" ? "🏠 Home Collection" : "🏥 Lab Visit" },
              { label: "Payment", value: `₹${(total + gst).toLocaleString()} (${payMethod.toUpperCase()})` },
            ].map((d, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: C.textSec }}>{d.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{d.value}</span>
              </div>
            ))}
          </div>
          <Btn v="primary" full onClick={() => { setBookingDone(false); setBookingStep(1); setCart([]); setScreen("home"); }}>🏠 Home Pe Jao</Btn>
          <Btn v="ghost" full onClick={() => setScreen("reports")} style={{ marginTop: 10 }}>📄 Reports Dekho</Btn>
        </div>
      ) : (
        <div style={{ padding: "16px" }}>
          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24 }}>
            {["Cart", "Details", "Payment"].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", border: `2px solid ${bookingStep > i ? C.success : bookingStep === i + 1 ? C.primary : C.border}`,
                    background: bookingStep > i ? C.success : bookingStep === i + 1 ? C.primary : C.white,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, color: bookingStep >= i + 1 ? "#fff" : C.textMuted,
                  }}>{bookingStep > i ? "✓" : i + 1}</div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: bookingStep === i + 1 ? C.primary : C.textMuted, textAlign: "center" }}>{step}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: bookingStep > i + 1 ? C.success : C.border, margin: "0 4px", marginBottom: 14 }} />}
              </div>
            ))}
          </div>

          {/* STEP 1: Cart */}
          {bookingStep === 1 && (
            <>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>Cart Khaali Hai</div>
                  <Btn v="primary" onClick={() => setScreen("tests")}>Tests Dekho</Btn>
                </div>
              ) : (
                <>
                  {cart.map(t => (
                    <div key={t.id} style={{ background: C.white, borderRadius: 14, padding: "14px", marginBottom: 10, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: 24, width: 44, height: 44, background: C.primaryLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.icon || "🧪"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.name}</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>⏱ {t.time || "24 hrs"}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.primary }}>₹{t.price.toLocaleString()}</div>
                        <button onClick={() => removeFromCart(t.id)} style={{ background: "none", border: "none", color: C.danger, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: C.white, borderRadius: 14, padding: 16, border: `1px solid ${C.border}`, marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: C.textSec }}>Subtotal</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>₹{total.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: C.textSec }}>GST (18%)</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>₹{gst}</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Total</span>
                      <span style={{ fontSize: 17, fontWeight: 800, color: C.primary }}>₹{(total + gst).toLocaleString()}</span>
                    </div>
                  </div>
                  <Btn v="primary" full onClick={() => setBookingStep(2)}>Appointment Book Karo →</Btn>
                </>
              )}
            </>
          )}

          {/* STEP 2: Details */}
          {bookingStep === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ id: "home", label: "🏠 Home Collection", desc: "Phlebotomist aayega" }, { id: "lab", label: "🏥 Lab Visit", desc: "Khud aao" }].map(opt => (
                  <button key={opt.id} onClick={() => setCollectionType(opt.id)} style={{
                    flex: 1, padding: "14px 10px", borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
                    background: collectionType === opt.id ? C.primaryLight : C.white,
                    border: `2px solid ${collectionType === opt.id ? C.primary : C.border}`,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: collectionType === opt.id ? C.primary : C.textSec }}>{opt.label}</span>
                    <span style={{ fontSize: 10, color: C.textMuted }}>{opt.desc}</span>
                  </button>
                ))}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.textSec, display: "block", marginBottom: 6 }}>Date</label>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min="2026-05-16" style={{ width: "100%", background: C.white, border: `2px solid ${C.border}`, borderRadius: 14, padding: 14, fontSize: 14, fontFamily: "inherit", outline: "none", color: C.text, boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.textSec, display: "block", marginBottom: 8 }}>Time Slot</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {SLOTS.map((slot, i) => (
                    <button key={i} onClick={() => setSelectedSlot(slot)} style={{
                      padding: "10px 4px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                      background: selectedSlot === slot ? C.primaryLight : C.white,
                      border: `2px solid ${selectedSlot === slot ? C.primary : C.border}`,
                      color: selectedSlot === slot ? C.primary : C.textSec, fontSize: 11, fontWeight: 700,
                    }}>{slot}</button>
                  ))}
                </div>
              </div>

              {collectionType === "home" && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.textSec, display: "block", marginBottom: 6 }}>Ghar ka Address</label>
                  <textarea placeholder="Poora address likhein — flat, area, city, pincode" value={address} onChange={e => setAddress(e.target.value)} style={{ width: "100%", background: C.white, border: `2px solid ${C.border}`, borderRadius: 14, padding: 14, fontSize: 14, fontFamily: "inherit", outline: "none", color: C.text, resize: "vertical", minHeight: 80, boxSizing: "border-box" }} />
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <Btn v="outline" onClick={() => setBookingStep(1)} style={{ flex: 1 }}>← Wapas</Btn>
                <Btn v="primary" onClick={() => setBookingStep(3)} disabled={!selectedDate || !selectedSlot} style={{ flex: 2 }}>Payment Karo →</Btn>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {bookingStep === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Summary */}
              <div style={{ background: C.successLight, border: `1px solid ${C.success}33`, borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.success, marginBottom: 8 }}>Booking Summary</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.textSec }}>{cart.length} test{cart.length > 1 ? "s" : ""}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>₹{total}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: C.textSec }}>Date & Time</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{selectedDate} · {selectedSlot}</span>
                </div>
                <div style={{ borderTop: `1px solid ${C.success}33`, paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Total Payable</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>₹{(total + gst).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment methods */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.textSec, display: "block", marginBottom: 8 }}>Payment Method</label>
                {[
                  { id: "upi", label: "UPI / Google Pay / PhonePe", icon: "📲" },
                  { id: "card", label: "Credit / Debit Card", icon: "💳" },
                  { id: "netbanking", label: "Net Banking", icon: "🏦" },
                  { id: "cash", label: "Cash (at the time of collection)", icon: "💵" },
                ].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 14, border: `2px solid ${payMethod === m.id ? C.primary : C.border}`,
                    background: payMethod === m.id ? C.primaryLight : C.white, cursor: "pointer",
                    fontFamily: "inherit", marginBottom: 8, textAlign: "left",
                  }}>
                    <span style={{ fontSize: 22 }}>{m.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: payMethod === m.id ? C.primary : C.text }}>{m.label}</span>
                    {payMethod === m.id && <span style={{ marginLeft: "auto", fontSize: 16 }}>✅</span>}
                  </button>
                ))}
              </div>

              {/* Coupon */}
              <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="Coupon code daalo" style={{ flex: 1, background: C.white, border: `2px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 14, fontFamily: "inherit", outline: "none", color: C.text }} />
                <Btn v="ghost" small>Apply</Btn>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Btn v="outline" onClick={() => setBookingStep(2)} style={{ flex: 1 }}>← Wapas</Btn>
                <Btn v="success" onClick={() => setBookingDone(true)} style={{ flex: 2 }}>✅ Confirm & Pay ₹{(total + gst).toLocaleString()}</Btn>
              </div>
            </div>
          )}
        </div>
      )}
      <BottomNav />
    </div>
  );

  // REPORTS
  if (screen === "reports") return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingBottom: 80, maxWidth: 480, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ background: C.white, padding: "16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>📄 Meri Reports</div>
        <div style={{ fontSize: 12, color: C.textMuted }}>Apni test reports download karo</div>
      </div>
      <div style={{ padding: 16 }}>
        {/* Pending */}
        <div style={{ background: C.warningLight, border: `1px solid ${C.warning}33`, borderRadius: 14, padding: 14, marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 24 }}>⏳</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.warning }}>1 Report Processing</div>
            <div style={{ fontSize: 11, color: C.textSec }}>CBC · Booked Today · Ready in 4-6 hrs</div>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 12 }}>Completed Reports</div>
        {[
          { test: "Thyroid Profile", date: "10 May 2026", status: "Normal", id: "RPT2301" },
          { test: "HbA1c", date: "28 Apr 2026", status: "Normal", id: "RPT2198" },
          { test: "HP Care Gold Package", date: "15 Mar 2026", status: "Abnormal", id: "RPT2041" },
          { test: "Vitamin D + B12", date: "2 Feb 2026", status: "Normal", id: "RPT1892" },
        ].map((r, i) => (
          <div key={i} style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 10, border: `1px solid ${C.border}`, boxShadow: C.shadowSm }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{r.test}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>📅 {r.date} · {r.id}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: r.status === "Normal" ? C.successLight : "#FEF2F2", color: r.status === "Normal" ? C.success : C.danger, border: `1px solid ${r.status === "Normal" ? C.success + "33" : C.danger + "33"}` }}>
                {r.status === "Normal" ? "✅ Normal" : "⚠️ Abnormal"}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn v="ghost" small style={{ flex: 1, fontSize: 12 }}>👁 View Report</Btn>
              <Btn v="primary" small style={{ flex: 1, fontSize: 12 }}>⬇ Download PDF</Btn>
              <button style={{ padding: "6px 12px", borderRadius: 10, background: "#25D36622", border: "1px solid #25D36644", color: "#25D366", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>💬</button>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );

  // PROFILE
  if (screen === "profile") return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingBottom: 80, maxWidth: 480, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, padding: "32px 20px 28px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 auto 12px", border: "3px solid rgba(255,255,255,0.3)" }}>
          {(user.name || "P")[0].toUpperCase()}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{user.name}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>+91 {user.phone}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>HP Care Member · Silver</div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Tests Booked", value: "4", icon: "🧪" },
            { label: "Reports", value: "3", icon: "📄" },
            { label: "Points", value: "240", icon: "⭐" },
          ].map((s, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 14, padding: 14, textAlign: "center", border: `1px solid ${C.border}`, boxShadow: C.shadowSm }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>{s.value}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        {[
          { icon: "👤", label: "Profile Edit Karo", color: C.primary },
          { icon: "📋", label: "Booking History", color: C.primary },
          { icon: "📄", label: "Meri Reports", color: C.primary, action: () => setScreen("reports") },
          { icon: "⭐", label: "Loyalty Points & Rewards", color: "#F59E0B" },
          { icon: "🎟️", label: "Coupon Codes", color: C.accent },
          { icon: "📞", label: "HP Care Support", color: C.success },
          { icon: "🌐", label: "Language / भाषा", color: C.purple },
        ].map((item, i) => (
          <button key={i} onClick={item.action} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 14,
            marginBottom: 8, cursor: "pointer", fontFamily: "inherit", boxShadow: C.shadowSm,
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{item.icon}</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.label}</span>
            </div>
            <span style={{ color: C.textMuted, fontSize: 16 }}>→</span>
          </button>
        ))}

        <Btn v="danger" full onClick={onLogout} style={{ marginTop: 8 }}>🚪 Logout</Btn>
      </div>
      <BottomNav />
    </div>
  );

  return null;
};

// ============================================================
// ROOT
// ============================================================
export default function HPCareCustomerApp() {
  const [user, setUser] = useState(null);
  return user
    ? <CustomerApp user={user} onLogout={() => setUser(null)} />
    : <LoginScreen onLogin={(u) => setUser(u)} />;
}
