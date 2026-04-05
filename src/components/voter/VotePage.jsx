import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Confetti Component
function Confetti() {
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 6,
    duration: Math.random() * 2 + 2
  }));

  return (
    <div className="confetti-container">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
          }}
        />
      ))}
    </div>
  );
}

// Firework Component
function Firework({ x, y, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="firework"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#f59e0b',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="firework-particle" style={{ '--angle': '0deg' }} />
      <div className="firework-particle" style={{ '--angle': '60deg' }} />
      <div className="firework-particle" style={{ '--angle': '120deg' }} />
      <div className="firework-particle" style={{ '--angle': '180deg' }} />
      <div className="firework-particle" style={{ '--angle': '240deg' }} />
      <div className="firework-particle" style={{ '--angle': '300deg' }} />
    </div>
  );
}

export default function VotePage() {
  const { user, getCandidates, castVote, logout } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [votedFor, setVotedFor] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fireworks, setFireworks] = useState([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!user || user.type !== 'voter') {
      navigate('/');
      return;
    }

    const loadCandidates = async () => {
      const data = await getCandidates();
      setCandidates(data);
      // If user already voted, show success screen
      if (user.hasVoted) {
        setSuccess(true);
      }
    };
    loadCandidates();
  }, [user]);

  // Handle animation steps
  useEffect(() => {
    if (success) {
      setShowConfetti(true);
      
      // Trigger fireworks
      const fireworkInterval = setInterval(() => {
        setFireworks(prev => [
          ...prev.slice(-3),
          {
            id: Date.now(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 40 + 20
          }
        ]);
      }, 500);

      // Animation sequence
      setTimeout(() => setAnimationStep(1), 300);
      setTimeout(() => setAnimationStep(2), 600);
      setTimeout(() => setAnimationStep(3), 900);
      setTimeout(() => setAnimationStep(4), 1200);
      
      setTimeout(() => {
        clearInterval(fireworkInterval);
        setShowConfetti(false);
      }, 4000);

      // Auto logout and go home after 4 seconds
      const redirectTimer = setTimeout(() => {
        logout();
        navigate('/');
      }, 4000);

      // Countdown ticker
      const countInterval = setInterval(() => {
        setCountdown(prev => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      return () => {
        clearInterval(fireworkInterval);
        clearTimeout(redirectTimer);
        clearInterval(countInterval);
      };
    }
  }, [success]);

  const removeFirework = useCallback((id) => {
    setFireworks(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleSelect = (candidate) => {
    setSelectedCandidate(candidate);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!selectedCandidate) return;
    
    setLoading(true);
    const result = await castVote(selectedCandidate.id);
    
    if (result.success) {
      setSuccess(true);
      setVotedFor(selectedCandidate);
    } else {
      alert(result.message || 'Error casting vote');
    }
    
    setLoading(false);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedCandidate(null);
  };

  const handleGoBack = () => {
    navigate('/voter');
  };

  if (success && votedFor) {
    return (
      <div className="vote-page">
        {/* Confetti Animation */}
        {showConfetti && <Confetti />}
        
        {/* Fireworks */}
        {fireworks.map(fw => (
          <Firework 
            key={fw.id} 
            x={fw.x} 
            y={fw.y} 
            onComplete={() => removeFirework(fw.id)} 
          />
        ))}

        <header className="vote-header">
          <div className="header-left">
            <Link to="/voter" className="back-btn">
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
                <p>Cast Your Vote</p>
              </div>
            </div>
          </div>
        </header>

        <main className="vote-main">
          <div className={`success-container ${animationStep >= 1 ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.3s' }}>
            <div className={`success-icon-large ${animationStep >= 1 ? 'animate-glow' : ''}`} style={{ animationDelay: '0.5s' }}>
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={animationStep >= 1 ? 'checkmark-animated' : ''}
                style={{
                  animation: animationStep >= 1 ? 'checkmark-scale 0.6s ease forwards, checkmark-draw 0.6s ease forwards' : 'none',
                  strokeDasharray: 100,
                  strokeDashoffset: animationStep >= 1 ? 0 : 100
                }}
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            
            <h2 className={animationStep >= 2 ? 'animate-slide-up' : ''} style={{ animationDelay: '0.6s', opacity: animationStep >= 2 ? 1 : 0 }}>
              🎉 Vote Cast Successfully!
            </h2>
            
            <p className={`success-message ${animationStep >= 2 ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.7s', opacity: animationStep >= 2 ? 1 : 0 }}>
              Thank you for participating in the democratic process.
              Your vote has been recorded securely. 🗳️
            </p>
            
            <div className={`voted-for-card ${animationStep >= 3 ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.8s', opacity: animationStep >= 3 ? 1 : 0 }}>
              <p className="voted-label">You voted for:</p>
              <div className="voted-candidate">
                <div className="candidate-image-animated">
                  <div className="voted-avatar">
                    {votedFor.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="candidate-image-ring"></div>
                </div>
                <div className="voted-info">
                  <h3>{votedFor.name}</h3>
                  <p>{votedFor.party}</p>
                  <span className="vote-confirmed">✓ Vote Confirmed</span>
                </div>
              </div>
            </div>

            <div className={`success-actions ${animationStep >= 4 ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.9s', opacity: animationStep >= 4 ? 1 : 0 }}>
              <Link to="/voter" className="btn btn-primary btn-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Back to Dashboard
              </Link>
              <Link to="/results" className="btn btn-secondary btn-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                View Results
              </Link>
            </div>

            <p className="reminder">
              🔒 Remember: Your vote is secret. Do not share your voting details.
            </p>

            <div className="redirect-notice">
              <div className="redirect-spinner"></div>
              Redirecting to home in <strong>{countdown}s</strong>...
            </div>
          </div>
        </main>

        <style>{`
          /* Confetti & Fireworks Styles */
          .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
          }

          .confetti-piece {
            position: absolute;
            top: -10px;
            animation: confetti-fall 3s ease-in-out forwards;
          }

          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }

          .firework {
            position: absolute;
            z-index: 9998;
          }

          .firework-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: #f59e0b;
            border-radius: 50%;
            animation: firework-particle 0.6s ease-out forwards;
            transform: rotate(var(--angle)) translateY(0);
          }

          @keyframes firework-particle {
            0% {
              transform: rotate(var(--angle)) translateY(0) scale(1);
              opacity: 1;
            }
            100% {
              transform: rotate(var(--angle)) translateY(-60px) scale(0);
              opacity: 0;
            }
          }

          @keyframes checkmark-scale {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes checkmark-draw {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: 0; }
          }

          @keyframes glow-pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
            50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
          }

          @keyframes slide-up-fade {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-slide-up {
            animation: slide-up-fade 0.6s ease forwards;
          }

          .animate-glow {
            animation: glow-pulse 2s ease-in-out infinite;
          }

          .candidate-image-animated {
            position: relative;
          }

          .candidate-image-ring {
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border: 3px solid #10b981;
            border-radius: 50%;
            animation: ring-pulse 1.5s ease-in-out infinite;
          }

          @keyframes ring-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.5; }
          }

          .vote-confirmed {
            display: inline-block;
            margin-top: 0.5rem;
            padding: 0.25rem 0.75rem;
            background: #10b981;
            color: white;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .vote-page {
            min-height: 100vh;
            background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
          }

          .vote-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .back-btn {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }

          .back-btn:hover {
            background: rgba(255, 255, 255, 0.3);
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
            color: #10b981;
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

          .vote-main {
            padding: 3rem 1rem;
            display: flex;
            justify-content: center;
          }

          .success-container {
            background: white;
            border-radius: 24px;
            padding: 3rem;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
          }

          .success-icon-large {
            width: 100px;
            height: 100px;
            background: #d1fae5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
          }

          .success-icon-large svg {
            width: 50px;
            height: 50px;
            color: #10b981;
          }

          .success-container h2 {
            color: #065f46;
            margin-bottom: 1rem;
          }

          .success-message {
            color: #047857;
            margin-bottom: 2rem;
          }

          .voted-for-card {
            background: #f0fdf4;
            border: 2px solid #10b981;
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 2rem;
          }

          .voted-label {
            color: #64748b;
            margin-bottom: 1rem;
          }

          .voted-candidate {
            display: flex;
            align-items: center;
            gap: 1rem;
            text-align: left;
          }

          .voted-candidate img {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #10b981;
          }

          .voted-info h3 {
            color: #065f46;
            margin-bottom: 0.25rem;
          }

          .voted-info p {
            color: #047857;
            margin: 0;
          }

          .success-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 2rem;
          }

          .reminder {
            color: #64748b;
            font-size: 0.9rem;
            margin: 0;
          }
          .redirect-notice {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            margin-top: 1.25rem;
            padding: 0.75rem 1.5rem;
            background: rgba(30, 58, 138, 0.08);
            border-radius: 50px;
            color: #1e40af;
            font-size: 0.9rem;
          }
          .redirect-spinner {
            width: 14px;
            height: 14px;
            border: 2px solid #bfdbfe;
            border-top-color: #1e40af;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="vote-page">
      <header className="vote-header">
        <div className="header-left">
          <button onClick={handleGoBack} className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="logo-area">
            <div className="logo">
              <img src="/logo.png" alt="Logo" />
            </div>
            <div className="college-info">
              <h1>TrustElect</h1>
              <p>Cast Your Vote</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <span className="voter-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {user?.name}
          </span>
        </div>
      </header>

      <div className="progress-steps">
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span>Login</span>
        </div>
        <div className="step-line"></div>
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span>Verify</span>
        </div>
        <div className="step-line"></div>
        <div className="step active">
          <div className="step-icon">3</div>
          <span>Cast Vote</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className="step-icon">4</div>
          <span>Confirm</span>
        </div>
      </div>

      <main className="vote-main">
        <div className="container">
          <div className="election-info">
            <h2>Headboy Election 2024-25</h2>
            <p>Select your preferred candidate carefully. Your vote matters!</p>
          </div>

          <div className="candidates-vote-grid">
            {candidates.map((candidate, index) => (
              <div 
                key={candidate.id} 
                className={`candidate-vote-card ${selectedCandidate?.id === candidate.id ? 'selected' : ''}`}
                onClick={() => handleSelect(candidate)}
              >
                <div className="candidate-vote-number">{index + 1}</div>
                <div className="candidate-vote-avatar">
                  {candidate.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="candidate-vote-info">
                  <h3>{candidate.name}</h3>
                  <p>{candidate.party}</p>
                </div>
                <div className="select-indicator">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Click to Select
                </div>
              </div>
            ))}
          </div>

          <div className="security-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <div>
              <h4>Your Vote is Secure & Anonymous</h4>
              <p>All votes are encrypted and cannot be traced back to you. The voting system ensures complete ballot secrecy.</p>
            </div>
          </div>
        </div>
      </main>

      {showConfirm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Confirm Your Vote</h3>
            <p>Are you sure you want to vote for:</p>
            
            <div className="confirm-candidate">
              <div className="confirm-candidate-avatar">
                {selectedCandidate?.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4>{selectedCandidate?.name}</h4>
                <p>{selectedCandidate?.party}</p>
              </div>
            </div>

            <div className="confirm-warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>This action cannot be undone!</span>
            </div>

            <div className="confirm-actions">
              <button onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirm} className="btn btn-success btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 20, height: 20 }}></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Confirm Vote
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .vote-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .vote-header {
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
          border: none;
          cursor: pointer;
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

        .header-right {
          display: flex;
          align-items: center;
        }

        .voter-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          color: white;
          font-weight: 500;
        }

        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .step.completed .step-icon {
          background: #10b981;
          color: white;
        }

        .step.active .step-icon {
          background: #1e3a8a;
          color: white;
        }

        .step span {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .step.active span {
          color: #1e3a8a;
        }

        .step-line {
          width: 80px;
          height: 2px;
          background: #e2e8f0;
          margin: 0 1rem;
          margin-bottom: 1.5rem;
        }

        .vote-main {
          padding: 3rem 1rem;
        }

        .election-info {
          text-align: center;
          margin-bottom: 3rem;
        }

        .election-info h2 {
          color: #1e3a8a;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .election-info p {
          color: #64748b;
        }

        .candidates-vote-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto 3rem;
        }

        .candidate-vote-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid transparent;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .candidate-vote-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          border-color: #3b82f6;
        }

        .candidate-vote-card.selected {
          border-color: #10b981;
          background: #f0fdf4;
          transform: scale(1.02);
        }

        .candidate-vote-number {
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

        .candidate-vote-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          color: white;
          font-size: 2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.2rem;
          border: 4px solid #e2e8f0;
          box-shadow: 0 4px 15px rgba(30,58,138,0.2);
          letter-spacing: 0.05em;
        }

        .candidate-vote-card.selected .candidate-vote-avatar {
          border-color: #1e3a8a;
          box-shadow: 0 4px 20px rgba(30,58,138,0.4);
        }

        .confirm-candidate-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          color: white;
          font-size: 1.4rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 3px solid #e2e8f0;
        }

        .voted-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          color: white;
          font-size: 2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .candidate-vote-symbol {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 50px;
          height: 50px;
          background: #f59e0b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          border: 3px solid white;
        }

        .candidate-vote-info h3 {
          color: #1e293b;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .candidate-vote-info p {
          color: #64748b;
          font-weight: 500;
        }

        .select-indicator {
          margin-top: 1.5rem;
          padding: 0.75rem;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #64748b;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .select-indicator svg {
          width: 18px;
          height: 18px;
        }

        .candidate-vote-card.selected .select-indicator {
          background: #10b981;
          color: white;
        }

        .security-notice {
          background: #dbeafe;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .security-notice svg {
          width: 50px;
          height: 50px;
          color: #1e40af;
          flex-shrink: 0;
        }

        .security-notice h4 {
          color: #1e40af;
          margin-bottom: 0.5rem;
        }

        .security-notice p {
          color: #3b82f6;
          margin: 0;
          font-size: 0.9rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .confirm-modal {
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          text-align: center;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .confirm-icon {
          width: 80px;
          height: 80px;
          background: #dbeafe;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .confirm-icon svg {
          width: 40px;
          height: 40px;
          color: #1e40af;
        }

        .confirm-modal h3 {
          margin-bottom: 0.5rem;
        }

        .confirm-modal > p {
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        .confirm-candidate {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .confirm-candidate img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }

        .confirm-candidate h4 {
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .confirm-candidate p {
          color: #64748b;
          margin: 0;
        }

        .confirm-warning {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #fef3c7;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          color: #92400e;
          font-weight: 500;
        }

        .confirm-warning svg {
          width: 20px;
          height: 20px;
        }

        .confirm-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .candidates-vote-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
        }
      `}</style>
    </div>
  );
}
