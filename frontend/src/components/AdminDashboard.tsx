import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Download,
  Send,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { RootState, AppDispatch } from "../store";
import { fetchSwaps } from "../features/swaps/swapsSlice";
import {
  getAllUsersAdmin,
  createAdminMessage,
  getAdminMessages,
  type AdminMessage,
} from "../services/adminService";
import { banUser, unbanUser } from "../services/userService";
import api from "../features/auth/axiosConfig";
import type { User } from "../types";

export const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { swaps } = useSelector((state: RootState) => state.swaps);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState<
    "info" | "warning" | "update" | "maintenance"
  >("info");
  const [banLoading, setBanLoading] = useState<string | null>(null);
  const [messageLoading, setMessageLoading] = useState(false);
  const [recalculateLoading, setRecalculateLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsersAdmin();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await getAdminMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchSwaps());
        await fetchUsers();
        await fetchMessages();
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleBanUser = async (userId: string, isCurrentlyBanned: boolean) => {
    setBanLoading(userId);
    try {
      if (isCurrentlyBanned) {
        await unbanUser(userId);
      } else {
        await banUser(userId);
      }
      // Refresh the users list to get updated data
      await fetchUsers();
    } catch (error) {
      console.error(
        `Failed to ${isCurrentlyBanned ? "unban" : "ban"} user:`,
        error,
      );
    } finally {
      setBanLoading(null);
    }
  };

  const handleRecalculateSwapCounts = async () => {
    setRecalculateLoading(true);
    try {
      await api.post("/admin/recalculate-swap-counts");
      await fetchUsers(); // Refresh users to show updated counts
      console.log("Swap counts recalculated successfully");
    } catch (error) {
      console.error("Failed to recalculate swap counts:", error);
    } finally {
      setRecalculateLoading(false);
    }
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u && !u.isBanned).length,
    bannedUsers: users.filter((u) => u && u.isBanned).length,
    totalSwaps: swaps.length,
    pendingSwaps: swaps.filter((r) => r && r.status === "pending").length,
    completedSwaps: swaps.filter((r) => r && r.status === "completed").length,
    averageRating:
      users.length > 0
        ? users.filter((u) => u).reduce((sum, u) => sum + (u.rating || 0), 0) /
          users.filter((u) => u).length
        : 0,
  };

  const handleSendMessage = async () => {
    if (messageTitle && messageContent) {
      setMessageLoading(true);
      try {
        await createAdminMessage({
          title: messageTitle,
          content: messageContent,
          type: messageType,
        });
        setShowMessageModal(false);
        setMessageTitle("");
        setMessageContent("");
        setMessageType("info");
        // Refresh messages list
        await fetchMessages();
        // You could add a success notification here
      } catch (error) {
        console.error("Failed to send admin message:", error);
        // You could add an error notification here
      } finally {
        setMessageLoading(false);
      }
    }
  };

  const downloadReport = (type: string) => {
    let data;
    let filename;

    switch (type) {
      case "users":
        data = users.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          totalSwaps: u.totalSwaps,
          rating: u.rating,
          joinDate: u.joinDate,
          isBanned: u.isBanned,
        }));
        filename = "users-report.json";
        break;
      case "swaps":
        data = swaps;
        filename = "swaps-report.json";
        break;
      default:
        return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage users, monitor activity, and oversee platform operations
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "users", label: "Users", icon: Users },
              { id: "swaps", label: "Swaps", icon: MessageSquare },
              { id: "messages", label: "Messages", icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Swaps
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalSwaps}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Avg Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {swaps
                .filter((swap) => swap)
                .slice(0, 5)
                .map((swap) => {
                  const fromUserId =
                    typeof swap.fromUserId === "string"
                      ? swap.fromUserId
                      : swap.fromUserId?._id;
                  const toUserId =
                    typeof swap.toUserId === "string"
                      ? swap.toUserId
                      : swap.toUserId?._id;
                  const fromUser = users.find((u) => u && u._id === fromUserId);
                  const toUser = users.find((u) => u && u._id === toUserId);
                  return (
                    <div
                      key={swap._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">
                          {fromUser?.name || "Unknown"}
                        </span>{" "}
                        requested to learn{" "}
                        <span className="font-medium text-blue-600">
                          {swap.skillWanted}
                        </span>{" "}
                        from{" "}
                        <span className="font-medium">
                          {toUser?.name || "Unknown"}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          swap.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : swap.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {swap.status}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              User Management
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={handleRecalculateSwapCounts}
                disabled={recalculateLoading}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
              >
                <Download size={16} />
                <span>
                  {recalculateLoading
                    ? "Recalculating..."
                    : "Recalculate Swap Counts"}
                </span>
              </button>
              <button
                onClick={() => downloadReport("users")}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download size={16} />
                <span>Export Users</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Swaps
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users
                    .filter((user) => user)
                    .map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <Users size={14} className="text-white" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.totalSwaps}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.rating.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isBanned
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.isBanned ? "Banned" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className={`px-3 py-1 rounded text-xs transition-colors ${
                              banLoading === user._id
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : user.isBanned
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                            onClick={() => {
                              handleBanUser(user._id, user.isBanned);
                            }}
                            disabled={banLoading === user._id}
                          >
                            {banLoading === user._id
                              ? "Processing..."
                              : user.isBanned
                                ? "Unban"
                                : "Ban"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Swaps Tab */}
      {activeTab === "swaps" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Swap Management
            </h3>
            <button
              onClick={() => downloadReport("swaps")}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download size={16} />
              <span>Export Swaps</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wanted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {swaps
                    .filter((swap) => swap)
                    .map((swap) => (
                      <tr key={swap._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof swap.fromUserId === "string"
                            ? "Unknown"
                            : swap.fromUserId?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof swap.toUserId === "string"
                            ? "Unknown"
                            : swap.toUserId?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {swap.skillOffered}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {swap.skillWanted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              swap.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : swap.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : swap.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {swap.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(swap.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Admin Messages
            </h3>
            <button
              onClick={() => setShowMessageModal(true)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Send size={16} />
              <span>Send Message</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            {messages.length === 0 ? (
              <p className="text-gray-600">
                No messages sent yet. Use the button above to send your first
                admin message.
              </p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {message.title}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          message.type === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : message.type === "update"
                              ? "bg-blue-100 text-blue-800"
                              : message.type === "maintenance"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                        }`}
                      >
                        {message.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {message.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Send Admin Message
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Type
                </label>
                <select
                  value={messageType}
                  onChange={(e) =>
                    setMessageType(
                      e.target.value as
                        | "info"
                        | "warning"
                        | "update"
                        | "maintenance",
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="update">Update</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Message title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Message content"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSendMessage}
                disabled={!messageTitle || !messageContent || messageLoading}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {messageLoading ? "Sending..." : "Send Message"}
              </button>
              <button
                onClick={() => setShowMessageModal(false)}
                disabled={messageLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
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
