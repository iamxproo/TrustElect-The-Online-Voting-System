import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [loginType, setLoginType] = useState('voter');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    voterId: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const credentials = loginType === 'admin' 
      ? { username: formData.username, password: formData.password }
      : { voterId: formData.voterId, email: formData.email, password: formData.password };

    const result = await login(loginType, credentials);

    if (result.success) {
      if (loginType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/voter');
      }
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="background-effects">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="login-container animate-fadeIn">
        {/* Header with Logo */}
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

        {/* Login Type Toggle */}
        <div className="login-toggle">
          <button
            type="button"
            className={`toggle-btn ${loginType === 'voter' ? 'active' : ''}`}
            onClick={() => setLoginType('voter')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Voter Login
          </button>
          <button
            type="button"
            className={`toggle-btn ${loginType === 'admin' ? 'active' : ''}`}
            onClick={() => setLoginType('admin')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
            </svg>
            Admin Login
          </button>
        </div>

        {/* Error Message */}
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {loginType === 'admin' ? (
            <>
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    name="username"
                    className="form-input with-icon"
                    placeholder="Enter admin username"
                    value={formData.username}
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
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="demo-credentials">
                <p>Demo: username: <strong>admin</strong> | password: <strong>admin123</strong></p>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Voter ID or Email</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    name="voterId"
                    className="form-input with-icon"
                    placeholder="Enter Voter ID or Email"
                    value={formData.voterId}
                    onChange={handleChange}
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
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="register-link">
                <p>New Voter? <Link to="/register">Register Here</Link></p>
              </div>
            </>
          )}

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

        {/* Footer */}
        <div className="login-footer">
          <p>© 2024 TrustElect Voting System</p>
          <p>Secure • Transparent • Democratic</p>
        </div>
      </div>

      <style>{`
        .background-effects {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          top: -100px;
          right: -100px;
          animation: float 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          bottom: -50px;
          left: -50px;
          animation: float 10s ease-in-out infinite reverse;
        }

        .orb-3 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #10b981, #059669);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }

        .login-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          padding: 3rem;
          width: 100%;
          max-width: 450px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .logo-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(30, 58, 138, 0.3);
        }

        .logo-icon svg {
          width: 50px;
          height: 50px;
          color: white;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .login-election {
          font-size: 0.85rem;
          color: #f59e0b;
          font-weight: 600;
        }

        .login-toggle {
          display: flex;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1.5rem;
        }

        .toggle-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .toggle-btn svg {
          width: 18px;
          height: 18px;
        }

        .toggle-btn.active {
          background: white;
          color: #1e3a8a;
          box-shadow: 0 2px 8px rgba(30, 58, 138, 0.15);
        }

        .toggle-btn:hover:not(.active) {
          color: #1e3a8a;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #94a3b8;
        }

        .form-input.with-icon {
          padding-left: 3rem;
        }

        .demo-credentials {
          background: #fef3c7;
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 0.85rem;
          color: #92400e;
        }

        .register-link {
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .register-link a {
          color: #3b82f6;
          font-weight: 600;
        }

        .register-link a:hover {
          text-decoration: underline;
        }

        .login-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .login-footer p {
          font-size: 0.8rem;
          color: #94a3b8;
          margin: 0;
        }

        .login-footer p:last-child {
          margin-top: 0.5rem;
          color: #10b981;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
