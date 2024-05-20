import React from 'react';
import './Navbar.scss'
import { VscMenu } from "react-icons/vsc";
import { useState } from 'react';
import logo from '../../assets/logo_epoka-removebg.png'
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {

    const navigate = useNavigate()

    const handleLogout = () =>{
        localStorage.removeItem('token');
        navigate('/admin-log-in', {replace:true})
    }

    return (
        <nav className='admin-navbar'>
            <h1 id="admin">Admin Control Panel</h1> <br />
                <div>
                <a href="" onClick={handleLogout}>Logout</a>
            </div>
        </nav>
    );
}

export default AdminNavbar;
