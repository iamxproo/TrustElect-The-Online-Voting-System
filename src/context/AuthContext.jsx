import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

// Mock data storage keys
const STORAGE_KEYS = {
  ADMIN: 'trustelect_admin',
  VOTERS: 'trustelect_voters',
  CANDIDATES: 'trustelect_candidates',
  VOTES: 'trustelect_votes',
  ELECTION: 'trustelect_election'
};

// Initialize mock data
const initializeMockData = () => {
  // Initialize admin if not exists
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify({
      username: 'admin',
      password: 'admin123',
      name: 'System Administrator'
    }));
  }

  // Initialize candidates if not exists
  if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
    const defaultCandidates = [
      {
        id: 1,
        name: 'Rahul Sharma',
        party: 'Student Council',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        votes: 0,
        symbol: '🌟'
      },
      {
        id: 2,
        name: 'Amit Patel',
        party: 'Youth Alliance',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        votes: 0,
        symbol: '🚀'
      },
      {
        id: 3,
        name: 'Saurabh Singh',
        party: 'Progress Party',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        votes: 0,
        symbol: '💪'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(defaultCandidates));
  }

  // Initialize voters if not exists
  if (!localStorage.getItem(STORAGE_KEYS.VOTERS)) {
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify([]));
  }

  // Initialize election if not exists
  if (!localStorage.getItem(STORAGE_KEYS.ELECTION)) {
    localStorage.setItem(STORAGE_KEYS.ELECTION, JSON.stringify({
      title: 'Headboy Election 2024-25',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: 'Vote for your next Headboy of DY Patil School Of Engineering And Technology, Ambi'
    }));
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeMockData();
    // Check for existing session
    const sessionUser = localStorage.getItem('trustelect_session');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  const login = async (userType, credentials) => {
    setLoading(true);
    
    if (userType === 'admin') {
      const admin = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN));
      if (admin.username === credentials.username && admin.password === credentials.password) {
        const userData = { type: 'admin', name: admin.name, username: admin.username };
        setUser(userData);
        localStorage.setItem('trustelect_session', JSON.stringify(userData));
        setLoading(false);
        return { success: true };
      }
    } else {
      // Voter login
      const voters = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTERS) || '[]');
      const voter = voters.find(v => 
        (v.voterId === credentials.voterId || v.email === credentials.email) && 
        v.password === credentials.password
      );
      
      if (voter) {
        if (voter.hasVoted) {
          setLoading(false);
          return { success: false, message: 'You have already voted!' };
        }
        const userData = { 
          type: 'voter', 
          id: voter.id, 
          name: voter.name, 
          voterId: voter.voterId,
          email: voter.email 
        };
        setUser(userData);
        localStorage.setItem('trustelect_session', JSON.stringify(userData));
        setLoading(false);
        return { success: true };
      }
    }
    
    setLoading(false);
    return { success: false, message: 'Invalid credentials!' };
  };

  const register = async (voterData) => {
    setLoading(true);
    
    // Parse name into first name and last name
    const nameParts = voterData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    
    // Use firstName + lastName as voterId and password
    const voterId = firstName + lastName;
    const password = firstName + lastName;
    
    const voters = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTERS) || '[]');
    
    // Check if email already exists
    if (voters.find(v => v.email === voterData.email)) {
      setLoading(false);
      return { success: false, message: 'Email already registered!' };
    }
    
    // Check if voterId already exists
    if (voters.find(v => v.voterId === voterId)) {
      setLoading(false);
      return { success: false, message: 'Name already registered! Please use full name.' };
    }
    
    const newVoter = {
      id: Date.now(),
      ...voterData,
      firstName,
      lastName,
      voterId,
      password,
      hasVoted: false,
      createdAt: new Date().toISOString()
    };
    
    voters.push(newVoter);
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));
    
    setLoading(false);
    return { 
      success: true, 
      voterId, 
      password,
      message: 'Registration successful! Your credentials have been sent to your email.'
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trustelect_session');
  };

  const getCandidates = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CANDIDATES) || '[]');
  };

  const getVoters = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTERS) || '[]');
  };

  const addVoter = (voterData) => {
    const voters = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTERS) || '[]');
    const voterId = 'VTR' + Date.now().toString().slice(-6);
    const password = Math.random().toString(36).slice(-6);
    
    const newVoter = {
      id: Date.now(),
      ...voterData,
      voterId,
      password,
      hasVoted: false,
      createdAt: new Date().toISOString()
    };
    
    voters.push(newVoter);
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));
    return { success: true, voterId, password };
  };

  const updateVoter = (id, updatedData) => {
    const voters = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTERS) || '[]');
    const index = voters.findIndex(v => v.id === id);
    if (index !== -1) {
      voters[index] = { ...voters[index], ...updatedData };
      localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));
      return { success: true };
    }
    return { success: false, message: 'Voter not found!' };
  };

  const removeVoter = (id) => {
    const voters = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTERS) || '[]');
    const filtered = voters.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(filtered));
    return { success: true };
  };

  const addCandidate = (candidateData) => {
    const candidates = JSON.parse(localStorage.getItem(STORAGE_KEYS.CANDIDATES) || '[]');
    const newCandidate = {
      id: Date.now(),
      ...candidateData,
      votes: 0
    };
    candidates.push(newCandidate);
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    return { success: true };
  };

  const updateCandidate = (id, updatedData) => {
    const candidates = JSON.parse(localStorage.getItem(STORAGE_KEYS.CANDIDATES) || '[]');
    const index = candidates.findIndex(c => c.id === id);
    if (index !== -1) {
      candidates[index] = { ...candidates[index], ...updatedData };
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
      return { success: true };
    }
    return { success: false, message: 'Candidate not found!' };
  };

  const removeCandidate = (id) => {
    const candidates = JSON.parse(localStorage.getItem(STORAGE_KEYS.CANDIDATES) || '[]');
    const filtered = candidates.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(filtered));
    return { success: true };
  };

  const castVote = (candidateId) => {
    if (!user || user.type !== 'voter') {
      return { success: false, message: 'Please login to vote!' };
    }

    const voters = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTERS) || '[]');
    const voterIndex = voters.findIndex(v => v.id === user.id);
    
    if (voterIndex === -1) {
      return { success: false, message: 'Voter not found!' };
    }

    if (voters[voterIndex].hasVoted) {
      return { success: false, message: 'You have already voted!' };
    }

    // Update voter as voted
    voters[voterIndex].hasVoted = true;
    voters[voterIndex].votedAt = new Date().toISOString();
    voters[voterIndex].votedFor = candidateId;
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));

    // Update candidate votes
    const candidates = JSON.parse(localStorage.getItem(STORAGE_KEYS.CANDIDATES) || '[]');
    const candidateIndex = candidates.findIndex(c => c.id === candidateId);
    if (candidateIndex !== -1) {
      candidates[candidateIndex].votes = (candidates[candidateIndex].votes || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    }

    // Record vote
    const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '[]');
    votes.push({
      id: Date.now(),
      voterId: user.voterId,
      candidateId,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));

    return { success: true, message: 'Vote cast successfully!' };
  };

  const getVoteHistory = () => {
    const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '[]');
    const voters = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTERS) || '[]');
    const candidates = JSON.parse(localStorage.getItem(STORAGE_KEYS.CANDIDATES) || '[]');

    return votes.map(vote => {
      const voter = voters.find(v => v.voterId === vote.voterId);
      const candidate = candidates.find(c => c.id === vote.candidateId);
      return {
        ...vote,
        voterName: voter?.name || 'Unknown',
        candidateName: candidate?.name || 'Unknown'
      };
    }).reverse();
  };

  const getElection = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ELECTION) || '{}');
  };

  const getTotalVotes = () => {
    const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '[]');
    return votes.length;
  };

  const getTotalVoters = () => {
    const voters = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTERS) || '[]');
    return voters.length;
  };

  const getVotedCount = () => {
    const voters = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTERS) || '[]');
    return voters.filter(v => v.hasVoted).length;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    getCandidates,
    getVoters,
    addVoter,
    updateVoter,
    removeVoter,
    addCandidate,
    updateCandidate,
    removeCandidate,
    castVote,
    getVoteHistory,
    getElection,
    getTotalVotes,
    getTotalVoters,
    getVotedCount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
