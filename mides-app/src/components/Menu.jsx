import React, { useState } from 'react';
import '../styles/Menu.css'; // Importa tus estilos CSS

const Menu = ({ items, components }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);

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
      {selectedComponent && (
        <div className="selected-component">
          {selectedComponent}
        </div>
      )}
    </div>
  );
};

export default Menu