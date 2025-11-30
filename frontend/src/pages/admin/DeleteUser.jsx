
import React, { useState, useEffect } from "react";
import { admAllUsers, admDeleteUser } from "../../services/adminServices";

function SectionCard({ title, message, children }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      {message && (
        <p
          className={`mb-4 text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function DeleteUser() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [confirmUser, setConfirmUser] = useState(null);

  // ✅ Fetch users using axios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await admAllUsers(); // axios returns { data }
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    setMessage("");
    try {
      await admDeleteUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setMessage("✅ User deleted successfully!");
      setConfirmUser(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete user");
    }
  };

  return (
    <>
      <SectionCard title="👥 All Users" message={message}>
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center bg-gray-50 hover:bg-orange-50 p-3 rounded-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.profilePicture ||
                    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  }
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <p className="font-semibold text-gray-700">{user.name}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmUser(user)}
                className="text-red-600 hover:text-red-700 font-medium transition"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center italic">No users found.</p>
        )}
      </SectionCard>

      {/* ✅ Delete Confirmation Modal */}
      {confirmUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 sm:w-96 text-center animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-red-600">
                {confirmUser.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(confirmUser._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmUser(null)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
