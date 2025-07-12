import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Star, MessageSquare, Trash2, User as UserIcon } from 'lucide-react';
import type { User, SwapRequest } from '../types';

interface SwapRequestsProps {
  requests: SwapRequest[];
  users: User[];
  currentUser: User;
  onUpdateRequest: (requestId: string, status: string) => void;
  onDeleteRequest: (requestId: string) => void;
  onSubmitFeedback: (swapId: string, rating: number, comment: string) => void;
}

export const SwapRequests: React.FC<SwapRequestsProps> = ({
  requests,
  users,
  currentUser,
  onUpdateRequest,
  onDeleteRequest,
  onSubmitFeedback
}) => {
  const [activeTab, setActiveTab] = useState('received');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const getUserById = (id: string) => users.find(u => u._id === id);

  const receivedRequests = requests.filter(r => r.toUserId === currentUser._id);
  const sentRequests = requests.filter(r => r.fromUserId === currentUser._id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFeedbackSubmit = () => {
    if (selectedSwap) {
      onSubmitFeedback(selectedSwap.id, rating, comment);
      setShowFeedbackModal(false);
      setSelectedSwap(null);
      setRating(5);
      setComment('');
    }
  };

  const openFeedbackModal = (swap: SwapRequest) => {
    setSelectedSwap(swap);
    setShowFeedbackModal(true);
  };

  const RequestCard = ({ request, isReceived }: { request: SwapRequest; isReceived: boolean }) => {
    const otherUser = getUserById(isReceived ? request.fromUserId : request.toUserId);
    if (!otherUser) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <UserIcon size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
              <p className="text-sm text-gray-600">{otherUser.location}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">
              {isReceived ? 'They want to learn:' : 'You want to learn:'}
            </div>
            <div className="font-medium text-blue-700">{request.skillWanted}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">
              {isReceived ? 'They offer:' : 'You offer:'}
            </div>
            <div className="font-medium text-purple-700">{request.skillOffered}</div>
          </div>
        </div>

        {request.message && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="text-sm text-gray-600 mb-1">Message:</div>
            <div className="text-sm text-gray-800">{request.message}</div>
          </div>
        )}

        <div className="text-xs text-gray-500 mb-4">
          {isReceived ? 'Received' : 'Sent'} {new Date(request.createdAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {request.status === 'pending' && isReceived && (
            <>
              <button
                onClick={() => onUpdateRequest(request.id, 'accepted')}
                className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                <CheckCircle size={14} />
                <span>Accept</span>
              </button>
              <button
                onClick={() => onUpdateRequest(request.id, 'rejected')}
                className="flex items-center space-x-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <XCircle size={14} />
                <span>Reject</span>
              </button>
            </>
          )}

          {request.status === 'pending' && !isReceived && (
            <button
              onClick={() => onDeleteRequest(request.id)}
              className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              <Trash2 size={14} />
              <span>Cancel</span>
            </button>
          )}

          {request.status === 'accepted' && (
            <>
              <button
                onClick={() => onUpdateRequest(request.id, 'completed')}
                className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <CheckCircle size={14} />
                <span>Mark Complete</span>
              </button>
              <button
                onClick={() => openFeedbackModal(request)}
                className="flex items-center space-x-1 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                <Star size={14} />
                <span>Rate</span>
              </button>
            </>
          )}

          {request.status === 'completed' && (
            <button
              onClick={() => openFeedbackModal(request)}
              className="flex items-center space-x-1 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              <Star size={14} />
              <span>Rate</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
        <p className="text-gray-600">Manage your skill swap requests and collaborations</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('received')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Received ({receivedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent ({sentRequests.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Request Lists */}
      <div className="space-y-4">
        {activeTab === 'received' && (
          <>
            {receivedRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageSquare size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests received</h3>
                <p className="text-gray-600">When someone requests a skill swap, it will appear here</p>
              </div>
            ) : (
              receivedRequests.map((request) => (
                <RequestCard key={request.id} request={request} isReceived={true} />
              ))
            )}
          </>
        )}

        {activeTab === 'sent' && (
          <>
            {sentRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Clock size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests sent</h3>
                <p className="text-gray-600">Browse skills to send your first swap request</p>
              </div>
            ) : (
              sentRequests.map((request) => (
                <RequestCard key={request.id} request={request} isReceived={false} />
              ))
            )}
          </>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedSwap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Rate Your Experience</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star size={24} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleFeedbackSubmit}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setShowFeedbackModal(false)}
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