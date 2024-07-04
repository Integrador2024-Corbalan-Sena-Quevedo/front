import { useState, useRef } from "react";
import {  useNavigate } from "react-router-dom";
import '../styles/Login.css'

const Login = () => {
 
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    let navigate = useNavigate();

    const handleSubmit = (e) => {
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
            
            usuario: nombre,
            password: pass,

        }
 
    
   
  
        fetch('http://localhost:8080/login-usuario', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(elUsuario),
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          if (data.codigo === 200) {
              localStorage.setItem("iduser", data.id);
              localStorage.setItem("apiKey", data.apiKey);
              localStorage.setItem("user", nombre);
              navigate("/menu");
          } else {
              setError('Usuario y/o contraseña incorrectos');
          }
      })
      .catch(error => {
          setError('Ocurrió un error durante el login');
          console.error('Error:', error);
      });
    

      console.log('Username:', nombre);
      console.log('Password:', pass);
  
     
      // Limpiar el formulario
      setUsername('');
      setPassword('');
      setError('');
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
        </form>
      </div>
      );
    };

export default Login;