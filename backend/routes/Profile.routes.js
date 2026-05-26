const express = require("express");

const router = express.Router();

const User = require("../models/user");


// SAVE PROFILE
router.post(
  "/save",

  async (req, res) => {

    try {

      const {
        email,
        ...updateData
      } = req.body;

      const updatedUser =
        await User.findOneAndUpdate(

          { email },

          updateData,

          {
            new: true,
            runValidators: true,
          }

        );

      if (!updatedUser) {

        return res.status(404).json({

          success: false,

          message: "User not found",

        });

      }

      res.json({

        success: true,

        user: updatedUser,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Profile update failed",

      });

    }

  }

);


// GET PROFILE
router.get(
  "/me",

  async (req, res) => {

    try {

      const email =
        req.query.email;

      if (!email) {

        return res.status(400)
        .json({

          success: false,

          message:
            "Email required"

        });

      }

      const user =
        await User.findOne({
          email
        });

      if (!user) {

        return res.status(404)
        .json({

          success: false,

          message:
            "User not found"

        });

      }

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