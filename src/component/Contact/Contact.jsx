import React, { useState, useRef, useEffect } from "react";
import msg_icon    from "../../assets/msg-icon.png";
import mail_icon   from "../../assets/mail-icon.png";
import phone_icon  from "../../assets/phone-icon.png";
import location_icon from "../../assets/location-icon.png";

const Contact = () => {
  const [result,  setResult]  = useState("");
  const [status,  setStatus]  = useState("idle"); // idle | sending | success | error
  const [focused, setFocused] = useState("");
  const [reveal,  setReveal]  = useState(false);
  const sectionRef = useRef(null);

  /* Scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setReveal(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setResult("");
    const formData = new FormData(event.target);
    formData.append("access_key", "f03b99d4-599d-460a-998d-62046420b9ba");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setStatus("success");
        setResult("Message sent! We'll be in touch soon.");
        event.target.reset();
      } else {
        setStatus("error");
        setResult(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setResult("Network error. Please try again.");
    }
  };

  const contactItems = [
    {
      icon: mail_icon,
      label: "Email Us",
      value: "Contact@edusity.com",
      href: "mailto:Contact@edusity.com",
    },
    {
      icon: phone_icon,
      label: "Call Us",
      value: "+1 123-456-7890",
      href: "tel:+11234567890",
    },
    {
      icon: location_icon,
      label: "Visit Us",
      value: "77 Massachusetts Ave, Cambridge, MA 02139",
      href: "https://maps.google.com/?q=77+Massachusetts+Ave+Cambridge+MA",
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="ctc-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

        /* ── Section ── */
        .ctc-section {
          position: relative; width: 100%;
          padding: clamp(72px,10vw,120px) 0;
          background:
            radial-gradient(ellipse 65% 45% at 0%   0%,  rgba(29,78,216,0.08)  0%, transparent 65%),
            radial-gradient(ellipse 55% 40% at 100% 100%, rgba(37,99,235,0.07) 0%, transparent 65%),
            linear-gradient(160deg, #020b18 0%, #041220 40%, #061a30 70%, #030e1e 100%);
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
        }
        .ctc-section::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(96,165,250,.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,.022) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── Inner layout ── */
        .ctc-inner {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
          padding: 0 clamp(16px,5vw,72px);
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: clamp(36px,6vw,96px);
          align-items: start;
        }
        @media (max-width: 860px) {
          .ctc-inner { grid-template-columns: 1fr; }
        }

        /* ── Eyebrow + heading ── */
        .ctc-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 100px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(96,165,250,0.25);
          font-size: 10px; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          color: #93c5fd; margin-bottom: 20px;
        }
        .ctc-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #3b82f6; box-shadow: 0 0 6px #3b82f6;
          animation: ctcDot 2s ease-in-out infinite;
        }
        @keyframes ctcDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

        .ctc-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.9rem,4vw,3rem);
          font-weight: 900; line-height: 1.08;
          letter-spacing: -0.025em; color: #eff6ff;
          margin-bottom: 16px;
        }
        .ctc-title-accent {
          background: linear-gradient(135deg, #60a5fa, #93c5fd, #bfdbfe);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ctc-desc {
          font-size: clamp(13.5px,1.45vw,15px);
          color: rgba(191,219,254,0.58); font-weight: 300;
          line-height: 1.82; margin-bottom: 36px;
          max-width: 380px;
        }

        /* ── Contact info cards ── */
        .ctc-info-list {
          display: flex; flex-direction: column; gap: 12px;
        }
        .ctc-info-card {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 18px; border-radius: 14px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(96,165,250,0.10);
          text-decoration: none;
          transition: border-color .3s ease,
                      background .3s ease,
                      transform .3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .ctc-info-card:hover {
          border-color: rgba(96,165,250,0.32);
          background: rgba(59,130,246,0.07);
          transform: translateX(5px);
        }
        .ctc-info-icon {
          width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(29,78,216,0.4), rgba(59,130,246,0.22));
          border: 1px solid rgba(96,165,250,0.18);
          display: flex; align-items: center; justify-content: center;
        }
        .ctc-info-icon img { width: 18px; height: 18px; object-fit: contain; }
        .ctc-info-label {
          font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .14em;
          color: rgba(147,197,253,0.5); margin-bottom: 2px;
        }
        .ctc-info-value {
          font-size: 13.5px; font-weight: 500; color: rgba(219,234,254,0.82);
          line-height: 1.4;
        }

        /* ── Form card ── */
        .ctc-form-card {
          padding: clamp(28px,4vw,44px);
          border-radius: 22px;
          background: rgba(255,255,255,0.038);
          border: 1px solid rgba(96,165,250,0.13);
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4),
                      inset 0 1px 0 rgba(255,255,255,0.07);
          position: relative; overflow: hidden;
        }
        /* Shimmer top */
        .ctc-form-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent);
          pointer-events: none;
        }
        .ctc-form-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem; font-weight: 800;
          color: #eff6ff; letter-spacing: -0.015em;
          margin-bottom: 6px;
        }
        .ctc-form-sub {
          font-size: 12px; color: rgba(147,197,253,0.5);
          margin-bottom: 24px; font-weight: 400;
        }

        /* ── Input fields ── */
        .ctc-field { margin-bottom: 16px; }
        .ctc-label {
          display: block; margin-bottom: 6px;
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .13em;
          color: rgba(147,197,253,0.55);
          transition: color .2s ease;
        }
        .ctc-label-focused { color: #93c5fd; }

        .ctc-input, .ctc-textarea {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(96,165,250,0.14);
          color: #eff6ff;
          font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 400;
          outline: none;
          transition: border-color .25s ease, background .25s ease, box-shadow .25s ease;
          color-scheme: dark;
          -webkit-appearance: none;
        }
        .ctc-input::placeholder, .ctc-textarea::placeholder {
          color: rgba(147,197,253,0.28);
        }
        .ctc-input:hover, .ctc-textarea:hover {
          border-color: rgba(96,165,250,0.28);
          background: rgba(255,255,255,0.055);
        }
        .ctc-input:focus, .ctc-textarea:focus {
          border-color: rgba(96,165,250,0.6);
          background: rgba(59,130,246,0.07);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.18), 0 0 16px rgba(37,99,235,0.1);
        }
        .ctc-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }

        /* ── Submit button ── */
        .ctc-submit {
          display: inline-flex; align-items: center; justify-content: center; gap: 9px;
          padding: 13px 32px; border-radius: 100px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          border: 1px solid rgba(96,165,250,0.3);
          color: #fff; font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: .04em;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform .3s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow .3s ease, background .3s ease;
          width: 100%; margin-top: 6px;
        }
        .ctc-submit:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 32px rgba(37,99,235,0.5);
          background: linear-gradient(135deg, #2563eb, #3b82f6);
        }
        .ctc-submit:active { transform: scale(0.98); }
        .ctc-submit:disabled { opacity: .65; cursor: not-allowed; transform: none; }

        /* Shimmer on hover */
        .ctc-submit::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: translateX(-100%) skewX(-15deg);
        }
        .ctc-submit:hover::after { animation: ctcShim .55s ease forwards; }
        @keyframes ctcShim { to { transform: translateX(300%) skewX(-15deg); } }

        /* Sending spinner */
        .ctc-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          animation: ctcSpin .7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes ctcSpin { to { transform: rotate(360deg); } }

        /* ── Result message ── */
        .ctc-result {
          margin-top: 14px; padding: 12px 16px;
          border-radius: 10px; font-size: 13px; font-weight: 600;
          display: flex; align-items: center; gap: 8px;
          animation: ctcResultIn .4s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes ctcResultIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .ctc-result-success {
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.28);
          color: #6ee7b7;
        }
        .ctc-result-error {
          background: rgba(244,63,94,0.1);
          border: 1px solid rgba(244,63,94,0.28);
          color: #fca5a5;
        }

        /* ── Reveal animations ── */
        .ctc-reveal-left {
          opacity: 0; transform: translateX(-32px);
          transition: opacity .8s cubic-bezier(0.22,1,0.36,1),
                      transform .8s cubic-bezier(0.22,1,0.36,1);
        }
        .ctc-reveal-right {
          opacity: 0; transform: translateX(32px);
          transition: opacity .8s cubic-bezier(0.22,1,0.36,1) .15s,
                      transform .8s cubic-bezier(0.22,1,0.36,1) .15s;
        }
        .ctc-revealed { opacity: 1 !important; transform: none !important; }
      `}</style>

      <div className="ctc-inner">

        {/* ══ LEFT — Info ══ */}
        <div className={`ctc-reveal-left ${reveal ? "ctc-revealed" : ""}`}>

          <div className="ctc-eyebrow">
            <span className="ctc-eyebrow-dot" />
            Get In Touch
          </div>

          <h2 className="ctc-title">
            Let's <span className="ctc-title-accent">Connect</span>
          </h2>

          <p className="ctc-desc">
            Questions, applications, or just curious? We'd love to hear from you. Our team responds within 24 hours.
          </p>

          <div className="ctc-info-list">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("https") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="ctc-info-card"
              >
                <div className="ctc-info-icon">
                  <img src={item.icon} alt={item.label} />
                </div>
                <div>
                  <p className="ctc-info-label">{item.label}</p>
                  <p className="ctc-info-value">{item.value}</p>
                </div>
                <svg style={{ marginLeft:"auto", flexShrink:0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* ══ RIGHT — Form ══ */}
        <div className={`ctc-reveal-right ${reveal ? "ctc-revealed" : ""}`}>
          <div className="ctc-form-card">
            <p className="ctc-form-title">Send a Message</p>
            <p className="ctc-form-sub">We'll get back to you within 24 hours.</p>

            <form onSubmit={onSubmit} noValidate>

              {/* Name + Phone row */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}
                className="ctc-row-grid">
                <div className="ctc-field">
                  <label
                    className={`ctc-label ${focused === "name" ? "ctc-label-focused" : ""}`}
                  >
                    Full Name
                  </label>
                  <input
                    type="text" name="name" placeholder="Your name"
                    required className="ctc-input"
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused("")}
                  />
                </div>
                <div className="ctc-field">
                  <label
                    className={`ctc-label ${focused === "phone" ? "ctc-label-focused" : ""}`}
                  >
                    Phone
                  </label>
                  <input
                    type="tel" name="phone" placeholder="Your number"
                    required className="ctc-input"
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused("")}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="ctc-field">
                <label
                  className={`ctc-label ${focused === "email" ? "ctc-label-focused" : ""}`}
                >
                  Email Address
                </label>
                <input
                  type="email" name="email" placeholder="your@email.com"
                  required className="ctc-input"
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                />
              </div>

              {/* Message */}
              <div className="ctc-field">
                <label
                  className={`ctc-label ${focused === "message" ? "ctc-label-focused" : ""}`}
                >
                  Message
                </label>
                <textarea
                  name="message" rows="4"
                  placeholder="How can we help you?"
                  required className="ctc-textarea"
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused("")}
                />
              </div>

              <button
                type="submit"
                className="ctc-submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? (
                  <>
                    <span className="ctc-spinner" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M2 7.5h11M8.5 3l4.5 4.5L8.5 12"
                        stroke="white" strokeWidth="1.7"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Result */}
            {result && (
              <div className={`ctc-result ${status === "success" ? "ctc-result-success" : "ctc-result-error"}`}>
                {status === "success"
                  ? <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="rgba(52,211,153,0.2)" stroke="#34d399" strokeWidth="1.2"/><path d="M4.5 7.5l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="rgba(244,63,94,0.2)" stroke="#f43f5e" strokeWidth="1.2"/><path d="M5 5l5 5M10 5l-5 5" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round"/></svg>
                }
                {result}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 500px) {
          .ctc-row-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default Contact;