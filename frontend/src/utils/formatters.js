export const formatDate = (date, options = {}) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", ...options });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const truncate = (str, length = 100) => str?.length > length ? `${str.slice(0, length)}...` : str;

export const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export const slugify = (str) => str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

export const scoreColor = (score) => {
  if (score >= 80) return "emerald";
  if (score >= 60) return "yellow";
  return "red";
};

export const planLabel = (plan) => ({ free: "Free", pro: "Pro", enterprise: "Enterprise" }[plan] || plan);