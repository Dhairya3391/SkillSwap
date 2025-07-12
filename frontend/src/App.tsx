import React, { useState } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Header } from "./components/Header";
import { UserProfile } from "./components/UserProfile";
import { SkillBrowser } from "./components/SkillBrowser";
import { SwapRequests } from "./components/SwapRequests";
import { AdminDashboard } from "./components/AdminDashboard";
import { Login, Register } from "./components/Auth/index.ts";
import { NotFound } from "./components/NotFound";
import { mockUsers, mockRequests, mockFeedback } from "./data/mockData";
import type { User, SwapRequest, Feedback, AdminMessage } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "./store";

// Wrapper component for dynamic user profile routing
const UserProfileWrapper: React.FC<{
  users: User[];
  currentUser: User;
  onUpdateUser: (user: User) => void;
}> = ({ users, currentUser, onUpdateUser }) => {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    // If no userId, show current user's profile
    return (
      <UserProfile
        user={currentUser}
        onUpdateUser={onUpdateUser}
        isOwnProfile={true}
      />
    );
  }

  // Find the user by ID
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isOwnProfile = user.id === currentUser.id;

  return (
    <UserProfile
      user={user}
      onUpdateUser={onUpdateUser}
      isOwnProfile={isOwnProfile}
    />
  );
};

function App() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [requests, setRequests] = useState<SwapRequest[]>(mockRequests);
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([]);

  // Get current user from Redux
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleRequestSwap = (
    fromUser: User,
    toUser: User,
    skillOffered: string,
    skillWanted: string
  ) => {
    const newRequest: SwapRequest = {
      id: Date.now().toString(),
      fromUserId: fromUser.id,
      toUserId: toUser.id,
      skillOffered,
      skillWanted,
      message: "",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRequests([...requests, newRequest]);
  };

  const handleUpdateRequest = (requestId: string, status: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId
          ? { ...r, status: status as any, updatedAt: new Date().toISOString() }
          : r
      )
    );
  };

  const handleDeleteRequest = (requestId: string) => {
    setRequests(requests.filter((r) => r.id !== requestId));
  };

  const handleSubmitFeedback = (
    swapId: string,
    rating: number,
    comment: string
  ) => {
    const request = requests.find((r) => r.id === swapId);
    if (request && currentUser) {
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        swapId,
        fromUserId: currentUser.id,
        toUserId:
          request.fromUserId === currentUser.id
            ? request.toUserId
            : request.fromUserId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };
      setFeedback([...feedback, newFeedback]);

      // Update user ratings
      const targetUserId = newFeedback.toUserId;
      const userFeedbacks = [...feedback, newFeedback].filter(
        (f) => f.toUserId === targetUserId
      );
      const averageRating =
        userFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
        userFeedbacks.length;

      setUsers(
        users.map((u) =>
          u.id === targetUserId ? { ...u, rating: averageRating } : u
        )
      );
    }
  };

  const handleBanUser = (userId: string) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isBanned: true } : u))
    );
  };

  const handleUnbanUser = (userId: string) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isBanned: false } : u))
    );
  };

  const handleSendMessage = (message: AdminMessage) => {
    setAdminMessages([...adminMessages, message]);
  };

  // Calculate notifications
  const notifications = currentUser
    ? requests.filter(
        (r) => r.toUserId === currentUser.id && r.status === "pending"
      ).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} notifications={notifications} />

      <main className="py-8">
        <Routes>
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />

          <Route
            path="/"
            element={
              currentUser ? (
                <SkillBrowser
                  users={users}
                  currentUser={currentUser}
                  onRequestSwap={handleRequestSwap}
                />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              currentUser ? (
                <UserProfile
                  user={currentUser}
                  onUpdateUser={handleUpdateUser}
                  isOwnProfile={true}
                />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route
            path="/profile/:userId"
            element={
              currentUser ? (
                <UserProfileWrapper
                  users={users}
                  currentUser={currentUser}
                  onUpdateUser={handleUpdateUser}
                />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route
            path="/swaps"
            element={
              currentUser ? (
                <SwapRequests
                  requests={requests}
                  users={users}
                  currentUser={currentUser}
                  onUpdateRequest={handleUpdateRequest}
                  onDeleteRequest={handleDeleteRequest}
                  onSubmitFeedback={handleSubmitFeedback}
                />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route
            path="/admin"
            element={
              currentUser && currentUser.isAdmin ? (
                <AdminDashboard
                  users={users}
                  requests={requests}
                  feedback={feedback}
                  onBanUser={handleBanUser}
                  onUnbanUser={handleUnbanUser}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
