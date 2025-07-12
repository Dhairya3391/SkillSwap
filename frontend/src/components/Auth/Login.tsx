import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { RootState, AppDispatch } from "../../store";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles } from "lucide-react";

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error, token } = useSelector(
    (state: RootState) => state.auth,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const hasLoggedIn = useRef(false);

  useEffect(() => {
    if (user && token && !hasLoggedIn.current) {
      hasLoggedIn.current = true;
      // Redirect admin users to admin dashboard, regular users to home
      if (user.isAdmin) {
        toast.success("Login successful! Welcome to Admin Dashboard.");
        navigate("/admin");
      } else {
        toast.success("Login successful!");
        navigate("/");
      }
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yinmn_blue-500 to-oxford_blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LogIn size={24} className="text-white" />
            </div>
            <Sparkles className="text-yinmn_blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rich_black-600 via-oxford_blue-600 to-yinmn_blue-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-silver_lake_blue-600">
            Sign in to continue your skill exchange journey
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-silver_lake_blue-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-rich_black-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-silver_lake_blue-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700 placeholder-silver_lake_blue-500 transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-rich_black-700 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-silver_lake_blue-500" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700 placeholder-silver_lake_blue-500 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-silver_lake_blue-500 hover:text-yinmn_blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 text-white py-3 rounded-xl hover:from-yinmn_blue-600 hover:to-oxford_blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-silver_lake_blue-600">
              Don't have an account?{" "}
              <NavLink
                to="/auth/register"
                className="font-semibold text-yinmn_blue-600 hover:text-oxford_blue-600 transition-colors"
              >
                Create one here
              </NavLink>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-gradient-to-r from-platinum-100 to-silver_lake_blue-100 rounded-xl p-4 border border-silver_lake_blue-200">
          <h3 className="text-sm font-semibold text-rich_black-700 mb-2">Demo Credentials</h3>
          <div className="text-xs text-silver_lake_blue-600 space-y-1">
            <p><strong>Admin:</strong> admin@skillswap.com / admin123</p>
            <p><strong>User:</strong> user@skillswap.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};