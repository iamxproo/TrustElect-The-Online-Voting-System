import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    className: '',
    rollNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Auto-navigate to login after popup shown
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login', {
          state: {
            prefillVoterId: success?.voterId,
            prefillPassword: success?.password,
          },
        });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.className || !formData.rollNumber) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      setSuccess(result);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const handleLogin = () => {
    navigate('/login', {
      state: {
        prefillVoterId: success?.voterId,
        prefillPassword: success?.password,
      },
    });
  };

  return (
    <>
      {/* ── SUCCESS POPUP MODAL via Portal ── */}
      {success && createPortal(
        <div className="reg-success-overlay" onClick={handleLogin}>
          <div className="reg-success-popup" onClick={e => e.stopPropagation()}>
            <div className="reg-popup-check">✅</div>
            <h2 className="reg-popup-title">Registration Successful!</h2>
            <p className="reg-popup-sub">Save your credentials — you'll need these to login.</p>
            <div className="reg-popup-creds">
              <div className="reg-popup-row">
                <span className="reg-popup-label">🪪 Voter ID</span>
                <span className="reg-popup-val">{success.voterId}</span>
              </div>
              <div className="reg-popup-divider" />
              <div className="reg-popup-row">
                <span className="reg-popup-label">🔑 Password</span>
                <span className="reg-popup-val">{success.password}</span>
              </div>
            </div>
            <p className="reg-popup-note">💡 Voter ID aur Password dono <strong>same</strong> hain.</p>
            <button onClick={handleLogin} className="reg-popup-btn">Login Page pe Jao →</button>
            <p style={{fontSize:'0.75rem', color:'#6b7280', marginTop:'0.5rem', textAlign:'center'}}>
              8 seconds mein automatically redirect hoga...
            </p>
          </div>
          <style>{`
            .reg-success-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:1rem; animation:fadeIn 0.2s ease; }
            @keyframes fadeIn { from{opacity:0} to{opacity:1} }
            .reg-success-popup { background:white; border-radius:24px; padding:2.5rem 2rem; width:100%; max-width:400px; box-shadow:0 30px 80px rgba(0,0,0,0.35); text-align:center; animation:slideUp 0.25s ease; }
            @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
            .reg-popup-check { font-size:3.5rem; line-height:1; margin-bottom:0.6rem; }
            .reg-popup-title { font-size:1.45rem; font-weight:800; color:#064e3b; margin-bottom:0.3rem; }
            .reg-popup-sub { font-size:0.88rem; color:#64748b; margin-bottom:1.4rem; }
            .reg-popup-creds { background:linear-gradient(135deg,#ecfdf5,#d1fae5); border:2px solid #10b981; border-radius:16px; padding:1.2rem 1.4rem; margin-bottom:1rem; text-align:left; }
            .reg-popup-row { display:flex; align-items:center; justify-content:space-between; gap:0.75rem; }
            .reg-popup-label { font-size:0.85rem; color:#065f46; font-weight:600; white-space:nowrap; }
            .reg-popup-val { font-size:1.05rem; font-weight:800; color:#1e3a8a; letter-spacing:0.04em; background:white; padding:0.3rem 0.75rem; border-radius:8px; border:1.5px solid #bfdbfe; font-family:monospace; }
            .reg-popup-divider { height:1px; background:#a7f3d0; margin:0.85rem 0; }
            .reg-popup-note { font-size:0.82rem; color:#64748b; margin-bottom:1.4rem; }
            .reg-popup-btn { width:100%; padding:0.9rem; background:linear-gradient(135deg,#10b981,#059669); color:white; border:none; border-radius:12px; font-size:1rem; font-weight:700; cursor:pointer; box-shadow:0 4px 15px rgba(16,185,129,0.4); transition:transform 0.15s, box-shadow 0.15s; }
            .reg-popup-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(16,185,129,0.5); }
          `}</style>
        </div>,
        document.body
      )}

      {/* ── MAIN PAGE ── */}
      <div className="rv-page">

        {/* LEFT PANEL */}
        <div className="rv-left">
          <div className="rv-left-inner">
            <div className="rv-logo-wrap">
              <img src="/logo.png" alt="TrustElect" className="rv-logo-img" />
            </div>
            <h1 className="rv-brand">TrustElect</h1>
            <p className="rv-college">DY Patil School Of Engineering<br/>And Technology, Ambi</p>
            <div className="rv-badge">🗳️ Headboy Election 2024-25</div>

            <p className="rv-steps-title">How it works</p>
            <div className="rv-steps">
              <div className="rv-step">
                <div className="rv-step-num">1</div>
                <div>
                  <p className="rv-step-title">Register</p>
                  <p className="rv-step-sub">Fill in your college details</p>
                </div>
              </div>
              <div className="rv-step">
                <div className="rv-step-num">2</div>
                <div>
                  <p className="rv-step-title">Get Voter ID</p>
                  <p className="rv-step-sub">Auto-generated credentials</p>
                </div>
              </div>
              <div className="rv-step">
                <div className="rv-step-num">3</div>
                <div>
                  <p className="rv-step-title">Cast Your Vote</p>
                  <p className="rv-step-sub">Securely vote for your candidate</p>
                </div>
              </div>
            </div>

            <p className="rv-copy">© 2024 TrustElect • Secure & Transparent</p>
          </div>
          <div className="rv-circle rv-c1" />
          <div className="rv-circle rv-c2" />
        </div>

        {/* RIGHT PANEL */}
        <div className="rv-right">
          <div className="rv-form-card">
            <div className="rv-form-header">
              <h2 className="rv-form-title">Create Account 📋</h2>
              <p className="rv-form-sub">Register to get your Voter ID and cast your vote</p>
            </div>

            {error && (
              <div className="rv-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="rv-form">
              {/* Name */}
              <div className="rv-field">
                <label className="rv-label">Full Name <span className="rv-req">*</span></label>
                <div className="rv-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rv-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="text" name="name" className="rv-input" placeholder="Enter your full name"
                    value={formData.name} onChange={handleChange} required />
                </div>
              </div>

              {/* Email */}
              <div className="rv-field">
                <label className="rv-label">Email Address <span className="rv-req">*</span></label>
                <div className="rv-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rv-icon">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" name="email" className="rv-input" placeholder="Enter your email"
                    value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              {/* Phone */}
              <div className="rv-field">
                <label className="rv-label">Phone Number</label>
                <div className="rv-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rv-icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 12 19.79 19.79 0 0 1 1.04 3.4 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input type="tel" name="phone" className="rv-input" placeholder="Enter phone number"
                    value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              {/* Class + Roll */}
              <div className="rv-row">
                <div className="rv-field">
                  <label className="rv-label">Class <span className="rv-req">*</span></label>
                  <div className="rv-input-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rv-icon">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                    <select name="className" className="rv-input rv-select" value={formData.className} onChange={handleChange} required>
                      <option value="">Select Year</option>
                      <option value="SE">Second Year (SE)</option>
                      <option value="TE">Third Year (TE)</option>
                      <option value="BE">Final Year (BE)</option>
                    </select>
                  </div>
                </div>
                <div className="rv-field">
                  <label className="rv-label">Roll Number <span className="rv-req">*</span></label>
                  <div className="rv-input-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rv-icon">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <input type="text" name="rollNumber" className="rv-input" placeholder="e.g. 2021001"
                      value={formData.rollNumber} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="rv-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{flexShrink:0, marginTop:'2px'}}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <p>After registration, your <strong>Voter ID & Password</strong> will be shown on screen. Save them to login and vote!</p>
              </div>

              <button type="submit" className="rv-btn" disabled={loading}>
                {loading
                  ? <><span className="rv-spinner" /> Registering...</>
                  : <>Register as Voter &nbsp;→</>
                }
              </button>
            </form>

            <p className="rv-login-link">
              Already registered? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .rv-page { min-height:100vh; display:flex; font-family:'Inter',-apple-system,sans-serif; }

        .rv-left { width:42%; background:linear-gradient(145deg,#052e16 0%,#065f46 50%,#059669 100%); display:flex; align-items:center; justify-content:center; padding:3rem 2.5rem; position:relative; overflow:hidden; }
        .rv-left-inner { position:relative; z-index:2; color:white; width:100%; max-width:320px; }
        .rv-logo-wrap { width:80px; height:80px; background:rgba(255,255,255,0.15); border-radius:20px; display:flex; align-items:center; justify-content:center; margin-bottom:1.5rem; backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.2); }
        .rv-logo-img { width:56px; height:56px; object-fit:contain; }
        .rv-brand { font-size:2.5rem; font-weight:900; letter-spacing:-1px; margin-bottom:0.5rem; }
        .rv-college { font-size:0.88rem; color:rgba(255,255,255,0.7); line-height:1.5; margin-bottom:1.25rem; }
        .rv-badge { display:inline-block; background:rgba(251,191,36,0.2); border:1px solid rgba(251,191,36,0.4); color:#fbbf24; padding:0.4rem 1rem; border-radius:999px; font-size:0.82rem; font-weight:600; margin-bottom:2rem; }
        .rv-steps-title { font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.5); margin-bottom:1rem; }
        .rv-steps { display:flex; flex-direction:column; gap:1rem; margin-bottom:2.5rem; }
        .rv-step { display:flex; align-items:center; gap:1rem; }
        .rv-step-num { width:32px; height:32px; background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.3); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.85rem; font-weight:800; flex-shrink:0; }
        .rv-step-title { font-size:0.9rem; font-weight:700; color:white; margin:0; }
        .rv-step-sub { font-size:0.76rem; color:rgba(255,255,255,0.55); margin:0; }
        .rv-copy { font-size:0.75rem; color:rgba(255,255,255,0.4); }
        .rv-circle { position:absolute; border-radius:50%; opacity:0.07; background:white; }
        .rv-c1 { width:350px; height:350px; top:-100px; right:-100px; }
        .rv-c2 { width:250px; height:250px; bottom:-80px; left:-80px; }

        .rv-right { flex:1; display:flex; align-items:center; justify-content:center; background:#f8fafc; padding:2rem; overflow-y:auto; }
        .rv-form-card { width:100%; max-width:460px; background:white; border-radius:24px; padding:2.5rem; box-shadow:0 4px 40px rgba(0,0,0,0.08); border:1px solid #e2e8f0; }
        .rv-form-header { margin-bottom:1.75rem; }
        .rv-form-title { font-size:1.75rem; font-weight:800; color:#0f172a; margin-bottom:0.4rem; }
        .rv-form-sub { font-size:0.9rem; color:#64748b; }
        .rv-error { display:flex; align-items:center; gap:0.6rem; background:#fef2f2; border:1px solid #fecaca; color:#dc2626; padding:0.75rem 1rem; border-radius:10px; font-size:0.875rem; margin-bottom:1.25rem; }
        .rv-form { display:flex; flex-direction:column; gap:1.1rem; }
        .rv-field { display:flex; flex-direction:column; gap:0.35rem; }
        .rv-label { font-size:0.84rem; font-weight:600; color:#374151; }
        .rv-req { color:#ef4444; }
        .rv-input-wrap { position:relative; }
        .rv-icon { position:absolute; left:0.9rem; top:50%; transform:translateY(-50%); color:#9ca3af; width:17px; height:17px; pointer-events:none; }
        .rv-input { width:100%; padding:0.8rem 0.9rem 0.8rem 2.7rem; border:2px solid #e5e7eb; border-radius:12px; font-size:0.92rem; color:#0f172a; background:#f9fafb; outline:none; transition:border-color 0.2s, box-shadow 0.2s, background 0.2s; box-sizing:border-box; }
        .rv-input:focus { border-color:#10b981; background:white; box-shadow:0 0 0 4px rgba(16,185,129,0.1); }
        .rv-select { appearance:none; cursor:pointer; }
        .rv-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .rv-info { display:flex; gap:0.6rem; align-items:flex-start; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:10px; padding:0.85rem 1rem; }
        .rv-info p { font-size:0.82rem; color:#065f46; margin:0; line-height:1.5; }
        .rv-btn { width:100%; padding:0.95rem; background:linear-gradient(135deg,#059669,#10b981); color:white; border:none; border-radius:12px; font-size:1rem; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; transition:transform 0.2s, box-shadow 0.2s, opacity 0.2s; box-shadow:0 4px 20px rgba(16,185,129,0.3); margin-top:0.25rem; }
        .rv-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 30px rgba(16,185,129,0.4); }
        .rv-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .rv-spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:rv-spin 0.7s linear infinite; display:inline-block; }
        @keyframes rv-spin { to { transform:rotate(360deg); } }
        .rv-login-link { text-align:center; margin-top:1.25rem; font-size:0.9rem; color:#64748b; }
        .rv-login-link a { color:#10b981; font-weight:700; text-decoration:none; }
        .rv-login-link a:hover { text-decoration:underline; }

        @media (max-width:768px) {
          .rv-page { flex-direction:column; }
          .rv-left { width:100%; padding:2rem 1.5rem; min-height:auto; }
          .rv-left-inner { max-width:100%; }
          .rv-steps { display:none; }
          .rv-right { padding:1.5rem 1rem; }
          .rv-form-card { padding:2rem 1.5rem; }
          .rv-row { grid-template-columns:1fr; }
        }
      `}</style>
    </>
  );
}
