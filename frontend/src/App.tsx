import React, { useEffect } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Header } from "./components/Header";
import { UserProfile } from "./components/UserProfile";
import { SkillBrowser } from "./components/SkillBrowser";
import { SwapRequests } from "./components/SwapRequests";
import { AdminDashboard } from "./components/AdminDashboard";
import { Login, Register } from "./components/Auth/index.ts";
import { NotFound } from "./components/NotFound";
import type { User } from "./types";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { fetchCurrentUser } from "./features/auth/authSlice";

// Wrapper component for dynamic user profile routing
const UserProfileWrapper: React.FC<{
  currentUser: User;
}> = ({ currentUser }) => {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    // If no userId, show current user's profile
    return <UserProfile user={currentUser} isOwnProfile={true} />;
  }

  // For now, we'll redirect to the main profile page
  // In a real app, you'd fetch the specific user data
  return <Navigate to="/profile" replace />;
};

function App() {
  const dispatch = useDispatch<AppDispatch>();

  // Get current user from Redux
  const { user: currentUser, loading: authLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  // Fetch current user on app load if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, currentUser]);

  // Calculate notifications from Redux swaps state
  const swaps = useSelector((state: RootState) => state.swaps.swaps);
  const notifications = currentUser
    ? swaps.filter((swap) => {
        const toUserId =
          typeof swap.toUserId === "string" ? swap.toUserId : swap.toUserId._id;
        return toUserId === currentUser._id && swap.status === "pending";
      }).length
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
              authLoading ? (
                <div className="flex justify-center items-center h-40 text-lg">
                  Loading...
                </div>
              ) : currentUser ? (
                <SkillBrowser currentUser={currentUser} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              authLoading ? (
                <div className="flex justify-center items-center h-40 text-lg">
                  Loading...
                </div>
              ) : currentUser ? (
                <UserProfile user={currentUser} isOwnProfile={true} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route
            path="/profile/:userId"
            element={
              authLoading ? (
                <div className="flex justify-center items-center h-40 text-lg">
                  Loading...
                </div>
              ) : currentUser ? (
                <UserProfileWrapper currentUser={currentUser} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route
            path="/swaps"
            element={
              currentUser ? (
                <SwapRequests currentUser={currentUser} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route
            path="/admin"
            element={
              currentUser && currentUser.isAdmin ? (
                <AdminDashboard />
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
