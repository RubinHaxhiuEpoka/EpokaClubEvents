import React, { useState, useEffect } from "react";
import axios from "axios";
import MyEventsNavbar from "../Navbar/MyEventsNavbar";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState({});
  const [interestedEvents, setInterestedEvents] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    rating_number: "",
    student_comment: "",
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [presidentConfirmed, setPresidentConfirmed] = useState(new Set());
  const [ratedEvents, setRatedEvents] = useState(new Set()); 

  useEffect(() => {
    const storedRatedEvents = JSON.parse(localStorage.getItem('ratedEvents')) || [];
    setRatedEvents(new Set(storedRatedEvents));
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const loadAttendedEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/users/attendedEvents`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const attendedEvents = response.data;
      setInterestedEvents(attendedEvents.map((event) => event.event_id));
      const confirmedSet = new Set(
        attendedEvents
        .filter((event) => event.president_confirmed)
        .map((event) => event.event_id)
      );
      setPresidentConfirmed(confirmedSet);
    } catch (error) {
      console.error("Failed to load attended events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    loadAttendedEvents();
  }, []);

  const handleAttend = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (interestedEvents.includes(eventId)) {
        await axios.delete(
          `http://localhost:5000/users/events/attend/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInterestedEvents(interestedEvents.filter((id) => id!== eventId));
      } else {
        await axios.post(
          "http://localhost:5000/users/events/attend",
          { eventId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInterestedEvents([...interestedEvents, eventId]);
      }
      loadAttendedEvents(); 
    } catch (error) {
      console.error("Failed to attend event:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm({
    ...feedbackForm,
      [name]: name === "rating_number"? Number(value) : value,
    });
  };

  const handleSubmitFeedback = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const feedbackData = { eventId,...feedbackForm };
      const response = await axios.post(
        `http://localhost:5000/users/event/rating`,
        feedbackData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response:", response.data);
      const currentRatedEvents = JSON.parse(localStorage.getItem('ratedEvents')) || [];
      setRatedEvents((prev) => new Set(prev.add(eventId)));
      localStorage.setItem('ratedEvents', JSON.stringify([...currentRatedEvents, eventId]));
      setShowFeedbackForm(false);
    } catch (error) {
      console.error("Failed to rate event:", error);
    }
  };

  const toggleAccordion = (index) => {
    setIsOpen((prevState) => ({...prevState, [index]:prevState[index] }));
  };

  const toggleFeedbackFormVisibility = () => {
    setShowFeedbackForm(!showFeedbackForm);
    console.log(showFeedbackForm);
  };

  const attendedEvents = events.filter((event) =>
    interestedEvents.includes(event.event_id)
  );

  return (
    <>
    <MyEventsNavbar/>
      <div className="card-container">
        {attendedEvents.map((event, index) => (
          <div key={index} className="card">
            <img
              src={`http://localhost:5000/uploads/${event.event_image}`}
              alt={event.event_title}
            />
            <div className="card-content">
              <button
                disabled={
                  event.event_quotas <= 0 &&
                !interestedEvents.includes(event.event_id)
                }
                className={`attend-button ${
                  interestedEvents.includes(event.event_id)? "attending" : ""
                }`}
                onClick={() => handleAttend(event.event_id)}
              >
                {interestedEvents.includes(event.event_id)
                ? "Withdraw"
                  : "Attend"}
              </button>
              <h6>Quotas Available: {event.event_quotas}</h6>
              <h5> Event Room: {event.event_room}</h5>
              <h4>
                Event date: {new Date(event.event_date).toLocaleString()}{" "}
              </h4>
              <h3>{event.event_title}</h3>

              <div className="feedback-description">
                <button
                  className={`buton_styling ${isOpen[index]? "red" : "green"}`}
                  onClick={() => toggleAccordion(index)}
                >
                  {isOpen[index]? "Close" : "Description"}
                </button>
                <p>{isOpen[index]? event.event_description : ""}</p>
                {presidentConfirmed.has(event.event_id) &&!ratedEvents.has(event.event_id) && (
                  <span
                    className="feedback-span"
                    onClick={() => toggleFeedbackFormVisibility(event.event_id)}
                  >
                    &#9734; Rate The Event
                  </span>
                )}
              </div>

              {showFeedbackForm && (
                <div className="modal">
                  <div className="modal-content">
                    <span
                      className="close"
                      onClick={() => toggleFeedbackFormVisibility()}
                    >
                      &times;
                    </span>

                    <form
                      className="parent-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitFeedback(event.event_id);
                      }}
                    >
                      <label className="rn" htmlFor="rating_number">Rating Number</label>
                      <div className="form-feedback">   
                        {[...Array(5)].map((_, index) => (
                          <label key={index}>
                            <input className="inputradio"
                              name="rating_number"
                              type="radio"
                              value={index + 1}
                              checked={feedbackForm.rating_number === index + 1}
                              onChange={handleChange}
                              required
                            />
                            {index + 1}
                          </label>
                        ))}
                      </div>
                      <br />

                      <label htmlFor="student_comment">Student Comment</label>
                      <input
                        name="student_comment"
                        type="text"
                        value={feedbackForm.student_comment}
                        onChange={handleChange}
                        placeholder="Student Comment"
                      />
                      <br />
                      <br />

                      <button className="signup-button" type="submit">
                        Post
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default MyEvents;
