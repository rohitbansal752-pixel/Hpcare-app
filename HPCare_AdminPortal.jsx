import { useState, useEffect } from "react";

// ============================================================
// CREDENTIALS (Demo - In real app use Firebase Auth)
// ============================================================
const ADMIN_CREDENTIALS = {
  phone: "9017250094",
  email: "rbansal520@gmail.com",
  password: "HAUMANJI@123",
  name: "R. Bansal",
  role: "Super Admin",
};

const DEMO_OTP = "8520";

// ============================================================
// COLORS
// ============================================================
const C = {
  bg: "#060D18",
  card: "#0D1B2A",
  cardLight: "#112436",
  border: "#1A3048",
  borderLight: "#243F58",
  primary: "#0E76D8",
  primaryDark: "#0A56A0",
  primaryLight: "#3A9AFF",
  accent: "#FF6B2C",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  teal: "#06B6C4",
  text: "#EAF2FF",
  textSec: "#7FA8C9",
  textMuted: "#3D6080",
  purple: "#8B5CF6",
};

// ============================================================
// MOCK DATA
// ============================================================
const BOOKINGS_DATA = [
  { id: "BK001", name: "Ramesh Kumar", phone: "9876543210", test: "CBC + LFT", date: "15 May", time: "9:00 AM", type: "Home", status: "Confirmed", amount: 899 },
  { id: "BK002", name: "Sunita Sharma", phone: "8765432109", test: "Thyroid Profile", date: "15 May", time: "10:30 AM", type: "Lab", status: "Sample Collected", amount: 799 },
  { id: "BK003", name: "Ajay Verma", phone: "7654321098", test: "HbA1c", date: "15 May", time: "11:00 AM", type: "Home", status: "Report Ready", amount: 499 },
  { id: "BK004", name: "Priya Singh", phone: "6543210987", test: "HP Care Gold Package", date: "15 May", time: "2:00 PM", type: "Lab", status: "Confirmed", amount: 1999 },
  { id: "BK005", name: "Deepak Gupta", phone: "9012345678", test: "Vitamin D + B12", date: "15 May", time: "3:30 PM", type: "Home", status: "Pending", amount: 1799 },
];

// ============================================================
// SMALL COMPONENTS
// ============================================================
const Btn = ({ children, onClick, v = "primary", full = false, style = {} }) => {
  const variants = {
    primary: { background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDark})`, color: "#fff", border: "none" },
    accent: { background: `linear-gradient(135deg, #FF8F5A, ${C.accent})`, color: "#fff", border: "none" },
    success: { background: `linear-gradient(135deg, #34D399, ${C.success})`, color: "#fff", border: "none" },
    outline: { background: "transparent", color: C.textSec, border: `1px solid ${C.border}` },
    ghost: { background: "rgba(255,255,255,0.05)", color: C.textSec, border: "none" },
    danger: { background: `linear-gradient(135deg, #F87171, ${C.danger})`, color: "#fff", border: "none" },
  };
  return (
    <button onClick={onClick} style={{
      ...(variants[v] || variants.primary),
      borderRadius: 12, padding: "12px 22px",
      fontSize: 14, fontWeight: 700, cursor: "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      transition: "all 0.2s", fontFamily: "inherit",
      width: full ? "100%" : "auto",
      letterSpacing: "0.01em",
      ...style,
    }}>{children}</button>
  );
};

const Input = ({ label, placeholder, value, onChange, type = "text", icon, maxLength, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, letterSpacing: "0.04em" }}>{label}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: C.textMuted }}>{icon}</span>}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength}
        style={{
          background: C.cardLight, border: `1.5px solid ${C.border}`, borderRadius: 12,
          padding: icon ? "13px 14px 13px 42px" : "13px 14px",
          color: C.text, fontSize: 15, width: "100%", outline: "none",
          fontFamily: "inherit", boxSizing: "border-box", transition: "border 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = C.primaryLight}
        onBlur={e => e.target.style.borderColor = C.border}
      />
    </div>
  </div>
);

const StatCard = ({ icon, label, value, delta, color }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <div style={{ fontSize: 26 }}>{icon}</div>
      {delta && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
          color: delta.startsWith("+") ? C.success : C.danger,
          background: delta.startsWith("+") ? C.success + "22" : C.danger + "22",
        }}>{delta}</span>
      )}
    </div>
    <div style={{ fontSize: 22, fontWeight: 800, color: color || C.primaryLight, letterSpacing: "-0.03em", marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 11, color: C.textMuted }}>{label}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    "Confirmed": C.primary, "Sample Collected": C.warning,
    "Report Ready": C.success, "Pending": C.textMuted,
  };
  const color = map[status] || C.textMuted;
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.04em", textTransform: "uppercase",
    }}>{status}</span>
  );
};

