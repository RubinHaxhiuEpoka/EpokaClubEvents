import React, { useState, useEffect } from "react";
import PresidentNavbar from "../components/Navbar/PresidentNavbar";
import axios from "axios";

const PresidentHome = () => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get(
          "http://localhost:5000/users/president_events",
          { headers }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  const toggleAccordion = (index) => {
    setIsOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  const fetchAttendees = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/event_attendees/${eventId}`);
      setAttendees(response.data);
      console.log(response.data)
      setSelectedEvent(eventId);
    } catch (error) {
      console.error("Failed to fetch attendees:", error);
    }
  };

  const confirmAttendance = async (eventId, studentId) => {
    try {
      await axios.put("http://localhost:5000/users/confirm_attendance", { eventId, studentId });
      fetchAttendees(eventId); 
      console.log(eventId, studentId)
    } catch (error) {
      console.error("Failed to confirm attendance:", error);
    }
  };


  return (
    <div>
      <PresidentNavbar />
      <div className="card-container">
        {events.map((event, index) => (
          <div key={index} className="card">
            <img
              src={`http://localhost:5000/uploads/${event.event_image}`}
              alt={event.event_title}
            />
            <button className="atnd-btn" onClick={() => fetchAttendees(event.event_id)}>Attendance</button>
            <div className="card-content">
              <h6>Quotas Available: {event.event_quotas}</h6>
              <h5> Event Room: {event.event_room}</h5>
              <h4>
                Event date: {new Date(event.event_date).toLocaleString()}{" "}
              </h4>
              <h3>{event.event_title}</h3>
              <button
                className={`buton_styling ${isOpen[index] ? "red" : "green"}`}
                onClick={() => toggleAccordion(index)}
              >
                {isOpen[index] ? "Close" : "Description"}
              </button>
              <p>{isOpen[index] ? event.event_description : ""}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedEvent && (
        <div className="modal">
          <div className="modal-content2">
          <h2>Attendees for Event {selectedEvent}</h2>
          <ul>
            {attendees.map((attendee) => (
              <li key={attendee.student_id}>
                <span className="student_name">{attendee.student_name} </span> <span className="student_surname">{attendee.student_surname}</span>
                {attendee.president_confirmed ? (
                  <h4>Confirmed</h4>
                ) : (
                  <button onClick={() => confirmAttendance(selectedEvent, attendee.student_id)}>Confirm</button>
                )}
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedEvent(null)}>Close</button>
        </div>
        </div>
      )}
    </div>
  );
};

export default PresidentHome;