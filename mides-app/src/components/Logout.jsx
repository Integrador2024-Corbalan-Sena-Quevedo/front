import { Link, useNavigate } from "react-router-dom";
import '../styles/Logout.css'
const Logout = () => {
  const navigate = useNavigate();
    const borrarSesion = () => {
      localStorage.clear();
      
      navigate("/");
      
    };
  
    return (
      <div className="logout-container">
        <label>Log out</label>
        <Link  to="/" id="linkLogout" onClick={borrarSesion}>
          Cerrar sesión
        </Link>
      </div>
    );
  };
  

export default Logout