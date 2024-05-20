import axios from 'axios';
import React, {useState, useEffect} from 'react';

const AdminPresidents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [presidents, setPresidents] = useState([]);
  const [editingPresident, setEditingPresident] = useState(null);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [formData, setFormData] = useState({
    club_name: '',
    president_email: '',
    president_password: ''
});

  useEffect(() => {
    fetchPresidents()
  }, []);

  const fetchPresidents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/clubpresident");
      setPresidents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addPresident = async () =>{
    try {
      await axios.post('http://localhost:5000/admin/president_post', formData)
    } catch (error) {
      console.error(error)
    }
  }

  const deletePresident = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/clubpresidents/${id}`);
      fetchPresidents();
    } catch (error) {
      console.error(error);
    }
  };

  const updatePresident = async (id) => {
    try {
        await axios.put(`http://localhost:5000/admin/clubpresidents/${id}`, {...formData, isPasswordChanged: isPasswordChanged});
        fetchPresidents();
        setEditingPresident(null);
        setIsPasswordChanged(false)
    } catch (error) {
        console.error(error);
    }
};

const handleInputChange = (e) => {
    if (e.target.name === "president_password") {
        setIsPasswordChanged(true);
      }
    setFormData({
       ...formData,
        [e.target.name]: e.target.value
    });
};

const startEditing = (president) => {
    setEditingPresident(president.president_id);
    setFormData({
      club_name: president.club_name,
      president_email: president.president_email,
      president_password: president.president_password
    });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

    return (
        <div>
            <h2>Club Presidents</h2>
          <table className="content-table"> 
            <thead>
              <tr>
                <th>President ID</th>
                <th>Club Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Modify</th>
                <th>Remove</th>
                <th><button className="btn-style-post" onClick={toggleModal}>Add</button></th>
              </tr>
            </thead>
            <tbody>
      {presidents.map((president) => (
          <>
          <tr key={president.president_id}>
            <td>{president.president_id}</td>
            <td>
            {editingPresident === president.president_id ? (
              <input
                type="text"
                name="club_name"
                value={formData.club_name || ''}
                onChange={handleInputChange}
              />
            ) : (
              president.club_name
            )}
          </td>

          <td>
            {editingPresident === president.president_id ? (
              <input
                type="email"
                name="president_email"
                value={formData.president_email || ''}
                onChange={handleInputChange}
              />
            ) : (
              president.president_email
            )}
          </td>
          <td>
            {editingPresident === president.president_id ? (
              <input
                type="password"
                name="president_password"
                value={formData.president_password || ''}
                onChange={handleInputChange}
              />
            ) : (
              president.president_password
            )}
          </td>
          <td>
            {editingPresident === president.president_id? (
             <td> <button className="btn-style-edit" onClick={() => updatePresident(president.president_id)}>Confirm</button></td>
            ) : (
             <td><button className="btn-style-edit" onClick={() => startEditing(president)}>Edit</button></td>
            )}
          </td>
              
            <td><button className="btn-style-delete" onClick={() => deletePresident(president.president_id)}>Delete</button></td>
          </tr>
        </>
          ))}
      </tbody>
    </table>
    {isModalOpen && (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={toggleModal}>&times;</span>
                
                <form className="parent-form" onSubmit={addPresident}>
                    
                    <label htmlFor="club_name">Club Name</label>
                    <input name="club_name" type="text" value={formData.club_name} onChange={handleChange} placeholder="Club Name" required/><br />
                    
                    <label htmlFor="president_email">President Email</label>
                    <input name="president_email" type="email" value={formData.president_email} onChange={handleChange} placeholder="President_email" required/><br />
                    
                    <label htmlFor="president_password">President Password</label>
                    <input name="president_password" type="password" value={formData.president_password} onChange={handleChange} required/><br />
                    
                    <button className="signup-button" type="submit">Post</button>
                </form>
            </div>
        </div>
      )}
        </div>
    );
}

export default AdminPresidents;
