import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      {/* Header */}
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
          <Link to="/login" className="btn btn-outline-white">Login</Link>
          <Link to="/register" className="btn btn-white">Register</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-home">
        <div className="hero-content-home">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Online Voting System — Active
          </div>
          <h1>Your Vote,<br />Your Voice 🗳️</h1>
          <p>Participate in a <strong>100% secure, transparent</strong> and fair digital election. Every vote counts — cast yours from anywhere, anytime.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-accent btn-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Register to Vote
            </Link>
            <Link to="/login" className="btn btn-outline-white btn-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Already Registered? Login
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-num">🔒</span>
              <span className="stat-label">End-to-End Secure</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-num">⚡</span>
              <span className="stat-label">Real-Time Results</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-num">✅</span>
              <span className="stat-label">One Person One Vote</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="vote-card-float">
            <div className="vote-card-inner">
              <div className="vc-logo">
                <img src="/logo.png" alt="Logo" />
              </div>
              <div className="vc-title">Official Ballot</div>
              <div className="vc-election">DY Patil SET Election</div>
              <div className="vc-lines">
                <div className="vc-line"></div>
                <div className="vc-line short"></div>
                <div className="vc-line"></div>
                <div className="vc-line short"></div>
              </div>
              <div className="vc-stamp">✓ VERIFIED</div>
            </div>
          </div>
          <div className="floating-badge fb1">🔐 Encrypted</div>
          <div className="floating-badge fb2">📊 Live Results</div>
          <div className="floating-badge fb3">🛡️ Anti-Fraud</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="container">
          <div className="section-tag">Simple Process</div>
          <h2>How Online Voting Works?</h2>
          <p className="section-sub">3 simple steps to cast your vote securely</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">📝</div>
              <h3>Register</h3>
              <p>Fill in your details — name, email, class & roll number. Get your unique Voter ID & password instantly.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">🔑</div>
              <h3>Login & Verify</h3>
              <p>Use your Voter ID and password to login securely. Your identity is verified before you can vote.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">🗳️</div>
              <h3>Cast Your Vote</h3>
              <p>Select your candidate and submit. Your vote is recorded permanently — no changes, no duplicates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-tag">Why TrustElect?</div>
          <h2>Built for Trust & Transparency</h2>
          <p className="section-sub">A modern voting platform designed with security and fairness at its core</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3>Military-Grade Security</h3>
              <p>Your vote is protected with advanced encryption. No one can trace who you voted for — complete anonymity guaranteed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{background: 'linear-gradient(135deg, #059669, #10b981)'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14 9 11"/></svg>
              </div>
              <h3>Fully Transparent</h3>
              <p>Live vote counts, real-time results, and a complete audit trail ensure the election is fair and accountable.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{background: 'linear-gradient(135deg, #7c3aed, #a855f7)'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>One Person, One Vote</h3>
              <p>Advanced duplicate detection and verified voter IDs ensure every eligible voter casts exactly one vote — no exceptions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{background: 'linear-gradient(135deg, #dc2626, #f97316)'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3>Instant Results</h3>
              <p>No waiting for manual counting. Results are available in real-time as votes come in — fast and accurate.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{background: 'linear-gradient(135deg, #0891b2, #06b6d4)'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
              </div>
              <h3>Vote from Anywhere</h3>
              <p>No need to stand in queues. Vote from your phone, tablet, or laptop — completely paperless and eco-friendly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{background: 'linear-gradient(135deg, #be185d, #ec4899)'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Anti-Fraud Protection</h3>
              <p>Multi-layer verification, session-based security, and tamper-proof vote records eliminate any chance of fraud.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Online Voting Section */}
      <section className="about-voting-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <div className="section-tag">About Online Voting</div>
              <h2>Why Digital Elections Are the Future</h2>
              <p>Online voting or <strong>e-voting</strong> is the process of casting votes through a secure digital platform. It eliminates physical constraints, reduces costs, and dramatically increases participation rates among voters.</p>
              <p>Traditional paper ballots are vulnerable to tampering, miscounting, and logistical challenges. Digital voting systems like <strong>TrustElect</strong> use modern encryption and identity verification to ensure that every vote is genuine, counted correctly, and impossible to alter.</p>
              <div className="about-points">
                <div className="about-point">
                  <span className="point-icon">🌍</span>
                  <div>
                    <strong>Higher Participation</strong>
                    <p>Students can vote from hostels, libraries, or home — increasing turnout by up to 3x vs physical booths.</p>
                  </div>
                </div>
                <div className="about-point">
                  <span className="point-icon">💰</span>
                  <div>
                    <strong>Cost Effective</strong>
                    <p>No printing, no ballot boxes, no staff required. The entire election runs digitally at a fraction of the cost.</p>
                  </div>
                </div>
                <div className="about-point">
                  <span className="point-icon">⚡</span>
                  <div>
                    <strong>Instant & Accurate</strong>
                    <p>Results are computed automatically with zero human error — no recounting needed.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="stats-card">
                <div className="stats-card-title">📊 Why Digital Voting?</div>
                <div className="stat-row">
                  <div className="stat-bar-label">Voter Participation</div>
                  <div className="stat-bar-wrap"><div className="stat-bar" style={{width:'85%', background:'linear-gradient(90deg,#1e3a8a,#3b82f6)'}}></div><span>85%</span></div>
                </div>
                <div className="stat-row">
                  <div className="stat-bar-label">Cost Reduction</div>
                  <div className="stat-bar-wrap"><div className="stat-bar" style={{width:'72%', background:'linear-gradient(90deg,#059669,#10b981)'}}></div><span>72%</span></div>
                </div>
                <div className="stat-row">
                  <div className="stat-bar-label">Error Elimination</div>
                  <div className="stat-bar-wrap"><div className="stat-bar" style={{width:'98%', background:'linear-gradient(90deg,#7c3aed,#a855f7)'}}></div><span>98%</span></div>
                </div>
                <div className="stat-row">
                  <div className="stat-bar-label">Fraud Prevention</div>
                  <div className="stat-bar-wrap"><div className="stat-bar" style={{width:'95%', background:'linear-gradient(90deg,#dc2626,#f97316)'}}></div><span>95%</span></div>
                </div>
                <div className="stats-note">vs Traditional Paper Voting</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-icon">🗳️</div>
            <h2>Ready to Make Your Voice Heard?</h2>
            <p>Join the digital democracy. Register now and cast your vote in the DY Patil SET election.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-white btn-lg">
                Register Now — It's Free
              </Link>
              <Link to="/login" className="btn btn-outline-white btn-lg">
                Login to Vote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-logo">
            <img src="/logo.png" alt="Logo" />
            <span>TrustElect</span>
          </div>
          <p>DY Patil School Of Engineering And Technology, Ambi</p>
          <p className="footer-tagline">Secure • Transparent • Democratic • Digital</p>
          <p className="footer-copy">© 2025 TrustElect. Building Democracy Digitally.</p>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        .home-page { min-height: 100vh; background: #f8fafc; font-family: 'Inter', system-ui, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

        /* Header */
        .home-header { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 20px rgba(0,0,0,0.3); }
        .header-left .logo-area { display: flex; align-items: center; gap: 1rem; }
        .header-left .logo { width: 48px; height: 48px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 4px; }
        .header-left .logo img { width: 100%; height: 100%; object-fit: contain; }
        .college-info h1 { color: white; font-size: 1.4rem; margin: 0; font-weight: 700; }
        .college-info p { color: rgba(255,255,255,0.65); font-size: 0.75rem; margin: 0; }
        .header-right { display: flex; gap: 0.75rem; align-items: center; }
        .btn-outline-white { background: transparent; border: 2px solid rgba(255,255,255,0.5); color: white; padding: 0.5rem 1.25rem; border-radius: 8px; font-weight: 500; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; font-size: 0.9rem; }
        .btn-outline-white:hover { border-color: white; background: rgba(255,255,255,0.1); color: white; }
        .btn-white { background: white; color: #1e3a8a; padding: 0.5rem 1.25rem; border-radius: 8px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; font-size: 0.9rem; border: none; }
        .btn-white:hover { background: #f1f5f9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

        /* Hero */
        .hero-home { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%); padding: 5rem 2rem; display: flex; align-items: center; justify-content: space-between; gap: 3rem; min-height: 90vh; position: relative; overflow: hidden; }
        .hero-home::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at 30% 50%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(139,92,246,0.1) 0%, transparent 50%); pointer-events: none; }
        .hero-content-home { max-width: 580px; position: relative; z-index: 1; }
        .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.12); backdrop-filter: blur(10px); color: white; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 500; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.2); }
        .badge-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse-dot 2s infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        .hero-content-home h1 { color: white; font-size: 3.8rem; font-weight: 800; margin-bottom: 1.25rem; line-height: 1.1; }
        .hero-content-home p { color: rgba(255,255,255,0.85); font-size: 1.15rem; margin-bottom: 2.5rem; line-height: 1.7; }
        .hero-content-home p strong { color: white; }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
        .btn-accent { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; border: none; font-weight: 600; }
        .btn-accent:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(245,158,11,0.4); color: white; }
        .btn-lg { padding: 0.875rem 1.75rem; font-size: 1rem; border-radius: 10px; }
        .hero-stats { display: flex; align-items: center; gap: 1.5rem; background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); border-radius: 16px; padding: 1.25rem 1.5rem; border: 1px solid rgba(255,255,255,0.15); }
        .hero-stat { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
        .stat-num { font-size: 1.5rem; }
        .stat-label { color: rgba(255,255,255,0.8); font-size: 0.75rem; font-weight: 500; white-space: nowrap; }
        .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.2); }

        /* Hero Visual */
        .hero-visual { position: relative; display: flex; align-items: center; justify-content: center; min-width: 380px; }
        .vote-card-float { animation: float 4s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
        .vote-card-inner { background: rgba(255,255,255,0.95); border-radius: 24px; padding: 2.5rem 2rem; width: 280px; box-shadow: 0 25px 60px rgba(0,0,0,0.4); text-align: center; }
        .vc-logo { width: 60px; height: 60px; margin: 0 auto 1rem; background: #f1f5f9; border-radius: 12px; overflow: hidden; padding: 4px; display: flex; align-items: center; justify-content: center; }
        .vc-logo img { width: 100%; height: 100%; object-fit: contain; }
        .vc-title { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.5rem; }
        .vc-election { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }
        .vc-lines { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
        .vc-line { height: 12px; background: linear-gradient(90deg, #e2e8f0, #f1f5f9); border-radius: 6px; }
        .vc-line.short { width: 60%; margin: 0 auto; }
        .vc-stamp { background: linear-gradient(135deg, #059669, #10b981); color: white; font-size: 0.9rem; font-weight: 700; padding: 0.6rem 1.5rem; border-radius: 9999px; display: inline-block; letter-spacing: 1px; }
        .floating-badge { position: absolute; background: white; border-radius: 50px; padding: 0.5rem 1rem; font-size: 0.8rem; font-weight: 600; color: #1e293b; box-shadow: 0 8px 25px rgba(0,0,0,0.15); animation: float 4s ease-in-out infinite; }
        .fb1 { top: 10%; right: -10px; animation-delay: 0.5s; }
        .fb2 { bottom: 25%; right: -20px; animation-delay: 1s; }
        .fb3 { top: 50%; left: -20px; animation-delay: 1.5s; }

        /* How It Works */
        .how-section { padding: 5rem 0; background: white; }
        .section-tag { display: inline-block; background: #eff6ff; color: #1e40af; padding: 0.35rem 1rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .how-section h2, .features-section h2, .about-text h2 { color: #0f172a; font-size: 2.2rem; font-weight: 800; margin-bottom: 0.75rem; }
        .section-sub { color: #64748b; font-size: 1.05rem; margin-bottom: 3rem; }
        .steps-grid { display: flex; align-items: center; gap: 1rem; }
        .step-card { flex: 1; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 20px; padding: 2.5rem 1.5rem; text-align: center; border: 1px solid #e2e8f0; transition: transform 0.2s, box-shadow 0.2s; position: relative; }
        .step-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.08); }
        .step-number { position: absolute; top: 1rem; left: 1.5rem; font-size: 0.75rem; font-weight: 700; color: #cbd5e1; letter-spacing: 1px; }
        .step-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .step-card h3 { color: #1e293b; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; }
        .step-card p { color: #64748b; font-size: 0.9rem; line-height: 1.6; margin: 0; }
        .step-arrow { font-size: 2rem; color: #cbd5e1; flex-shrink: 0; }

        /* Features */
        .features-section { padding: 5rem 0; background: #f8fafc; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .feature-card { background: white; border-radius: 20px; padding: 2rem; border: 1px solid #e2e8f0; transition: transform 0.2s, box-shadow 0.2s; }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.08); }
        .feature-icon { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }
        .feature-icon svg { width: 28px; height: 28px; color: white; }
        .feature-card h3 { color: #1e293b; font-size: 1.05rem; font-weight: 700; margin-bottom: 0.6rem; }
        .feature-card p { color: #64748b; font-size: 0.875rem; line-height: 1.6; margin: 0; }

        /* About Voting */
        .about-voting-section { padding: 5rem 0; background: white; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .about-text h2 { margin-bottom: 1.25rem; }
        .about-text p { color: #475569; line-height: 1.8; margin-bottom: 1rem; }
        .about-text p strong { color: #1e293b; }
        .about-points { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.5rem; }
        .about-point { display: flex; gap: 1rem; align-items: flex-start; }
        .point-icon { font-size: 1.5rem; flex-shrink: 0; margin-top: 0.1rem; }
        .about-point strong { display: block; color: #1e293b; font-weight: 700; margin-bottom: 0.25rem; }
        .about-point p { color: #64748b; font-size: 0.875rem; margin: 0; line-height: 1.5; }
        .stats-card { background: linear-gradient(135deg, #0f172a, #1e3a8a); border-radius: 24px; padding: 2rem; color: white; }
        .stats-card-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.75rem; }
        .stat-row { margin-bottom: 1.25rem; }
        .stat-bar-label { font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 0.4rem; }
        .stat-bar-wrap { display: flex; align-items: center; gap: 0.75rem; }
        .stat-bar { height: 10px; border-radius: 5px; transition: width 0.8s ease; }
        .stat-bar-wrap span { font-size: 0.85rem; font-weight: 700; color: white; min-width: 35px; }
        .stats-note { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-align: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); }

        /* CTA */
        .cta-section { padding: 5rem 0; background: linear-gradient(135deg, #0f172a, #1e3a8a, #1d4ed8); }
        .cta-card { text-align: center; padding: 4rem 2rem; }
        .cta-icon { font-size: 4rem; margin-bottom: 1.5rem; }
        .cta-card h2 { color: white; font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
        .cta-card p { color: rgba(255,255,255,0.8); font-size: 1.1rem; margin-bottom: 2.5rem; }
        .cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        /* Footer */
        .home-footer { background: #0f172a; padding: 3rem 0; text-align: center; }
        .footer-logo { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1rem; }
        .footer-logo img { width: 36px; height: 36px; object-fit: contain; background: white; border-radius: 8px; padding: 3px; }
        .footer-logo span { color: white; font-size: 1.2rem; font-weight: 700; }
        .home-footer p { color: #64748b; margin: 0.25rem 0; font-size: 0.875rem; }
        .footer-tagline { color: #94a3b8 !important; font-weight: 500; margin-top: 0.5rem !important; }
        .footer-copy { color: #475569 !important; font-size: 0.8rem !important; margin-top: 1rem !important; }

        /* Responsive */
        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-content-home h1 { font-size: 3rem; }
          .about-grid { grid-template-columns: 1fr; gap: 2rem; }
        }
        @media (max-width: 768px) {
          .hero-home { flex-direction: column; padding: 3rem 1.5rem; min-height: auto; text-align: center; }
          .hero-content-home h1 { font-size: 2.5rem; }
          .hero-actions { justify-content: center; }
          .hero-stats { flex-direction: column; gap: 1rem; }
          .stat-divider { width: 100%; height: 1px; }
          .hero-visual { min-width: auto; }
          .floating-badge { display: none; }
          .steps-grid { flex-direction: column; }
          .step-arrow { transform: rotate(90deg); }
          .features-grid { grid-template-columns: 1fr; }
          .cta-card h2 { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}
