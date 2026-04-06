import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ password: '', voterId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { prefillVoterId, prefillPassword } = location.state || {};
    if (prefillVoterId) {
      setFormData(prev => ({ ...prev, voterId: prefillVoterId, password: prefillPassword || '' }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login('voter', { voterIdOrEmail: formData.voterId, password: formData.password });
    if (result.success) {
      navigate('/voter');
    } else {
      setError(result.message || 'Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="lv-page">
      {/* ── LEFT PANEL ── */}
      <div className="lv-left">
        <div className="lv-left-inner">
          <div className="lv-logo-wrap">
            <img src="/logo.png" alt="TrustElect" className="lv-logo-img" />
          </div>
          <h1 className="lv-brand">TrustElect</h1>
          <p className="lv-college">DY Patil School Of Engineering<br/>And Technology, Ambi</p>
          <div className="lv-badge">🗳️ Headboy Election 2024-25</div>

          <div className="lv-features">
            <div className="lv-feat">
              <span className="lv-feat-icon">🔐</span>
              <div>
                <p className="lv-feat-title">Secure Voting</p>
                <p className="lv-feat-sub">JWT encrypted & anonymous</p>
              </div>
            </div>
            <div className="lv-feat">
              <span className="lv-feat-icon">✅</span>
              <div>
                <p className="lv-feat-title">One Vote Only</p>
                <p className="lv-feat-sub">Your vote counts once</p>
              </div>
            </div>
            <div className="lv-feat">
              <span className="lv-feat-icon">📊</span>
              <div>
                <p className="lv-feat-title">Live Results</p>
                <p className="lv-feat-sub">Real-time vote count</p>
              </div>
            </div>
          </div>

          <p className="lv-copy">© 2024 TrustElect • Secure & Transparent</p>
        </div>

        {/* decorative circles */}
        <div className="lv-circle lv-c1" />
        <div className="lv-circle lv-c2" />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lv-right">
        <div className="lv-form-card">
          <div className="lv-form-header">
            <h2 className="lv-form-title">Welcome Back 👋</h2>
            <p className="lv-form-sub">Login with your Voter ID to cast your vote</p>
          </div>

          {error && (
            <div className="lv-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="lv-form">
            <div className="lv-field">
              <label className="lv-label">Voter ID</label>
              <div className="lv-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lv-input-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  name="voterId"
                  className="lv-input"
                  placeholder="e.g. VTR-XXXXXX"
                  value={formData.voterId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="lv-field">
              <label className="lv-label">Password</label>
              <div className="lv-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lv-input-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  className="lv-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="lv-eye" onClick={() => setShowPass(p => !p)}>
                  {showPass
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" className="lv-btn" disabled={loading}>
              {loading ? (
                <><span className="lv-spinner" /> Logging in...</>
              ) : (
                <>Login to Vote &nbsp;→</>
              )}
            </button>
          </form>

          <p className="lv-register-link">
            New voter? <Link to="/register">Register here</Link>
          </p>

          <div className="lv-divider"><span>or</span></div>

          <a href="/admin/login" className="lv-admin-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Admin Portal
          </a>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .lv-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── LEFT ── */
        .lv-left {
          width: 45%;
          background: linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .lv-left-inner {
          position: relative;
          z-index: 2;
          color: white;
          width: 100%;
          max-width: 340px;
        }

        .lv-logo-wrap {
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.15);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .lv-logo-img { width: 56px; height: 56px; object-fit: contain; }

        .lv-brand {
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: -1px;
          margin-bottom: 0.5rem;
        }

        .lv-college {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .lv-badge {
          display: inline-block;
          background: rgba(251,191,36,0.2);
          border: 1px solid rgba(251,191,36,0.4);
          color: #fbbf24;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 2.5rem;
        }

        .lv-features {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }

        .lv-feat {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 0.85rem 1rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .lv-feat-icon { font-size: 1.5rem; }

        .lv-feat-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.1rem;
        }

        .lv-feat-sub {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.55);
        }

        .lv-copy {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
        }

        .lv-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.08;
          background: white;
        }

        .lv-c1 { width: 350px; height: 350px; top: -100px; right: -100px; }
        .lv-c2 { width: 250px; height: 250px; bottom: -80px; left: -80px; }

        /* ── RIGHT ── */
        .lv-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 2rem;
        }

        .lv-form-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 4px 40px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }

        .lv-form-header { margin-bottom: 2rem; }

        .lv-form-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.4rem;
        }

        .lv-form-sub {
          font-size: 0.9rem;
          color: #64748b;
        }

        .lv-error {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
        }

        .lv-form { display: flex; flex-direction: column; gap: 1.25rem; }

        .lv-field { display: flex; flex-direction: column; gap: 0.4rem; }

        .lv-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
        }

        .lv-input-wrap { position: relative; }

        .lv-input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          width: 18px;
          height: 18px;
          pointer-events: none;
        }

        .lv-input {
          width: 100%;
          padding: 0.85rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          color: #0f172a;
          background: #f9fafb;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .lv-input:focus {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
        }

        .lv-eye {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .lv-eye:hover { color: #374151; }

        .lv-btn {
          width: 100%;
          padding: 0.95rem;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 20px rgba(59,130,246,0.3);
        }

        .lv-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(59,130,246,0.4);
        }

        .lv-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .lv-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: lv-spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes lv-spin { to { transform: rotate(360deg); } }

        .lv-register-link {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.9rem;
          color: #64748b;
        }
        .lv-register-link a {
          color: #3b82f6;
          font-weight: 700;
          text-decoration: none;
        }
        .lv-register-link a:hover { text-decoration: underline; }

        .lv-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.25rem 0;
          color: #cbd5e1;
          font-size: 0.8rem;
        }
        .lv-divider::before, .lv-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .lv-admin-btn {
          width: 100%;
          padding: 0.8rem;
          background: white;
          color: #475569;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .lv-admin-btn:hover {
          border-color: #94a3b8;
          background: #f8fafc;
          color: #1e293b;
        }

        /* mobile */
        @media (max-width: 768px) {
          .lv-page { flex-direction: column; }
          .lv-left {
            width: 100%;
            padding: 2rem 1.5rem;
            min-height: auto;
          }
          .lv-left-inner { max-width: 100%; }
          .lv-features { display: none; }
          .lv-right { padding: 1.5rem 1rem; }
          .lv-form-card { padding: 2rem 1.5rem; }
        }
      `}</style>
    </div>
  );
}
