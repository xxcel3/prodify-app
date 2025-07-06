import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
import { useEffect, useState } from "react";
import api from "../api";

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/user/") 
      .then((res) => setUsername(res.data.username || "User"))
      .catch(() => setUsername("User"));
  }, []);

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <div className="top-bar">
          <h2>Welcome, {username}!</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="app-description-box">
          <h3>Welcome to Prodify</h3>
          <p>
            Prodify is your all-in-one productivity companion that combines
            note-taking with AI-powered summaries, task management, calendar
            and more all-in-one cozy workspace built for focus.
          </p>
          <p>
            Use the sidebar to explore features. 
            Everything you need, right where you want it.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Home;
