const axios = require("axios");
const { AppError } = require("../utils/errorHandler");
const { logger } = require("../utils/logger");
const { STATUS } = require("../constants/statusCodes");
const NodeCache = require("node-cache");

const tokenCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Authorization token required", STATUS.UNAUTHORIZED, "UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];
    if (!token) throw new AppError("Token missing", STATUS.UNAUTHORIZED, "TOKEN_MISSING");

    const cachedUser = tokenCache.get(token);
    if (cachedUser) {
      req.user = cachedUser;
      req.token = token;
      return next();
    }

    const response = await axios.get(`${process.env.BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    });

    if (!response.data?.user) {
      throw new AppError("Invalid token response", STATUS.UNAUTHORIZED, "INVALID_TOKEN");
    }

    tokenCache.set(token, response.data.user);
    req.user = response.data.user;
    req.token = token;
    next();
  } catch (err) {
    if (err.isOperational) return next(err);
    if (err.response?.status === 401) {
      return next(new AppError("Invalid or expired token", STATUS.UNAUTHORIZED, "TOKEN_EXPIRED"));
    }
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      logger.error("Auth service unreachable:", err.message);
      return next(new AppError("Authentication service unavailable", STATUS.SERVICE_UNAVAILABLE, "AUTH_UNAVAILABLE"));
    }
    logger.error("Auth middleware error:", err.message);
    next(new AppError("Authentication failed", STATUS.UNAUTHORIZED, "AUTH_FAILED"));
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", STATUS.UNAUTHORIZED, "UNAUTHORIZED"));
  }
  if (req.user.role !== "admin") {
    return next(new AppError("Admin privileges required", STATUS.FORBIDDEN, "FORBIDDEN"));
  }
  next();
};

const verifyPlan = (...allowedPlans) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", STATUS.UNAUTHORIZED, "UNAUTHORIZED"));
  }
  const userPlan = req.user.plan || "free";
  if (!allowedPlans.includes(userPlan)) {
    return next(
      new AppError(
        `This feature requires one of the following plans: ${allowedPlans.join(", ")}`,
        STATUS.FORBIDDEN,
        "PLAN_UPGRADE_REQUIRED"
      )
    );
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    if (!token) return next();

    const cachedUser = tokenCache.get(token);
    if (cachedUser) {
      req.user = cachedUser;
      req.token = token;
      return next();
    }

    const response = await axios.get(`${process.env.BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    });

    if (response.data?.user) {
      tokenCache.set(token, response.data.user);
      req.user = response.data.user;
      req.token = token;
    }
  } catch {
    // Silent fail — optional auth
  }
  next();
};

const verifyInternalSecret = (req, res, next) => {
  const secret = req.headers["x-internal-secret"];
  if (!secret || secret !== process.env.BACKEND_API_SECRET) {
    return next(new AppError("Invalid internal secret", STATUS.FORBIDDEN, "FORBIDDEN"));
  }
  next();
};

const invalidateToken = (token) => tokenCache.del(token);

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyPlan,
  optionalAuth,
  verifyInternalSecret,
  invalidateToken,
};