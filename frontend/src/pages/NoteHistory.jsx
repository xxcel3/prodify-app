import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import Navbar from "../components/Navbar";
import "../styles/NoteHistory.css";

function NoteHistory() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api
      .get("/api/notes/")
      .then((res) => setNotes(res.data))
      .catch((err) => alert(err));
  }, []);

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted!");
        else alert("Failed to delete note.");
        return api.get("/api/notes/");
      })
      .then((res) => setNotes(res.data))
      .catch((err) => alert(err));
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <h2>Note History</h2>
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.id} className="note-item">
              <Note note={note} onDelete={deleteNote} key={note.id} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default NoteHistory;
