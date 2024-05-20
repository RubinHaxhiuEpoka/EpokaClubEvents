import axios from 'axios';
import React, {useState, useEffect} from 'react';


const AdminFeedback = () => {
    const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetchFeedback()
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/event_ratings");
      setFeedback(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/event_ratings/${id}`);
      fetchFeedback();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
        <h2>Event Ratings</h2>
      <table className="content-table"> 
        <thead>
          <tr>
            <th>Rating ID</th>
            <th>Rating Number</th>
            <th>Student Comment</th>
            <th>Student ID</th>
            <th>Event ID</th>
            <th>Delete Feedback</th>
          </tr>
        </thead>
        <tbody>
  {feedback.map((feedback) => (
      <>
      <tr key={feedback.rating_id}>
        <td>{feedback.rating_id}</td>
        <td>{feedback.rating_number}</td>
        <td>{feedback.student_comment}</td>
        <td>{feedback.student_id}</td>
        <td>{feedback.event_id}</td>
        <td><button className="btn-style-delete" onClick={() => deleteFeedback(feedback.rating_id)}>Delete</button></td>
      </tr>
    </>
      ))}
  </tbody>
</table>
    </div>
);
}

export default AdminFeedback;
