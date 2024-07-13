import React from 'react';
import { useState, useRef, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import Menu from './Menu';


const PrivateRoute = ({ element }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
   
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
        setToken(storedToken);
        }
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    if (!token) {
        return <Navigate to="/" replace />;
      }

      return (
        <Menu onLogout={handleLogout} />
      );
};

export default PrivateRoute;