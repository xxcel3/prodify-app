import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import "../styles/NoteHistory.css"; // reuse existing styles

function SettingsPage() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    api
      .get("/api/user/") // Replace with your actual endpoint
      .then((res) => setUsername(res.data.username))
      .catch(() => setMessage("Failed to fetch user data"));
  }, []);

  const checkStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return "Weak";
    if (strength === 3) return "Medium";
    return "Strong";
  };

  useEffect(() => {
    setPasswordStrength(checkStrength(newPassword));
  }, [newPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    api
      .put("/api/settings/", {
        username,
        new_password: newPassword,
        current_password: currentPassword,
      })
      .then(() => setMessage("Settings updated successfully."))
      .catch((err) => {
        if (err.response?.data) {
          const errors = Object.values(err.response.data).flat().join(" ");
          setMessage(errors);
        } else {
          setMessage("Error updating settings.");
        }
      });
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    setDeleteMessage("");

    if (!deletePassword) {
      setDeleteMessage("Please enter your password.");
      return;
    }

    api
      .post("/api/delete-account/", { password: deletePassword })
      .then(() => {
        alert("Account deleted.");
        localStorage.removeItem("accessToken");
        window.location.href = "/register"; // or /login
      })
      .catch((err) => {
        if (err.response?.data?.detail) {
          setDeleteMessage(err.response.data.detail);
        } else {
          setDeleteMessage("Error deleting account.");
        }
      });
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <h2>Account Settings</h2>

        {/* Update settings form */}
        <form onSubmit={handleSubmit} className="note-form">
          <label htmlFor="username">New Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {newPassword && (
            <p>
              Password Strength: <strong>{passwordStrength}</strong>
            </p>
          )}

          <input type="submit" value="Save Changes" />
          {message && (
            <p style={{ marginTop: "1rem", color: message.includes("success") ? "green" : "crimson" }}>
              {message}
            </p>
          )}
        </form>

        {/* Delete account form */}
        <form onSubmit={handleDeleteAccount} className="note-form" style={{ border: "2px solid crimson", marginTop: "2rem" }}>
          <h3 style={{ color: "crimson" }}>Danger Zone</h3>
          <label htmlFor="deletePassword">Enter password to delete account:</label>
          <input
            type="password"
            id="deletePassword"
            name="deletePassword"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
          <input
            type="submit"
            value="Delete Account"
            style={{ backgroundColor: "crimson" }}
          />
          {deleteMessage && <p style={{ color: "crimson" }}>{deleteMessage}</p>}
        </form>
      </main>
    </div>
  );
}

export default SettingsPage;
