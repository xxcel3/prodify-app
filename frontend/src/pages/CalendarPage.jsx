import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api";
import Navbar from "../components/Navbar";
import "../styles/CalendarPage.css";

function CalendarPage() {
  // States to track selected date, event list, title input, and time input
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");

  // Format selected date to YYYY-MM-DD
  const formattedDate = selectedDate.toISOString().split("T")[0];

  // Fetch events each time the date changes
  useEffect(() => {
    fetchEvents(formattedDate);
  }, [formattedDate]);

  // Fetch all events for a specific date
  const fetchEvents = (date) => {
    api
      .get(`/api/calendar/events/?date=${date}`)
      .then((res) => setEvents(res.data))
      .catch(() => alert("Failed to load events"));
  };

  // Add a new event
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    api
      .post("/api/calendar/events/", {
        title: newEventTitle,
        date: formattedDate,
        time: newEventTime || null, 
      })
      .then(() => {
        setNewEventTitle("");
        setNewEventTime("");
        fetchEvents(formattedDate); 
      })
      .catch(() => alert("Failed to add event"));
  };

  // Delete an existing event by ID
  const deleteEvent = (id) => {
    api
      .delete(`/api/calendar/events/${id}/`)
      .then(() => fetchEvents(formattedDate))
      .catch(() => alert("Failed to delete event"));
  };

  return (
    <div className="home-container">
      <Navbar />

      <main className="main-content">
        <h2>Calendar</h2>

        <div className="calendar-section">
          {/* Calendar UI component */}
          <Calendar value={selectedDate} onChange={setSelectedDate} />

          {/* Events display and form */}
          <div className="event-panel">
            <h3>Events on {formattedDate}</h3>

            {/* Show event list or fallback message */}
            {events.length > 0 ? (
              <ul className="event-list">
                {events.map((event) => (
                  <li key={event.id}>
                    <span>
                      {event.title}
                      {event.time ? ` @ ${event.time.slice(0, 5)}` : ""}
                    </span>
                    <button onClick={() => deleteEvent(event.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events.</p>
            )}

            {/* Form to add new event */}
            <form onSubmit={handleAddEvent} className="event-form">
              <input
                type="text"
                placeholder="New event title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
              />
              <input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
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
