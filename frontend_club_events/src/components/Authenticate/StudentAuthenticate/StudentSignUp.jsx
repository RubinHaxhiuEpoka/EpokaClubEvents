import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './StudentSignUp.scss'
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo_epoka-removebg.png'

const StudentSignUp = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        student_name: '',
        student_surname: '',
        student_email: '',
        student_password: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
            const response = await axios.post('http://localhost:5000/users/signup', formData)
            console.log('Signup response: ', response.data)
            localStorage.setItem('token', response.data.token)
            navigate('/home', { replace: true })
        } catch (error) {
            console.error('Signup failed:', error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }, []);

    return (
        <div className='big-parenti'>
        <div className='parenti'>
        <img src={logo}/>
        <form onSubmit={handleSubmit}>
            <h2>Sign Up To Your Account</h2>
            <input name='student_name' placeholder='Name' onChange={handleChange} required />
            <input name='student_surname' placeholder='Surname' onChange={handleChange} required />
            <input name='student_email' type='email' placeholder='Email' onChange={handleChange} required />
            <input name='student_password' type='password' placeholder='Password' onChange={handleChange} required />
            <p>Already have an account? <a href="/student-log-in">Log-in</a></p>
            <button className='signup-button' type='submit'>Sign Up</button>
        </form>
        </div>
        </div>
    );
}

export default StudentSignUp;
