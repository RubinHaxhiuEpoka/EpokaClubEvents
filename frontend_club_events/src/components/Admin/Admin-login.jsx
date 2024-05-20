import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AdminLogin = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        admin_username: '',
        admin_password: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await axios.post('http://localhost:5000/admin/admin-login', formData);
            console.log('Login response:', response.data)
            localStorage.setItem('token', response.data.token);
            navigate('/admin', {replace:true})
        } catch (error) {
            if (error.response) {
                console.error('Login failed with status code:', error.response.status);
                console.error('Error message:', error.response.data.error);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error', error.message);
            }
            console.error('Login failed:', error)
        }
    }

    return (
            <div className='big-parenti'>
        <div className='parenti'>
            <h2>Login as an Admin</h2>
            <form onSubmit={handleSubmit}>
                <input name='admin_username' type="text" placeholder='Username' value={formData.admin_username} onChange={handleChange} required />
                <input name='admin_password' type="password" placeholder='Password' value={formData.admin_password} onChange={handleChange} required />
                <button className='signup-button' type='submit'>Login</button>
            </form>
        </div>
        </div>
    );
}

export default AdminLogin;
