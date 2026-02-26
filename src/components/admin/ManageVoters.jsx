import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ManageVoters() {
  const { user, getVoters, addVoter, updateVoter, removeVoter } = useAuth();
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    rollNumber: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');

  useEffect(() => {
    if (!user || user.type !== 'admin') {
      navigate('/login');
      return;
    }
    loadVoters();
  }, [user]);

  const loadVoters = () => {
    const data = getVoters();
    setVoters(data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingVoter) {
      updateVoter(editingVoter.id, formData);
    } else {
      const result = addVoter(formData);
      if (result.success) {
        alert(`Voter added! Voter ID: ${result.voterId}, Password: ${result.password}`);
      }
    }
    
    loadVoters();
    closeModal();
  };

  const handleEdit = (voter) => {
    setEditingVoter(voter);
    setFormData({
      name: voter.name,
      email: voter.email,
      phone: voter.phone || '',
      class: voter.class,
      rollNumber: voter.rollNumber
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this voter?')) {
      removeVoter(id);
      loadVoters();
    }
  };

  const openModal = () => {
    setEditingVoter(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      class: '',
      rollNumber: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVoter(null);
  };

  const filteredVoters = voters.filter(voter => {
    const matchesSearch = voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.voterId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filterClass || voter.class === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="manage-voters">
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
              <p>Manage Voters</p>
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
          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{voters.length}</span>
              <span className="stat-label">Total Voters</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{voters.filter(v => v.hasVoted).length}</span>
              <span className="stat-label">Voted</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{voters.filter(v => !v.hasVoted).length}</span>
              <span className="stat-label">Not Voted</span>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="actions-bar">
            <div className="search-filters">
              <div className="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={filterClass} 
                onChange={(e) => setFilterClass(e.target.value)}
                className="filter-select"
              >
                <option value="">All Classes</option>
                <option value="SE">SE</option>
                <option value="TE">TE</option>
                <option value="BE">BE</option>
              </select>
            </div>
            <button onClick={openModal} className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Voter
            </button>
          </div>

          {/* Voters Table */}
          <div className="voters-table-card">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Class</th>
                    <th>Roll No</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVoters.length > 0 ? (
                    filteredVoters.map((voter) => (
                      <tr key={voter.id}>
                        <td>
                          <span className="voter-id">{voter.voterId || 'N/A'}</span>
                        </td>
                        <td>{voter.name}</td>
                        <td>{voter.email}</td>
                        <td>
                          <span className="badge badge-primary">{voter.class}</span>
                        </td>
                        <td>{voter.rollNumber}</td>
                        <td>
                          {voter.hasVoted ? (
                            <span className="badge badge-success">Voted</span>
                          ) : (
                            <span className="badge badge-warning">Pending</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleEdit(voter)} 
                              className="btn-icon btn-edit"
                              title="Edit"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(voter.id)} 
                              className="btn-icon btn-delete"
                              title="Delete"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        No voters found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingVoter ? 'Edit Voter' : 'Add New Voter'}</h3>
              <button onClick={closeModal} className="close-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Class *</label>
                  <select
                    name="class"
                    className="form-input"
                    value={formData.class}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="SE">SE</option>
                    <option value="TE">TE</option>
                    <option value="BE">BE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number *</label>
                  <input
                    type="text"
                    name="rollNumber"
                    className="form-input"
                    placeholder="Enter roll number"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVoter ? 'Update' : 'Add'} Voter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .manage-voters {
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

        .stats-bar {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1e3a8a;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
        }

        .actions-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .search-filters {
          display: flex;
          gap: 1rem;
          flex: 1;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-box svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #94a3b8;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          min-width: 150px;
        }

        .voters-table-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .voter-id {
          font-family: monospace;
          font-weight: 600;
          color: #1e3a8a;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-icon svg {
          width: 16px;
          height: 16px;
        }

        .btn-edit {
          background: #dbeafe;
          color: #1e40af;
        }

        .btn-edit:hover {
          background: #bfdbfe;
        }

        .btn-delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-delete:hover {
          background: #fecaca;
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

        .close-btn:hover {
          background: #e2e8f0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        @media (max-width: 768px) {
          .stats-bar {
            flex-wrap: wrap;
          }

          .actions-bar {
            flex-direction: column;
          }

          .search-filters {
            flex-direction: column;
          }

          .search-box {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
