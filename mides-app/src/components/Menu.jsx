import React, { useState } from 'react';
import '../styles/Menu.css';
import FileUpload from './UploadCSV';
import Home from './Home';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
import ListaOperadores from './ListaOperadores'; 
import { JobMatch } from './JobMatch';
import BusquedaConFiltros from './BusquedaFiltrado';
import logo from '../img/midelogo.png';
import Estadisticas from './Estadisticas';
import  Follow from './FollowNew';
import FollowView from './FollowView';
import BusquedaConFiltrosEmpleos from './BusquedaFiltradoEmpresa';


const Menu = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState('Home');
  const rol = localStorage.getItem('rol');

  const components = {
    'Home': <Home />,
    'Subir archivo': <FileUpload />,
    'Match' : <JobMatch />,
    'Lista de Operadores' : <ListaOperadores />,
    'Filtro de candidatos': <BusquedaConFiltros />,
    'Estadísticas y reportes' : <Estadisticas/>,
    'Nuevo seguimiento': <Follow/>,
    'Ver seguimientos': <FollowView/>,
    'Filtro empresas': <BusquedaConFiltrosEmpleos/> ,
    'Logout': <Logout onLogout={onLogout} />
  };

  const menuItems = {
    'ADMIN': ['Home', 'Subir archivo', 'Match', 'Lista de Operadores', 'Filtro de candidatos','Filtro empresas','Nuevo seguimiento', 'Ver seguimientos', 'Estadísticas y reportes', 'Logout'],
    'OPERADOR_LABORAL_SUPERIOR': ['Home', 'Subir archivo','Filtro de candidatos', 'Filtro empresas', 'Nuevo seguimiento', 'Ver seguimientos', 'Estadísticas y reportes','Logout'],
    'OPERADOR_LABORAL_NOVATO': ['Home', 'Logout']
  };

  const handleItemClick = (item) => {
    if (selectedComponent !== item) {
      setSelectedComponent(item);
      navigate(`/menu/${item.toLowerCase().replace(/ /g, '-')}`);
    }
  };

  return (
    <div className="menu-container">
      <div className="menu">
        <img src={logo} alt="Logo" className="menu-logo" />
        {menuItems[rol]?.map((item, index) => (
          <button
            key={index}
            className={`menu-item ${selectedComponent === item ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="selected-component">
        {components[selectedComponent]}
      </div>
    </div>
  );
};

export default Menu;
