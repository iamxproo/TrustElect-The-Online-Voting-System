import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VoterDashboard() {
  const { user, logout, getCandidates, getElection, getTotalVotes, getVotedCount, getTotalVoters } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState({});
  const [stats, setStats] = useState({ total: 0, voted: 0, remaining: 0 });
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (!user || user.type !== 'voter') {
      navigate('/login');
      return;
    }

    loadData();
  }, [user]);

  const loadData = () => {
    const candidateData = getCandidates();
    setCandidates(candidateData);
    
    const electionData = getElection();
    setElection(electionData);

    const total = getTotalVoters();
    const voted = getVotedCount();
    setStats({
      total,
      voted,
      remaining: total - voted
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVote = () => {
    navigate('/voter/vote');
  };

  const submitFeedback = () => {
    if (!rating) return;
    
    const feedback = {
      id: Date.now(),
      voterId: user?.voterId,
      rating,
      comment: feedbackComment,
      timestamp: new Date().toISOString()
    };
    
    // Store feedback in localStorage
    const feedbacks = JSON.parse(localStorage.getItem('trustelect_feedback') || '[]');
    feedbacks.push(feedback);
    localStorage.setItem('trustelect_feedback', JSON.stringify(feedbacks));
    
    setFeedbackSubmitted(true);
    setRating(0);
    setFeedbackComment('');
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setFeedbackSubmitted(false);
    }, 3000);
  };

  const hasVoted = () => {
    const voters = JSON.parse(localStorage.getItem('trustelect_voters') || '[]');
    const voter = voters.find(v => v.id === user?.id);
    return voter?.hasVoted || false;
  };

  const votedFor = () => {
    const voters = JSON.parse(localStorage.getItem('trustelect_voters') || '[]');
    const voter = voters.find(v => v.id === user?.id);
    if (voter?.votedFor) {
      const candidate = candidates.find(c => c.id === voter.votedFor);
      return candidate?.name || 'Unknown';
    }
    return null;
  };

  const newsHeadlines = [
    "📢 Headboy Election 2024-25 is now live! Cast your vote wisely.",
    "🗳️ Your vote matters! Participate in the democratic process.",
    "📊 Live results will be available after the election ends.",
    "🏫 DY Patil School Of Engineering - Building future leaders.",
    "✨ Exercise your right to vote - It's your voice that counts!"
  ];

  return (
    <div className="voter-dashboard">
      {/* Header */}
      <header className="voter-header">
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
            <span className="badge badge-success">Voter</span>
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

      {/* News Ticker */}
      <div className="news-ticker">
        <div className="news-ticker-content">
          {newsHeadlines.join('  •  ')}
        </div>
      </div>

      {/* Main Content */}
      <main className="voter-main">
        <div className="container">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-content">
              <h2>🏫 Headboy Election 2024-25</h2>
              <p>Cast your vote for the next Headboy of DY Patil School Of Engineering And Technology, Ambi</p>
              <div className="hero-buttons">
                {!hasVoted() ? (
                  <button onClick={handleVote} className="btn btn-accent btn-lg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Cast Your Vote Now
                  </button>
                ) : (
                  <div className="voted-message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>You have voted for <strong>{votedFor()}</strong></span>
                  </div>
                )}
                <Link to="/results" className="btn btn-secondary btn-lg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  View Live Results
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-section">
            <div className="stat-card-voter">
              <div className="stat-icon-voter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="stat-text">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total Voters</span>
              </div>
            </div>

            <div className="stat-card-voter">
              <div className="stat-icon-voter stat-icon-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="stat-text">
                <span className="stat-number">{stats.voted}</span>
                <span className="stat-label">Votes Cast</span>
              </div>
            </div>

            <div className="stat-card-voter">
              <div className="stat-icon-voter stat-icon-warning">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="stat-text">
                <span className="stat-number">{stats.remaining}</span>
                <span className="stat-label">Remaining</span>
              </div>
            </div>
          </div>

          {/* Candidates Section */}
          <div className="candidates-section">
            <h3>Meet the Candidates</h3>
            <p>Choose your next Headboy wisely</p>
            
            <div className="candidates-grid-voter">
              {candidates.map((candidate, index) => (
                <div key={candidate.id} className="candidate-card-voter">
                  <div className="candidate-image-wrapper">
                    <img 
                      src={candidate.image} 
                      alt={candidate.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Candidate';
                      }}
                    />
                    <div className="candidate-number">{index + 1}</div>
                    {candidate.symbol && (
                      <span className="candidate-symbol-voter">{candidate.symbol}</span>
                    )}
                  </div>
                  <div className="candidate-body">
                    <h4>{candidate.name}</h4>
                    <p className="candidate-party">{candidate.party}</p>
                    {!hasVoted() && (
                      <button onClick={handleVote} className="btn btn-primary w-full">
                        Vote for {candidate.name.split(' ')[0]}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="instructions-section">
            <h3>📋 Voting Instructions</h3>
            <div className="instructions-grid">
              <div className="instruction-card">
                <div className="instruction-number">1</div>
                <h4>Review Candidates</h4>
                <p>Look at the candidate profiles and their manifestos carefully.</p>
              </div>
              <div className="instruction-card">
                <div className="instruction-number">2</div>
                <h4>Cast Your Vote</h4>
                <p>Click on the candidate of your choice to cast your vote.</p>
              </div>
              <div className="instruction-card">
                <div className="instruction-number">3</div>
                <h4>Confirm Selection</h4>
                <p>Review your choice and confirm to submit your vote.</p>
              </div>
              <div className="instruction-card">
                <div className="instruction-number">4</div>
                <h4>Get Receipt</h4>
                <p>You'll receive a confirmation. Your vote is secure and anonymous.</p>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="feedback-section">
            <h3>💬 Feedback & Suggestions</h3>
            <p>Help us improve the voting system</p>
            
            <div className="feedback-form">
                <div className="star-rating">
                <p>Rate your experience:</p>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${rating >= star ? 'active' : ''} ${rating > 0 ? 'rated' : ''}`}
                      onClick={() => setRating(star)}
                      style={{ animationDelay: `${star * 0.1}s` }}
                    >
                      <svg viewBox="0 0 24 24" fill={rating >= star ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                  ))}
                </div>
                <span className="rating-text">
                  {rating > 0 ? (
                    <>
                      {rating === 1 && '😞 Poor'}
                      {rating === 2 && '😐 Fair'}
                      {rating === 3 && '🙂 Good'}
                      {rating === 4 && '😊 Great'}
                      {rating === 5 && '🤩 Excellent!'}
                    </>
                  ) : 'Select a rating'}
                </span>
              </div>
              
              <div className="feedback-comment">
                <label>Your feedback:</label>
                <textarea
                  placeholder="Share your thoughts, suggestions, or any issues you faced..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  rows="4"
                ></textarea>
              </div>
              
              <button 
                onClick={submitFeedback} 
                className="btn btn-primary"
                disabled={!rating}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Submit Feedback
              </button>
              
              {feedbackSubmitted && (
                <div className="feedback-success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Thank you for your feedback!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="voter-footer">
        <div className="footer-content">
          <p>© 2024 TrustElect Voting System | Secure • Transparent • Democratic</p>
          <div className="developer-info">
            <p>Developed by <strong>Samarth Karale</strong></p>
            <p>Fullstack Java Developer | Email: samarthkarale21@gmail.com | Mob: 9022983993</p>
          </div>
        </div>
      </footer>

      <style>{`
        .voter-dashboard {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .voter-header {
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

        .news-ticker {
          background: linear-gradient(90deg, #1e3a8a, #3b82f6);
          padding: 0.75rem 0;
          overflow: hidden;
          white-space: nowrap;
        }

        .news-ticker-content {
          display: inline-block;
          animation: ticker 30s linear infinite;
          color: white;
          font-weight: 500;
        }

        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .voter-main {
          padding: 2rem 0;
        }

        .hero-section {
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%);
          border-radius: 24px;
          padding: 3rem;
          text-align: center;
          color: white;
          margin-bottom: 2rem;
          box-shadow: 0 20px 40px rgba(30, 58, 138, 0.3);
        }

        .hero-content h2 {
          color: white;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .hero-content > p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .voted-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 1rem 2rem;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
        }

        .voted-message strong {
          color: #fbbf24;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card-voter {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .stat-icon-voter {
          width: 60px;
          height: 60px;
          background: #dbeafe;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e40af;
        }

        .stat-icon-voter svg {
          width: 30px;
          height: 30px;
        }

        .stat-icon-success {
          background: #d1fae5;
          color: #059669;
        }

        .stat-icon-warning {
          background: #fef3c7;
          color: #d97706;
        }

        .stat-text {
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
        }

        .candidates-section {
          margin-bottom: 3rem;
        }

        .candidates-section h3 {
          text-align: center;
          font-size: 2rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .candidates-section > p {
          text-align: center;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .candidates-grid-voter {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .candidate-card-voter {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .candidate-card-voter:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .candidate-image-wrapper {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .candidate-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .candidate-card-voter:hover .candidate-image-wrapper img {
          transform: scale(1.1);
        }

        .candidate-number {
          position: absolute;
          top: 1rem;
          left: 1rem;
          width: 40px;
          height: 40px;
          background: #1e3a8a;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .candidate-symbol-voter {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .candidate-body {
          padding: 1.5rem;
          text-align: center;
        }

        .candidate-body h4 {
          font-size: 1.25rem;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .candidate-party {
          color: #64748b;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .instructions-section {
          margin-bottom: 2rem;
        }

        .instructions-section h3 {
          text-align: center;
          font-size: 1.75rem;
          color: #1e293b;
          margin-bottom: 2rem;
        }

        .instructions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .instruction-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .instruction-number {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 auto 1rem;
        }

        .instruction-card h4 {
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .instruction-card p {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
        }

        .voter-footer {
          background: #1e293b;
          padding: 1.5rem;
          text-align: center;
          color: #94a3b8;
        }

        .voter-footer p {
          margin: 0;
          font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
          .candidates-grid-voter {
            grid-template-columns: repeat(2, 1fr);
          }

          .instructions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-section {
            grid-template-columns: 1fr;
          }

          .candidates-grid-voter {
            grid-template-columns: 1fr;
          }

          .instructions-grid {
            grid-template-columns: 1fr;
          }

          .hero-content h2 {
            font-size: 1.75rem;
          }
        }

        /* Feedback Section Styles */
        .feedback-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .feedback-section h3 {
          text-align: center;
          font-size: 1.75rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .feedback-section > p {
          text-align: center;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .feedback-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .star-rating {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .star-rating > p {
          color: #64748b;
          margin-bottom: 0.75rem;
        }

        .stars {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          transition: transform 0.2s ease;
          animation: star-pop 0.3s ease backwards;
        }

        @keyframes star-pop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .star-btn:hover {
          transform: scale(1.2);
        }

        .star-btn:hover svg {
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.8));
        }

        .star-btn svg {
          width: 40px;
          height: 40px;
          color: #fbbf24;
          transition: all 0.3s ease;
        }

        .star-btn:not(.active) svg {
          color: #d1d5db;
        }

        .star-btn.active {
          animation: star-pulse 0.5s ease;
        }

        @keyframes star-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        .rating-text {
          display: block;
          color: #64748b;
          font-size: 0.9rem;
        }

        .feedback-comment {
          margin-bottom: 1.5rem;
        }

        .feedback-comment label {
          display: block;
          color: #374151;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .feedback-comment textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.3s ease;
        }

        .feedback-comment textarea:focus {
          outline: none;
          border-color: #1e3a8a;
        }

        .feedback-form .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin: 0 auto;
        }

        .feedback-success {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 1rem;
          background: #d1fae5;
          color: #059669;
          border-radius: 12px;
          font-weight: 500;
        }

        /* Footer Styles */
        .voter-footer {
          background: #1e293b;
          padding: 2rem;
          text-align: center;
          color: #94a3b8;
        }

        .footer-content p {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
        }

        .developer-info {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #374151;
        }

        .developer-info p {
          margin: 0.25rem 0;
          font-size: 0.85rem;
        }

        .developer-info strong {
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
