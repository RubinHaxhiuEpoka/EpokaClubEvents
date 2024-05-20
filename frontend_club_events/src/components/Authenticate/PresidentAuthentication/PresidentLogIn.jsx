import React, {useState} from 'react';
import logo from '../../../assets/logo_epoka-removebg.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PresidentLogIn = () => {
    
        const navigate = useNavigate()
        const [formData, setFormData] = useState({
            president_email: '',
            president_password: '',
        })
    
        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            console.log(formData);
            try {
                const response = await axios.post('http://localhost:5000/users/presidentlogin', formData);
                console.log('Login response:', response.data)
                localStorage.setItem('token', response.data.token);
                navigate('/president-home', {replace:true})
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
            <h2>Login as President</h2>
            <form onSubmit={handleSubmit}>
                <input name='president_email' type="email" placeholder='Email' value={formData.president_email} onChange={handleChange} required />
                <input name='president_password' type="password" placeholder='Password' value={formData.president_password} onChange={handleChange} required />
                <p>Wrong login form? <a href="/student-log-in">Login as a Student</a></p>
                <button className='signup-button' type='submit'>Login</button>
            </form>
        </div>
        </div>
    );
}

export default PresidentLogIn;
