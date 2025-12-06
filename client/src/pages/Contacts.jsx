import React, { useEffect, useState } from "react";
import { Edit, Trash2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", contact: "" });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));

  // ✅ Token validation utility
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      return !isExpired;
    } catch {
      return false;
    }
  };

  // ✅ Validate token and fetch contacts
  useEffect(() => {
    if (!isTokenValid(token)) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }
    fetchContacts();
  }, []);

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_HOST}/api/contacts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        // If server rejects token, log out
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  // Save contact
  const saveContact = async (e) => {
    e.preventDefault();
    try {
      if (!/07[0-9]{8}/.test(form.contact)) {
        setMessage("Enter a valid contact!");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_HOST}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const data = await res.json();
      setMessage(data.message);
      if (data.message.includes("SAVED")) {
        setForm({ name: "", contact: "" });
        fetchContacts();
      }
    } catch (err) {
      console.error("Error saving contact:", err);
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST}/api/contacts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const data = await res.json();
      setMessage(data.message);
      fetchContacts();
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  // Update contact
  const updateContact = async (id, updatedContact) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST}/api/contacts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedContact),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const data = await res.json();
      setMessage(data.message);
      setEditingId(null);
      fetchContacts();
    } catch (err) {
      console.error("Error updating contact:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors duration-300">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-100">
          📇 Manage Your Contacts
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Add Contact Form */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 shadow-inner transition-colors duration-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Add Contact
            </h2>
            <form onSubmit={saveContact} className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded-lg p-2 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              <input
                type="tel"
                placeholder="07********"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="border rounded-lg p-2 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition"
              >
                Save Contact
              </button>
            </form>
          </div>

          {/* Contacts List */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
              All My Contacts
            </h2>
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No contacts found.
                </p>
              ) : (
                contacts.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    {editingId === c._id ? (
                      <div className="flex flex-col w-full space-y-2">
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) =>
                            setContacts((prev) =>
                              prev.map((ct) =>
                                ct._id === c._id
                                  ? { ...ct, name: e.target.value }
                                  : ct
                              )
                            )
                          }
                          className="border rounded p-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                        />
                        <input
                          type="text"
                          value={c.contact}
                          onChange={(e) =>
                            setContacts((prev) =>
                              prev.map((ct) =>
                                ct._id === c._id
                                  ? { ...ct, contact: e.target.value }
                                  : ct
                              )
                            )
                          }
                          className="border rounded p-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {c.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          0{c.contact}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {editingId === c._id ? (
                        <>
                          <button
                            onClick={() => updateContact(c._id, c)}
                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 dark:hover:bg-green-500"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(c._id)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-500"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteContact(c._id)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 dark:hover:bg-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Toast Message */}
        {message && (
          <div className="mt-6 text-center">
            <p className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-4 py-2 rounded-lg shadow transition">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
