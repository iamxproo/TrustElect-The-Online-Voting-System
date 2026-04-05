const BASE_URL = 'http://localhost:8080/api';

// ─── Helper ───────────────────────────────────────────────────────────────────
const authHeader = () => {
  const token = localStorage.getItem('trustelect_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (method, path, body = null, auth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) Object.assign(headers, authHeader());

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || data?.error || 'Request failed');
  }
  return data?.data ?? data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const adminLogin = (username, password) =>
  request('POST', '/auth/admin/login', { username, password });

export const voterLogin = (voterIdOrEmail, password) =>
  request('POST', '/auth/voter/login', { voterIdOrEmail, password });

export const registerVoter = (voterData) =>
  request('POST', '/auth/voter/register', voterData);

// ─── Candidates ───────────────────────────────────────────────────────────────
export const getCandidates = () =>
  request('GET', '/candidates');

export const addCandidate = (candidateData) =>
  request('POST', '/candidates', candidateData, true);

export const updateCandidate = (id, candidateData) =>
  request('PUT', `/candidates/${id}`, candidateData, true);

export const deleteCandidate = (id) =>
  request('DELETE', `/candidates/${id}`, null, true);

export const uploadCandidateImage = async (id, file) => {
  const token = localStorage.getItem('trustelect_token');
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/candidates/${id}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Upload failed');
  return data?.data ?? data;
};

// ─── Election ─────────────────────────────────────────────────────────────────
export const getCurrentElection = () =>
  request('GET', '/election/current');

export const createElection = (electionData) =>
  request('POST', '/election', electionData, true);

export const updateElection = (id, electionData) =>
  request('PUT', `/election/${id}`, electionData, true);

// ─── Votes ────────────────────────────────────────────────────────────────────
export const castVote = (candidateId) =>
  request('POST', '/votes', { candidateId }, true);

export const getResults = () =>
  request('GET', '/votes/results');

export const getStats = () =>
  request('GET', '/votes/stats', null, true);

export const getVoteHistory = () =>
  request('GET', '/votes/history', null, true);

// ─── Admin ────────────────────────────────────────────────────────────────────
export const getDashboardStats = () =>
  request('GET', '/admin/dashboard', null, true);

export const getAllVoters = () =>
  request('GET', '/admin/voters', null, true);

export const addVoterByAdmin = (voterData) =>
  request('POST', '/admin/voters', voterData, true);

export const updateVoterByAdmin = (id, voterData) =>
  request('PUT', `/admin/voters/${id}`, voterData, true);

export const deleteVoterByAdmin = (id) =>
  request('DELETE', `/admin/voters/${id}`, null, true);
