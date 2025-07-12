import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Settings, Bell, Search, MessageSquare, Menu, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import type { User as UserType } from "../types";

interface HeaderProps {
  currentUser: UserType | null;
  notifications: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  notifications,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "/", label: "Browse Skills", icon: Search },
    { id: "/profile", label: "My Profile", icon: User },
    { id: "/swaps", label: "My Swaps", icon: MessageSquare },
  ];

  if (currentUser?.isAdmin) {
    navItems.push({ id: "/admin", label: "Admin", icon: Settings });
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/auth/login");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-silver_lake_blue-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to={"/"} className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yinmn_blue-600 to-oxford_blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-lg">S</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yinmn_blue-600 via-oxford_blue-600 to-rich_black-600 bg-clip-text text-transparent">
                SkillSwap
              </h1>
            </NavLink>
          </div>

          {currentUser ? (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.id}
                      to={item.id}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-500 text-white shadow-lg"
                            : "text-rich_black-600 hover:text-yinmn_blue-600 hover:bg-silver_lake_blue-100"
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Desktop User Menu */}
              <div className="hidden lg:flex items-center space-x-4">
                <button className="relative p-2 text-rich_black-600 hover:text-yinmn_blue-600 transition-colors rounded-xl hover:bg-silver_lake_blue-100">
                  <Bell size={20} />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg animate-pulse-soft">
                      {notifications}
                    </span>
                  )}
                </button>

                <div className="flex items-center space-x-3 bg-gradient-to-r from-silver_lake_blue-100 to-platinum-200 rounded-xl px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yinmn_blue-500 to-oxford_blue-600 rounded-full flex items-center justify-center shadow-md">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-rich_black-700">
                      {currentUser?.name}
                    </span>
                    {currentUser?.isAdmin && (
                      <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium rounded-full shadow-sm">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-3 py-1 bg-gradient-to-r from-rich_black-400 to-oxford_blue-500 hover:from-rich_black-500 hover:to-oxford_blue-600 text-white rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center space-x-2">
                <button className="relative p-2 text-rich_black-600 hover:text-yinmn_blue-600 transition-colors">
                  <Bell size={20} />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-rich_black-600 hover:text-yinmn_blue-600 transition-colors"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <NavLink
                to="/auth/login"
                className={({ isActive }) =>
                  `px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-500 text-white shadow-lg"
                      : "text-rich_black-600 hover:text-yinmn_blue-600 hover:bg-silver_lake_blue-100"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/auth/register"
                className={({ isActive }) =>
                  `px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                      : "bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-500 text-white hover:from-yinmn_blue-600 hover:to-oxford_blue-600 shadow-md hover:shadow-lg"
                  }`
                }
              >
                Register
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && currentUser && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-silver_lake_blue-200 shadow-xl animate-slide-up">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.id}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-500 text-white shadow-lg"
                          : "text-rich_black-600 hover:text-yinmn_blue-600 hover:bg-silver_lake_blue-100"
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              
              <div className="pt-4 border-t border-silver_lake_blue-200">
                <div className="flex items-center space-x-3 px-4 py-2 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yinmn_blue-500 to-oxford_blue-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-rich_black-700">{currentUser?.name}</div>
                    {currentUser?.isAdmin && (
                      <span className="text-xs text-purple-600 font-medium">Administrator</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-gradient-to-r from-rich_black-400 to-oxford_blue-500 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};