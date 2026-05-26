import axios from 'axios'
import toast from 'react-hot-toast'

 
// ─── Axios Instances ──────────────────────────────────────────────────
const BASE_URL    = import.meta.env.VITE_API_URL    || 'http://localhost:5001/api'
const AI_BASE_URL =
  import.meta.env.VITE_AI_API_URL ||
  'http://localhost:5001/api'
 
 
const authHeaders = () => ({
  Authorization:
    `Bearer ${localStorage.getItem(
      "resumeiq_token"
    )}`
});
 
// Backend API instance
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
});
 
// AI Engine instance
export const aiAxios = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})
 
// ─── Interceptors ─────────────────────────────────────────────────────
const attachToken = (config) => {

  const token =
    localStorage.getItem(
      "resumeiq_token"
    );

  if (token) {

    config.headers.Authorization =
      `Bearer ${token}`;

  }

  return config;

};
 
const handleError = (error) => {
  console.log("API ERROR:", error);

  return Promise.reject(error);
}
 
api.interceptors.request.use(attachToken)
api.interceptors.response.use(res => res, handleError)
aiAxios.interceptors.request.use(attachToken)
aiAxios.interceptors.response.use(res => res, handleError)
 
// ─── Auth API ─────────────────────────────────────────────────────────
export const authAPI = {
  login:          (data)    => api.post('/auth/login', data),
  register:       (data)    => api.post('/auth/register', data),
  getMe:          (token)   => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),

  forgotPassword: (data)    => api.post('/auth/forgot-password', data),
  resetPassword:  (data)    => api.post('/auth/reset-password', data),
 changePassword: (data) =>
  api.put(
    "/users/change-password",
    data
  ),
  uploadAvatar:   (form)    => api.post('/auth/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteAccount:  ()        => api.delete('/auth/account'),
  updateSettings: (data) =>
  api.put(
    "/users/settings",
    data
  ),
}
 
// ─── Resume API ────────────────────────────────────────────────────────
export const resumeAPI = {
  uploadResume: (formData, onUploadProgress) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        const pct = Math.round((e.loaded * 100) / e.total)
        onUploadProgress?.(pct)
      },
    }),
  getAll:        ()         => api.get('/resume/list'),
  getById:       (id)       => api.get(`/resume/${id}`),
  deleteResume: (id) =>
  api.delete(`/resume/delete/${id}`),
  delete:        (id)       => api.delete(`/resume/${id}`),
  update:        (id, data) => api.put(`/resume/${id}`, data),
  download:      (id)       => api.get(`/resume/${id}/download`, { responseType: 'blob' }),
  getAnalysis:   (id)       => api.get(`/resume/${id}/analysis`),
}
 
// ─── Dashboard API ────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats:       () => api.get('/dashboard/stats'),
  getActivity:    () => api.get('/dashboard/activity'),
  getScoreHistory: () => api.get('/dashboard/score-history'),
}
 
// ─── User API ─────────────────────────────────────────────────────────
export const userAPI = {

  getProfile: () =>
    api.get("/users/profile"),

  updateProfile: (data) =>
    api.put("/users/profile", data),

  getSettings: () =>
    api.get("/users/settings"),

  updateSettings: (data) =>
    api.put("/users/settings", data),

  getActivity: () =>
    api.get("/users/activity"),

}
// ─── Admin API ────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers:       (params) => api.get('/admin/users', { params }),
  getUserById:    (id)     => api.get(`/admin/users/${id}`),
  updateUser:     (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser:     (id)     => api.delete(`/admin/users/${id}`),
  getStats:       ()       => api.get('/admin/stats'),
  getAnalytics:   ()       => api.get('/admin/analytics'),
  banUser:        (id)     => api.post(`/admin/users/${id}/ban`),
  unbanUser:      (id)     => api.post(`/admin/users/${id}/unban`),
}
 
// ─── Jobs API ─────────────────────────────────────────────────────────
export const jobsAPI = {
  getMatches:   (resumeId) => api.get(`/jobs/matches/${resumeId}`),
  search:       (params)   => api.get('/jobs/search', { params }),
  getSaved:     ()         => api.get('/jobs/saved'),
  saveJob:      (jobId)    => api.post(`/jobs/${jobId}/save`),
  unsaveJob:    (jobId)    => api.delete(`/jobs/${jobId}/save`),
}

 
// ─── Reports API ──────────────────────────────────────────────────────
export const reportsAPI = {
  getAll:     ()   => api.get('/reports'),
  getById:    (id) => api.get(`/reports/${id}`),
  generate:   (data) => api.post('/reports/generate', data),
  download:   (id) => api.get(`/reports/${id}/pdf`, { responseType: 'blob' }),
  delete:     (id) => api.delete(`/reports/${id}`),
}
 export const aiAPI = {

  getSkills: (resumeText) =>
    aiAxios.post("/analysis/skills", {
      resumeText,
    }),

  generateSummary: (experience) =>
    aiAxios.post("/analysis/summary", {
      experience,
    }),

  fullAnalysis: (resumeText, targetRole = "") =>
    aiAxios.post("/analysis/full", {
      resumeText,
      targetRole,
    }),

  // REAL AI INTERVIEW QUESTIONS
  generateInterviewQuestions:
(data) =>
api.post(
"/interview/questions",
data
),

generateInterviewFeedback:
(data) =>
api.post(
"/interview/feedback",

),

  // REAL AI FEEDBACK
  generateInterviewFeedback: (data) =>
    aiAxios.post(
      "/interview/feedback",
      data
    ),

  chatbotMessage: (message) =>
    aiAxios.post("/chatbot/message", {
      message,
    }),

};
export default api