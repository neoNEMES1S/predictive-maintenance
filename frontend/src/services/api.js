import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (email, password, fullName) =>
    api.post('/api/auth/register', { email, password, full_name: fullName }),
  
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
  
  logout: () => api.post('/api/auth/logout'),
  
  getMe: () => api.get('/api/auth/me'),
}

// Upload API
export const uploadAPI = {
  upload: (file, expiryDays, onUploadProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    if (expiryDays) {
      formData.append('expiry_days', expiryDays)
    }
    return api.post('/api/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    })
  },
  
  getHistory: () => api.get('/api/upload/history'),
  
  getDetails: (uploadId) => api.get(`/api/upload/${uploadId}`),
  
  getColumns: (uploadId) => api.get(`/api/upload/${uploadId}/columns`),
  
  preview: (uploadId, rows = 10) => api.get(`/api/upload/${uploadId}/preview?rows=${rows}`),
  
  delete: (uploadId, password) =>
    api.delete(`/api/upload/${uploadId}`, { data: { upload_id: uploadId, password } }),
}

// EDA API
export const edaAPI = {
  perform: (uploadId) =>
    api.post('/api/eda/', { upload_id: uploadId }),
  
  getSummary: (uploadId) =>
    api.get(`/api/eda/${uploadId}/summary`),
  
  getCorrelations: (uploadId) =>
    api.get(`/api/eda/${uploadId}/correlations`),
  
  getOutliers: (uploadId) =>
    api.get(`/api/eda/${uploadId}/outliers`),
}

// ML API
export const mlAPI = {
  train: (uploadId, targetColumn, applySmote = true) =>
    api.post('/api/ml/train', {
      upload_id: uploadId,
      target_column: targetColumn,
      apply_smote: applySmote,
    }),
  
  predict: (uploadId, modelId, data) =>
    api.post('/api/ml/predict', { upload_id: uploadId, model_id: modelId, data }),
  
  getModels: (uploadId) => api.get(`/api/ml/${uploadId}/models`),
  
  getModelDetails: (uploadId, modelId) => api.get(`/api/ml/${uploadId}/models/${modelId}`),
}

// Anomaly API
export const anomalyAPI = {
  detect: (uploadId, method = 'isolation_forest', contamination = 0.1, eps = 0.5, minSamples = 5) =>
    api.post('/api/anomaly/', {
      upload_id: uploadId,
      method,
      contamination,
      eps,
      min_samples: minSamples,
    }),
  
  export: (uploadId, anomalyIndices) =>
    api.post('/api/anomaly/export', { upload_id: uploadId, anomaly_indices: anomalyIndices }),
  
  getResults: (uploadId) => api.get(`/api/anomaly/${uploadId}/results`),
}

// Optimization API
export const optimizationAPI = {
  optimize: (uploadId, targetColumn, goal = 'maximize', percentile = 0.1) =>
    api.post('/api/optimize/', {
      upload_id: uploadId,
      target_column: targetColumn,
      goal,
      percentile,
    }),
  
  getResults: (uploadId) => api.get(`/api/optimize/${uploadId}/results`),
}

// Report API
export const reportAPI = {
  generate: (uploadId, includeEda = true, includeMl = true, includeAnomaly = true, includeOptimization = true) =>
    api.post('/api/report/generate', {
      upload_id: uploadId,
      include_eda: includeEda,
      include_ml: includeMl,
      include_anomaly: includeAnomaly,
      include_optimization: includeOptimization,
    }),
  
  list: () => api.get('/api/report/'),
  
  getDetails: (reportId) => api.get(`/api/report/${reportId}`),
  
  download: (reportId) => api.get(`/api/report/${reportId}/download`, { responseType: 'blob' }),
}

export default api

