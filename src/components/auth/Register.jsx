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
      }, 8000); // 8 seconds to read credentials
      return () => clearTimeout(timer);
    }
  }, [success]);

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

          <button onClick={handleLogin} className="reg-popup-btn">
            Login Page pe Jao →
          </button>
          <p style={{fontSize:'0.75rem', color:'#6b7280', marginTop:'0.5rem', textAlign:'center'}}>
            8 seconds mein automatically redirect hoga...
          </p>
        </div>

        <style>{`
          .reg-success-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(6px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            animation: fadeIn 0.2s ease;
          }
          @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

          .reg-success-popup {
            background: white;
            border-radius: 24px;
            padding: 2.5rem 2rem;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 30px 80px rgba(0,0,0,0.35);
            text-align: center;
            animation: slideUp 0.25s ease;
          }
          @keyframes slideUp { from { transform:translateY(30px); opacity:0 } to { transform:translateY(0); opacity:1 } }

          .reg-popup-check { font-size: 3.5rem; line-height: 1; margin-bottom: 0.6rem; }

          .reg-popup-title {
            font-size: 1.45rem;
            font-weight: 800;
            color: #064e3b;
            margin-bottom: 0.3rem;
          }

          .reg-popup-sub {
            font-size: 0.88rem;
            color: #64748b;
            margin-bottom: 1.4rem;
          }

          .reg-popup-creds {
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            border: 2px solid #10b981;
            border-radius: 16px;
            padding: 1.2rem 1.4rem;
            margin-bottom: 1rem;
            text-align: left;
          }

          .reg-popup-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
          }

          .reg-popup-label {
            font-size: 0.85rem;
            color: #065f46;
            font-weight: 600;
            white-space: nowrap;
          }

          .reg-popup-val {
            font-size: 1.05rem;
            font-weight: 800;
            color: #1e3a8a;
            letter-spacing: 0.04em;
            background: white;
            padding: 0.3rem 0.75rem;
            border-radius: 8px;
            border: 1.5px solid #bfdbfe;
            font-family: monospace;
          }

          .reg-popup-divider {
            height: 1px;
            background: #a7f3d0;
            margin: 0.85rem 0;
          }

          .reg-popup-note {
            font-size: 0.82rem;
            color: #64748b;
            margin-bottom: 1.4rem;
          }

          .reg-popup-btn {
            width: 100%;
            padding: 0.9rem;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(16,185,129,0.4);
            transition: transform 0.15s, box-shadow 0.15s;
          }
          .reg-popup-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(16,185,129,0.5);
          }
        `}</style>
      </div>,
      document.body
    )}

    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="register-container animate-fadeIn">
        <>
        {/* Header with Logo */}
        <div className="register-header">
          <div className="logo-container">
            <div className="logo-icon">
              <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          <h1 className="register-title">Voter Registration</h1>
          <p className="register-subtitle">DY Patil School Of Engineering And Technology, Ambi</p>
          <p className="register-election">Headboy Election 2024-25</p>
        </div>

        {/* Error Message */}
        {error && !success && (
          <div className="alert alert-danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}

        {/* Registration Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  name="name"
                  className="form-input with-icon"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  className="form-input with-icon"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <input
                  type="tel"
                  name="phone"
                  className="form-input with-icon"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Class *</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  <select
                    name="className"
                    className="form-input with-icon"
                    value={formData.className}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Class</option>
                    <option value="SE">Second Year (SE)</option>
                    <option value="TE">Third Year (TE)</option>
                    <option value="BE">Final Year (BE)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Roll Number *</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <input
                    type="text"
                    name="rollNumber"
                    className="form-input with-icon"
                    placeholder="Enter roll number"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="info-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p>After registration, your Voter ID and Password will be sent to your email. Use these credentials to login and cast your vote.</p>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20 }}></span>
                  Registering...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Register as Voter
                </>
              )}
            </button>

            <div className="login-link">
              <p>Already registered? <Link to="/login">Login Here</Link></p>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="register-footer">
          <p>© 2024 TrustElect Voting System</p>
          <p>Secure • Transparent • Democratic</p>
        </div>
        </>
      </div>

      <style>{`
        .success-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .success-popup {
          background: white;
          border-radius: 24px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
          text-align: center;
          position: relative;
        }

        .popup-check {
          font-size: 3.5rem;
          margin-bottom: 0.75rem;
          line-height: 1;
        }

        .success-popup h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #064e3b;
          margin-bottom: 0.4rem;
        }

        .popup-sub {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        .popup-creds {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 2px solid #10b981;
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1rem;
          text-align: left;
        }

        .popup-cred-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .popup-cred-label {
          font-size: 0.85rem;
          color: #065f46;
          font-weight: 600;
          white-space: nowrap;
        }

        .popup-cred-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e3a8a;
          letter-spacing: 0.04em;
          background: white;
          padding: 0.3rem 0.75rem;
          border-radius: 8px;
          border: 1.5px solid #bfdbfe;
          font-family: monospace;
        }

        .popup-cred-divider {
          height: 1px;
          background: #a7f3d0;
          margin: 0.85rem 0;
        }

        .popup-note {
          font-size: 0.82rem;
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        .popup-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 15px rgba(16,185,129,0.4);
        }

        .popup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16,185,129,0.5);
        }

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
          background: linear-gradient(135deg, #10b981, #059669);
          top: -100px;
          left: -100px;
          animation: float 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          bottom: -50px;
          right: -50px;
          animation: float 10s ease-in-out infinite reverse;
        }

        .orb-3 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }

        .register-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          padding: 3rem;
          width: 100%;
          max-width: 500px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .logo-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .logo-icon svg {
          width: 40px;
          height: 40px;
          color: white;
        }

        .register-title {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #10b981, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .register-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .register-election {
          font-size: 0.85rem;
          color: #f59e0b;
          font-weight: 600;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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

        .info-box {
          background: #dbeafe;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .info-box svg {
          color: #1e40af;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-box p {
          font-size: 0.85rem;
          color: #1e40af;
          margin: 0;
          line-height: 1.5;
        }

        .success-card {
          text-align: center;
          padding: 1rem 0;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: #d1fae5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .success-icon svg {
          width: 40px;
          height: 40px;
          color: #10b981;
        }

        .success-card h3 {
          color: #065f46;
          margin-bottom: 0.5rem;
        }

        .success-card > p {
          color: #047857;
          margin-bottom: 1.5rem;
        }

        .credentials-box {
          background: #f0fdf4;
          border: 2px dashed #10b981;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .credential-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
        }

        .credential-item:not(:last-child) {
          border-bottom: 1px solid #d1fae5;
        }

        .credential-label {
          color: #64748b;
          font-weight: 500;
        }

        .credential-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #10b981;
          font-family: monospace;
        }

        .email-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .login-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
        }

        .login-link a {
          color: #10b981;
          font-weight: 600;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        .register-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .register-footer p {
          font-size: 0.8rem;
          color: #94a3b8;
          margin: 0;
        }

        .register-footer p:last-child {
          margin-top: 0.5rem;
          color: #10b981;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
    </>
  );
}
