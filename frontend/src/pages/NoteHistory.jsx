import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import Navbar from "../components/Navbar";
import "../styles/NoteHistory.css";

function NoteHistory() {
  const [notes, setNotes] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10;

  useEffect(() => {
    api
      .get("/api/notes/")
      .then((res) => setNotes(res.data))
      .catch((err) => alert(err));
  }, []);

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { title, content })
      .then((res) => {
        if (res.status === 201) {
          alert("Note created!");
          setTitle("");
          setContent("");
          return api.get("/api/notes/");
        } else {
          alert("Failed to create note.");
        }
      })
      .then((res) => res && setNotes(res.data))
      .catch((err) => alert(err));
  };

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

  // Pagination
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(notes.length / notesPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <h2>Note History</h2>

        {/* Note form */}
        <form onSubmit={createNote} className="note-form">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <input type="submit" value="Submit" />
        </form>

        {/* Notes */}
        <ul className="note-list">
          {currentNotes.map((note) => (
            <li key={note.id} className="note-item">
              <Note note={note} onDelete={deleteNote} />
              <div className="note-actions">
                <button
                  className="summarize-btn"
                  onClick={() => summarizeNote(note)}
                >
                  Summarize
                </button>
              </div>
              {summaries[note.id] && (
                <div className="summary">
                  <strong>Summary:</strong> {summaries[note.id]}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="pagination-controls">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default NoteHistory;
