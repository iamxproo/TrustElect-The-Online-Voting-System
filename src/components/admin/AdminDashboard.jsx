import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

function AnimatedCounter({ value, duration = 1000 }) {
  const [count, setCount] = useState(0);
  const elRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (elRef.current) obs.observe(elRef.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    let start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration, visible]);
  return <span ref={elRef}>{count}</span>;
}

export default function AdminDashboard() {
  const { user, logout, getCandidates, getFullStats, getElection, getVoteHistory } = useAuth();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({ totalVotes: 0, totalVoters: 0, votedCount: 0, turnout: 0 });
  const [recentVotes, setRecentVotes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Create Election form
  const [showCreateElection, setShowCreateElection] = useState(false);
  const [electionForm, setElectionForm] = useState({ title: '', type: '', description: '' });
  const [electionLoading, setElectionLoading] = useState(false);
  const [electionError, setElectionError] = useState('');

  // Candidate form
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [candidateForm, setCandidateForm] = useState({ name: '', party: '' });
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [candidateError, setCandidateError] = useState('');

  // Stop/Complete election confirm
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!user || user.type !== 'admin') { navigate('/login'); return; }
    loadData().catch(() => { logout(); navigate('/login'); });
  }, [user]);

  const loadData = async () => {
    const electionData = await getElection();
    setElection(electionData);
    const candidateData = await getCandidates();
    setCandidates(candidateData);
    const history = await getVoteHistory();
    setRecentVotes(history.slice(0, 10));
    const s = await getFullStats();
    setStats({
      totalVotes: s.totalVotes ?? 0,
      totalVoters: s.totalVoters ?? 0,
      votedCount: s.votedCount ?? 0,
      turnout: s.turnoutPercentage ?? 0,
      remaining: s.remainingCount ?? 0,
    });
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // ── Create Election ──────────────────────────────────────────────────────────
  const handleCreateElection = async (e) => {
    e.preventDefault();
    if (!electionForm.title || !electionForm.type) { setElectionError('Title and type are required.'); return; }
    setElectionLoading(true);
    setElectionError('');
    try {
      await api.createElection({ title: electionForm.title, description: `${electionForm.type}${electionForm.description ? ' - ' + electionForm.description : ''}`, status: 'ACTIVE' });
      setShowCreateElection(false);
      setElectionForm({ title: '', type: '', description: '' });
      await loadData();
    } catch (err) {
      setElectionError(err.message || 'Failed to create election.');
    }
    setElectionLoading(false);
  };

  // ── Stop / Complete Election ─────────────────────────────────────────────────
  const handleStopElection = async () => {
    try {
      const top = candidates.length > 0 ? candidates.reduce((a, b) => (a.votes || 0) >= (b.votes || 0) ? a : b) : null;
      setWinner(top);
      await api.updateElection(election.id, { title: election.title, description: election.description, status: 'COMPLETED' });
      setShowStopConfirm(false);
      await loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // ── Candidate Add/Edit/Delete ────────────────────────────────────────────────
  const openAddCandidate = () => { setEditingCandidate(null); setCandidateForm({ name: '', party: '' }); setCandidateError(''); setShowCandidateForm(true); };
  const openEditCandidate = (c) => { setEditingCandidate(c); setCandidateForm({ name: c.name, party: c.party }); setCandidateError(''); setShowCandidateForm(true); };

  const handleSaveCandidate = async (e) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.party) { setCandidateError('Name and party are required.'); return; }
    setCandidateLoading(true);
    setCandidateError('');
    try {
      if (editingCandidate) {
        await api.updateCandidate(editingCandidate.id, { name: candidateForm.name, party: candidateForm.party });
      } else {
        await api.addCandidate({ name: candidateForm.name, party: candidateForm.party });
      }
      setShowCandidateForm(false);
      await loadData();
    } catch (err) {
      setCandidateError(err.message || 'Failed to save candidate.');
    }
    setCandidateLoading(false);
  };

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Delete this candidate?')) return;
    try {
      await api.deleteCandidate(id);
      await loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const currentLeader = candidates.length > 0 ? candidates.reduce((a, b) => (a.votes || 0) >= (b.votes || 0) ? a : b) : null;
  const isCompleted = election?.status === 'COMPLETED';

  return (
    <div className="admin-dashboard">
      {/* ── Header ── */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo-area">
            <div className="logo"><img src="/logo.png" alt="Logo" /></div>
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

      {/* ── Winner Banner ── */}
      {winner && (
        <div className="winner-banner">
          <div className="winner-inner">
            <span className="winner-crown">🏆</span>
            <div>
              <div className="winner-title">Election Completed — Winner Declared!</div>
              <div className="winner-name">{winner.name} <span className="winner-party">({winner.party})</span> — {winner.votes || 0} votes</div>
            </div>
            <button className="modal-close" onClick={() => setWinner(null)}>✕</button>
          </div>
        </div>
      )}

      {/* ── No Election Screen ── */}
      {!election && (
        <main className="setup-screen">
          <div className="setup-card">
            <div className="setup-icon">🗳️</div>
            <h2>Welcome, Administrator!</h2>
            <p>No election has been created yet. Create one to get started.</p>
            <button className="btn btn-primary btn-lg" onClick={() => setShowCreateElection(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Election
            </button>
          </div>
        </main>
      )}

      {/* ── Full Dashboard ── */}
      {election && (
        <>
          <nav className="admin-nav">
            <div className="container">
              <div className="nav-tabs">
                <button className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Overview
                </button>
                <button className={`nav-tab ${activeTab === 'candidates' ? 'active' : ''}`} onClick={() => setActiveTab('candidates')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  Candidates
                </button>
                <Link to="/admin/voters" className="nav-tab">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  Voters
                </Link>
                <Link to="/results" className="nav-tab">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  Live Results
                </Link>
              </div>
            </div>
          </nav>

          <main className="admin-main">
            <div className="container">

              {/* Election Status Bar */}
              <div className={`election-status-bar ${election.status?.toLowerCase()}`}>
                <div className="election-status-left">
                  <span className="election-status-dot"></span>
                  <div>
                    <div className="election-status-title">{election.title}</div>
                    <div className="election-status-desc">{election.description}</div>
                  </div>
                </div>
                <div className="election-status-right">
                  <span className={`status-badge status-${election.status?.toLowerCase()}`}>
                    {election.status === 'ACTIVE' ? '🟢 Active' : election.status === 'COMPLETED' ? '✅ Completed' : '🕐 Upcoming'}
                  </span>
                  {election.status === 'ACTIVE' && (
                    <button className="btn btn-danger btn-sm" onClick={() => setShowStopConfirm(true)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                      Stop & Declare Winner
                    </button>
                  )}
                </div>
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="overview-tab animate-fadeIn">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon stat-icon-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                      <div className="stat-content"><span className="stat-number"><AnimatedCounter value={stats.totalVoters} /></span><span className="stat-label">Total Voters</span></div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon stat-icon-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                      <div className="stat-content"><span className="stat-number"><AnimatedCounter value={stats.votedCount} /></span><span className="stat-label">Votes Cast</span></div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon stat-icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></div>
                      <div className="stat-content"><span className="stat-number"><AnimatedCounter value={parseFloat(stats.turnout)} />%</span><span className="stat-label">Turnout</span></div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon stat-icon-danger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                      <div className="stat-content"><span className="stat-number"><AnimatedCounter value={stats.totalVoters - stats.votedCount} /></span><span className="stat-label">Remaining</span></div>
                    </div>
                  </div>

                  {currentLeader && (
                    <div className="leader-card">
                      <div className="leader-badge"><span className="animate-crown">👑</span> Current Leader</div>
                      <div className="leader-content">
                        <div className="leader-avatar">{currentLeader.name.charAt(0)}</div>
                        <div className="leader-info">
                          <h3>{currentLeader.name}</h3>
                          <p>{currentLeader.party}</p>
                          <div className="leader-votes">
                            <span className="vote-count"><AnimatedCounter value={currentLeader.votes || 0} /></span>
                            <span className="vote-label">votes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="recent-votes-card">
                    <h3>Recent Voting Activity</h3>
                    <div className="table-container">
                      <table>
                        <thead><tr><th>Voter</th><th>Candidate</th><th>Time</th></tr></thead>
                        <tbody>
                          {recentVotes.length > 0 ? recentVotes.map((v, i) => (
                            <tr key={i}>
                              <td>{v.voterName}</td>
                              <td><span className="badge badge-primary">{v.candidateName}</span></td>
                              <td>{new Date(v.timestamp).toLocaleString()}</td>
                            </tr>
                          )) : <tr><td colSpan="3" className="text-center">No votes recorded yet</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Candidates Tab */}
              {activeTab === 'candidates' && (
                <div className="candidates-tab animate-fadeIn">
                  <div className="tab-header">
                    <h2>Candidates ({candidates.length})</h2>
                    {!isCompleted && (
                      <button className="btn btn-primary" onClick={openAddCandidate}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Candidate
                      </button>
                    )}
                  </div>

                  {candidates.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">👤</div>
                      <p>No candidates added yet. Click "Add Candidate" to get started.</p>
                    </div>
                  ) : (
                    <div className="candidates-list">
                      {candidates.map((c, i) => (
                        <div key={c.id} className="candidate-row">
                          <div className="candidate-rank-badge">#{i + 1}</div>
                          <div className="candidate-avatar-sm">{c.name.charAt(0)}</div>
                          <div className="candidate-details">
                            <div className="candidate-name">{c.name}</div>
                            <div className="candidate-party">{c.party}</div>
                          </div>
                          <div className="candidate-vote-bar-wrap">
                            <div className="candidate-vote-bar" style={{ width: `${stats.totalVotes > 0 ? ((c.votes || 0) / stats.totalVotes * 100) : 0}%` }}></div>
                          </div>
                          <div className="candidate-vote-count">{c.votes || 0} <span>votes</span></div>
                          {!isCompleted && (
                            <div className="candidate-actions">
                              <button className="action-btn edit-btn" onClick={() => openEditCandidate(c)} title="Edit">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button className="action-btn delete-btn" onClick={() => handleDeleteCandidate(c.id)} title="Delete">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>

          <footer className="admin-footer">
            <div className="footer-content">
              <p>© 2024 TrustElect Voting System | Secure • Transparent • Democratic</p>
              <div className="developer-info">
                <p>Developed by <strong>Samarth Karale</strong></p>
                <p>Fullstack Java Developer | Email: samarthkarale21@gmail.com | Mob: 9022983993</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ── Create Election Modal ── */}
      {showCreateElection && (
        <div className="modal-overlay" onClick={() => setShowCreateElection(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🗳️ Create New Election</h3>
              <button className="modal-close" onClick={() => setShowCreateElection(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateElection}>
              <div className="form-group">
                <label>Election Title *</label>
                <input className="form-input" placeholder="e.g. Headboy Election 2024-25" value={electionForm.title} onChange={e => setElectionForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Type of Election *</label>
                <select className="form-input" value={electionForm.type} onChange={e => setElectionForm(f => ({ ...f, type: e.target.value }))} required>
                  <option value="">Select Type</option>
                  <option value="Headboy Election">Headboy Election</option>
                  <option value="Student Council Election">Student Council Election</option>
                  <option value="Class Representative Election">Class Representative Election</option>
                  <option value="Club Election">Club Election</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description <span className="optional">(optional)</span></label>
                <textarea className="form-input" rows={3} placeholder="Any additional info..." value={electionForm.description} onChange={e => setElectionForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              {electionError && <div className="form-error">{electionError}</div>}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateElection(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={electionLoading}>{electionLoading ? 'Creating...' : 'Create Election'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add / Edit Candidate Modal ── */}
      {showCandidateForm && (
        <div className="modal-overlay" onClick={() => setShowCandidateForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCandidate ? '✏️ Edit Candidate' : '➕ Add Candidate'}</h3>
              <button className="modal-close" onClick={() => setShowCandidateForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveCandidate}>
              <div className="form-group">
                <label>Full Name *</label>
                <input className="form-input" placeholder="e.g. Rahul Sharma" value={candidateForm.name} onChange={e => setCandidateForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Party / Group *</label>
                <input className="form-input" placeholder="e.g. Student Progressive Party" value={candidateForm.party} onChange={e => setCandidateForm(f => ({ ...f, party: e.target.value }))} required />
              </div>
              {candidateError && <div className="form-error">{candidateError}</div>}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCandidateForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={candidateLoading}>{candidateLoading ? 'Saving...' : editingCandidate ? 'Save Changes' : 'Add Candidate'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Stop Election Confirm Modal ── */}
      {showStopConfirm && (
        <div className="modal-overlay" onClick={() => setShowStopConfirm(false)}>
          <div className="modal-box modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Stop Election</h3>
              <button className="modal-close" onClick={() => setShowStopConfirm(false)}>✕</button>
            </div>
            <p className="confirm-text">Are you sure you want to <strong>stop the election</strong> and declare a winner? This action cannot be undone.</p>
            {currentLeader && (
              <div className="confirm-winner-preview">
                <span>🏆 Likely Winner:</span>
                <strong>{currentLeader.name}</strong>
                <span className="confirm-party">({currentLeader.party})</span>
                <span className="confirm-votes">{currentLeader.votes || 0} votes</span>
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowStopConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleStopElection}>Yes, Stop & Declare Winner</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-dashboard { min-height: 100vh; background: #f8fafc; }

        /* Header */
        .admin-header { background: linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 20px rgba(30,58,138,0.2); }
        .header-left .logo-area { display: flex; align-items: center; gap: 1rem; }
        .header-left .logo { width: 50px; height: 50px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .header-left .logo img { width: 100%; height: 100%; object-fit: contain; }
        .college-info h1 { color: white; font-size: 1.5rem; margin: 0; }
        .college-info p { color: rgba(255,255,255,0.8); font-size: 0.8rem; margin: 0; }
        .header-right { display: flex; align-items: center; gap: 1rem; }
        .user-info { display: flex; align-items: center; gap: 0.75rem; }
        .user-name { color: white; font-weight: 500; }

        /* Winner Banner */
        .winner-banner { background: linear-gradient(135deg,#f59e0b,#d97706); padding: 1rem 2rem; }
        .winner-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 1rem; }
        .winner-crown { font-size: 2rem; }
        .winner-title { font-weight: 700; color: white; font-size: 1rem; }
        .winner-name { color: white; font-size: 1.25rem; font-weight: 800; }
        .winner-party { font-weight: 400; opacity: 0.9; }
        .winner-inner .modal-close { margin-left: auto; color: white; font-size: 1.2rem; background: rgba(255,255,255,0.2); border: none; border-radius: 6px; padding: 0.3rem 0.6rem; cursor: pointer; }

        /* Election Status Bar */
        .election-status-bar { background: white; border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border-left: 5px solid #1e40af; gap: 1rem; flex-wrap: wrap; }
        .election-status-bar.completed { border-left-color: #059669; }
        .election-status-left { display: flex; align-items: center; gap: 0.75rem; }
        .election-status-dot { width: 12px; height: 12px; border-radius: 50%; background: #22c55e; animation: pulse-dot 1.5s ease-in-out infinite; flex-shrink: 0; }
        .election-status-bar.completed .election-status-dot { background: #059669; animation: none; }
        @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); } 50% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } }
        .election-status-title { font-weight: 700; color: #1e293b; font-size: 1.1rem; }
        .election-status-desc { color: #64748b; font-size: 0.85rem; }
        .election-status-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .status-badge { font-size: 0.85rem; font-weight: 600; padding: 0.35rem 0.9rem; border-radius: 9999px; background: #f0fdf4; color: #15803d; }
        .status-badge.status-completed { background: #ecfdf5; color: #059669; }
        .status-badge.status-upcoming { background: #fef3c7; color: #d97706; }

        /* Nav */
        .admin-nav { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
        .nav-tabs { display: flex; gap: 0.5rem; padding: 0.5rem 2rem; overflow-x: auto; }
        .nav-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: transparent; border: none; border-radius: 8px; font-weight: 500; color: #64748b; cursor: pointer; transition: all 0.2s; white-space: nowrap; text-decoration: none; font-size: 0.95rem; }
        .nav-tab svg { width: 18px; height: 18px; }
        .nav-tab:hover { background: #f1f5f9; color: #1e3a8a; }
        .nav-tab.active { background: #1e3a8a; color: white; }

        /* Main */
        .admin-main { padding: 1.5rem 2rem; }
        .container { max-width: 1200px; margin: 0 auto; }

        /* Setup Screen */
        .setup-screen { min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center; padding: 2rem; background: linear-gradient(135deg,#f0f4ff,#e8f0fe); }
        .setup-card { background: white; border-radius: 24px; padding: 3.5rem; text-align: center; box-shadow: 0 20px 60px rgba(30,58,138,0.12); max-width: 480px; width: 100%; }
        .setup-icon { font-size: 4rem; margin-bottom: 1.5rem; display: block; }
        .setup-card h2 { color: #1e3a8a; font-size: 1.75rem; margin-bottom: 0.75rem; }
        .setup-card p { color: #64748b; font-size: 1rem; margin-bottom: 2rem; line-height: 1.6; }
        .btn-lg { padding: 0.9rem 2.2rem; font-size: 1.05rem; display: inline-flex; align-items: center; gap: 0.6rem; border-radius: 12px; }

        /* Stats */
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
        .stat-card { background: white; border-radius: 16px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-4px); }
        .stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-icon svg { width: 28px; height: 28px; }
        .stat-icon-primary { background: #dbeafe; color: #1e40af; }
        .stat-icon-success { background: #d1fae5; color: #059669; }
        .stat-icon-warning { background: #fef3c7; color: #d97706; }
        .stat-icon-danger { background: #fee2e2; color: #dc2626; }
        .stat-content { display: flex; flex-direction: column; }
        .stat-number { font-size: 1.9rem; font-weight: 800; color: #1e293b; line-height: 1; }
        .stat-label { font-size: 0.85rem; color: #64748b; margin-top: 0.25rem; }

        /* Leader */
        .leader-card { background: linear-gradient(135deg,#fef3c7,#fde68a); border-radius: 16px; padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 4px 20px rgba(245,158,11,0.2); }
        .leader-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #f59e0b; color: white; padding: 0.45rem 1rem; border-radius: 9999px; font-weight: 600; font-size: 0.875rem; margin-bottom: 1.25rem; }
        .leader-content { display: flex; align-items: center; gap: 1.5rem; }
        .leader-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg,#1e3a8a,#3b82f6); color: white; font-size: 2rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 4px solid #f59e0b; }
        .leader-info h3 { font-size: 1.4rem; margin-bottom: 0.2rem; color: #1e293b; }
        .leader-info p { color: #64748b; margin-bottom: 0.5rem; }
        .leader-votes { display: flex; align-items: baseline; gap: 0.4rem; }
        .vote-count { font-size: 1.9rem; font-weight: 800; color: #f59e0b; }
        .vote-label { color: #64748b; }
        .animate-crown { display: inline-block; animation: crown-bounce 1s ease-in-out infinite; }
        @keyframes crown-bounce { 0%,100% { transform: rotate(-5deg); } 50% { transform: translateY(-4px) rotate(5deg); } }

        /* Recent Votes */
        .recent-votes-card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .recent-votes-card h3 { margin-bottom: 1rem; color: #1e293b; }
        .table-container { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 0.75rem 1rem; background: #f8fafc; color: #64748b; font-size: 0.85rem; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
        td { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; color: #374151; font-size: 0.9rem; }
        .text-center { text-align: center; color: #94a3b8; }

        /* Candidates Tab */
        .tab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .tab-header h2 { color: #1e293b; font-size: 1.3rem; margin: 0; }
        .empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-state p { color: #64748b; }
        .candidates-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .candidate-row { background: white; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: transform 0.15s; }
        .candidate-row:hover { transform: translateX(4px); }
        .candidate-rank-badge { font-size: 1rem; font-weight: 700; color: #1e3a8a; width: 28px; flex-shrink: 0; }
        .candidate-avatar-sm { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg,#1e3a8a,#3b82f6); color: white; font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .candidate-details { flex: 0 0 180px; }
        .candidate-name { font-weight: 700; color: #1e293b; font-size: 1rem; }
        .candidate-party { color: #64748b; font-size: 0.85rem; margin-top: 0.1rem; }
        .candidate-vote-bar-wrap { flex: 1; background: #f1f5f9; border-radius: 9999px; height: 8px; overflow: hidden; }
        .candidate-vote-bar { height: 100%; background: linear-gradient(90deg,#1e3a8a,#3b82f6); border-radius: 9999px; min-width: 4px; transition: width 0.6s ease; }
        .candidate-vote-count { font-size: 1rem; font-weight: 700; color: #1e293b; width: 80px; text-align: right; flex-shrink: 0; }
        .candidate-vote-count span { font-weight: 400; color: #94a3b8; font-size: 0.8rem; margin-left: 2px; }
        .candidate-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
        .action-btn { width: 34px; height: 34px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .edit-btn { background: #dbeafe; color: #1e40af; }
        .edit-btn:hover { background: #1e40af; color: white; }
        .delete-btn { background: #fee2e2; color: #dc2626; }
        .delete-btn:hover { background: #dc2626; color: white; }

        /* Modals */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
        .modal-box { background: white; border-radius: 20px; padding: 2rem; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.2); animation: modalIn 0.2s ease; }
        .modal-sm { max-width: 420px; }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(-10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header h3 { font-size: 1.25rem; color: #1e3a8a; margin: 0; }
        .modal-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #94a3b8; padding: 0.25rem 0.5rem; border-radius: 6px; transition: all 0.15s; }
        .modal-close:hover { background: #f1f5f9; color: #1e3a8a; }
        .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; }
        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: block; font-weight: 600; color: #374151; margin-bottom: 0.4rem; font-size: 0.9rem; }
        .optional { font-weight: 400; color: #94a3b8; font-size: 0.8rem; }
        .form-input { width: 100%; padding: 0.7rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; transition: border-color 0.2s; box-sizing: border-box; font-family: inherit; background: white; }
        .form-input:focus { outline: none; border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30,58,138,0.1); }
        textarea.form-input { resize: vertical; min-height: 80px; }
        .form-error { background: #fee2e2; color: #dc2626; border-radius: 8px; padding: 0.6rem 0.9rem; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .confirm-text { color: #374151; margin-bottom: 1rem; line-height: 1.6; }
        .confirm-winner-preview { background: #fef3c7; border-radius: 10px; padding: 0.85rem 1.1rem; display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .confirm-winner-preview strong { color: #1e293b; font-size: 1rem; }
        .confirm-party { color: #64748b; }
        .confirm-votes { background: #f59e0b; color: white; padding: 0.2rem 0.6rem; border-radius: 9999px; font-weight: 600; font-size: 0.8rem; margin-left: auto; }

        /* Buttons */
        .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem; border-radius: 10px; font-weight: 600; font-size: 0.9rem; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .btn-primary { background: linear-gradient(135deg,#1e3a8a,#1e40af); color: white; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(30,58,138,0.3); }
        .btn-secondary { background: #f1f5f9; color: #475569; }
        .btn-secondary:hover { background: #e2e8f0; }
        .btn-danger { background: linear-gradient(135deg,#dc2626,#b91c1c); color: white; }
        .btn-danger:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(220,38,38,0.3); }
        .btn-sm { padding: 0.45rem 1rem; font-size: 0.85rem; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .badge { display: inline-flex; align-items: center; padding: 0.25rem 0.65rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; }
        .badge-primary { background: #dbeafe; color: #1e40af; }

        /* Footer */
        .admin-footer { background: #1e293b; padding: 2rem; text-align: center; color: #94a3b8; }
        .admin-footer .footer-content p { margin: 0 0 0.5rem; font-size: 0.9rem; }
        .admin-footer .developer-info { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #374151; }
        .admin-footer .developer-info p { margin: 0.25rem 0; font-size: 0.85rem; }
        .admin-footer .developer-info strong { color: #3b82f6; }

        /* Animations */
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 768px) {
          .admin-main { padding: 1rem; }
          .nav-tabs { padding: 0.5rem 1rem; }
          .stats-grid { grid-template-columns: repeat(2,1fr); gap: 1rem; }
          .election-status-bar { flex-direction: column; align-items: flex-start; }
          .candidate-details { flex: 1; min-width: 0; }
          .candidate-vote-bar-wrap { display: none; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
          .leader-content { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
