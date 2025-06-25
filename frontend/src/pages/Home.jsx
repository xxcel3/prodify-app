import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Home.css";
import "../styles/Logout.css";
import Navbar from '../components/Navbar';

function Home() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          alert("Note created!");
          setTitle("");
          setContent("");
        } else {
          alert("Failed to create note.");
        }
      })
      .catch((err) => alert(err));
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
          <label htmlFor="title">Title:</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <label htmlFor="content">Content:</label>
          <br />
          <textarea
            id="content"
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </main>
    </div>
  );
}

export default Home;
