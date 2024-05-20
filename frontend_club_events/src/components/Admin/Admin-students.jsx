import axios from 'axios';
import React, {useState, useEffect} from 'react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    student_surname: '',
    student_email: '',
    student_password: '',
});

  useEffect(() => {
    fetchStudents()
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/signup");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStudent = async (id) => {
    try {
        await axios.put(`http://localhost:5000/admin/students/${id}`, {...formData, isPasswordChanged: isPasswordChanged});
        fetchStudents();
        setEditingStudent(null); 
        setIsPasswordChanged(false);
    } catch (error) {
        console.error(error);
    }
};

const handleInputChange = (e) => {
    if (e.target.name === "student_password") {
        setIsPasswordChanged(true);
      }
    setFormData({
       ...formData,
        [e.target.name]: e.target.value
    });
};

const startEditing = (student) => {
    setEditingStudent(student.student_id);
    setFormData({
      student_name: student.student_name,
      student_surname: student.student_surname,
      student_email: student.student_email,
      student_password: student.student_password
    });
  };

    return (
        <div>
            <h2>Students</h2>
          <table className="content-table"> 
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Password</th>
                <th>Modify</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
      {students.map((student) => (
          <>
          <tr key={student.student_id}>
            <td>{student.student_id}</td>
            <td>
            {editingStudent === student.student_id? (
              <input
                type="text"
                name="student_name"
                value={formData.student_name || ''}
                onChange={handleInputChange}
              />
            ) : (
              student.student_name
            )}
          </td>
          <td>
            {editingStudent === student.student_id? (
              <input
                type="text"
                name="student_surname"
                value={formData.student_surname || ''}
                onChange={handleInputChange}
              />
            ) : (
              student.student_surname
            )}
          </td>
          <td>
            {editingStudent === student.student_id? (
              <input
                type="email"
                name="student_email"
                value={formData.student_email || ''}
                onChange={handleInputChange}
              />
            ) : (
              student.student_email
            )}
          </td>
          <td>
            {editingStudent === student.student_id? (
              <input
                type="password"
                name="student_password"
                value={formData.student_password || ''}
                onChange={handleInputChange}
              />
            ) : (
              student.student_password
            )}
          </td>
          <td>
            {editingStudent === student.student_id? (
             <td> <button className="btn-style-edit" onClick={() => updateStudent(student.student_id)}>Confirm</button></td>
            ) : (
             <td><button className="btn-style-edit" onClick={() => startEditing(student)}>Edit</button></td>
            )}
          </td>
              
            <td><button className="btn-style-delete" onClick={() => deleteStudent(student.student_id)}>Delete</button></td>
          </tr>
        </>
          ))}
      </tbody>
    </table>
        </div>
    );
}

export default AdminStudents;