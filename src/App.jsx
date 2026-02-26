import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddCandidates from './components/admin/AddCandidates';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageVoters from './components/admin/ManageVoters';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VoterDashboard from './components/voter/Dashboard';
import Results from './components/voter/Results';
import VotePage from './components/voter/VotePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import Home from './pages/Home';

// Protected Route for Admin
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!user || user.type !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Protected Route for Voter
function VoterRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!user || user.type !== 'voter') {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Public Route - Redirect if already logged in
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (user) {
    if (user.type === 'admin') {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/voter" />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/voters" element={<AdminRoute><ManageVoters /></AdminRoute>} />
      <Route path="/admin/candidates" element={<AdminRoute><AddCandidates /></AdminRoute>} />
      <Route path="/voter" element={<VoterRoute><VoterDashboard /></VoterRoute>} />
      <Route path="/voter/vote" element={<VoterRoute><VotePage /></VoterRoute>} />
      <Route path="/results" element={<AdminRoute><Results /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
