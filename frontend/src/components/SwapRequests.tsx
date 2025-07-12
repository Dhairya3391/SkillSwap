import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchSwaps,
  createSwap,
  updateSwap,
  deleteSwap,
} from "../features/swaps/swapsSlice";
import { User } from "../types";
import { getAllUsers } from "../services/userService";
import {
  MessageSquare,
  Plus,
  Check,
  X,
  Trash2,
  Clock,
  User as UserIcon,
  Send,
  Filter,
  Search,
  Calendar,
  Award,
  AlertCircle,
} from "lucide-react";

interface SwapRequestsProps {
  currentUser: User;
}

export const SwapRequests: React.FC<SwapRequestsProps> = ({ currentUser }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swaps, loading, error } = useSelector(
    (state: RootState) => state.swaps,
  );
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    toUserId: "",
    skillOffered: "",
    skillWanted: "",
    message: "",
  });

  useEffect(() => {
    dispatch(fetchSwaps());
    // Fetch users for the form
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createSwap(form));
    setShowForm(false);
    setForm({ toUserId: "", skillOffered: "", skillWanted: "", message: "" });
  };

  const handleUpdate = (id: string, status: string) => {
    dispatch(updateSwap({ id, status }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteSwap(id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
      case "completed":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      default:
        return "bg-gradient-to-r from-silver_lake_blue-100 to-platinum-100 text-silver_lake_blue-800 border-silver_lake_blue-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "accepted":
        return <Check size={16} />;
      case "rejected":
        return <X size={16} />;
      case "completed":
        return <Award size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const filteredSwaps = swaps.filter((swap) => {
    if (!swap) return false;
    
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "sent" && swap.fromUserId?._id === currentUser._id) ||
      (activeTab === "received" && swap.toUserId?._id === currentUser._id) ||
      (activeTab === "pending" && swap.status === "pending");

    const matchesSearch = 
      searchTerm === "" ||
      swap.skillOffered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.skillWanted.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: "all", label: "All Swaps", count: swaps.length },
    { id: "sent", label: "Sent", count: swaps.filter(s => s?.fromUserId?._id === currentUser._id).length },
    { id: "received", label: "Received", count: swaps.filter(s => s?.toUserId?._id === currentUser._id).length },
    { id: "pending", label: "Pending", count: swaps.filter(s => s?.status === "pending").length },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yinmn_blue-500 to-oxford_blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare size={24} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rich_black-600 via-oxford_blue-600 to-yinmn_blue-600 bg-clip-text text-transparent mb-2">
          My Swap Requests
        </h1>
        <p className="text-silver_lake_blue-600 max-w-2xl mx-auto">
          Manage your skill exchange requests and track your learning journey
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-silver_lake_blue-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver_lake_blue-500" size={20} />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700"
              />
            </div>
          </div>
          
          <button
            className="bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 text-white px-6 py-2 rounded-xl hover:from-yinmn_blue-600 hover:to-oxford_blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={20} />
            <span>{showForm ? "Cancel" : "New Request"}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 text-white shadow-lg"
                  : "bg-silver_lake_blue-100 text-silver_lake_blue-700 hover:bg-silver_lake_blue-200"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? "bg-white/20" : "bg-silver_lake_blue-200"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-silver_lake_blue-200 p-6 mb-6 animate-slide-up">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Plus size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-rich_black-700">Create New Swap Request</h3>
          </div>
          
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-rich_black-700 mb-3">
                  Select User
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver_lake_blue-500" size={20} />
                  <select
                    name="toUserId"
                    value={form.toUserId}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700"
                    required
                  >
                    <option value="">Choose a user to swap with</option>
                    {users
                      .filter((u) => u._id !== currentUser._id)
                      .map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-rich_black-700 mb-3">
                  Skill You'll Offer
                </label>
                <input
                  name="skillOffered"
                  value={form.skillOffered}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700"
                  placeholder="What skill will you teach?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-rich_black-700 mb-3">
                  Skill You Want
                </label>
                <input
                  name="skillWanted"
                  value={form.skillWanted}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700"
                  placeholder="What skill do you want to learn?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-rich_black-700 mb-3">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-silver_lake_blue-300 rounded-xl focus:ring-2 focus:ring-yinmn_blue-500 focus:border-yinmn_blue-500 bg-white text-rich_black-700"
                  placeholder="Add a personal message..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Send size={20} />
              <span>Send Request</span>
            </button>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-2 text-yinmn_blue-600">
            <div className="w-8 h-8 border-4 border-yinmn_blue-200 border-t-yinmn_blue-600 rounded-full animate-spin"></div>
            <span className="text-lg font-medium">Loading requests...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Swap Requests List */}
      <div className="space-y-4">
        {filteredSwaps.length === 0 && !loading ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-silver_lake_blue-200 to-platinum-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={32} className="text-silver_lake_blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-rich_black-700 mb-2">
              No swap requests found
            </h3>
            <p className="text-silver_lake_blue-600 max-w-md mx-auto mb-6">
              {activeTab === "all" 
                ? "You haven't created or received any swap requests yet. Start by creating your first request!"
                : `No ${activeTab} requests found. Try adjusting your filters.`}
            </p>
            {activeTab === "all" && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-yinmn_blue-500 to-oxford_blue-600 text-white px-6 py-3 rounded-xl hover:from-yinmn_blue-600 hover:to-oxford_blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Create Your First Request
              </button>
            )}
          </div>
        ) : (
          filteredSwaps.map((swap) => (
            <div
              key={swap._id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-silver_lake_blue-200 hover:border-yinmn_blue-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yinmn_blue-500 to-oxford_blue-600 rounded-xl flex items-center justify-center">
                        <MessageSquare size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-rich_black-700">
                          {typeof swap.fromUserId === 'object' ? swap.fromUserId?.name : "Unknown"} → {typeof swap.toUserId === 'object' ? swap.toUserId?.name : "Unknown"}
                        </div>
                        <div className="text-sm text-silver_lake_blue-600 flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{new Date(swap.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-sm font-medium border ${getStatusColor(swap.status)}`}>
                      {getStatusIcon(swap.status)}
                      <span className="capitalize">{swap.status}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                      <div className="text-sm font-semibold text-green-800 mb-1">Offering</div>
                      <div className="text-green-700 font-medium">{swap.skillOffered}</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                      <div className="text-sm font-semibold text-blue-800 mb-1">Wanting</div>
                      <div className="text-blue-700 font-medium">{swap.skillWanted}</div>
                    </div>
                  </div>

                  {/* Message */}
                  {swap.message && (
                    <div className="bg-gradient-to-r from-platinum-100 to-silver_lake_blue-100 rounded-xl p-4">
                      <div className="text-sm font-semibold text-rich_black-700 mb-1">Message</div>
                      <div className="text-silver_lake_blue-700">{swap.message}</div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:ml-6">
                  {swap.toUserId?._id === currentUser._id && swap.status === "pending" && (
                    <>
                      <button
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        onClick={() => handleUpdate(swap._id, "accepted")}
                      >
                        <Check size={16} />
                        <span>Accept</span>
                      </button>
                      <button
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        onClick={() => handleUpdate(swap._id, "rejected")}
                      >
                        <X size={16} />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                  {(swap.fromUserId?._id === currentUser._id || swap.toUserId?._id === currentUser._id) && (
                    <button
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-silver_lake_blue-400 to-silver_lake_blue-500 text-white px-4 py-2 rounded-xl hover:from-silver_lake_blue-500 hover:to-silver_lake_blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                      onClick={() => handleDelete(swap._id)}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};