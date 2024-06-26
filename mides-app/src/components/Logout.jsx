import { Link, useNavigate } from "react-router-dom";
const Logout = () => {
    const borrarSesion = () => {
      localStorage.clear();
      console.log("Sesión cerrada");
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