import React from 'react';
import './Navbar.scss'
import { VscMenu } from "react-icons/vsc";
import { useState } from 'react';
import logo from '../../assets/logo_epoka-removebg.png'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const handleLogout = () =>{
        localStorage.removeItem('token');
        navigate('/student-log-in', {replace:true})
    }

    return (
        <nav>
            <img src={logo} alt='logo' />
            <div className={`menu-items ${isOpen ? 'open' : ''}`}>
                <a href="/myevents">My Events </a>
                <a href="" onClick={handleLogout}>Logout</a>
            </div>
            
            <div className="menu-toggle" onClick={toggleMenu}>
                <VscMenu/>
            </div>
        </nav>
    );
}

export default Navbar;
