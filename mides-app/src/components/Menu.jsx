import React, { useState, useEffect } from 'react';
import '../styles/Menu.css';
import FileUpload from './UploadCSV';
import Home from './Home';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
import ListaOperadores from './ListaOperadores'; 
import { JobMatch } from './JobMatch';
import BusquedaConFiltros from './BusquedaFiltrado';

const Menu = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState('Home');
  const rol = localStorage.getItem('rol');

  const components = {
    'Home': <Home />,
    'Subir archivo': <FileUpload />,
    'Match' : <JobMatch/>,
    'Lista de Operadores' : <ListaOperadores/>,
    'Filtro de candidatos': <BusquedaConFiltros/>,
    'Logout': <Logout onLogout={onLogout} />
    

    
  };

  const menuItems = {
    'ADMIN': ['Home', 'Subir archivo', 'Match','Lista de Operadores', 'Filtro de candidatos', 'Logout'],
    'OPERADOR_LABORAL_SUPERIOR': ['Home', 'Subir archivo', 'Logout'],
    'OPERADOR_LABORAL_NOVATO': ['Home', 'Logout']
  };

  const handleItemClick = (item) => {
    setSelectedComponent(item);
    navigate(`/menu/${item.toLowerCase().replaceAll(' ', '-')}`);
  };

  return (
    <div className="menu-container">
      <div className="menu">
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