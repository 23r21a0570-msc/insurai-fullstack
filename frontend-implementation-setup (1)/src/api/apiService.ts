// ═══════════════════════════════════════════════════════════════
// INSURAI - API Service (Connects React to Spring Boot Backend)
// ═══════════════════════════════════════════════════════════════

const API_BASE_URL = 'http://localhost:8080/api';

// ─── Get Token from LocalStorage ─────────────────────────────
const getToken = (): string | null => {
  return localStorage.getItem('insurai_token');
};

// ─── Base Fetch with Auth Headers ────────────────────────────
const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('insurai_token');
    localStorage.removeItem('insurai_user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// ═══════════════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════════════
export const authAPI = {
  login: async (email: string, password: string, role?: string) => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    
    if (response.token) {
      localStorage.setItem('insurai_token', response.token);
      localStorage.setItem('insurai_user', JSON.stringify(response.user));
    }
    
    return response;
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    department?: string;
  }) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (email: string) => {
    return apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  getCurrentUser: async () => {
    return apiFetch('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('insurai_token');
    localStorage.removeItem('insurai_user');
    window.location.href = '/login';
  },
};

// ═══════════════════════════════════════════════════════════════
// CLAIMS API
// ═══════════════════════════════════════════════════════════════
export const claimsAPI = {
  getAll: async (page = 0, size = 15, sortBy = 'submittedAt', direction = 'DESC') => {
    return apiFetch(`/claims?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
  },

  getById: async (id: string) => {
    return apiFetch(`/claims/${id}`);
  },

  getByClaimNumber: async (claimNumber: string) => {
    return apiFetch(`/claims/number/${claimNumber}`);
  },

  search: async (query: string, page = 0, size = 15) => {
    return apiFetch(`/claims/search?query=${query}&page=${page}&size=${size}`);
  },

  getByStatus: async (status: string) => {
    return apiFetch(`/claims/status/${status}`);
  },

  create: async (data: {
    policyNumber: string;
    claimantName: string;
    claimantEmail: string;
    claimantPhone: string;
    type: string;
    description: string;
    amount: number;
    incidentDate?: string;
    incidentLocation?: string;
  }) => {
    return apiFetch('/claims', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id: string, status: string, reason?: string) => {
    const params = new URLSearchParams({ status });
    if (reason) params.append('reason', reason);
    return apiFetch(`/claims/${id}/status?${params}`, { method: 'PUT' });
  },

  approve: async (id: string) => {
    return apiFetch(`/claims/${id}/approve`, { method: 'POST' });
  },

  reject: async (id: string, reason: string) => {
    return apiFetch(`/claims/${id}/reject?reason=${reason}`, { method: 'POST' });
  },

  assign: async (id: string, userId: string, userName: string) => {
    return apiFetch(`/claims/${id}/assign?userId=${userId}&userName=${userName}`, { method: 'POST' });
  },
};

// ═══════════════════════════════════════════════════════════════
// POLICIES API
// ═══════════════════════════════════════════════════════════════
export const policiesAPI = {
  getAll: async (page = 0, size = 15, sortBy = 'createdAt', direction = 'DESC') => {
    return apiFetch(`/policies?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
  },

  getById: async (id: string) => {
    return apiFetch(`/policies/${id}`);
  },

  getByPolicyNumber: async (policyNumber: string) => {
    return apiFetch(`/policies/number/${policyNumber}`);
  },

  search: async (query: string, page = 0, size = 15) => {
    return apiFetch(`/policies/search?query=${query}&page=${page}&size=${size}`);
  },

  create: async (data: {
    type: string;
    holderName: string;
    holderEmail: string;
    holderPhone?: string;
    coverageAmount: number;
    premium: number;
    deductible: number;
    startDate: string;
    endDate: string;
  }) => {
    return apiFetch('/policies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiFetch(`/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/policies/${id}`, { method: 'DELETE' });
  },
};

// ═══════════════════════════════════════════════════════════════
// ANALYTICS API
// ═══════════════════════════════════════════════════════════════
export const analyticsAPI = {
  getDashboardStats: async () => {
    return apiFetch('/analytics/dashboard-stats');
  },
};

// ═══════════════════════════════════════════════════════════════
// USERS API
// ═══════════════════════════════════════════════════════════════
export const usersAPI = {
  getAll: async () => {
    return apiFetch('/users');
  },

  getById: async (id: string) => {
    return apiFetch(`/users/${id}`);
  },

  getByRole: async (role: string) => {
    return apiFetch(`/users/role/${role}`);
  },

  getActive: async () => {
    return apiFetch('/users/active');
  },
};

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS API
// ═══════════════════════════════════════════════════════════════
export const notificationsAPI = {
  getAll: async () => {
    return apiFetch('/notifications');
  },

  getUnread: async () => {
    return apiFetch('/notifications/unread');
  },

  getUnreadCount: async () => {
    return apiFetch('/notifications/unread-count');
  },

  markAsRead: async (id: string) => {
    return apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
  },

  markAllAsRead: async () => {
    return apiFetch('/notifications/read-all', { method: 'PATCH' });
  },
};

// ═══════════════════════════════════════════════════════════════
// PAYMENTS API
// ═══════════════════════════════════════════════════════════════
export const paymentsAPI = {
  getAll: async () => {
    return apiFetch('/payments');
  },

  getByPolicy: async (policyNumber: string) => {
    return apiFetch(`/payments/policy/${policyNumber}`);
  },

  getUpcoming: async () => {
    return apiFetch('/payments/upcoming');
  },

  getOverdue: async () => {
    return apiFetch('/payments/overdue');
  },

  process: async (id: string) => {
    return apiFetch(`/payments/${id}/process`, { method: 'POST' });
  },
};

// ═══════════════════════════════════════════════════════════════
// FRAUD API
// ═══════════════════════════════════════════════════════════════
export const fraudAPI = {
  getAlerts: async () => {
    return apiFetch('/fraud/alerts');
  },

  getActiveAlerts: async () => {
    return apiFetch('/fraud/alerts/active');
  },

  getAlertsByClaimId: async (claimId: string) => {
    return apiFetch(`/fraud/alerts/claim/${claimId}`);
  },

  updateAlertStatus: async (id: string, status: string, resolvedBy?: string, notes?: string) => {
    const params = new URLSearchParams({ status });
    if (resolvedBy) params.append('resolvedBy', resolvedBy);
    if (notes) params.append('notes', notes);
    return apiFetch(`/fraud/alerts/${id}?${params}`, { method: 'PUT' });
  },
};

// ═══════════════════════════════════════════════════════════════
// POLICY RULES API
// ═══════════════════════════════════════════════════════════════
export const policyRulesAPI = {
  getAll: async () => {
    return apiFetch('/policy-rules');
  },

  getActive: async () => {
    return apiFetch('/policy-rules/active');
  },

  create: async (data: {
    name: string;
    description: string;
    threshold: number;
    action: string;
    claimType?: string;
  }) => {
    return apiFetch('/policy-rules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiFetch(`/policy-rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggle: async (id: string) => {
    return apiFetch(`/policy-rules/${id}/toggle`, { method: 'PATCH' });
  },

  delete: async (id: string) => {
    return apiFetch(`/policy-rules/${id}`, { method: 'DELETE' });
  },
};

// ═══════════════════════════════════════════════════════════════
// AUDIT LOGS API
// ═══════════════════════════════════════════════════════════════
export const auditLogsAPI = {
  getAll: async (page = 0, size = 20) => {
    return apiFetch(`/audit-logs?page=${page}&size=${size}`);
  },

  getByUser: async (userId: string) => {
    return apiFetch(`/audit-logs/user/${userId}`);
  },

  getByEntity: async (entityType: string, entityId: string) => {
    return apiFetch(`/audit-logs/entity/${entityType}/${entityId}`);
  },
};

// ═══════════════════════════════════════════════════════════════
// CUSTOMER API
// ═══════════════════════════════════════════════════════════════
export const customerAPI = {
  getDashboard: async () => {
    return apiFetch('/customer/dashboard');
  },

  getMyPolicies: async () => {
    return apiFetch('/customer/policies');
  },

  getMyClaims: async () => {
    return apiFetch('/customer/claims');
  },

  getMyPayments: async () => {
    return apiFetch('/customer/payments');
  },
};

// ═══════════════════════════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════════════════════════
export const adminAPI = {
  getSystemInfo: async () => {
    return apiFetch('/admin/system-info');
  },

  healthCheck: async () => {
    return apiFetch('/admin/health-check');
  },
};
// ═══════════════════════════════════════════════════════════════
// LANDING PAGE API (Public - No Auth Required)
// ═══════════════════════════════════════════════════════════════
export const landingAPI = {
  submitContact: async (data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message?: string;
    type: string;
  }) => {
    return apiFetch('/landing/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  subscribeNewsletter: async (email: string) => {
    return apiFetch('/landing/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  requestDemo: async (data: {
    name: string;
    email: string;
    company: string;
    phone?: string;
    preferredDate?: string;
    message?: string;
  }) => {
    return apiFetch('/landing/demo', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSubmissions: async () => {
    return apiFetch('/landing/submissions');
  },

  getSubmissionsByType: async (type: string) => {
    return apiFetch(`/landing/submissions/type/${type}`);
  },

  getNewSubmissionCount: async () => {
    return apiFetch('/landing/submissions/count');
  },
};