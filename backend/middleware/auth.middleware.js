const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../config/env");

const protect = async (
  req,
  res,
  next
) => {

  try {

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {

      token =
        req.headers.authorization.split(
          " "
        )[1];

    }

    if (!token) {

      return res.status(401).json({

        success: false,

        message:
          "Not authorized"

      });

    }

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    const user =
      await User.findById(
        decoded.id
      );

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User not found"

      });

    }

    req.user = user;

    next();

  } catch (err) {

    return res.status(401).json({

      success: false,

      message:
        "Token invalid"

    });

  }

};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route.`,
      });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  next();
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
};