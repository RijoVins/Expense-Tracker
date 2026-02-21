import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowLeft, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const { login, signup, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      console.error("Full Auth error:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      
      // Handle specific Firebase error codes
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Email/Password authentication is not enabled. Please contact support.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many login attempts. Please try again later.");
      } else {
        // Show Firebase's actual error message
        setError(err.message || `Failed to ${isLogin ? "sign in" : "create account"}`);
      }
    }

    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setResetEmailSent(true);
    } catch (err) {
      console.error("Reset password error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else {
        setError("Failed to send reset email");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 -z-10"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000 -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Premium header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 mb-4 shadow-lg shadow-blue-500/50">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-500 mb-3">
            FinanceFlow
          </h1>
          <p className="text-base text-gray-300 font-light tracking-wide">
            Manage your wealth with elegance
          </p>
        </motion.div>

        {/* Premium card with glass morphism */}
        <Card className="backdrop-blur-xl bg-white/8 border border-cyan-500/30 shadow-2xl shadow-blue-500/25">
          <CardHeader className="space-y-2 pb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold text-white text-center">
                {resetPasswordMode ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-gray-300 text-center text-sm mt-2 font-light">
                {resetPasswordMode
                  ? "Enter your email to receive a password reset link"
                  : isLogin
                  ? "Access your financial dashboard"
                  : "Start your financial journey today"}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="pt-2">
            {resetPasswordMode ? (
              resetEmailSent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mail className="w-10 h-10 text-white" />
                  </motion.div>
                  <p className="text-white font-semibold mb-2">Email Sent Successfully!</p>
                  <p className="text-gray-300 text-sm mb-6">Check your inbox for the password reset link</p>
                  <Button
                    onClick={() => {
                      setResetPasswordMode(false);
                      setResetEmailSent(false);
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/50 w-full transition-all duration-300 transform hover:scale-105"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Email Address</label>
                    <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 backdrop-blur-sm border border-cyan-500/30 text-white placeholder-gray-400 pl-12 rounded-xl font-light focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 hover:bg-white/10"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-xl p-4"
                    >
                      <p className="text-red-300 text-sm font-medium">{error}</p>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => setResetPasswordMode(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold border border-cyan-500/30 rounded-xl transition-all duration-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/50 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </div>
                </form>
              )
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-yellow-500 group-focus-within:text-yellow-400 transition-colors" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 backdrop-blur-sm border border-yellow-600/30 text-white placeholder-gray-400 pl-12 rounded-xl font-light focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 hover:bg-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/5 backdrop-blur-sm border border-cyan-500/30 text-white placeholder-gray-400 pl-12 rounded-xl font-light focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 hover:bg-white/10"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white/5 backdrop-blur-sm border border-cyan-500/30 text-white placeholder-gray-400 pl-12 rounded-xl font-light focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 hover:bg-white/10"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-xl p-4"
                  >
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 font-semibold text-base rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-blue-500/50`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : isLogin ? (
                    <>
                      <LogIn className="mr-2 h-5 w-5 inline" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5 inline" />
                      Create Account
                    </>
                  )}
                </Button>

                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setResetPasswordMode(true)}
                    className="w-full text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-light mt-2"
                  >
                    Forgot your password?
                  </button>
                )}
              </form>
            )}

            {!resetPasswordMode && (
              <div className="mt-8 pt-8 border-t border-cyan-500/30">
                <p className="text-center text-gray-300 text-sm font-light mb-4">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setConfirmPassword("");
                  }}
                  className="w-full border border-cyan-500/30 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                  {isLogin ? "Create an Account" : "Sign In Instead"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <motion.p 
          className="text-center text-gray-400 text-xs mt-8 font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🔒 Your financial data is encrypted and secure
        </motion.p>
      </motion.div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}