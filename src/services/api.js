// API Client for Digital Industrial Symbiosis (DIS) Backend
const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[DIS API] Error requesting ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // System Health
  checkHealth: () => request('/health'),

  // Organizations
  getOrganizations: () => request('/organizations'),
  getOrganization: (id) => request(`/organizations/${id}`),
  createOrganization: (org) => request('/organizations', { method: 'POST', body: JSON.stringify(org) }),
  updateOrganization: (id, updates) => request(`/organizations/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  // Waste Listings
  getListings: () => request('/listings'),
  createListing: (listing) => request('/listings', { method: 'POST', body: JSON.stringify(listing) }),
  updateListing: (id, updates) => request(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteListing: (id) => request(`/listings/${id}`, { method: 'DELETE' }),

  // Requirements
  getRequirements: () => request('/requirements'),
  createRequirement: (reqData) => request('/requirements', { method: 'POST', body: JSON.stringify(reqData) }),

  // Matches
  getMatches: () => request('/matches'),
  createMatch: (match) => request('/matches', { method: 'POST', body: JSON.stringify(match) }),
  updateMatch: (id, updates) => request(`/matches/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  // Transactions
  getTransactions: () => request('/transactions'),
  getTransaction: (id) => request(`/transactions/${id}`),
  createTransaction: (trx) => request('/transactions', { method: 'POST', body: JSON.stringify(trx) }),
  updateTransaction: (id, updates) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  // Notifications & Activity
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),
  getActivity: () => request('/activity'),

  // Platform Analytics
  getAnalytics: () => request('/analytics')
};

export default api;
