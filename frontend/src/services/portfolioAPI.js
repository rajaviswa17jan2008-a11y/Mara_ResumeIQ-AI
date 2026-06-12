// frontend/services/portfolioAPI.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://mara-resumeiq-ai.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});
                                
/**
 * Generate a portfolio from form data
 * @param {Object} formData - Portfolio form data (name, title, skills, projects, etc.)
 * @returns {Promise<Object>} Generated portfolio data
 */
export const generatePortfolio = async (form) => {
  const formData = new FormData();

  Object.keys(form).forEach((key) => {
    if (key === "projects") {
      formData.append(
        "projects",
        JSON.stringify(form.projects)
      );
    } else if (key === "profileImage") {
      if (form.profileImage) {
        formData.append(
          "profileImage",
          form.profileImage
        );
      }
    } else {
      formData.append(key, form[key]);
    }
  });

 const token =
localStorage.getItem(
  "resumeiq_token"
);

const response = await api.post(
  "/portfolio/generate",
  formData,
  {
    headers: {
      Authorization:
        `Bearer ${token}`,
      "Content-Type":
        "multipart/form-data",
    },
  }
);

  return response.data;
};

/**
 * Export portfolio as HTML, PDF, or ZIP
 * @param {Object} portfolioData - Portfolio data
 * @param {string} template - Template ID
 * @param {string} format - "html" | "pdf" | "zip"
 * @returns {Promise<Blob>}
 */
export const exportPortfolio = async (portfolioData, template, format = "html") => {
  const response = await api.post(
    "/portfolio/export",
    { portfolioData, template, format },
    { responseType: "blob" }
  );
  return response.data;
};

/**
 * Save portfolio draft to user account
 */
export const savePortfolioDraft = async (portfolioData, template) => {
  const response = await api.post("/portfolio/save", { portfolioData, template });
  return response.data;
};

/**
 * Get saved portfolio drafts for the current user
 */
export const getPortfolioDrafts = async () => {
  const response = await api.get("/portfolio/drafts");
  return response.data;
};

/**
 * Delete a saved draft
 */
export const deletePortfolioDraft = async (draftId) => {
  const response = await api.delete(`/portfolio/drafts/${draftId}`);
  return response.data;
};
export const exportPortfolioHTML =
async (payload) => {

  const response =
    await api.post(
      "/portfolio/export",
      payload,
      {
        responseType: "blob"
      }
    );

  return response.data;
};
export default api;