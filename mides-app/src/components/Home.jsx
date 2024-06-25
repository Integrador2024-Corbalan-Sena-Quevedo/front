import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Bienvenido, {localStorage.getItem("user")}</h1>
      
    </div>
  );
};

export default Home;