import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
   
    const success = localStorage.getItem('registrationSuccess');
    if (success) {
      setSuccessMessage(success);
    
      localStorage.removeItem('registrationSuccess');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!username || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    let elUsuario = {
      username,
      password,
    };

    try {
      const response = await fetch('http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(elUsuario),
      });

      if (response.status === 200) {
        const data = await response.json(); 
        if (data.token && data.username) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", data.username);
          localStorage.setItem("rol", data.rol);
          localStorage.setItem("email", data.email)
          navigate("/menu/home");
        } else {
          setError("Los datos recibidos no contienen 'token' o 'username'.");
          console.error("Los datos recibidos no contienen 'token' o 'username'.");
        }
      } else {
        setError("El usuario y/o contraseña son incorrectos");
        console.error('Error en la respuesta del servidor:', response.status);
      }
    } catch (error) {
      setError('Ocurrió un error durante el login');
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
        {/* Mostrar mensaje de éxito si existe */}
        {successMessage && (
          <div className="success-message">
            <p style={{ color: 'green' }}>{successMessage}</p>
          </div>
        )}

        <div className="form-group">
          <label>Usuario:</label>
          <input
            id="usuarioInput"
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
        <button type="submit" className="btn-login">Login</button>
        
        <div className="error-container">
          {error && <p className="error">{error}</p>}
        </div>
        
        <p><Link to="/register" className="btn-linkRegistro">Registrarse</Link></p>
      </form>
    </div>
  );
};

export default Login;