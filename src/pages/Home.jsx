import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-left">
          <div className="logo-area">
            <div className="logo">
              <img src="/logo.png" alt="Logo" />
            </div>
            <div className="college-info">
              <h1>TrustElect</h1>
              <p>DY Patil School Of Engineering And Technology, Ambi</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Register</Link>
        </div>
      </header>

      <section className="hero-home">
        <div className="hero-content-home">
          <div className="hero-badge">Secure Online Voting System</div>
          <h1>Headboy Election 2024-25</h1>
          <p>Cast your vote securely and transparently. Your voice matters in shaping the future of our college.</p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-accent btn-lg">Login to Vote</Link>
            <Link to="/results" className="btn btn-secondary btn-lg">View Results</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="vote-icon-large">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Why Trust Our Voting System?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3>Secure & Encrypted</h3>
              <p>Your vote is protected with enterprise-grade encryption ensuring complete ballot secrecy.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14 9 11"/>
                </svg>
              </div>
              <h3>Transparent</h3>
              <p>Real-time results visibility with complete audit trail of all voting activities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Fast & Efficient</h3>
              <p>Cast your vote in seconds with our intuitive and user-friendly interface.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <h3>One Person, One Vote</h3>
              <p>Advanced verification ensures each eligible voter can cast only one vote.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="election-info-section">
        <div className="container">
          <div className="election-card">
            <h2>About the Election</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Election Type</span>
                <span className="info-value">Headboy Election</span>
              </div>
              <div className="info-item">
                <span className="info-label">Academic Year</span>
                <span className="info-value">2024-25</span>
              </div>
              <div className="info-item">
                <span className="info-label">Institution</span>
                <span className="info-value">DY Patil SET, Ambi</span>
              </div>
              <div className="info-item">
                <span className="info-label">Positions</span>
                <span className="info-value">Headboy (1)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="container">
          <p>TrustElect Voting System - Building Democracy Digitally</p>
          <p>Secure • Transparent • Democratic</p>
        </div>
      </footer>

      <style>{`
        .home-page { min-height: 100vh; background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%); }
        .home-header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .header-left .logo-area { display: flex; align-items: center; gap: 1rem; }
        .header-left .logo { width: 50px; height: 50px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .header-left .logo img { width: 100%; height: 100%; object-fit: contain; }
        .header-left .logo svg { width: 30px; height: 30px; color: #1e3a8a; }
        .college-info h1 { color: white; font-size: 1.5rem; margin: 0; }
        .college-info p { color: rgba(255,255,255,0.8); font-size: 0.8rem; margin: 0; }
        .header-right { display: flex; gap: 1rem; }
        .hero-home { background: linear-gradient(135deg, rgba(30,58,138,0.95) 0%, rgba(59,130,246,0.95) 100%); padding: 4rem 2rem; display: flex; align-items: center; justify-content: space-between; min-height: 60vh; }
        .hero-content-home { max-width: 600px; }
        .hero-badge { display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; margin-bottom: 1.5rem; }
        .hero-content-home h1 { color: white; font-size: 3.5rem; margin-bottom: 1rem; }
        .hero-content-home p { color: rgba(255,255,255,0.9); font-size: 1.25rem; margin-bottom: 2rem; }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .vote-icon-large { width: 250px; height: 250px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .vote-icon-large svg { width: 150px; height: 150px; color: white; }
        .features-section { padding: 5rem 0; background: white; }
        .features-section h2 { text-align: center; color: #1e293b; font-size: 2rem; margin-bottom: 3rem; }
        .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .feature-card { text-align: center; padding: 2rem; border-radius: 16px; background: #f8fafc; }
        .feature-icon { width: 70px; height: 70px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
        .feature-icon svg { width: 35px; height: 35px; color: white; }
        .feature-card h3 { color: #1e293b; margin-bottom: 0.75rem; }
        .feature-card p { color: #64748b; font-size: 0.9rem; margin: 0; }
        .election-info-section { padding: 4rem 0; background: #f8fafc; }
        .election-card { background: white; border-radius: 24px; padding: 3rem; }
        .election-card h2 { color: #1e3a8a; text-align: center; margin-bottom: 2rem; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        .info-item { display: flex; flex-direction: column; padding: 1rem; background: #f8fafc; border-radius: 12px; }
        .info-label { color: #64748b; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .info-value { color: #1e293b; font-weight: 600; font-size: 1.1rem; }
        .home-footer { background: #1e293b; padding: 2rem 0; text-align: center; }
        .home-footer p { color: #94a3b8; margin: 0; }
        .home-footer p:first-child { color: white; font-weight: 600; margin-bottom: 0.5rem; }
        @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr); } .hero-content-home h1 { font-size: 2.5rem; } }
        @media (max-width: 768px) { .hero-home { flex-direction: column; text-align: center; padding: 3rem 1rem; } .hero-actions { justify-content: center; } .vote-icon-large { width: 150px; height: 150px; margin-top: 2rem; } .vote-icon-large svg { width: 80px; height: 80px; } .features-grid { grid-template-columns: 1fr; } .info-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
