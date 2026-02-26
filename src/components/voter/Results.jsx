import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Results() {
  const { getCandidates, getTotalVotes, getTotalVoters, getVotedCount } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({ total: 0, voted: 0, percentage: 0 });

  useEffect(() => {
    loadData();
    
    // Refresh data every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const data = getCandidates();
    // Sort by votes descending
    const sorted = [...data].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    setCandidates(sorted);

    const total = getTotalVoters();
    const voted = getVotedCount();
    setStats({
      total,
      voted,
      percentage: total > 0 ? ((voted / total) * 100).toFixed(1) : 0
    });
  };

  const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
  const maxVotes = Math.max(...candidates.map(c => c.votes || 0), 1);

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="results-page">
      {/* Header */}
      <header className="results-header">
        <div className="header-left">
          <Link to="/" className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className="logo-area">
            <div className="logo">
              <img src="/logo.png" alt="Logo" />
            </div>
            <div className="college-info">
              <h1>TrustElect</h1>
              <p>Live Results</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="results-main">
        <div className="container">
          {/* Election Title */}
          <div className="results-title">
            <h2>Headboy Election 2024-25</h2>
            <p>Live Voting Results</p>
            <div className="live-indicator">
              <span className="live-dot"></span>
              Live Results
            </div>
          </div>

          {/* Stats Cards */}
          <div className="results-stats">
            <div className="stat-card-result">
              <div className="stat-icon-result">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="stat-content-result">
                <span className="stat-number-result">{stats.total}</span>
                <span className="stat-label-result">Total Voters</span>
              </div>
            </div>

            <div className="stat-card-result">
              <div className="stat-icon-result stat-icon-success-result">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="stat-content-result">
                <span className="stat-number-result">{stats.voted}</span>
                <span className="stat-label-result">Votes Cast</span>
              </div>
            </div>

            <div className="stat-card-result">
              <div className="stat-icon-result stat-icon-warning-result">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
              </div>
              <div className="stat-content-result">
                <span className="stat-number-result">{stats.percentage}%</span>
                <span className="stat-label-result">Turnout</span>
              </div>
            </div>
          </div>

          {/* Candidates Results */}
          <div className="candidates-results">
            <h3>Candidate Rankings</h3>
            
              {candidates.map((candidate, index) => (
              <div 
                key={candidate.id} 
                className={`result-card ${index === 0 ? 'leading' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="result-rank">
                  {index === 0 && <span className="trophy animate-trophy">🏆</span>}
                  <span className="rank-number">#{index + 1}</span>
                </div>
                
                <div className="result-image">
                  <img 
                    src={candidate.image} 
                    alt={candidate.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=Candidate';
                    }}
                  />
                </div>
                
                <div className="result-info">
                  <h4>{candidate.name}</h4>
                  <p>{candidate.party}</p>
                </div>
                
                <div className="result-votes">
                  <span className="vote-count-result">{candidate.votes || 0}</span>
                  <span className="vote-label-result">votes</span>
                </div>
                
                <div className="result-bar-container">
                  <div 
                    className={`result-bar-fill ${index === 0 ? 'leading-bar' : ''}`}
                    style={{ width: `${getPercentage(candidate.votes || 0)}%` }}
                  >
                    <span className="result-percentage">{getPercentage(candidate.votes || 0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="overall-progress">
            <h3>Overall Progress</h3>
            <div className="progress-bar-result">
              <div 
                className="progress-fill-result"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
            <p>{stats.voted} out of {stats.total} voters have cast their votes</p>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p>Results are updated in real-time. Final results will be announced after the election ends.</p>
          </div>
        </div>
      </main>

      <style>{`
        .results-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .results-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(30, 58, 138, 0.2);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .back-btn {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .back-btn svg {
          width: 20px;
          height: 20px;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo svg {
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

        .results-main {
          padding: 2rem 0;
        }

        .results-title {
          text-align: center;
          margin-bottom: 2rem;
        }

        .results-title h2 {
          color: #1e3a8a;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .results-title p {
          color: #64748b;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #fef3c7;
          color: #92400e;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .live-dot {
          width: 10px;
          height: 10px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .results-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card-result {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .stat-icon-result {
          width: 60px;
          height: 60px;
          background: #dbeafe;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e40af;
        }

        .stat-icon-result svg {
          width: 30px;
          height: 30px;
        }

        .stat-icon-success-result {
          background: #d1fae5;
          color: #059669;
        }

        .stat-icon-warning-result {
          background: #fef3c7;
          color: #d97706;
        }

        .stat-content-result {
          display: flex;
          flex-direction: column;
        }

        .stat-number-result {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }

        .stat-label-result {
          font-size: 0.875rem;
          color: #64748b;
        }

        .candidates-results {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .candidates-results h3 {
          color: #1e293b;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .result-card {
          display: grid;
          grid-template-columns: 60px 80px 1fr auto 200px;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          background: #f8fafc;
          transition: all 0.3s ease;
        }

        .result-card:hover {
          background: #f1f5f9;
        }

        .result-card.leading {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #f59e0b;
        }

        .result-rank {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .trophy {
          font-size: 1.5rem;
        }

        .rank-number {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e3a8a;
        }

        .result-image {
          width: 80px;
          height: 80px;
        }

        .result-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #1e3a8a;
        }

        .result-info h4 {
          color: #1e293b;
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .result-info p {
          color: #64748b;
          margin: 0;
        }

        .result-votes {
          text-align: right;
          min-width: 80px;
        }

        .vote-count-result {
          display: block;
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e3a8a;
        }

        .vote-label-result {
          color: #64748b;
          font-size: 0.875rem;
        }

        .result-bar-container {
          width: 200px;
          height: 35px;
          background: #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .result-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #1e3a8a, #3b82f6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 0.75rem;
          min-width: 60px;
          transition: width 0.5s ease;
        }

        .result-percentage {
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .leading .result-bar-fill {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        .overall-progress {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .overall-progress h3 {
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .progress-bar-result {
          width: 100%;
          height: 24px;
          background: #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill-result {
          height: 100%;
          background: linear-gradient(90deg, #1e3a8a, #3b82f6);
          border-radius: 12px;
          transition: width 0.5s ease;
        }

        .overall-progress p {
          text-align: center;
          color: #64748b;
          margin: 0;
        }

        .disclaimer {
          background: #dbeafe;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .disclaimer svg {
          width: 24px;
          height: 24px;
          color: #1e40af;
          flex-shrink: 0;
        }

        .disclaimer p {
          color: #3b82f6;
          margin: 0;
          font-size: 0.9rem;
        }

        @media (max-width: 900px) {
          .results-stats {
            grid-template-columns: 1fr;
          }

          .result-card {
            grid-template-columns: 50px 60px 1fr;
            grid-template-rows: auto auto;
          }

          .result-votes {
            grid-column: 2;
            grid-row: 2;
            text-align: left;
          }

          .result-bar-container {
            grid-column: 3;
            grid-row: 2;
            width: 100%;
          }
        }

        /* Animated Results Styles */
        .animate-trophy {
          display: inline-block;
          animation: trophy-shine 1.5s ease-in-out infinite;
        }

        @keyframes trophy-shine {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            filter: brightness(1);
          }
          50% { 
            transform: scale(1.2) rotate(10deg);
            filter: brightness(1.2);
          }
        }

        .result-card {
          animation: slide-up-result 0.5s ease forwards;
          opacity: 0;
        }

        @keyframes slide-up-result {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .result-bar-fill {
          animation: fill-bar 1s ease-out forwards;
        }

        @keyframes fill-bar {
          from {
            width: 0 !important;
          }
        }

        .leading-bar {
          background: linear-gradient(90deg, #f59e0b, #fbbf24) !important;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
        }

        .leading .result-image img {
          border-color: #f59e0b;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
        }
      `}</style>
    </div>
  );
}
