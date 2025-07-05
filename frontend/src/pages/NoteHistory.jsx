import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import Navbar from "../components/Navbar";
import "../styles/NoteHistory.css";

function NoteHistory() {
  const [notes, setNotes] = useState([]);
  const [summaries, setSummaries] = useState({});

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

  const summarizeNote = async (note) => {
  try {
    const response = await api.post("/api/summarize/", {
      content: note.content,
    });
    setSummaries((prev) => ({
      ...prev,
      [note.id]: response.data.summary,
    }));
  } catch (err) {
    alert("Failed to summarize note.");
  }
};


  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <h2>Note History</h2>
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.id} className="note-item">
              <Note note={note} onDelete={deleteNote} />
              <button onClick={() => summarizeNote(note)}>Summarize</button>
              {summaries[note.id] && (
                <div className="summary">
                  <strong>Summary:</strong> {summaries[note.id]}
                </div>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default NoteHistory;
