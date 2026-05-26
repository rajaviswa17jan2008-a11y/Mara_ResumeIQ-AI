const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 120,
});

// Middleware function
const cacheMiddleware = (duration = 3600) => {
  return (req, res, next) => {
    next();
  };
};

// Attach cache object to middleware
cacheMiddleware.cache = cache;

module.exports = cacheMiddleware;