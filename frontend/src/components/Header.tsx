import React from "react";
import { NavLink } from "react-router-dom";
import { User, Settings, Bell, Search, MessageSquare } from "lucide-react";

interface HeaderProps {
  currentUser: any;
  notifications: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  notifications,
}) => {
  const navItems = [
    { id: "/", label: "Browse Skills", icon: Search },
    { id: "/profile", label: "My Profile", icon: User },
    { id: "/swaps", label: "My Swaps", icon: MessageSquare },
  ];

  if (currentUser?.isAdmin) {
    navItems.push({ id: "/admin", label: "Admin", icon: Settings });
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavLink to={"/"}>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SkillSwap
                </h1>
              </NavLink>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.id}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {currentUser?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
