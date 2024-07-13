import { useState, useRef } from "react";
import {  Navigate, useNavigate, Link } from "react-router-dom";
import '../styles/Login.css'


const Login = () => {
 
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!username || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    let nombre = username;
      console.log(nombre);
      let pass = password;
      console.log(pass);

      let elUsuario = {
          username: nombre,
          password: pass,

      }
      try 
      {
        const response = await fetch('http://localhost:8080/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
             
            
          },
          body: JSON.stringify(elUsuario)
        })
        console.log(response)
        if (response.status === 200) {
          const data = await response.json(); 
          console.log(data); 
          if (data.token && data.username) {
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", data.username);
             navigate("/menu/home")
          } else {
            setError("Los datos recibidos no contienen 'token' o 'username'.");
              console.error("Los datos recibidos no contienen 'token' o 'username'.");
          }
        } else {
          setError("El usuario y/o contraseña son incorrectos")
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