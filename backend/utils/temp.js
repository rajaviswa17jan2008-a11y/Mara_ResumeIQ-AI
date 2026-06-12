const success = (res, data, statusCode = 200, meta = {}) => {
  res.status(statusCode).json({
    success: true,
    timestamp: new Date().toISOString(),
    ...(Object.keys(meta).length > 0 && { meta }),
    data,
  });
};

const error = (res, message, statusCode = 500, code = "INTERNAL_ERROR") => {
  res.status(statusCode).json({
    success: false,
    timestamp: new Date().toISOString(),
    message,
    code,
  });
};

const paginated = (res, data, page, limit, total) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data,
  });
};

module.exports = { success, error, paginated };