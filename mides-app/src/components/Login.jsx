import { useState } from "react";
import '../styles/Login.css'

const Login = () => {
 
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validar campos
      if (!username || !password) {
        setError('Por favor, complete todos los campos.');
        return;
      }
  
      // Aquí se puede agregar la lógica de autenticación
      console.log('Username:', username);
      console.log('Password:', password);
  
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