// ============================================================
// LOGIN SCREEN
// ============================================================
const LoginScreen = ({ onLogin }) => {
  const [tab, setTab] = useState("phone"); // phone | email
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  const sendOtp = () => {
    setError("");
    if (phone !== ADMIN_CREDENTIALS.phone) {
      setError("❌ Ye number registered nahi hai. Use: 9017250094");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtpTimer(30);
    }, 1500);
  };

  const verifyOtp = () => {
    setError("");
    if (otp !== DEMO_OTP) {
      setError("❌ OTP galat hai. Demo OTP: 8520");
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1000);
  };

  const loginEmail = () => {
    setError("");
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      setError("❌ Email ya password galat hai.");
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1000);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, fontFamily: "'DM Sans', sans-serif",
      backgroundImage: `radial-gradient(ellipse at 20% 50%, ${C.primary}18 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${C.teal}10 0%, transparent 50%)`,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22,
            background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDark})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, margin: "0 auto 14px", boxShadow: `0 8px 32px ${C.primary}44`,
          }}>🔬</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>HP Care</div>
          <div style={{ fontSize: 13, color: C.accent, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Diagnostics</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>Admin Portal</div>
        </div>

        {/* Card */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 24, padding: 28,
          boxShadow: `0 24px 80px rgba(0,0,0,0.5)`,
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 6 }}>Welcome Back 👋</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 22 }}>Apna HP Care admin account mein login karein</div>

          {/* Tabs */}
          <div style={{
            display: "flex", background: C.cardLight, borderRadius: 12,
            padding: 4, marginBottom: 22, border: `1px solid ${C.border}`,
          }}>
            {[{ id: "phone", label: "📱 Mobile OTP" }, { id: "email", label: "✉️ Email" }].map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setError(""); setOtpSent(false); }} style={{
                flex: 1, padding: "9px", borderRadius: 9, border: "none", cursor: "pointer",
                background: tab === t.id ? `linear-gradient(135deg, ${C.primaryLight}, ${C.primary})` : "transparent",
                color: tab === t.id ? "#fff" : C.textMuted,
                fontSize: 12, fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s",
              }}>{t.label}</button>
            ))}
          </div>

          {/* Phone OTP Tab */}
          {tab === "phone" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input
                label="Mobile Number"
                placeholder="10-digit mobile number"
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                icon="📱" maxLength={10}
              />
              {!otpSent ? (
                <Btn v="primary" full onClick={sendOtp} style={{ opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Sending OTP..." : "📨 Send OTP"}
                </Btn>
              ) : (
                <>
                  <div style={{ textAlign: "center", fontSize: 12, color: C.success, padding: "8px", background: C.success + "15", borderRadius: 10, border: `1px solid ${C.success}33` }}>
                    ✅ OTP sent to +91 {phone} &nbsp;|&nbsp; <strong>Demo OTP: 8520</strong>
                  </div>
                  <Input label="Enter OTP" placeholder="4-digit OTP" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} icon="🔑" maxLength={4} />
                  {/* OTP Boxes Visual */}
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} style={{
                        width: 52, height: 56, borderRadius: 12,
                        background: C.cardLight, border: `2px solid ${otp[i] ? C.primaryLight : C.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22, fontWeight: 800, color: C.primaryLight,
                        transition: "border 0.2s",
                      }}>{otp[i] || ""}</div>
                    ))}
                  </div>
                  <Btn v="success" full onClick={verifyOtp} style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Verifying..." : "✅ Verify & Login"}
                  </Btn>
                  <div style={{ textAlign: "center", fontSize: 12, color: C.textMuted }}>
                    {otpTimer > 0
                      ? `Resend OTP in ${otpTimer}s`
                      : <span onClick={sendOtp} style={{ color: C.primaryLight, cursor: "pointer", fontWeight: 600 }}>🔄 Resend OTP</span>
                    }
                  </div>
                </>
              )}
            </div>
          )}

          {/* Email Tab */}
          {tab === "email" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Email Address" placeholder="admin@hpcare.in" value={email} onChange={e => setEmail(e.target.value)} icon="✉️" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, letterSpacing: "0.04em" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: C.textMuted }}>🔒</span>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                      background: C.cardLight, border: `1.5px solid ${C.border}`, borderRadius: 12,
                      padding: "13px 44px 13px 42px", color: C.text, fontSize: 15, width: "100%",
                      outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = C.primaryLight}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                  <button onClick={() => setShowPass(!showPass)} style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.textMuted,
                  }}>{showPass ? "🙈" : "👁️"}</button>
                </div>
              </div>
              <Btn v="primary" full onClick={loginEmail} style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? "Logging in..." : "🚀 Login to Admin Portal"}
              </Btn>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: C.danger + "18", border: `1px solid ${C.danger}44`, borderRadius: 10, fontSize: 12, color: C.danger, fontWeight: 600 }}>
              {error}
            </div>
          )}
        </div>

        {/* Demo hint */}
        <div style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: C.textMuted }}>
          📱 Demo: <span style={{ color: C.primaryLight }}>9017250094</span> → OTP: <span style={{ color: C.accent }}>8520</span>
          &nbsp;|&nbsp; ✉️ rbansal520@gmail.com
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN DASHBOARD (after login)
// ============================================================
const NAV = [
  { id: "dashboard", icon: "⚡", label: "Dashboard" },
  { id: "bookings", icon: "📋", label: "Bookings" },
  { id: "reports", icon: "📄", label: "Reports" },
  { id: "patients", icon: "👥", label: "Patients" },
  { id: "payments", icon: "💳", label: "Payments" },
  { id: "tests", icon: "🧪", label: "Tests" },
  { id: "notify", icon: "🔔", label: "Notifications" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

const AdminDashboard = ({ onLogout }) => {
  const [active, setActive] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);

  const chartData = [28, 35, 42, 38, 51, 47, 61, 55, 68, 72, 58, 65, 71, 47];

  const renderContent = () => {
    switch (active) {
      case "dashboard": return (
        <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
          {/* Welcome */}
          <div style={{
            background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary} 60%, ${C.teal}88)`,
            borderRadius: 20, padding: "22px 28px", marginBottom: 22,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>HP Care Diagnostics</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>Namaste, R. Bansal Ji! 🙏</div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>📅 15 May 2026, Friday</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>📍 Delhi NCR</span>
              <span style={{ fontSize: 12, color: "#7DFF9B" }}>✅ System Active</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
            <StatCard icon="📋" label="Aaj ki Bookings" value="47" delta="+12%" color={C.primaryLight} />
            <StatCard icon="💰" label="Aaj ki Revenue" value="₹68,450" delta="+8%" color={C.success} />
            <StatCard icon="⏳" label="Pending Reports" value="12" delta="-3" color={C.warning} />
            <StatCard icon="👥" label="Total Patients" value="1,284" delta="+19%" color={C.purple} />
          </div>

          {/* Chart + Bookings */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 14 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>14-Day Booking Trend</div>
              <div style={{ height: 110, display: "flex", alignItems: "flex-end", gap: 5 }}>
                {chartData.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{
                      width: "100%", height: `${(v / 80) * 100}%`,
                      background: i === chartData.length - 1
                        ? `linear-gradient(180deg, ${C.accent}, ${C.accent}88)`
                        : `linear-gradient(180deg, ${C.primaryLight}99, ${C.primary}44)`,
                      borderRadius: "4px 4px 2px 2px", minHeight: 4,
                    }} />
                    {i % 4 === 0 && <div style={{ fontSize: 8, color: C.textMuted }}>{i + 1}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Aaj ki Bookings</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {BOOKINGS_DATA.slice(0, 4).map(b => (
                  <div key={b.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 10, background: C.cardLight, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: C.primary + "33", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.primaryLight,
                      }}>{b.name[0]}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{b.name}</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>{b.test} · {b.time}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <StatusBadge status={b.status} />
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.success }}>₹{b.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginTop: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
              {[
                { icon: "➕", label: "New Booking", color: C.primary },
                { icon: "📤", label: "Upload Report", color: C.success },
                { icon: "💬", label: "WhatsApp Alert", color: "#25D366" },
                { icon: "👤", label: "Add Patient", color: C.purple },
                { icon: "📊", label: "Revenue", color: C.teal },
                { icon: "🏠", label: "Home Collection", color: C.accent },
              ].map((a, i) => (
                <button key={i} style={{
                  background: a.color + "18", border: `1px solid ${a.color}33`,
                  borderRadius: 12, padding: "14px 8px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: "inherit",
                }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: a.color, textAlign: "center", lineHeight: 1.2 }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );

      case "bookings": return (
        <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Bookings Management</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>15 May 2026 · 47 total bookings</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn v="accent" style={{ padding: "10px 18px", fontSize: 13 }}>➕ New Booking</Btn>
              <Btn v="outline" style={{ padding: "10px 18px", fontSize: 13 }}>📥 Export</Btn>
            </div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.cardLight, borderBottom: `1px solid ${C.border}` }}>
                  {["ID", "Patient", "Phone", "Test", "Date & Time", "Type", "Status", "Amount", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 14px", fontSize: 10, fontWeight: 700, color: C.textMuted, textAlign: "left", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOOKINGS_DATA.map((b, i) => (
                  <tr key={b.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.cardLight + "55" }}>
                    <td style={{ padding: "12px 14px", fontSize: 11, color: C.primaryLight, fontWeight: 700 }}>{b.id}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: C.primary + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.primaryLight }}>{b.name[0]}</div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{b.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 11, color: C.textSec }}>{b.phone}</td>
                    <td style={{ padding: "12px 14px", fontSize: 11, color: C.textSec }}>{b.test}</td>
                    <td style={{ padding: "12px 14px", fontSize: 11, color: C.textSec }}>{b.date} · {b.time}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: b.type === "Home" ? C.accent + "22" : C.teal + "22", color: b.type === "Home" ? C.accent : C.teal, border: `1px solid ${b.type === "Home" ? C.accent + "44" : C.teal + "44"}` }}>{b.type}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 800, color: C.success }}>₹{b.amount}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ background: C.primary + "22", border: `1px solid ${C.primary}44`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 10, color: C.primaryLight, fontFamily: "inherit", fontWeight: 600 }}>View</button>
                        <button style={{ background: "#25D36622", border: "1px solid #25D36644", borderRadius: 8, padding: "5px 8px", cursor: "pointer", fontSize: 12 }}>💬</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

      case "reports": return (
        <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 20 }}>Reports Upload & Management</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>📤 Report Upload Karo</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Input placeholder="Booking ID ya Patient Phone" icon="🔍" />
                <div style={{ border: `2px dashed ${C.border}`, borderRadius: 14, padding: 28, textAlign: "center", cursor: "pointer", background: C.cardLight }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
                  <div style={{ fontSize: 13, color: C.textSec, fontWeight: 600 }}>PDF Report yahan drop karo</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>ya click karke select karo</div>
                </div>
                <Btn v="success" full>📤 Upload & Patient ko Notify Karo</Btn>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button style={{ padding: "10px", borderRadius: 10, background: "#25D36622", border: "1px solid #25D36644", color: "#25D366", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>💬 WhatsApp Alert</button>
                  <button style={{ padding: "10px", borderRadius: 10, background: C.primary + "22", border: `1px solid ${C.primary}44`, color: C.primaryLight, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📱 SMS Alert</button>
                </div>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>📋 Recent Reports</div>
              {[
                { name: "Ramesh Kumar", test: "CBC", date: "14 May", status: "Sent" },
                { name: "Sunita Sharma", test: "Thyroid", date: "14 May", status: "Pending" },
                { name: "Ajay Verma", test: "HbA1c", date: "13 May", status: "Sent" },
                { name: "Priya Singh", test: "Gold Pkg", date: "13 May", status: "Pending" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", marginBottom: 8, borderRadius: 10, background: C.cardLight, border: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{r.test} · {r.date}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: r.status === "Sent" ? C.success + "22" : C.warning + "22", color: r.status === "Sent" ? C.success : C.warning, border: `1px solid ${r.status === "Sent" ? C.success + "44" : C.warning + "44"}` }}>{r.status}</span>
                    <button style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontSize: 10, color: C.textSec, fontFamily: "inherit" }}>⬇ PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      case "notify": return (
        <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 20 }}>Notifications & Alerts</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>💬 WhatsApp Message Bhejo</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Input placeholder="Patient phone number" icon="📱" />
                <Input placeholder="Patient ka naam" icon="👤" />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Booking Confirmed ✅", "Report Ready 📄", "Home Collection Reminder 🏠", "Payment Received 💳"].map((t, i) => (
                    <button key={i} style={{ padding: "6px 12px", borderRadius: 20, background: "#25D36622", border: "1px solid #25D36644", color: "#25D366", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
                  ))}
                </div>
                <textarea placeholder="Message likhein..." style={{ background: C.cardLight, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px", color: C.text, fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 80, outline: "none" }} />
                <Btn v="success" full>💬 WhatsApp Bhejo</Btn>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>📱 Bulk SMS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Sab Patients", "Aaj ki Bookings", "Pending Reports"].map((s, i) => (
                    <button key={i} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, background: i === 0 ? C.primary + "33" : C.cardLight, border: `1px solid ${i === 0 ? C.primaryLight : C.border}`, color: i === 0 ? C.primaryLight : C.textMuted, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
                  ))}
                </div>
                <textarea placeholder="SMS message..." style={{ background: C.cardLight, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px", color: C.text, fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 80, outline: "none" }} />
                <div style={{ fontSize: 11, color: C.textMuted }}>📊 Selected: 47 patients · Estimated cost: ₹47</div>
                <Btn v="primary" full>📱 Bulk SMS Bhejo</Btn>
              </div>
            </div>
          </div>
        </div>
      );

      default: return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
          <div style={{ fontSize: 48 }}>🚧</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{active.charAt(0).toUpperCase() + active.slice(1)}</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>Yeh section jald aayega</div>
        </div>
      );
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={{ width: sideOpen ? 200 : 60, background: C.card, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", transition: "width 0.3s", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "18px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🔬</div>
          {sideOpen && <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>HP Care</div>
            <div style={{ fontSize: 9, color: C.accent, fontWeight: 700, letterSpacing: "0.06em" }}>DIAGNOSTICS</div>
          </div>}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActive(n.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", borderRadius: 10, border: "none",
              background: active === n.id ? C.primary + "33" : "transparent",
              borderLeft: active === n.id ? `3px solid ${C.primaryLight}` : "3px solid transparent",
              cursor: "pointer", marginBottom: 2, fontFamily: "inherit", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{n.icon}</span>
              {sideOpen && <span style={{ fontSize: 12, fontWeight: active === n.id ? 700 : 500, color: active === n.id ? C.primaryLight : C.textSec, whiteSpace: "nowrap" }}>{n.label}</span>}
            </button>
          ))}
        </div>

        {/* Logout */}
        <div style={{ padding: "10px 8px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 10, border: "none", background: C.danger + "18", cursor: "pointer", fontFamily: "inherit" }}>
            <span style={{ fontSize: 15 }}>🚪</span>
            {sideOpen && <span style={{ fontSize: 12, fontWeight: 700, color: C.danger }}>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ height: 52, background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSideOpen(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textSec }}>☰</button>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>HP Care Admin Portal</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 11, color: C.textMuted, background: C.cardLight, borderRadius: 8, padding: "4px 10px", border: `1px solid ${C.border}` }}>📅 15 May 2026</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.success, background: C.success + "18", borderRadius: 8, padding: "4px 10px" }}>● Live</div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.primary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>RB</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ROOT APP
// ============================================================
export default function HPCareAdminApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn
    ? <AdminDashboard onLogout={() => setLoggedIn(false)} />
    : <LoginScreen onLogin={() => setLoggedIn(true)} />;
}
