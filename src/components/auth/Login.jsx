import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ password: '', voterId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill from registration redirect
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="background-effects">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="login-container animate-fadeIn">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          <h1 className="login-title">TrustElect</h1>
          <p className="login-subtitle">DY Patil School Of Engineering And Technology, Ambi</p>
          <p className="login-election">Headboy Election 2024-25</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Voter ID</label>
            <div className="input-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                name="voterId"
                className="form-input with-icon"
                placeholder="Enter your Voter ID"
                value={formData.voterId}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                name="password"
                className="form-input with-icon"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="register-link">
            <p>New Voter? <Link to="/register">Register Here</Link></p>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" style={{ width: 20, height: 20 }}></span>
                Logging in...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Login to Vote
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2024 TrustElect Voting System</p>
          <p>Secure • Transparent • Democratic</p>
          <a href="/admin/login" className="admin-access-link">Admin Access →</a>
        </div>
      </div>

      <style>{`
        .background-effects { position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: -1; }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
        .orb-1 { width: 400px; height: 400px; background: linear-gradient(135deg, #3b82f6, #1e40af); top: -100px; right: -100px; animation: float 8s ease-in-out infinite; }
        .orb-2 { width: 300px; height: 300px; background: linear-gradient(135deg, #f59e0b, #d97706); bottom: -50px; left: -50px; animation: float 10s ease-in-out infinite reverse; }
        .orb-3 { width: 200px; height: 200px; background: linear-gradient(135deg, #10b981, #059669); top: 50%; left: 50%; transform: translate(-50%, -50%); animation: pulse 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }
        @keyframes pulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.2); } }
        .login-container { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); padding: 3rem; width: 100%; max-width: 450px; border: 1px solid rgba(255,255,255,0.2); }
        .login-header { text-align: center; margin-bottom: 2rem; }
        .logo-container { display: flex; justify-content: center; margin-bottom: 1rem; }
        .logo-icon { width: 80px; height: 80px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(30,58,138,0.3); }
        .login-title { font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #1e3a8a, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
        .login-subtitle { font-size: 0.9rem; color: #64748b; margin-bottom: 0.25rem; font-weight: 500; }
        .login-election { font-size: 0.85rem; color: #f59e0b; font-weight: 600; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #94a3b8; }
        .form-input.with-icon { padding-left: 3rem; }
        .register-link { text-align: center; margin-bottom: 1.5rem; font-size: 0.9rem; }
        .register-link a { color: #3b82f6; font-weight: 600; }
        .register-link a:hover { text-decoration: underline; }
        .login-footer { text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.35rem; align-items: center; }
        .login-footer p { font-size: 0.8rem; color: #94a3b8; margin: 0; }
        .admin-access-link { margin-top: 0.4rem; font-size: 0.75rem; color: #94a3b8; text-decoration: none; letter-spacing: 0.03em; transition: color 0.15s; }
        .admin-access-link:hover { color: #64748b; }
      `}</style>
    </div>
  );
}
