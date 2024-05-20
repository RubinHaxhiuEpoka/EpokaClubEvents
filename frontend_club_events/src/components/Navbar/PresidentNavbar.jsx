import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo_epoka-removebg.png'
import { VscMenu } from "react-icons/vsc";
import axios from "axios";
import './Navbar.scss'


const PresidentNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [event, setEvent] = useState({
    event_title: '',
    event_description: '',
    event_image: '',
    event_room: '',
    event_date: '',
    event_quotas: 0,
  })

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setEvent({ ...event, event_image: e.target.files[0] })
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
    Object.keys(event).forEach(key => {
        if (key === 'event_image') {
            formData.append(key, event[key]);
        } else {
            formData.append(key, event[key].toString())
        }
    });

    try {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.post('http://localhost:5000/users/events', formData, config)
        console.log(response.data)
        setIsModalOpen(false)
        setEvent({
            event_title: '',
            event_description: '',
            event_image: '',
            event_room: '',
            event_date: '',
            event_quotas: 0,
        });

    } catch (error) {
        console.error(error)
    }
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/president-log-in", { replace: true });
  };

  return (
    <nav>
      <img src={logo} />
      <div className={`menu-items ${isOpen ? "open" : ""}`}>
        <a href="" onClick={(e) => { e.preventDefault(); toggleModal(); setIsOpen(false)}}>Create an Event </a>
        <a href="" onClick={handleLogout}>
          Logout
        </a>
      </div>

      <div className="menu-toggle" onClick={toggleMenu}>
        <VscMenu />
      </div>

      {isModalOpen && (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={toggleModal}>&times;</span>
                
                <form className="parent-form" onSubmit={handleSubmit}>
                    
                    <label htmlFor="event_title">Event Title</label>
                    <input name="event_title" type="text" value={event.event_title} onChange={handleChange} placeholder="Event Title" required/><br />
                    
                    <label htmlFor="event_description">Event Description</label>
                    <input name="event_description" type="text" value={event.event_description} onChange={handleChange} placeholder="Event Description" required/><br />
                    
                    <label htmlFor="event_image">Event Image</label>
                    <input name="event_image" type="file" onChange={handleFileChange} required/><br />
                    
                    <label htmlFor="event_room">Event Room</label>
                    <input name="event_room" type="text" value={event.event_room} onChange={handleChange} placeholder="Event Room" required/><br />
                    
                    <label htmlFor="event_date">Event Date</label>
                    <input name="event_date" type="datetime-local" value={event.event_date} onChange={handleChange} placeholder="Event Date" required/><br />
                    
                    <label htmlFor="event_quotas">Event Quotas</label>
                    <input name="event_quotas" type="number" min="0" value={event.event_quotas} onChange={handleChange} placeholder="Event Quotas" required/><br />
                    
                    <button className="signup-button" type="submit">Post</button>
                </form>
            </div>
        </div>
      )}
    </nav>
  );
};

export default PresidentNavbar;
