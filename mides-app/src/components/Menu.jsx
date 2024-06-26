import React, { useState, useEffect } from 'react';
import '../styles/Menu.css'; // Importa tus estilos CSS

const Menu = ({ items, components }) => {
  const [selectedComponent, setSelectedComponent] = useState(components['Home']);

  
  const handleItemClick = (item) => {
    setSelectedComponent(components[item]);
  };

  return (
    <div className="menu-container">
      <div className="menu">
        {items.map((item, index) => (
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