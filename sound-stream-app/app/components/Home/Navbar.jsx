import React from 'react';
import './Navbar.css'; // Asegúrate de crear un archivo CSS para los estilos

function Navbar({ handleInicioClick }) {
  const handleProfileClick = () => {
    console.log('perfil');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="profile-icon" onClick={handleInicioClick}>
          <img src="usuario.png" alt="Profile" />
        </button>
      </div>
      <div className="navbar-center">
        <input type="text" placeholder="Buscar..." className="search-input" />
        <button className="search-button">Buscar</button>
      </div>
    </div>
  );
}

export default Navbar;
