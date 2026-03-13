import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('relay_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('relay_token')
        localStorage.removeItem('relay_user')
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ---- Auth ----
export const authApi = {
  googleLogin: () => `${API_URL}/api/auth/google`,
  demoLogin: () => api.post('/demo/login'),
  me: () => api.get('/users/me'),
}

// ---- Today View ----
export const todayApi = {
  get: () => api.get('/today'),
}

// ---- Deals ----
export const dealsApi = {
  list: () => api.get('/deals'),
  get: (id: string) => api.get(`/deals/${id}`),
  update: (id: string, data: unknown) => api.patch(`/deals/${id}`, data),
  create: (data: unknown) => api.post('/deals', data),
}

// ---- Contacts ----
export const contactsApi = {
  list: () => api.get('/contacts'),
  get: (id: string) => api.get(`/contacts/${id}`),
  create: (data: unknown) => api.post('/contacts', data),
  update: (id: string, data: unknown) => api.patch(`/contacts/${id}`, data),
}

// ---- Pending Actions ----
export const pendingApi = {
  list: () => api.get('/pending'),
  approve: (id: string) => api.post(`/pending/${id}/approve`),
  reject: (id: string) => api.post(`/pending/${id}/reject`),
}

// ---- Integrations ----
export const integrationsApi = {
  list: () => api.get('/integrations'),
  connect: (provider: string) => api.post(`/integrations/${provider}/connect`),
  disconnect: (provider: string) => api.delete(`/integrations/${provider}`),
}

// ---- Email Digest ----
export const emailApi = {
  digest: () => api.get('/gmail/digest'),
}

// ---- Demo ----
export const demoApi = {
  login: () => api.post('/demo/login'),
  today: () => api.get('/demo/today'),
  pipeline: () => api.get('/demo/pipeline'),
  contacts: () => api.get('/demo/contacts'),
  pending: () => api.get('/demo/pending'),
}
