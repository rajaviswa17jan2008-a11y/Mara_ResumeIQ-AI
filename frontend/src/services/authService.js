import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://mara-resumeiq-ai.onrender.com";

export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    {
      email,
      password,
    }
  );

  if (response.data.token) {
    localStorage.setItem(
      "token",
      response.data.token
    );
  }

  return response.data;
};