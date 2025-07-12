import React, { useState } from 'react';
import { Header } from './components/Header';
import { UserProfile } from './components/UserProfile';
import { SkillBrowser } from './components/SkillBrowser';
import { SwapRequests } from './components/SwapRequests';
import { AdminDashboard } from './components/AdminDashboard';
import { mockUsers, mockRequests, mockFeedback } from './data/mockData';
import type { User, SwapRequest, Feedback, AdminMessage } from './types';

function App() {
  const [currentView, setCurrentView] = useState('browse');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [requests, setRequests] = useState<SwapRequest[]>(mockRequests);
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([]);

  // Current user (first user in mock data)
  const currentUser = users[0];

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleRequestSwap = (fromUser: User, toUser: User, skillOffered: string, skillWanted: string) => {
    const newRequest: SwapRequest = {
      id: Date.now().toString(),
      fromUserId: fromUser.id,
      toUserId: toUser.id,
      skillOffered,
      skillWanted,
      message: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRequests([...requests, newRequest]);
  };

  const handleUpdateRequest = (requestId: string, status: string) => {
    setRequests(requests.map(r => 
      r.id === requestId 
        ? { ...r, status: status as any, updatedAt: new Date().toISOString() }
        : r
    ));
  };

  const handleDeleteRequest = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
  };

  const handleSubmitFeedback = (swapId: string, rating: number, comment: string) => {
    const request = requests.find(r => r.id === swapId);
    if (request) {
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        swapId,
        fromUserId: currentUser.id,
        toUserId: request.fromUserId === currentUser.id ? request.toUserId : request.fromUserId,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      setFeedback([...feedback, newFeedback]);

      // Update user ratings
      const targetUserId = newFeedback.toUserId;
      const userFeedbacks = [...feedback, newFeedback].filter(f => f.toUserId === targetUserId);
      const averageRating = userFeedbacks.reduce((sum, f) => sum + f.rating, 0) / userFeedbacks.length;
      
      setUsers(users.map(u => 
        u.id === targetUserId 
          ? { ...u, rating: averageRating }
          : u
      ));
    }
  };

  const handleBanUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isBanned: true } : u));
  };

  const handleUnbanUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isBanned: false } : u));
  };

  const handleSendMessage = (message: AdminMessage) => {
    setAdminMessages([...adminMessages, message]);
  };

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setCurrentView('profile');
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (view === 'profile' && !selectedUser) {
      setSelectedUser(currentUser);
    }
  };

  // Calculate notifications
  const notifications = requests.filter(r => 
    r.toUserId === currentUser.id && r.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser}
        currentView={currentView}
        onViewChange={handleViewChange}
        notifications={notifications}
      />

      <main className="py-8">
        {currentView === 'browse' && (
          <SkillBrowser
            users={users}
            currentUser={currentUser}
            onRequestSwap={handleRequestSwap}
            onViewProfile={handleViewProfile}
          />
        )}

        {currentView === 'profile' && (
          <UserProfile
            user={selectedUser || currentUser}
            onUpdateUser={handleUpdateUser}
            isOwnProfile={!selectedUser || selectedUser.id === currentUser.id}
          />
        )}

        {currentView === 'swaps' && (
          <SwapRequests
            requests={requests}
            users={users}
            currentUser={currentUser}
            onUpdateRequest={handleUpdateRequest}
            onDeleteRequest={handleDeleteRequest}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}

        {currentView === 'admin' && currentUser.isAdmin && (
          <AdminDashboard
            users={users}
            requests={requests}
            feedback={feedback}
            onBanUser={handleBanUser}
            onUnbanUser={handleUnbanUser}
            onSendMessage={handleSendMessage}
          />
        )}
      </main>
    </div>
  );
}

export default App;