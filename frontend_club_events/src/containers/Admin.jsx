import axios from "axios";
import React, { useState, useEffect } from "react";
import '../containers/Admin.scss'
import AdminStudents from "../components/Admin/Admin-students";
import AdminPresidents from "../components/Admin/Admin-presidents";
import AdminEvents from "../components/Admin/Admin-events";
import AdminFeedback from "../components/Admin/Admin-feedback";
import AdminNavbar from "../components/Navbar/AdminNavbar";


const Admin = () => {
  
  const [eventRatings, setEventRatings] = useState([]); 

const [formData, setFormData] = useState({
    student_name: '',
    student_surname: '',
    student_email: '',
    student_password: ''
});

  const fetchEventRatings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/event_ratings");
      setEventRatings(response.data); 
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEventRating = async (id) => {
    try {

      await axios.delete(`http://localhost:5000/users/event_ratings/${id}`);

      fetchEventRatings();

      alert('Event rating deleted successfully.');
    } catch (error) {

      console.error('Failed to delete event rating:', error);
      alert('An error occurred while trying to delete the event rating.');
    }
  };
  

  useEffect(() => {

 fetchEventRatings(); 
  }, []);


  return (
    <>
    <AdminNavbar />
    <div className="table-all">
    <AdminStudents/>
    <AdminPresidents/>
    <AdminEvents/>
    <AdminFeedback/>
    </div>
    </>
  );
};

export default Admin;