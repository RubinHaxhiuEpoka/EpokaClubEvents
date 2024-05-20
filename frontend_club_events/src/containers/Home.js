import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Events from '../components/Events/Events';
import Authenticate from '../components/Authenticate/Authenticate';


const Home = () => {
    return (
        <div>
            <Navbar/>
            <Events/>
        </div>
    );
}

export default Home;
