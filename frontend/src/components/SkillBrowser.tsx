import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";
import type { User } from "../types";

interface SkillBrowserProps {
  users: User[];
  currentUser: User;
  onRequestSwap: (
    fromUser: User,
    toUser: User,
    skillOffered: string,
    skillWanted: string
  ) => void;
}

export const SkillBrowser: React.FC<SkillBrowserProps> = ({
  users,
  currentUser,
  onRequestSwap,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [mySkillToOffer, setMySkillToOffer] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const filteredUsers = users.filter((user) => {
    if (user._id === currentUser._id || !user.isPublic || user.isBanned)
      return false;

    const matchesSearch =
      searchTerm === "" ||
      user.skillsOffered.some((skill: string) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
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
      onRequestSwap(currentUser, selectedUser, mySkillToOffer, selectedSkill);
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h1>
        <p className="text-gray-600">
          Find people with the skills you want to learn
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search skills, names, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="text-gray-400" size={20} />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Users</option>
              <option value="available">Available Now</option>
              <option value="highly-rated">Highly Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
      <div className="flex lg:flex-row md:flex-col gap-6 flex-wrap items-center">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 w-[30%] ring-1"
          >
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rating and Stats */}
            <div className="flex items-center space-x-4 mb-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="font-medium">{user.rating.toFixed(1)}</span>
              </div>
              <div className="text-gray-600">{user.totalSwaps} swaps</div>
            </div>

            {/* Skills Offered */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Skills Offered
              </h4>
              <div className="flex flex-wrap gap-1">
                {user.skillsOffered
                  .slice(0, 3)
                  .map((skill: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => openRequestModal(user, skill)}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-100 transition-colors"
                    >
                      {skill}
                    </button>
                  ))}
                {user.skillsOffered.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{user.skillsOffered.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Available
              </h4>
              <div className="flex flex-wrap gap-1">
                {user.availability
                  .slice(0, 2)
                  .map((time: string, index: number) => (
                    <span
                      key={index}
                      className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs"
                    >
                      {time}
                    </span>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewProfile(user)}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                View Profile
              </button>
              <button
                onClick={() => openRequestModal(user, user.skillsOffered[0])}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <MessageCircle size={14} />
                <span>Request</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Request Swap Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Request Skill Swap
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  You want to learn:{" "}
                  <span className="font-semibold text-blue-600">
                    {selectedSkill}
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill you'll offer in return
                </label>
                <select
                  value={mySkillToOffer}
                  onChange={(e) => setMySkillToOffer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a skill to offer</option>
                  {currentUser.skillsOffered.map(
                    (skill: string, index: number) => (
                      <option key={index} value={skill}>
                        {skill}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleRequestSwap}
                disabled={!mySkillToOffer}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Send Request
              </button>
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
