import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { RootState, AppDispatch } from "../../store";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Sparkles } from "lucide-react";

export const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error, token } = useSelector(
    (state: RootState) => state.auth,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (user && token && !hasRegistered.current) {
      toast.success("Registration successful! Welcome to SkillSwap!");
      hasRegistered.current = true;
      navigate("/");
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserPlus size={24} className="text-white" />
            </div>
            <Sparkles className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rich_black-600 via-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Join SkillSwap
          </h1>
          <p className="text-silver_lake_blue-600">
            Create your account and start exchanging skills today
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-silver_lake_blue-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-rich_black-700 mb-3">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-silver_lake_blue-500" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-rich_black-700 placeholder-silver_lake_blue-500 transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

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
                  className="w-full pl-12 pr-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-rich_black-700 placeholder-silver_lake_blue-500 transition-all duration-200"
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
                  className="w-full pl-12 pr-12 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-rich_black-700 placeholder-silver_lake_blue-500 transition-all duration-200"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-silver_lake_blue-500 hover:text-green-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-rich_black-700 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-silver_lake_blue-500" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-rich_black-700 placeholder-silver_lake_blue-500 transition-all duration-200"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-silver_lake_blue-500 hover:text-green-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gradient-to-r from-platinum-100 to-silver_lake_blue-100 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-rich_black-700 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-silver_lake_blue-600 space-y-1">
                <li className={`flex items-center space-x-2 ${password.length >= 6 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-silver_lake_blue-400'}`}></div>
                  <span>At least 6 characters long</span>
                </li>
                <li className={`flex items-center space-x-2 ${password && confirmPassword && password === confirmPassword ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${password && confirmPassword && password === confirmPassword ? 'bg-green-500' : 'bg-silver_lake_blue-400'}`}></div>
                  <span>Passwords match</span>
                </li>
              </ul>
            </div>

            {/* Error Messages */}
            {(error || passwordError) && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">{passwordError || error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={loading || !!passwordError}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-silver_lake_blue-600">
              Already have an account?{" "}
              <NavLink
                to="/auth/login"
                className="font-semibold text-green-600 hover:text-emerald-600 transition-colors"
              >
                Sign in here
              </NavLink>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <h3 className="text-sm font-semibold text-rich_black-700 mb-2">Why join SkillSwap?</h3>
          <ul className="text-xs text-silver_lake_blue-600 space-y-1">
            <li>• Connect with skilled professionals worldwide</li>
            <li>• Learn new skills through direct exchange</li>
            <li>• Build your professional network</li>
            <li>• Share your expertise and help others grow</li>
          </ul>
        </div>
      </div>
    </div>
  );
};