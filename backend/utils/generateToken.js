const jwt =
require("jsonwebtoken");

const {
  JWT_SECRET
} = require("../config/env");

const generateToken =
(id) => {

  return jwt.sign(

    { id },

    JWT_SECRET,

    {
      expiresIn: "7d"
    }

  );

};

const sendTokenResponse =
(
  user,
  statusCode,
  res,
  message
) => {

  const token =
    generateToken(
      user._id
    );

  res.status(statusCode).json({

    success: true,

    token,

    user,

    message

  });

};

module.exports =
sendTokenResponse;