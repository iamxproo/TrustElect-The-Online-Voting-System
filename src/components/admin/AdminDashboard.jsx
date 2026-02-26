import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Animated Counter Component
function AnimatedCounter({ value, duration = 1000 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [value, duration, isVisible]);

  return <span ref={elementRef}>{count}</span>;
}

export default function AdminDashboard() {
  const { user, logout, getCandidates, getTotalVotes, getTotalVoters, getVotedCount, getElection, getVoteHistory } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalVoters: 0,
    votedCount: 0,
    turnout: 0
  });
  const [recentVotes, setRecentVotes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newVote, setNewVote] = useState(null);
  const [prevWinner, setPrevWinner] = useState(null);
  const [showFirework, setShowFirework] = useState(false);

  useEffect(() => {
    if (!user || user.type !== 'admin') {
      navigate('/login');
      return;
    }

    loadData();
  }, [user]);

  const loadData = () => {
    const candidateData = getCandidates();
    
    // Check for new votes
    const history = getVoteHistory();
    if (recentVotes.length > 0 && history.length > recentVotes.length) {
      const latestVote = history[0];
      setNewVote(latestVote);
      setTimeout(() => setNewVote(null), 3000);
    }
    setRecentVotes(history.slice(0, 10));

    // Check for winner change
    const currentWinner = candidateData.length > 0 
      ? candidateData.reduce((prev, current) => ((prev.votes || 0) > (current.votes || 0) ? prev : current))
      : null;
    
    if (prevWinner && currentWinner && prevWinner.id !== currentWinner.id) {
      setShowFirework(true);
      setTimeout(() => setShowFirework(false), 3000);
    }
    setPrevWinner(currentWinner);
    
    setCandidates(candidateData);

    const totalVotes = getTotalVotes();
    const totalVoters = getTotalVoters();
    const votedCount = getVotedCount();
    
    setStats({
      totalVotes,
      totalVoters,
      votedCount,
      turnout: totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : 0
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getWinner = () => {
    if (candidates.length === 0) return null;
    return candidates.reduce((prev, current) => 
      (prev.votes || 0) > (current.votes || 0) ? prev : current
    );
  };

  const winner = getWinner();

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
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
          <div className="user-info">
            <span className="user-name">Welcome, {user?.name}</span>
            <span className="badge badge-primary">Admin</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <div className="container">
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Overview
            </button>
            <button 
              className={`nav-tab ${activeTab === 'candidates' ? 'active' : ''}`}
              onClick={() => setActiveTab('candidates')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Candidates
            </button>
            <Link to="/admin/voters" className="nav-tab">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Voters
            </Link>
            <Link to="/results" className="nav-tab">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Live Results
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        <div className="container">
          {/* New Vote Notification */}
          {newVote && (
            <div className="new-vote-notification animate-slide-in">
              <div className="notification-icon">🗳️</div>
              <div className="notification-content">
                <span className="notification-title">New Vote Cast!</span>
                <span className="notification-details">{newVote.voterName} voted for {newVote.candidateName}</span>
              </div>
            </div>
          )}

          {/* Fireworks Effect */}
          {showFirework && (
            <div className="fireworks-container">
              <div className="firework-burst"></div>
              <div className="firework-burst" style={{ left: '20%', animationDelay: '0.2s' }}></div>
              <div className="firework-burst" style={{ left: '80%', animationDelay: '0.4s' }}></div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="overview-tab animate-fadeIn">
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon stat-icon-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number"><AnimatedCounter value={stats.totalVoters} /></span>
                    <span className="stat-label">Total Voters</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon stat-icon-success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number"><AnimatedCounter value={stats.votedCount} /></span>
                    <span className="stat-label">Votes Cast</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon stat-icon-warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="20" x2="12" y2="10"/>
                      <line x1="18" y1="20" x2="18" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="16"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number"><AnimatedCounter value={parseFloat(stats.turnout)} />%</span>
                    <span className="stat-label">Turnout</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon stat-icon-danger">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number"><AnimatedCounter value={stats.totalVoters - stats.votedCount} /></span>
                    <span className="stat-label">Remaining</span>
                  </div>
                </div>
              </div>

              {/* Current Leader */}
              {winner && (
                <div className={`leader-card ${showFirework ? 'leader-celebration' : ''}`}>
                  <div className="leader-badge">
                    <span className="crown-icon animate-crown">👑</span>
                    Current Leader
                  </div>
                  <div className="leader-content">
                    <div className="leader-image-container">
                      <img src={winner.image} alt={winner.name} className="leader-image" />
                      <div className="leader-glow"></div>
                    </div>
                    <div className="leader-info">
                      <h3>{winner.name}</h3>
                      <p>{winner.party}</p>
                      <div className="leader-votes">
                        <span className="vote-count"><AnimatedCounter value={winner.votes || 0} /></span>
                        <span className="vote-label">votes</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Votes */}
              <div className="recent-votes-card">
                <h3>Recent Voting Activity</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Voter</th>
                        <th>Candidate</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentVotes.length > 0 ? (
                        recentVotes.map((vote, index) => (
                          <tr key={index}>
                            <td>{vote.voterName}</td>
                            <td>
                              <span className="badge badge-primary">{vote.candidateName}</span>
                            </td>
                            <td>{new Date(vote.timestamp).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">No votes recorded yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="candidates-tab animate-fadeIn">
              <div className="tab-header">
                <h2>Candidates Management</h2>
                <Link to="/admin/candidates" className="btn btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Candidate
                </Link>
              </div>

              <div className="candidates-grid">
                {candidates.map((candidate, index) => (
                  <div key={candidate.id} className="candidate-manage-card">
                    <div className="candidate-rank">#{index + 1}</div>
                    <img src={candidate.image} alt={candidate.name} className="candidate-image" />
                    <div className="candidate-info">
                      <h4>{candidate.name}</h4>
                      <p>{candidate.party}</p>
                      <div className="candidate-votes">
                        <span className="votes-number">{candidate.votes || 0}</span>
                        <span className="votes-text">votes</span>
                      </div>
                    </div>
                    <div className="candidate-progress">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${stats.totalVotes > 0 ? ((candidate.votes || 0) / stats.totalVotes * 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-footer">
        <div className="footer-content">
          <p>© 2024 TrustElect Voting System | Secure • Transparent • Democratic</p>
          <div className="developer-info">
            <p>Developed by <strong>Samarth Karale</strong></p>
            <p>Fullstack Java Developer | Email: samarthkarale21@gmail.com | Mob: 9022983993</p>
          </div>
        </div>
      </footer>

      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f8fafc;
        }

        .admin-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(30, 58, 138, 0.2);
        }

        .header-left .logo-area {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-left .logo {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .header-left .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .header-left .logo svg {
          width: 30px;
          height: 30px;
          color: #1e3a8a;
        }

        .college-info h1 {
          color: white;
          font-size: 1.5rem;
          margin: 0;
        }

        .college-info p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-name {
          color: white;
          font-weight: 500;
        }

        .admin-nav {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-tabs {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem 0;
          overflow-x: auto;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .nav-tab svg {
          width: 18px;
          height: 18px;
        }

        .nav-tab:hover {
          background: #f1f5f9;
          color: #1e3a8a;
        }

        .nav-tab.active {
          background: #1e3a8a;
          color: white;
        }

        .admin-main {
          padding: 2rem 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon svg {
          width: 30px;
          height: 30px;
        }

        .stat-icon-primary {
          background: #dbeafe;
          color: #1e40af;
        }

        .stat-icon-success {
          background: #d1fae5;
          color: #059669;
        }

        .stat-icon-warning {
          background: #fef3c7;
          color: #d97706;
        }

        .stat-icon-danger {
          background: #fee2e2;
          color: #dc2626;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        .leader-card {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.2);
        }

        .leader-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f59e0b;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .leader-badge svg {
          width: 18px;
          height: 18px;
        }

        .leader-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .leader-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #f59e0b;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .leader-info h3 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .leader-info p {
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .leader-votes {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .vote-count {
          font-size: 2rem;
          font-weight: 800;
          color: #f59e0b;
        }

        .vote-label {
          color: #64748b;
        }

        .recent-votes-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .recent-votes-card h3 {
          margin-bottom: 1rem;
        }

        .candidate-manage-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .candidate-rank {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e3a8a;
          margin-bottom: 0.5rem;
        }

        .candidates-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .candidates-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .candidates-grid {
            grid-template-columns: 1fr;
          }

          .leader-content {
            flex-direction: column;
            text-align: center;
          }
        }

        /* Admin Footer Styles */
        .admin-footer {
          background: #1e293b;
          padding: 2rem;
          text-align: center;
          color: #94a3b8;
        }

        .admin-footer .footer-content p {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
        }

        .admin-footer .developer-info {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #374151;
        }

        .admin-footer .developer-info p {
          margin: 0.25rem 0;
          font-size: 0.85rem;
        }

        .admin-footer .developer-info strong {
          color: #3b82f6;
        }

        /* New Vote Notification */
        .new-vote-notification {
          position: fixed;
          top: 100px;
          right: 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);
          z-index: 1000;
          animation: slide-in-right 0.4s ease, fade-out 0.4s ease 2.6s forwards;
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-out {
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .notification-icon {
          font-size: 2rem;
        }

        .notification-content {
          display: flex;
          flex-direction: column;
        }

        .notification-title {
          font-weight: 700;
          font-size: 1rem;
        }

        .notification-details {
          font-size: 0.85rem;
          opacity: 0.9;
        }

        /* Fireworks */
        .fireworks-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 999;
        }

        .firework-burst {
          position: absolute;
          top: 30%;
          left: 50%;
          width: 20px;
          height: 20px;
          background: #f59e0b;
          border-radius: 50%;
          animation: firework-burst 1s ease-out forwards;
        }

        @keyframes firework-burst {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        /* Animated Crown */
        .animate-crown {
          display: inline-block;
          animation: crown-bounce 1s ease-in-out infinite;
        }

        @keyframes crown-bounce {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-5px) rotate(5deg);
          }
        }

        /* Leader Glow */
        .leader-image-container {
          position: relative;
        }

        .leader-glow {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: glow-pulse-admin 2s ease-in-out infinite;
        }

        @keyframes glow-pulse-admin {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        /* Leader Celebration */
        .leader-celebration {
          animation: celebration-pulse 0.5s ease;
        }

        @keyframes celebration-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        /* Animated Progress Bars */
        .candidate-progress .progress-fill {
          animation: progress-fill 1s ease-out forwards;
        }

        @keyframes progress-fill {
          from {
            width: 0;
          }
        }

        /* Slide in animation */
        .animate-slide-in {
          animation: slide-in 0.4s ease forwards;
        }

        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
