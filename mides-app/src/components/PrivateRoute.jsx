import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';
import '../styles/PrivateRoute.css'; 

const PrivateRoute = ({ element }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const handleTokenChange = () => {
            const newToken = localStorage.getItem('token');
            if (newToken !== token) {
                setToken(newToken);
            }
        };

        handleTokenChange(); 

        window.addEventListener('storage', handleTokenChange);
        return () => {
            window.removeEventListener('storage', handleTokenChange);
        };
    }, [token]);

    useEffect(() => {
        if (!token) {
          setLoading(true);
            navigate('/', { replace: true });
            window.location.reload();
        }
       else {
        setLoading(false); 
    }
    }, [token, navigate]);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            setLoading(true);
            setToken(null);
            navigate('/', { replace: true }); 
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    
    if (loading) {
      return <div className="loading">Cargando...</div>; // Mensaje de carga
  }

    return (
        <Menu onLogout={handleLogout} />
    );
};

export default PrivateRoute;
