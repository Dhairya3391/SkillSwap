import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, AlertTriangle } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={48} className="text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <NavLink
              to="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home size={20} className="mr-2" />
              Back to Home
            </NavLink>

            <NavLink
              to="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Search size={20} className="mr-2" />
              Browse Skills
            </NavLink>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Try navigating through our main menu above.
          </p>
        </div>
      </div>
    </div>
  );
};
