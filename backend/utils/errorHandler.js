class AppError extends Error {

  constructor(message, statusCode = 500, code = "SERVER_ERROR") {

    super(message);

    this.statusCode = statusCode;

    this.code = code;

  }

}

const errorHandler = (err, req, res, next) => {

  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "SERVER_ERROR",
  });

};

module.exports = {
  AppError,
  errorHandler,
};