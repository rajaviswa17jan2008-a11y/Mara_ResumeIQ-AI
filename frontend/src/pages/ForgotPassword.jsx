import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { authAPI } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await authAPI.forgotPassword({
        email,
      });

      setSuccess(
        res.data.message ||
          "Password reset link sent successfully."
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] flex items-center justify-center px-6">

      {/* Background Glow */}
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
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
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

        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">

          <img
            src="/logo2.png"
            alt="Mara ResumeIQ"
            className="w-16 h-16 object-contain"
          />

          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-cyan-400">Mara</span>

            <span className="text-white ml-2">
              Resume
            </span>

            <span className="text-purple-400">
              IQ
            </span>
          </h1>

        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 mb-4">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>

          <h2 className="text-3xl font-black text-white">
            Forgot Password
          </h2>

          <p className="text-gray-400 mt-3">
            Enter your email address and we'll send
            you a secure password reset link.
          </p>
        </div>

        {success && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400 text-sm">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="
                  w-full
                  pl-12
                  pr-4
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
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
              ? "Sending..."
              : "Send Reset Link"}
          </motion.button>
        </form>

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
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
}