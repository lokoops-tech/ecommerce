import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Add/Add.css";
import { API_BASE_URL } from "../../../Config";

const AddAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admins, setAdmins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/all`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAdmins(data.admins);
        }
      })
      .catch((err) => toast.error("Error fetching admins"));
  }, []);

  const handleAddAdmin = async () => {
    if (!email || !password) {
      toast.warn("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        setAdmins([...admins, data.admin]);
        setEmail("");
        setPassword("");
        toast.success("Admin added successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding admin");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/delete/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        setAdmins(admins.filter((admin) => admin._id !== id));
        toast.success("Admin deleted successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting admin");
    }
  };

  const startEdit = (admin) => {
    setEditingId(admin._id);
    setEditEmail(admin.email);
    setEditPassword("");
  };

  const handleEdit = async (id) => {
    if (!editEmail || !editPassword) {
      toast.warn("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: editEmail, password: editPassword }),
      });

      const data = await response.json();
      if (data.success) {
        setAdmins(admins.map((admin) => (admin._id === id ? data.admin : admin)));
        setEditingId(null);
        setEditEmail("");
        setEditPassword("");
        toast.success("Admin updated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating admin");
    }
  };

  return (
    <div className="add-admin-container">
      <ToastContainer />
      <h2>Admin Panel</h2>
      <h3>Add New Admin</h3>
      <div>
        <input type="email" placeholder="New Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="New Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="add-admin-btn" onClick={handleAddAdmin}>Add Admin</button>
      </div>

      <div className="admins-list">
        <h3>Current Admins</h3>
        {admins.length === 0 ? <p>No admins added yet.</p> : admins.map((admin) => (
          <div key={admin._id} className="admin-item">
            {editingId === admin._id ? (
              <>
                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
                <button onClick={() => handleEdit(admin._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{admin.email}</span>
                <button onClick={() => startEdit(admin)}>Edit</button>
                <button onClick={() => handleDelete(admin._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddAdmin;
