import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

import { authAPI } from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await authAPI.resetPassword(
        token,
        {
          password,
        }
      );

      alert(
        "Password reset successful ✅"
      );

      navigate("/login");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Password reset failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] flex items-center justify-center px-6">

      {/* Background Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-cyan-500/20 blur-[140px]" />

      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-500/20 blur-[140px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
        }}
        className="
        relative
        z-10
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-2xl
        p-8
        shadow-[0_0_80px_rgba(0,240,255,0.08)]
      "
      >
        {/* Logo + Brand */}

        <div className="flex items-center justify-center gap-3 mb-8">

          <img
            src="/logo2.png"
            alt="Mara ResumeIQ"
            className="w-16 h-16 object-contain"
          />

          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-cyan-400">
              Mara
            </span>

            <span className="text-white ml-2">
              Resume
            </span>

            <span className="text-purple-400">
              IQ
            </span>
          </h1>

        </div>

        {/* Header */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 mb-4">

            <ShieldCheck className="w-8 h-8 text-cyan-400" />

          </div>

          <h2 className="text-3xl font-black text-white">

            Reset Password

          </h2>

          <p className="text-gray-400 mt-3">

            Create a strong new password
            to secure your account.

          </p>

        </div>

        {/* Form */}

        <form
          onSubmit={submit}
          className="space-y-6"
        >

          <div>

            <label className="block text-sm text-gray-300 mb-2">

              New Password

            </label>

            <div className="relative">

              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter new password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  pl-12
                  pr-12
                  py-4
                  rounded-xl
                  bg-black/20
                  border
                  border-white/10
                  text-white
                  outline-none
                  focus:border-cyan-400
                  focus:ring-2
                  focus:ring-cyan-400/20
                  transition-all
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              >

                {showPassword ? (
                  <EyeOff
                    size={20}
                  />
                ) : (
                  <Eye
                    size={20}
                  />
                )}

              </button>

            </div>

          </div>

          {/* Password Strength */}

          <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4">

            <p className="text-xs text-cyan-300">

              Password Tips:

            </p>

            <ul className="text-xs text-gray-400 mt-2 space-y-1">

              <li>
                • Minimum 8 characters
              </li>

              <li>
                • Use uppercase letters
              </li>

              <li>
                • Include numbers
              </li>

              <li>
                • Add special characters
              </li>

            </ul>

          </div>

          {/* Button */}

          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            disabled={loading}
            type="submit"
            className="
              w-full
              py-4
              rounded-xl
              font-bold
              text-black
              bg-cyan-400
              hover:bg-cyan-300
              transition-all
              shadow-[0_0_30px_rgba(0,240,255,0.35)]
            "
          >

            {loading
              ? "Updating..."
              : "Reset Password"}

          </motion.button>

        </form>

        {/* Back Login */}

        <Link
          to="/login"
          className="
            mt-6
            flex
            items-center
            justify-center
            gap-2
            text-gray-400
            hover:text-cyan-400
            transition-colors
          "
        >

          <ArrowLeft
            className="w-4 h-4"
          />

          Back to Login

        </Link>

      </motion.div>
    </div>
  );
}