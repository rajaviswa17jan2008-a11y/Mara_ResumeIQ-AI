// frontend/services/resumeImprovementAPI.js

import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://mara-resumeiq-ai.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

/**
 * Analyze Resume
 */
export const analyzeResume = async (
  file,
  jobTitle = ""
) => {
  const token = localStorage.getItem("resumeiq_token");

  const formData = new FormData();

  formData.append("resume", file);

  if (jobTitle) {
    formData.append("jobTitle", jobTitle);
  }

  const response = await api.post(
    "/resume/analyze",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

/**
 * Get section suggestions
 */
export const getSectionSuggestions = async (
  section,
  content
) => {
  const token =
  localStorage.getItem("resumeiq_token");

  const response = await api.post(
    "/resume/section-suggestions",
    {
      section,
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

/**
 * ATS Score
 */
export const getATSScore = async (
  file,
  jobDescription
) => {
  const token =
  localStorage.getItem("resumeiq_token");

  const formData = new FormData();

  formData.append("resume", file);
  formData.append(
    "jobDescription",
    jobDescription
  );

  const response = await api.post(
    "/resume/ats-score",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export default api;