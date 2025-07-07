import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import "../styles/NoteHistory.css"; // Reuse styling

function SettingsPage() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    api.get("/api/user/") 
      .then((res) => setUsername(res.data.username))
      .catch((err) => setMessage("Failed to fetch user data"));
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

    api.put("/api/settings/", {
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

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <h2>Account Settings</h2>

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
          {message && <p style={{ marginTop: "1rem", color: "black" }}>{message}</p>}
        </form>
      </main>
    </div>
  );
}

export default SettingsPage;
