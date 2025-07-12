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

interface SwapRequestsProps {
  users: User[];
  currentUser: User;
}

export const SwapRequests: React.FC<SwapRequestsProps> = ({
  users,
  currentUser,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swaps, loading, error } = useSelector(
    (state: RootState) => state.swaps
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    toUserId: "",
    skillOffered: "",
    skillWanted: "",
    message: "",
  });

  useEffect(() => {
    dispatch(fetchSwaps());
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Swap Requests</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowForm((v) => !v)}
      >
        {showForm ? "Cancel" : "New Swap Request"}
      </button>
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 space-y-3 bg-white p-4 rounded shadow"
        >
          <div>
            <label className="block mb-1">To User</label>
            <select
              name="toUserId"
              value={form.toUserId}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select a user</option>
              {users
                .filter((u) => u.id !== currentUser.id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Skill Offered</label>
            <input
              name="skillOffered"
              value={form.skillOffered}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Skill Wanted</label>
            <input
              name="skillWanted"
              value={form.skillWanted}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Send Request
          </button>
        </form>
      )}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-4">
        {swaps.length === 0 && !loading && <div>No swap requests found.</div>}
        {swaps.map((swap) => (
          <div
            key={swap._id}
            className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="font-semibold">
                From: {swap.fromUserId?.name || swap.fromUserId}
              </div>
              <div>To: {swap.toUserId?.name || swap.toUserId}</div>
              <div>Offered: {swap.skillOffered}</div>
              <div>Wanted: {swap.skillWanted}</div>
              <div>
                Status: <span className="font-semibold">{swap.status}</span>
              </div>
              {swap.message && <div>Message: {swap.message}</div>}
              <div className="text-xs text-gray-500">
                Created: {new Date(swap.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 md:mt-0 flex space-x-2">
              {swap.toUserId?._id === currentUser.id &&
                swap.status === "pending" && (
                  <>
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleUpdate(swap._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleUpdate(swap._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
              {(swap.fromUserId?._id === currentUser.id ||
                swap.toUserId?._id === currentUser.id) && (
                <button
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  onClick={() => handleDelete(swap._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
