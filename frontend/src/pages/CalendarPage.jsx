import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api";
import "../styles/CalendarPage.css";

function CalendarPage() {
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get("/api/calendar/events/")
      .then(res => setEvents(res.data))
      .catch(err => alert("Failed to fetch events"));
  }, []);

  const handleDateClick = (date) => {
    setValue(date);
    setShowForm(true);
    setNewEvent("");
  };

  const submitEvent = (e) => {
    e.preventDefault();
    api.post("/api/calendar/events/", {
      title: newEvent,
      date: value.toISOString().split("T")[0],
    }).then(res => {
      setEvents(prev => [...prev, res.data]);
      setShowForm(false);
    }).catch(() => alert("Failed to create event"));
  };

  const renderEvents = (date) => {
    const dayStr = date.toISOString().split("T")[0];
    return events
      .filter(event => event.date === dayStr)
      .map((event, index) => (
        <div className="calendar-event" key={index}>{event.title}</div>
      ));
  };

  return (
    <div className="calendar-container">
      <h2>My Calendar</h2>
      <Calendar
        onClickDay={handleDateClick}
        value={value}
        tileContent={({ date }) => <div>{renderEvents(date)}</div>}
      />

      {showForm && (
        <form className="calendar-form" onSubmit={submitEvent}>
          <h4>Add Event for {value.toDateString()}</h4>
          <input
            type="text"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            placeholder="Event Title"
            required
          />
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
}

export default CalendarPage;
