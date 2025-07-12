import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Search,
  Filter,
  Star,
  MapPin,
  MessageCircle,
  Users,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";
import type { User } from "../types";
import { AppDispatch } from "../store";
import { createSwap } from "../features/swaps/swapsSlice";
import { getAllUsers } from "../services/userService";

interface SkillBrowserProps {
  currentUser: User;
}

export const SkillBrowser: React.FC<SkillBrowserProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [mySkillToOffer, setMySkillToOffer] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (user._id === currentUser._id || !user.isPublic || user.isBanned)
      return false;

    const matchesSearch =
      searchTerm === "" ||
      user.skillsOffered.some((skill: string) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "available" && user.availability.length > 0) ||
      (selectedFilter === "highly-rated" && user.rating >= 4.5);

    return matchesSearch && matchesFilter;
  });

  const handleRequestSwap = () => {
    if (selectedUser && selectedSkill && mySkillToOffer) {
      dispatch(
        createSwap({
          fromUserId: currentUser._id,
          toUserId: selectedUser._id,
          skillOffered: mySkillToOffer,
          skillWanted: selectedSkill,
          message: requestMessage,
        }),
      );
      setShowRequestModal(false);
      setSelectedUser(null);
      setSelectedSkill("");
      setMySkillToOffer("");
      setRequestMessage("");
    }
  };

  const openRequestModal = (user: User, skill: string) => {
    setSelectedUser(user);
    setSelectedSkill(skill);
    setShowRequestModal(true);
  };

  const handleViewProfile = (user: User) => {
    navigate(`/profile/${user._id}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-2 text-yinmn_blue-600">
            <div className="w-8 h-8 border-4 border-yinmn_blue-200 border-t-yinmn_blue-600 rounded-full animate-spin"></div>
            <span className="text-lg font-medium">Loading amazing skills...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center space-x-2 mb-4">
          <Sparkles className="text-yinmn_blue-600" size={32} />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-rich_black-600 via-oxford_blue-600 to-yinmn_blue-600 bg-clip-text text-transparent">
            Discover Amazing Skills
          </h1>
          <Sparkles className="text-yinmn_blue-600" size={32} />
        </div>
        <p className="text-lg sm:text-xl text-silver_lake_blue-600 max-w-2xl mx-auto leading-relaxed">
          Connect with talented individuals and exchange knowledge in a vibrant learning community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-silver_lake_blue-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-silver_lake_blue-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search skills, names, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white/90 backdrop-blur-sm text-rich_black-700 placeholder-silver_lake_blue-500 transition-all duration-200"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="text-silver_lake_blue-500" size={20} />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 sm:py-4 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white/90 backdrop-blur-sm text-rich_black-700 min-w-[160px]"
            >
              <option value="all">All Users</option>
              <option value="available">Available Now</option>
              <option value="highly-rated">Highly Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-silver_lake_blue-200 hover:border-yinmn_blue-300 hover:-translate-y-1 animate-slide-up"
          >
            {/* User Header */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-yinmn_blue-500 to-oxford_blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Users size={24} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-rich_black-700 group-hover:text-yinmn_blue-600 transition-colors">
                  {user.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-silver_lake_blue-600">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-yinmn_blue-50 to-oxford_blue-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="font-bold text-rich_black-700">{user.rating.toFixed(1)}</span>
                </div>
                <div className="text-xs text-silver_lake_blue-600">Rating</div>
              </div>
              <div className="bg-gradient-to-r from-silver_lake_blue-50 to-platinum-100 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Award size={16} className="text-yinmn_blue-600" />
                  <span className="font-bold text-rich_black-700">{user.totalSwaps}</span>
                </div>
                <div className="text-xs text-silver_lake_blue-600">Swaps</div>
              </div>
            </div>

            {/* Skills Offered */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-rich_black-700 mb-3 flex items-center space-x-2">
                <Sparkles size={16} className="text-yinmn_blue-600" />
                <span>Skills Offered</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered
                  .slice(0, 3)
                  .map((skill: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => openRequestModal(user, skill)}
                      className="bg-gradient-to-r from-yinmn_blue-100 to-oxford_blue-100 text-yinmn_blue-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:from-yinmn_blue-200 hover:to-oxford_blue-200 transition-all duration-200 hover:shadow-md"
                    >
                      {skill}
                    </button>
                  ))}
                {user.skillsOffered.length > 3 && (
                  <span className="text-xs text-silver_lake_blue-600 px-3 py-1.5 bg-platinum-200 rounded-lg">
                    +{user.skillsOffered.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-rich_black-700 mb-3 flex items-center space-x-2">
                <Clock size={16} className="text-green-600" />
                <span>Available</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.availability
                  .slice(0, 2)
                  .map((time: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium"
                    >
                      {time}
                    </span>
                  ))}
                {user.availability.length > 2 && (
                  <span className="text-xs text-silver_lake_blue-600 px-3 py-1.5 bg-platinum-200 rounded-lg">
                    +{user.availability.length - 2} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleViewProfile(user)}
                className="flex-1 px-4 py-3 border border-silver_lake_blue-300 text-silver_lake_blue-700 rounded-xl hover:bg-silver_lake_blue-50 hover:border-silver_lake_blue-400 transition-all duration-200 text-sm font-medium"
              >
                View Profile
              </button>
              <button
                onClick={() => openRequestModal(user, user.skillsOffered[0])}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 text-white rounded-xl hover:from-yinmn_blue-600 hover:to-oxford_blue-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
              >
                <MessageCircle size={16} />
                <span>Request</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-silver_lake_blue-200 to-platinum-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-silver_lake_blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-rich_black-700 mb-2">
            No users found
          </h3>
          <p className="text-silver_lake_blue-600 max-w-md mx-auto">
            Try adjusting your search terms or filters to discover more amazing skills
          </p>
        </div>
      )}

      {/* Request Swap Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-rich_black-500/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-silver_lake_blue-200 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yinmn_blue-500 to-oxford_blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-rich_black-700">
                Request Skill Swap
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yinmn_blue-50 to-oxford_blue-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-rich_black-700 mb-2">
                  You want to learn:
                </label>
                <div className="bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 text-white px-4 py-2 rounded-lg font-semibold text-center">
                  {selectedSkill}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-rich_black-700 mb-2">
                  Skill you'll offer in return
                </label>
                <select
                  value={mySkillToOffer}
                  onChange={(e) => setMySkillToOffer(e.target.value)}
                  className="w-full px-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700"
                >
                  <option value="">Select a skill to offer</option>
                  {currentUser.skillsOffered.map(
                    (skill: string, index: number) => (
                      <option key={index} value={skill}>
                        {skill}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-rich_black-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={3}
                  className="w-full px-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700 placeholder-silver_lake_blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleRequestSwap}
                disabled={!mySkillToOffer}
                className="flex-1 bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 text-white px-6 py-3 rounded-xl hover:from-yinmn_blue-600 hover:to-oxford_blue-700 disabled:from-silver_lake_blue-300 disabled:to-silver_lake_blue-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Send Request
              </button>
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-6 py-3 border border-silver_lake_blue-300 text-silver_lake_blue-700 rounded-xl hover:bg-silver_lake_blue-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};