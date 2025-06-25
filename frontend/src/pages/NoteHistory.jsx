import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import Navbar from "../components/Navbar";
import "../styles/NoteHistory.css";

function NoteHistory() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted!");
        else alert("Failed to delete note.");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  return (
    <div className="note-history-wrapper">
        <div className="sidebar">
        <Navbar />
        </div>

        <div className="note-history-main">
        <h2>Note History</h2>
        {notes.length === 0 ? (
            <p>No notes found.</p>
        ) : (
            <ul className="note-list">
            {notes.map((note) => (
                <li key={note.id} className="note-item">
                <Note note={note} onDelete={deleteNote} key={note.id} />
                </li>
            ))}
            </ul>
        )}
        </div>
    </div>
    );

}

export default NoteHistory;
