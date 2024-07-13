import React, { useState, useEffect } from 'react';
import '../styles/Menu.css'; 
import FileUpload from './UploadCSV';
import Home from './Home';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';




const Menu = ({ onLogout }) => {
  const components = {
    'Home': <Home />,
    'Subir archivo': <FileUpload />,
    'Logout': <Logout onLogout={onLogout} />
  };
  const [selectedComponent, setSelectedComponent] = useState(components['Home']);
  const navigate = useNavigate();
  

  const handleItemClick = (item) => {
    setSelectedComponent(components[item]);
    navigate(`/menu/${item.toLowerCase().replace(' ', '-')}`);
  };
  return (
    <div className="menu-container">
      <div className="menu">
        {Object.keys(components).map((item, index) => (
          <div
            key={index}
            className={`menu-item ${selectedComponent === components[item] ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="selected-component">
        {selectedComponent}
      </div>
    </div>
  );
};


export default Menu;