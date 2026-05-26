export const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isStrongPassword = (pw) => pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
export const isURL = (url) => { try { new URL(url); return true; } catch { return false; } };
export const isPhone = (phone) => /^\+?[\d\s\-().]{7,15}$/.test(phone);

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!email) errors.email = "Email is required";
  else if (!isEmail(email)) errors.email = "Invalid email address";
  if (!password) errors.password = "Password is required";
  return errors;
};

export const validateSignupForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!email) errors.email = "Email is required";
  else if (!isEmail(email)) errors.email = "Invalid email address";
  if (!password) errors.password = "Password is required";
  else if (!isStrongPassword(password)) errors.password = "Must be 8+ chars with uppercase and number";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
  return errors;
};