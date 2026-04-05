import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login('admin', { username: formData.username, password: formData.password });
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Access denied. Invalid credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="adm-root">
      {/* Left panel */}
      <div className="adm-left">
        <div className="adm-left-inner">
          <div className="adm-brand">
            <div className="adm-brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="adm-brand-name">TrustElect</span>
          </div>

          <div className="adm-left-content">
            <h1 className="adm-headline">Election<br/>Control<br/>Centre</h1>
            <p className="adm-tagline">Authorised personnel only. All access attempts are monitored and logged.</p>

            <div className="adm-badges">
              <div className="adm-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                256-bit Encrypted
              </div>
              <div className="adm-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Session Tracked
              </div>
              <div className="adm-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                Audit Logged
              </div>
            </div>
          </div>

          <div className="adm-left-footer">
            <span>© 2024 TrustElect · DY Patil School of Engineering</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="adm-right">
        <div className="adm-form-card">
          {/* Header */}
          <div className="adm-form-header">
            <div className="adm-lock-ring">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="adm-form-title">Admin Portal</h2>
            <p className="adm-form-sub">Sign in with your administrator credentials</p>
          </div>

          {/* Alert */}
          {error && (
            <div className="adm-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="adm-form" autoComplete="off">
            <div className="adm-field">
              <label className="adm-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Administrator Username
              </label>
              <input
                type="text"
                name="username"
                className="adm-input"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="off"
                spellCheck="false"
                required
              />
            </div>

            <div className="adm-field">
              <label className="adm-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Password
              </label>
              <div className="adm-input-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  className="adm-input"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button type="button" className="adm-eye" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                  {showPass ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="adm-btn" disabled={loading}>
              {loading ? (
                <><span className="adm-spinner"></span> Authenticating...</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Access Control Panel
                </>
              )}
            </button>
          </form>

          <div className="adm-divider"></div>

          <a href="/login" className="adm-voter-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Go to Voter Login
          </a>

          <div className="adm-warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Unauthorised access is a punishable offence
          </div>
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adm-root {
          min-height: 100vh;
          display: flex;
          background: #0a0f1e;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ── LEFT ── */
        .adm-left {
          width: 45%;
          background: linear-gradient(145deg, #0d1b3e 0%, #0a0f1e 40%, #0d1b2e 100%);
          border-right: 1px solid rgba(59,130,246,0.15);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: stretch;
        }
        .adm-left::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          top: -100px; left: -100px;
          pointer-events: none;
        }
        .adm-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
          bottom: 50px; right: -50px;
          pointer-events: none;
        }
        .adm-left-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          padding: 3rem;
          width: 100%;
        }
        .adm-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: auto;
        }
        .adm-brand-icon {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(59,130,246,0.35);
        }
        .adm-brand-icon svg { width: 22px; height: 22px; color: white; }
        .adm-brand-name {
          font-size: 1.3rem; font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
        }
        .adm-left-content { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 3rem 0; }
        .adm-headline {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 900;
          color: white;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }
        .adm-headline span { color: #3b82f6; }
        .adm-tagline {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          max-width: 320px;
          margin-bottom: 2.5rem;
        }
        .adm-badges { display: flex; flex-direction: column; gap: 0.75rem; }
        .adm-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          font-size: 0.78rem; font-weight: 500;
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          width: fit-content;
          letter-spacing: 0.01em;
        }
        .adm-badge svg { color: #3b82f6; flex-shrink: 0; }
        .adm-left-footer {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.02em;
        }

        /* ── RIGHT ── */
        .adm-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #080d1a;
        }
        .adm-form-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem;
          backdrop-filter: blur(10px);
        }

        .adm-form-header { text-align: center; margin-bottom: 2rem; }
        .adm-lock-ring {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, rgba(29,78,216,0.25), rgba(59,130,246,0.15));
          border: 1px solid rgba(59,130,246,0.3);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
          color: #60a5fa;
          box-shadow: 0 0 30px rgba(59,130,246,0.15);
        }
        .adm-form-title {
          font-size: 1.5rem; font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
          margin-bottom: 0.4rem;
        }
        .adm-form-sub { font-size: 0.83rem; color: rgba(255,255,255,0.35); }

        .adm-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.83rem;
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 1.25rem;
        }
        .adm-error svg { flex-shrink: 0; color: #f87171; }

        .adm-form { display: flex; flex-direction: column; gap: 1.1rem; }

        .adm-field { display: flex; flex-direction: column; gap: 0.45rem; }
        .adm-label {
          font-size: 0.75rem; font-weight: 600;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .adm-label svg { color: #3b82f6; }
        .adm-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: white;
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          letter-spacing: 0.01em;
        }
        .adm-input::placeholder { color: rgba(255,255,255,0.2); }
        .adm-input:focus {
          border-color: rgba(59,130,246,0.5);
          background: rgba(59,130,246,0.05);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }

        .adm-input-wrap { position: relative; }
        .adm-input-wrap .adm-input { padding-right: 3rem; }
        .adm-eye {
          position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); padding: 0; line-height: 0;
          transition: color 0.15s;
        }
        .adm-eye:hover { color: rgba(255,255,255,0.7); }

        .adm-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.92rem; font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.6rem;
          margin-top: 0.4rem;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 4px 20px rgba(29,78,216,0.4);
          letter-spacing: 0.01em;
        }
        .adm-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(29,78,216,0.55);
        }
        .adm-btn:active:not(:disabled) { transform: translateY(0); }
        .adm-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .adm-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: adm-spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes adm-spin { to { transform: rotate(360deg); } }

        .adm-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 1.5rem 0 1rem;
        }

        .adm-voter-link {
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          color: rgba(255,255,255,0.35);
          font-size: 0.8rem; font-weight: 500;
          text-decoration: none;
          transition: color 0.15s;
          margin-bottom: 1.25rem;
        }
        .adm-voter-link:hover { color: rgba(255,255,255,0.65); }

        .adm-warning {
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          font-size: 0.72rem;
          color: rgba(251,191,36,0.4);
          text-align: center;
          letter-spacing: 0.01em;
        }
        .adm-warning svg { color: rgba(251,191,36,0.5); flex-shrink: 0; }

        @media (max-width: 768px) {
          .adm-root { flex-direction: column; }
          .adm-left { width: 100%; min-height: auto; padding: 0; }
          .adm-left-inner { padding: 2rem; }
          .adm-headline { font-size: 1.8rem; }
          .adm-left-content { padding: 1.5rem 0; }
          .adm-tagline { display: none; }
          .adm-left-footer { display: none; }
          .adm-right { padding: 1.5rem; background: #0a0f1e; }
          .adm-form-card { border: none; background: transparent; padding: 1rem 0; }
        }
      `}</style>
    </div>
  );
}
