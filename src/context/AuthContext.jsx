import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('trustelect_token');
    const sessionUser = localStorage.getItem('trustelect_session');
    if (token && sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  const login = async (userType, credentials) => {
    try {
      let authData;
      if (userType === 'admin') {
        authData = await api.adminLogin(credentials.username, credentials.password);
      } else {
        authData = await api.voterLogin(credentials.voterId || credentials.voterIdOrEmail, credentials.password);
      }

      if (authData.hasVoted && userType === 'voter') {
        return { success: false, message: 'You have already voted!' };
      }

      const userData = {
        type: userType,
        id: authData.id,
        name: authData.name,
        username: authData.username,
        voterId: authData.voterId,
        email: authData.email,
        hasVoted: authData.hasVoted,
      };

      localStorage.setItem('trustelect_token', authData.token);
      localStorage.setItem('trustelect_session', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid credentials!' };
    }
  };

  const register = async (voterData) => {
    try {
      const result = await api.registerVoter(voterData);
      return {
        success: true,
        voterId: result.voterId,
        password: result.password,
        message: result.message || 'Registration successful!',
      };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed!' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trustelect_token');
    localStorage.removeItem('trustelect_session');
  };

  const getCandidates = async () => {
    try { return await api.getCandidates(); }
    catch { return []; }
  };

  const addCandidate = async (candidateData) => {
    try { await api.addCandidate(candidateData); return { success: true }; }
    catch (err) { return { success: false, message: err.message }; }
  };

  const updateCandidate = async (id, data) => {
    try { await api.updateCandidate(id, data); return { success: true }; }
    catch (err) { return { success: false, message: err.message }; }
  };

  const removeCandidate = async (id) => {
    try { await api.deleteCandidate(id); return { success: true }; }
    catch (err) { return { success: false, message: err.message }; }
  };

  const getElection = async () => {
    try { return await api.getCurrentElection(); }
    catch { return null; }
  };

  const createElection = async (electionData) => {
    try { await api.createElection(electionData); return { success: true }; }
    catch (err) { return { success: false, message: err.message }; }
  };

  const castVote = async (candidateId) => {
    try {
      await api.castVote(candidateId);
      const updated = { ...user, hasVoted: true };
      setUser(updated);
      localStorage.setItem('trustelect_session', JSON.stringify(updated));
      return { success: true, message: 'Vote cast successfully!' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const getVoteHistory = async () => {
    try { return await api.getVoteHistory(); }
    catch { return []; }
  };

  const getTotalVotes = async () => {
    try { const s = await api.getStats(); return s.totalVotes ?? 0; }
    catch { return 0; }
  };

  const getTotalVoters = async () => {
    try { const s = await api.getStats(); return s.totalVoters ?? 0; }
    catch { return 0; }
  };

  const getVotedCount = async () => {
    try { const s = await api.getStats(); return s.votedCount ?? 0; }
    catch { return 0; }
  };

  const getFullStats = async () => {
    try { return await api.getStats(); }
    catch { return { totalVoters: 0, votedCount: 0, remainingCount: 0, turnoutPercentage: 0, totalVotes: 0 }; }
  };

  const getVoters = async () => {
    try { return await api.getAllVoters(); }
    catch { return []; }
  };

  const addVoter = async (voterData) => {
    try {
      const result = await api.addVoterByAdmin(voterData);
      return { success: true, voterId: result.voterId, password: result.password };
    } catch (err) { return { success: false, message: err.message }; }
  };

  const updateVoter = async (id, data) => {
    try { await api.updateVoterByAdmin(id, data); return { success: true }; }
    catch (err) { return { success: false, message: err.message }; }
  };

  const removeVoter = async (id) => {
    try { await api.deleteVoterByAdmin(id); return { success: true }; }
    catch (err) { return { success: false, message: err.message }; }
  };

  const value = {
    user, loading, login, logout, register,
    getCandidates, getVoters, addVoter, updateVoter, removeVoter,
    addCandidate, updateCandidate, removeCandidate,
    castVote, getVoteHistory, getElection, createElection,
    getTotalVotes, getTotalVoters, getVotedCount, getFullStats,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
