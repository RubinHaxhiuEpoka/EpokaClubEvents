import React from 'react';
import logo from '../../assets/logo_epoka-removebg.png'
import { useNavigate } from 'react-router-dom';

const Authenticate = () => {
  const navigate = useNavigate()
  return (
    <div className='big-parenti'>
        <div className='parenti'>
            <img src={logo}/>
            <h2>Are you:</h2>
            <button className='signup-button' type='submit' onClick={() => navigate('/student-log-in')}>Student</button><br/>
            <button className='signup-button' type='submit' onClick={() => navigate('/president-log-in')}>President</button>
            
        </div>
        </div>
  );
}

export default Authenticate;
