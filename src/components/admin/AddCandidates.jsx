import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AddCandidates() {
  const { user, getCandidates, addCandidate, updateCandidate, removeCandidate } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    image: '',
    symbol: ''
  });

  useEffect(() => {
    if (!user || user.type !== 'admin') {
      navigate('/');
      return;
    }
    loadCandidates();
  }, [user]);

  const loadCandidates = async () => {
    const data = await getCandidates();
    setCandidates(data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCandidate) {
      await updateCandidate(editingCandidate.id, formData);
    } else {
      await addCandidate(formData);
    }
    
    loadCandidates();
    closeModal();
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      party: candidate.party,
      image: candidate.image,
      symbol: candidate.symbol
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this candidate?')) {
      await removeCandidate(id);
      loadCandidates();
    }
  };

  const openModal = () => {
    setEditingCandidate(null);
    setFormData({
      name: '',
      party: '',
      image: '',
      symbol: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCandidate(null);
  };

  const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);

  return (
    <div className="manage-candidates">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <Link to="/admin" className="back-btn">
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
              <p>Manage Candidates</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <Link to="/admin" className="btn btn-secondary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="manage-main">
        <div className="container">
          {/* Election Info */}
          <div className="election-info">
            <h2>Headboy Election 2024-25</h2>
            <p>Candidates for the position of Headboy</p>
          </div>

          {/* Actions Bar */}
          <div className="actions-bar">
            <h3>Candidates ({candidates.length})</h3>
            <button onClick={openModal} className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Candidate
            </button>
          </div>

          {/* Candidates Grid */}
          <div className="candidates-grid">
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="candidate-card-admin">
                <div className="candidate-rank">#{index + 1}</div>
                <div className="candidate-image-container">
                  <img 
                    src={candidate.image} 
                    alt={candidate.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                    }}
                  />
                  {candidate.symbol && (
                    <span className="candidate-symbol">{candidate.symbol}</span>
                  )}
                </div>
                <div className="candidate-details">
                  <h4>{candidate.name}</h4>
                  <p className="party-name">{candidate.party}</p>
                  <div className="vote-stats">
                    <span className="votes-count">{candidate.votes || 0}</span>
                    <span className="votes-label">votes</span>
                  </div>
                  <div className="vote-bar">
                    <div 
                      className="vote-fill"
                      style={{ width: `${totalVotes > 0 ? ((candidate.votes || 0) / totalVotes * 100) : 0}%` }}
                    ></div>
                  </div>
                  <div className="percentage">{totalVotes > 0 ? ((candidate.votes || 0) / totalVotes * 100).toFixed(1) : 0}%</div>
                </div>
                <div className="candidate-actions">
                  <button onClick={() => handleEdit(candidate)} className="btn btn-secondary btn-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(candidate.id)} className="btn btn-danger btn-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
            
            {candidates.length < 3 && (
              <div className="add-candidate-card" onClick={openModal}>
                <div className="add-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <p>Add Candidate</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</h3>
              <button onClick={closeModal} className="close-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Candidate Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter candidate name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Party/Organization *</label>
                <input
                  type="text"
                  name="party"
                  className="form-input"
                  placeholder="Enter party or organization name"
                  value={formData.party}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Photo</label>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" />
                    ) : (
                      <div className="placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>Upload Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="upload-buttons">
                    <label htmlFor="image-upload" className="btn btn-secondary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Choose File
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                <small style={{ color: '#64748b', marginTop: '0.5rem', display: 'block' }}>
                  Recommended: 400x400px image (JPG, PNG)
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">Symbol (Emoji)</label>
                <input
                  type="text"
                  name="symbol"
                  className="form-input"
                  placeholder="Enter emoji symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  maxLength={2}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCandidate ? 'Update' : 'Add'} Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .manage-candidates {
          min-height: 100vh;
          background: #f8fafc;
        }

        .admin-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
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

        .manage-main {
          padding: 2rem;
        }

        .election-info {
          text-align: center;
          margin-bottom: 2rem;
        }

        .election-info h2 {
          color: #1e3a8a;
          margin-bottom: 0.5rem;
        }

        .election-info p {
          color: #64748b;
        }

        .actions-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .actions-bar h3 {
          color: #1e293b;
        }

        .candidates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .candidate-card-admin {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          position: relative;
          transition: transform 0.3s ease;
        }

        .candidate-card-admin:hover {
          transform: translateY(-5px);
        }

        .candidate-rank {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          background: #1e3a8a;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .candidate-image-container {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 1rem;
        }

        .candidate-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
          border: 4px solid #1e3a8a;
        }

        .candidate-symbol {
          position: absolute;
          bottom: -10px;
          right: -10px;
          width: 40px;
          height: 40px;
          background: #f59e0b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          border: 3px solid white;
        }

        .candidate-details {
          text-align: center;
        }

        .candidate-details h4 {
          font-size: 1.25rem;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .party-name {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .vote-stats {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .votes-count {
          font-size: 2rem;
          font-weight: 800;
          color: #1e3a8a;
        }

        .votes-label {
          color: #64748b;
        }

        .vote-bar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .vote-fill {
          height: 100%;
          background: linear-gradient(90deg, #1e3a8a, #3b82f6);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .percentage {
          font-size: 0.9rem;
          font-weight: 600;
          color: #64748b;
        }

        .candidate-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .candidate-actions .btn {
          flex: 1;
        }

        .add-candidate-card {
          background: #f1f5f9;
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 400px;
        }

        .add-candidate-card:hover {
          border-color: #1e3a8a;
          background: #e2e8f0;
        }

        .add-icon {
          width: 60px;
          height: 60px;
          background: #1e3a8a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .add-icon svg {
          width: 30px;
          height: 30px;
          color: white;
        }

        .add-candidate-card p {
          color: #64748b;
          font-weight: 500;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f1f5f9;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        /* Image Upload Styles */
        .image-upload-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .image-preview {
          width: 150px;
          height: 150px;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          overflow: hidden;
          margin: 0 auto;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-preview .placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          color: #94a3b8;
        }

        .image-preview .placeholder svg {
          width: 40px;
          height: 40px;
          margin-bottom: 0.5rem;
        }

        .image-preview .placeholder span {
          font-size: 0.85rem;
        }

        .upload-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: center;
        }

        .upload-buttons .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .upload-buttons .form-input {
          width: 100%;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
