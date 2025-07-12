import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Calendar,
  Star,
  Edit2,
  Save,
  X,
  Plus,
  Loader2,
  Award,
  Clock,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { updateUserProfile } from "../features/auth/authSlice";
import type { User as UserType } from "../types";

interface UserProfileProps {
  user: UserType;
  onUpdateUser?: (user: UserType) => void;
  isOwnProfile: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onUpdateUser,
  isOwnProfile,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");

  // Update editedUser when user prop changes
  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSave = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      await dispatch(
        updateUserProfile({
          userId,
          userData: editedUser,
        }),
      ).unwrap();

      setIsEditing(false);
      if (onUpdateUser) {
        onUpdateUser(editedUser);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const addSkill = (type: "offered" | "wanted") => {
    const newSkill = type === "offered" ? newSkillOffered : newSkillWanted;
    if (newSkill.trim()) {
      const skillsKey = type === "offered" ? "skillsOffered" : "skillsWanted";
      setEditedUser({
        ...editedUser,
        [skillsKey]: [...editedUser[skillsKey], newSkill.trim()],
      });
      if (type === "offered") setNewSkillOffered("");
      else setNewSkillWanted("");
    }
  };

  const removeSkill = (type: "offered" | "wanted", index: number) => {
    const skillsKey = type === "offered" ? "skillsOffered" : "skillsWanted";
    setEditedUser({
      ...editedUser,
      [skillsKey]: editedUser[skillsKey].filter(
        (_: string, i: number) => i !== index,
      ),
    });
  };

  const availabilityOptions = [
    "Weekdays",
    "Weekends",
    "Evenings",
    "Mornings",
    "Flexible",
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-silver_lake_blue-200">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="animate-spin h-12 w-12 text-yinmn_blue-500 mx-auto mb-4" />
              <span className="text-lg text-silver_lake_blue-600">Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-silver_lake_blue-200">
        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <X size={20} />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-br from-yinmn_blue-500 via-oxford_blue-600 to-rich_black-600 px-6 sm:px-8 py-8 sm:py-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                    <User size={32} className="sm:w-10 sm:h-10" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{user.name}</h1>
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-white/90">
                    {user.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Edit2 size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 sm:px-8 py-6 border-b border-silver_lake_blue-200 bg-gradient-to-r from-platinum-100 to-silver_lake_blue-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Award className="text-yinmn_blue-600" size={24} />
                <span className="text-2xl sm:text-3xl font-bold text-rich_black-700">
                  {user.totalSwaps}
                </span>
              </div>
              <div className="text-sm font-medium text-silver_lake_blue-600">Swaps Completed</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star size={24} className="text-yellow-500 fill-current" />
                <span className="text-2xl sm:text-3xl font-bold text-rich_black-700">
                  {user.rating.toFixed(1)}
                </span>
              </div>
              <div className="text-sm font-medium text-silver_lake_blue-600">Average Rating</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="text-purple-600" size={24} />
                <span className="text-2xl sm:text-3xl font-bold text-rich_black-700">
                  {user.skillsOffered.length}
                </span>
              </div>
              <div className="text-sm font-medium text-silver_lake_blue-600">Skills Offered</div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Basic Info */}
          {isEditing && isOwnProfile ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-rich_black-700 mb-3">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-rich_black-700 mb-3">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editedUser.location || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, location: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700"
                    placeholder="Enter your location"
                  />
                </div>
              </div>
              <div className="bg-gradient-to-r from-yinmn_blue-50 to-oxford_blue-50 rounded-xl p-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={editedUser.isPublic}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        isPublic: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-silver_lake_blue-300 text-yinmn_blue-600 focus:ring-yinmn_blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    {editedUser.isPublic ? (
                      <Eye size={20} className="text-green-600" />
                    ) : (
                      <EyeOff size={20} className="text-silver_lake_blue-600" />
                    )}
                    <span className="text-sm font-semibold text-rich_black-700">
                      Make profile public
                    </span>
                  </div>
                </label>
                <p className="text-xs text-silver_lake_blue-600 mt-2 ml-8">
                  Public profiles can be discovered by other users
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gradient-to-r from-platinum-100 to-silver_lake_blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                {user.isPublic ? (
                  <Eye className="text-green-600" size={20} />
                ) : (
                  <EyeOff className="text-silver_lake_blue-600" size={20} />
                )}
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                    user.isPublic
                      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                      : "bg-gradient-to-r from-silver_lake_blue-100 to-silver_lake_blue-200 text-silver_lake_blue-800"
                  }`}
                >
                  {user.isPublic ? "Public Profile" : "Private Profile"}
                </span>
              </div>
            </div>
          )}

          {/* Skills Offered */}
          <div className="bg-gradient-to-r from-yinmn_blue-50 to-oxford_blue-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-rich_black-700 mb-6 flex items-center space-x-2">
              <Sparkles className="text-yinmn_blue-600" size={24} />
              <span>Skills I Offer</span>
            </h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {(isEditing ? editedUser : user).skillsOffered.map(
                  (skill: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center bg-gradient-to-r from-yinmn_blue-100 to-oxford_blue-100 text-yinmn_blue-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
                    >
                      <span>{skill}</span>
                      {isEditing && isOwnProfile && (
                        <button
                          onClick={() => removeSkill("offered", index)}
                          className="ml-3 text-yinmn_blue-500 hover:text-yinmn_blue-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ),
                )}
              </div>
              {isEditing && isOwnProfile && (
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    placeholder="Add a skill you offer"
                    className="flex-1 px-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700"
                    onKeyPress={(e) => e.key === "Enter" && addSkill("offered")}
                  />
                  <button
                    onClick={() => addSkill("offered")}
                    className="bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 text-white px-6 py-3 rounded-xl hover:from-yinmn_blue-600 hover:to-oxford_blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-rich_black-700 mb-6 flex items-center space-x-2">
              <Star className="text-purple-600" size={24} />
              <span>Skills I Want to Learn</span>
            </h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {(isEditing ? editedUser : user).skillsWanted.map(
                  (skill: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
                    >
                      <span>{skill}</span>
                      {isEditing && isOwnProfile && (
                        <button
                          onClick={() => removeSkill("wanted", index)}
                          className="ml-3 text-purple-500 hover:text-purple-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ),
                )}
              </div>
              {isEditing && isOwnProfile && (
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    placeholder="Add a skill you want to learn"
                    className="flex-1 px-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-rich_black-700"
                    onKeyPress={(e) => e.key === "Enter" && addSkill("wanted")}
                  />
                  <button
                    onClick={() => addSkill("wanted")}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-rich_black-700 mb-6 flex items-center space-x-2">
              <Clock className="text-green-600" size={24} />
              <span>Availability</span>
            </h3>
            {isEditing && isOwnProfile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availabilityOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-3 bg-white/80 rounded-lg p-3 cursor-pointer hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={editedUser.availability.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditedUser({
                            ...editedUser,
                            availability: [...editedUser.availability, option],
                          });
                        } else {
                          setEditedUser({
                            ...editedUser,
                            availability: editedUser.availability.filter(
                              (a: string) => a !== option,
                            ),
                          });
                        }
                      }}
                      className="w-4 h-4 rounded border-silver_lake_blue-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-rich_black-700">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {user.availability.map((time: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
                  >
                    {time}
                  </span>
                ))}
                {user.availability.length === 0 && (
                  <span className="text-silver_lake_blue-600 italic">No availability set</span>
                )}
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && isOwnProfile && (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-silver_lake_blue-200">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 text-white px-6 py-3 rounded-xl hover:from-yinmn_blue-600 hover:to-oxford_blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Save size={20} />
                )}
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedUser(user);
                }}
                disabled={loading}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-silver_lake_blue-400 to-silver_lake_blue-500 text-white px-6 py-3 rounded-xl hover:from-silver_lake_blue-500 hover:to-silver_lake_blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};