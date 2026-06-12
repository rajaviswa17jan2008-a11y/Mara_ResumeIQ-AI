const express = require("express");

const router = express.Router();

const User = require("../models/user");
const {
  protect
} = require(
  "../middleware/auth.middleware"
);

// SAVE PROFILE
router.post(
  "/save",
  protect,
  async (req, res) => {
    try {

      const updatedUser =
        await User.findByIdAndUpdate(
          req.user._id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      res.json({
        success: true,
        user: updatedUser,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: "Profile update failed",
      });

    }
  }
);


// GET PROFILE
router.get(
  "/me",
  protect,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      res.json({
        success: true,
        user
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false
      });

    }

  }
);
module.exports = router;