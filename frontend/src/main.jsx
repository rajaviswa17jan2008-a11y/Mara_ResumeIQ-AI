import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ResumeProvider } from "./context/ResumeContext";
import "./styles/globals.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
  <ResumeProvider>

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
      }}
    />

    <App />

  </ResumeProvider>
</AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);