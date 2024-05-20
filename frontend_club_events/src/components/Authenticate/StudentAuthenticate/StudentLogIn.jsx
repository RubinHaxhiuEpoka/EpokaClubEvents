import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import logo from '../../../assets/logo_epoka-removebg.png'
import './StudentSignUp.scss'

const StudentLogIn = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        student_email: '',
        student_password: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await axios.post('http://localhost:5000/users/login', formData);
            console.log('Login response:', response.data)
            localStorage.setItem('token', response.data.token);
            navigate('/home', {replace:true})
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
            <img src={logo}/>
            <h2>Login as a Student</h2>
            <form onSubmit={handleSubmit}>
                <input name='student_email' type="email" placeholder='Email' value={formData.student_email} onChange={handleChange} required />
                <input name='student_password' type="password" placeholder='Password' value={formData.student_password} onChange={handleChange} required />
                <p>Don't have an account? <a href="/student-sign-up">Sign-up</a></p>
                <button className='signup-button' type='submit'>Login</button>
            </form>
        </div>
        </div>
    );
}

export default StudentLogIn;
