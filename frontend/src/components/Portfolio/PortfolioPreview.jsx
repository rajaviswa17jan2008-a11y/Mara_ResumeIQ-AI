// frontend/components/Portfolio/PortfolioPreview.jsx
import React from "react";
import { motion } from "framer-motion";
import CyberpunkTemplate from "../../templates/CyberpunkTemplate";
import GlassmorphismTemplate from "../../templates/GlassmorphismTemplate";
import MinimalTemplate from "../../templates/MinimalTemplate";
import FuturisticTemplate from "../../templates/FuturisticTemplate";

const templateMap = {
  cyberpunk: CyberpunkTemplate,
  glassmorphism: GlassmorphismTemplate,
  minimal: MinimalTemplate,
  futuristic: FuturisticTemplate,
};

export default function PortfolioPreview({ data = {}, template = "cyberpunk" }) {
  const Template = templateMap[template] || CyberpunkTemplate;
  return (
    <motion.div
  id="portfolio-preview"
      key={template}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl overflow-hidden border border-white/5"
      style={{ boxShadow: "0 0 60px #00f0ff08" }}
    >
      <Template data={data} />
    </motion.div>
  );
}