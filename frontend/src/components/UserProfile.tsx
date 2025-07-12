import React, { useState } from 'react';
import { User, MapPin, Calendar, Star, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

interface UserProfileProps {
  user: any;
  onUpdateUser: (user: any) => void;
  isOwnProfile: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const addSkill = (type: 'offered' | 'wanted') => {
    const newSkill = type === 'offered' ? newSkillOffered : newSkillWanted;
    if (newSkill.trim()) {
      const skillsKey = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
      setEditedUser({
        ...editedUser,
        [skillsKey]: [...editedUser[skillsKey], newSkill.trim()]
      });
      if (type === 'offered') setNewSkillOffered('');
      else setNewSkillWanted('');
    }
  };

  const removeSkill = (type: 'offered' | 'wanted', index: number) => {
    const skillsKey = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    setEditedUser({
      ...editedUser,
      [skillsKey]: editedUser[skillsKey].filter((_: any, i: number) => i !== index)
    });
  };

  const availabilityOptions = ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <div className="flex items-center space-x-4 mt-2 text-blue-100">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <Edit2 size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user.totalSwaps}</div>
              <div className="text-sm text-gray-600">Swaps Completed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star size={20} className="text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-900">{user.rating.toFixed(1)}</span>
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user.skillsOffered.length}</div>
              <div className="text-sm text-gray-600">Skills Offered</div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-8">
          {/* Basic Info */}
          {isEditing && isOwnProfile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editedUser.location || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editedUser.isPublic}
                    onChange={(e) => setEditedUser({ ...editedUser, isPublic: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Make profile public</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.isPublic ? 'Public Profile' : 'Private Profile'}
                </span>
              </div>
            </div>
          )}

          {/* Skills Offered */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Offer</h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedUser : user).skillsOffered.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <span>{skill}</span>
                    {isEditing && isOwnProfile && (
                      <button
                        onClick={() => removeSkill('offered', index)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && isOwnProfile && (
                <div className="flex space-x-2 mt-2">
                  <input
                    type="text"
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    placeholder="Add a skill you offer"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('offered')}
                  />
                  <button
                    onClick={() => addSkill('offered')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Want to Learn</h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedUser : user).skillsWanted.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                    <span>{skill}</span>
                    {isEditing && isOwnProfile && (
                      <button
                        onClick={() => removeSkill('wanted', index)}
                        className="ml-2 text-purple-500 hover:text-purple-700"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && isOwnProfile && (
                <div className="flex space-x-2 mt-2">
                  <input
                    type="text"
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    placeholder="Add a skill you want to learn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('wanted')}
                  />
                  <button
                    onClick={() => addSkill('wanted')}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
            {isEditing && isOwnProfile ? (
              <div className="space-y-2">
                {availabilityOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editedUser.availability.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditedUser({
                            ...editedUser,
                            availability: [...editedUser.availability, option]
                          });
                        } else {
                          setEditedUser({
                            ...editedUser,
                            availability: editedUser.availability.filter((a: string) => a !== option)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.availability.map((time: string, index: number) => (
                  <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                    {time}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && isOwnProfile && (
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedUser(user);
                }}
                className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};