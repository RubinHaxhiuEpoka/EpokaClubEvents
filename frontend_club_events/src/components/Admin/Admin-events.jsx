import axios from 'axios';
import React, {useState, useEffect} from 'react';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    event_title: '',
    event_description: '',
    event_image: '',
    event_room: '',
    event_date: '',
    event_quotas: 0,
});

useEffect(() => {
    fetchEvents()
}, []);

const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/events");
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

const updateEvent = async (id) => {
    const formDataToSend = new FormData();
    formDataToSend.append('event_title', formData.event_title);
    formDataToSend.append('event_description', formData.event_description);
    formDataToSend.append('event_room', formData.event_room);
    formDataToSend.append('event_date', formData.event_date);
    formDataToSend.append('event_quotas', formData.event_quotas);

    if (formData.event_image instanceof File) {
        formDataToSend.append('event_image', formData.event_image);
    }

    try {
        await axios.put(`http://localhost:5000/admin/events/${id}`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        fetchEvents();
        setEditingEvent(null); 
    } catch (error) {
        console.error(error);
    }
};


const startEditing = (event) => {
    setEditingEvent(event.event_id);
    setFormData({
      event_title: event.event_title,
      event_description: event.event_description,
      event_image: '',
      event_room: event.event_room,
      event_date: event.event_date,
      event_quotas: event.event_quotas
    });
  };

const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleInputFileChange = (e) => {
    setFormData({ ...formData, event_image: e.target.files[0] })
  };

    return (
        <div>
            <h2>Events</h2>
          <table className="content-table"> 
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Event Title</th>
                <th>Event Description</th>
                <th>Event Image</th>
                <th>Event Room</th>
                <th>Event Date</th>
                <th>Event Quotas</th>
                <th>Modify</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
      {events.map((event) => (
          <>
          <tr key={event.event_id}>
            <td>{event.event_id}</td>
            <td>
            {editingEvent === event.event_id? (
              <input
                type="text"
                name="event_title"
                value={formData.event_title || ''}
                onChange={handleInputChange}
              />
            ) : (
              event.event_title
            )}
          </td>
          <td>
            {editingEvent === event.event_id? (
              <input
                type="text"
                name="event_description"
                value={formData.event_description || ''}
                onChange={handleInputChange}
              />
            ) : (
              event.event_description
            )}
          </td>
          <td>
            {editingEvent === event.event_id? (
              <input
                type="file"
                name="event_image"
                onChange={handleInputFileChange}
              />
            ) : (
              <img className='admin-event-img' src={`http://localhost:5000/uploads/${event.event_image}`} alt="" />
            )}
          </td>
          <td>
            {editingEvent === event.event_id? (
            <div>
              <input
                type="text"
                name="event_room"
                value={formData.event_room || ''}
                onChange={handleInputChange}
              />
              </div>
            ) : (
              event.event_room
            )}
          </td>
          <td>
            {editingEvent === event.event_id? (
              <input
                type="text"
                name="event_date"
                value={formData.event_date || ''}
                onChange={handleInputChange}
              />
            ) : (
              event.event_date
            )}
          </td>
          <td>
            {editingEvent === event.event_id? (
              <input
                type="text"
                name="event_quotas"
                value={formData.event_quotas || ''}
                onChange={handleInputChange}
              />
            ) : (
              event.event_quotas
            )}
          </td>
          <td>
            {editingEvent === event.event_id? (
             <td> <button className="btn-style-edit" onClick={() => updateEvent(event.event_id)}>Confirm</button></td>
            ) : (
             <td><button className="btn-style-edit" onClick={() => startEditing(event)}>Edit</button></td>
            )}
          </td>
              
            <td><button className="btn-style-delete" onClick={() => deleteEvent(event.event_id)}>Delete</button></td>
          </tr>
        </>
          ))}
      </tbody>
    </table>
        </div>
    );
}

export default AdminEvents;
