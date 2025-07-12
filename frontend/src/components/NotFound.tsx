import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, AlertTriangle, ArrowLeft, Sparkles } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-yinmn_blue-200/30 to-oxford_blue-200/30 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-silver_lake_blue-200/30 to-platinum-200/30 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-12 border border-silver_lake_blue-200">
          {/* Icon */}
          <div className="mb-8">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-yinmn_blue-500 to-oxford_blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <AlertTriangle size={64} className="text-white" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 text-yinmn_blue-600 animate-pulse" size={24} />
              <Sparkles className="absolute -bottom-2 -left-2 text-oxford_blue-600 animate-pulse" size={20} style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Error Code */}
          <div className="mb-6">
            <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-rich_black-600 via-oxford_blue-600 to-yinmn_blue-600 bg-clip-text text-transparent mb-2">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 rounded-full mx-auto"></div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-rich_black-700 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-silver_lake_blue-600 leading-relaxed max-w-md mx-auto">
              The page you're looking for seems to have wandered off into the digital wilderness. 
              Don't worry, we'll help you find your way back to amazing skills!
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <NavLink
              to="/"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 text-white font-semibold rounded-xl hover:from-yinmn_blue-600 hover:to-oxford_blue-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <Home size={20} className="mr-3 group-hover:scale-110 transition-transform" />
              <span>Back to Home</span>
            </NavLink>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <NavLink
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-silver_lake_blue-300 text-silver_lake_blue-700 font-medium rounded-xl hover:bg-silver_lake_blue-50 hover:border-silver_lake_blue-400 transition-all duration-200 group"
              >
                <Search size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                <span>Browse Skills</span>
              </NavLink>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-platinum-300 text-rich_black-600 font-medium rounded-xl hover:bg-platinum-100 hover:border-platinum-400 transition-all duration-200 group"
              >
                <ArrowLeft size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-silver_lake_blue-600 bg-gradient-to-r from-platinum-100 to-silver_lake_blue-100 rounded-xl px-6 py-3 border border-silver_lake_blue-200">
            <strong>Lost?</strong> Try using the navigation menu above or search for specific skills you're interested in.
          </p>
        </div>

        {/* Fun Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gradient-to-r from-yinmn_blue-50 to-oxford_blue-50 rounded-xl p-3 border border-yinmn_blue-200">
            <div className="text-lg font-bold text-yinmn_blue-700">∞</div>
            <div className="text-xs text-yinmn_blue-600">Skills to Learn</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
            <div className="text-lg font-bold text-green-700">24/7</div>
            <div className="text-xs text-green-600">Available</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200">
            <div className="text-lg font-bold text-purple-700">100%</div>
            <div className="text-xs text-purple-600">Free</div>
          </div>
        </div>
      </div>
    </div>
  );
};