import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "./logo.png";
import cirruslabsImage from "./cirruslabs.png";

const Login = () => {
    // Navigation handlers
    const navigate = useNavigate();
    const handleCreateAccount = () => {
      window.location.href = "/register";
    };
    const handleForgotPassword = () => {
      window.location.href = "/forgot-password";
    };
    // (moved below)
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msLoading, setMsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emptyError, setEmptyError] = useState("");

  const handleChange = (e) => {
    const value = e.target.name === "username" ? e.target.value.replace(/^\s+/, "") : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
    // Remove shake class on input
    const input = document.querySelector(`[name='${e.target.name}']`);
    if (input) input.classList.remove("shake");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmptyError("");
    setLoading(true);

    // Remove shake class before re-adding (for repeated animation)
    const usernameInput = document.querySelector("[name='username']");
    const passwordInput = document.querySelector("[name='password']");
    if (usernameInput) usernameInput.classList.remove("shake");
    if (passwordInput) passwordInput.classList.remove("shake");

    if (!form.username && !form.password) {
      setEmptyError("Please enter username and password.");
      if (usernameInput) usernameInput.classList.add("shake");
      if (passwordInput) passwordInput.classList.add("shake");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Save token (localStorage or context)
        localStorage.setItem("access_token", data.access_token);
        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        setEmptyError("Invalid username or password.");
        if (usernameInput) usernameInput.classList.add("shake");
        if (passwordInput) passwordInput.classList.add("shake");
      }
    } catch (err) {
      setLoading(false);
      setEmptyError("Login failed. Please try again.");
    }
  };

  const handleMicrosoftSignIn = () => {
    setMsLoading(true);
    // Simulate Microsoft SSO
    setTimeout(() => {
      setMsLoading(false);
      console.log("Microsoft SSO initiated");
    }, 1200);
  };

  // Generate animated dots for background
  const generateDots = () => {
    // Generate dots only once and keep them static
    if (!window._staticDots) {
      const dots = [];
      for (let i = 0; i < 120; i++) {
        const style = {
          position: "absolute",
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
          borderRadius: "50%",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float-dots ${Math.random() * 3 + 2}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
        };
        dots.push(<div key={i} style={style} />);
      }
      window._staticDots = dots;
    }
    return window._staticDots;
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* LEFT SIDE - Dark Blue with Animation */}
      <div
        style={{
          width: "50%",
          background: "linear-gradient(135deg, #1e3a8a 0%, #1b2a5aff 50%, #1a2d57ff 100%)",
          padding: "2.64rem 2.2rem", // +10% from 2.4rem 2rem
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated dots background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {generateDots()}
        </div>

        {/* Radial gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "2rem" }}>
          <img
            src={cirruslabsImage}
            alt="CirrusLabs"
            style={{
              width: "240px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
              zIndex: 20,
            }}
          />
          <div style={{ position: "relative", zIndex: 21, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh" }}>
            <img
              src={logoImage}
              alt="Portal Logo"
              style={{
                width: "120px",
                marginBottom: "1.2rem",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
              }}
            />
            <h1
              style={{
                color: "#9084a9ff",
                fontSize: "52px",
                fontWeight: 900,
                marginBottom: "0.2rem",
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
                letterSpacing: "-0.02em",
                textAlign: "center",
              }}
            >
              Deal Manager
            </h1>
            <p
              style={{
                color: "rgba(138, 131, 154, 1)",
                fontSize: "18px",
                fontWeight: 500,
                marginBottom: "1.2rem",
                letterSpacing: "0.5px",
                textAlign: "center",
              }}
            >
             • Companies • Customers • Deals   • Management 
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - White Background with Login Form */}
      <div
        style={{
          width: "50%",
          background: "#f9fafb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "336px", // 20% reduction from 420px
            background: "#ffffff",
            padding: "2.4rem 2rem", // 20% reduction from 3rem 2.5rem
            borderRadius: "13px", // 20% reduction from 16px
            boxShadow: "0 8px 32px rgba(0,0,0,0.09)",
          }}
        >
          <h2
            style={{
              fontSize: "25.6px", // 20% reduction from 32px
              fontWeight: 800,
              marginBottom: "1.6rem", // 20% reduction from 2rem
              color: "#1c4fa3ff",
              textAlign: "center",
            }}
          >
            Login
          </h2>
          {emptyError && (
            <p style={{ color: "#ef4444", fontWeight: 600, textAlign: "center", margin: "0.5rem 0 1rem 0" }}>{emptyError}</p>
          )}

          {/* Microsoft SSO Button */}
          <button
            onClick={handleMicrosoftSignIn}
            disabled={msLoading}
            style={{
              width: "100%",
              height: "50px", // +10% from 38px
              borderRadius: "8px", // 20% reduction from 10px
              border: "1.6px solid #e2e8f0", // 20% reduction from 2px
              background: "#ffffff",
              fontSize: "12.8px", // 20% reduction from 16px
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "9.6px", // 20% reduction from 12px
              cursor: msLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: msLoading ? 0.6 : 1,
              color: "#334155",
            }}
            onMouseEnter={(e) => {
              if (!msLoading) {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (!msLoading) {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {msLoading ? (
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: "3px solid #e2e8f0",
                  borderTop: "3px solid #3b82f6",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <rect width="11" height="11" fill="#F35325" />
                  <rect y="13" width="11" height="11" fill="#05A6F0" />
                  <rect x="13" width="11" height="11" fill="#81BC06" />
                  <rect x="13" y="13" width="11" height="11" fill="#FFBA08" />
                </svg>
                <span>Sign in with Microsoft</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "1.5rem 0",
              color: "#64748b",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ padding: "0 1rem" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Username Field */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: "50px", // +10% from 38px
                  padding: "0 0.8rem", // 20% reduction from 1rem
                  border: errors.username ? "1.6px solid #ef4444" : "1.6px solid #e2e8f0",
                  borderRadius: "8px", // 20% reduction from 10px
                  background: errors.username ? "#fef2f2" : "#f8fafc", 
                  fontSize: "12.8px", // 20% reduction from 16px
                  transition: "all 0.3s ease",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  if (!errors.username) {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.username) {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              />
              {errors.username && (
                <p style={{ marginTop: "0.5rem", fontSize: "14px", color: "#ef4444", fontWeight: 500 }}>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "50px",
                    padding: "0 2.4rem 0 0.8rem",
                    border: errors.password ? "1.6px solid #ef4444" : "1.6px solid #e2e8f0",
                    borderRadius: "8px",
                    background: errors.password ? "#fef2f2" : "#f8fafc",
                    fontSize: "12.8px",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  className={errors.password ? "shake" : ""}
                  onFocus={(e) => {
                    if (!errors.password) {
                      e.currentTarget.style.borderColor = "#3b82f6";
                      e.currentTarget.style.background = "#ffffff";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.password) {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.8rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    padding: "3.2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.3s ease",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ marginTop: "0.5rem", fontSize: "14px", color: "#ef4444", fontWeight: 500 }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "8px",
                border: "none",
                background: loading ? "#2563eb" : "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                boxShadow: loading ? "0 4px 16px rgba(59,130,246,0.15)" : "0 4px 16px rgba(59,130,246,0.25)",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(59,130,246,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    border: "3px solid #fff",
                    borderTop: "3px solid #2563eb",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              ) : (
                <>
                  <span>Log in</span>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "6px" }}>
                    <path d="M7 11h8m0 0l-3-3m3 3l-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                color: "#3b82f6",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "0.25rem 0",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#265dd3ff";
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#3b82f6";
                e.currentTarget.style.textDecoration = "none";
              }}
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#3b82f6",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "0.25rem 0",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#265dd3ff";
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#3b82f6";
                e.currentTarget.style.textDecoration = "none";
              }}
              onClick={handleCreateAccount}
            >
              Create account
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe animation for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float-dots {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .shake {
          animation: shake 0.3s;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
