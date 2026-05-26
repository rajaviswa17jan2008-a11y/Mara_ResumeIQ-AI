const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE, JWT_COOKIE_EXPIRE, NODE_ENV } = require("../config/env");
 
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};
 
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  const token = generateToken(user._id);
 
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
  };
 
  // Remove sensitive fields
  user.password = undefined;
  user.otp = undefined;
  user.resetPasswordToken = undefined;
 
  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      data: { user },
    });
};
 
module.exports = { generateToken, sendTokenResponse };
 