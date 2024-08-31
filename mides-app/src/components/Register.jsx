import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!username || !password || !name) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const nuevoUsuario = {
      username,
      password,
      name
    };

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.status === 200) {
        const data = await response.json();
       

   
        localStorage.setItem('registrationSuccess', 'Registrado exitosamente');

        
        navigate('/');
      } else {
        setError('Error al registrar el usuario.');
      }
    } catch (error) {
      setError('Ocurrió un error durante el registro.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Registrar Usuario</h2>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-register">Registrarse</button>
        <div className="error-container">
          {error && <p className="error">{error}</p>}
          <p><Link to="/" className="btn-linkLogin">Volver</Link></p>
        </div>

      </form>
    </div>
  );
};

export default Register;