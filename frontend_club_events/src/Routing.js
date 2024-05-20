import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from './containers/Home';
import Events from './components/Events/Events';
import StudentSignUp from './components/Authenticate/StudentAuthenticate/StudentSignUp';
import StudentLogIn from './components/Authenticate/StudentAuthenticate/StudentLogIn';
import Authenticate from './components/Authenticate/Authenticate';
import PresidentHome from './containers/PresidentHome';
import PresidentLogIn from './components/Authenticate/PresidentAuthentication/PresidentLogIn';
import Admin from './containers/Admin';
import MyEvents from './components/MyEvents/MyEvents';
import AdminLogin from './components/Admin/Admin-login';

function useAuth() {
    const token = localStorage.getItem('token')
    return { token }
}

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    const location = useLocation();
    const isSignupPage = location.pathname === '/student-sign-up' ;

    if (!token && !isSignupPage) {
        return <Navigate to='/student-sign-up' replace />
    }

    if (token && isSignupPage) {
        return <Navigate to = '/home' replace />
    }

    return children;
}

const Routing = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='' element={<Authenticate /> }/>
                <Route path='president-home' element={<ProtectedRoute><PresidentHome /></ProtectedRoute> }/>
                <Route path='home' element={ <ProtectedRoute><Home /></ProtectedRoute>}/>
                <Route path='student-sign-up' element={<StudentSignUp />}/>
                <Route path='student-log-in' element={<StudentLogIn />}/>
                <Route path='president-log-in' element={<PresidentLogIn />}/>
                <Route path='admin-log-in' element={<AdminLogin />}/>
                <Route path='admin' element={<ProtectedRoute><Admin /></ProtectedRoute>}/>
                <Route path='myevents' element={<MyEvents />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default Routing;
