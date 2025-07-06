import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api";
import Navbar from "../components/Navbar";
import "../styles/CalendarPage.css";

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState("");

  const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD

  useEffect(() => {
    fetchEvents(formattedDate);
  }, [formattedDate]);

  const fetchEvents = (date) => {
    api.get(`/api/calendar/events/?date=${date}`)
      .then((res) => setEvents(res.data))
      .catch(() => alert("Failed to load events"));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    api.post("/api/calendar/events/", {
      title: newEventTitle,
      date: formattedDate,
    })
    .then(() => {
      setNewEventTitle("");
      fetchEvents(formattedDate);
    })
    .catch(() => alert("Failed to add event"));
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <h2>Calendar</h2>

        <div className="calendar-section">
          <Calendar value={selectedDate} onChange={setSelectedDate} />

          <div className="event-panel">
            <h3>Events on {formattedDate}</h3>

            {events.length > 0 ? (
              <ul className="event-list">
                {events.map((event) => (
                  <li key={event.id}>{event.title}</li>
                ))}
              </ul>
            ) : (
              <p>No events.</p>
            )}

            <form onSubmit={handleAddEvent} className="event-form">
              <input
                type="text"
                placeholder="New event title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
              />
              <button type="submit">Add Event</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CalendarPage;
