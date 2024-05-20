import React from 'react';
import './Navbar.scss'
import { VscMenu } from "react-icons/vsc";
import { useState } from 'react';
import logo from '../../assets/logo_epoka-removebg.png'
import { useNavigate } from 'react-router-dom';

const MyEventsNavbar = () => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const goHome = () =>{
        navigate('/home', {replace:true})
    }

    return (
        <nav>
            <img src={logo} alt='logo' />
            <div className={`menu-items ${isOpen ? 'open' : ''}`}>
                <a href="" onClick={goHome}>Go Back</a>
            </div>
            <br />
            <div className="menu-toggle" onClick={toggleMenu}>
                <VscMenu/>
            </div>
        </nav>
    );
}
export default MyEventsNavbar;
