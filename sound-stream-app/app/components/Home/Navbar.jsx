import {React, useState} from 'react';
import './Navbar.css'; // Asegúrate de crear un archivo CSS para los estilos

function Navbar({ handleInicioClick, setShowPlaylist, Canciones, setCanciones , UpdateCanciones}) {

 
  const handleInputChange = (event) => {
    const value = event.target.value;

    setShowPlaylist(false);

    if (value==""){
      UpdateCanciones();
    }else{
       // Filtrar los elementos que coinciden con el valor ingresado
    const filteredItems = Canciones.filter(item => 
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    // Imprimir las coincidencias en la consola
    setCanciones(filteredItems);
    }

   
  };



  

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="profile-icon" onClick={handleInicioClick}>
          <img src="usuario.png" alt="Profile" />
        </button>
      </div>
      <div className="navbar-center">
        <input onChange={handleInputChange} type="text" placeholder="Buscar..." className="search-input" />
      </div>
    </div>
  );
}

export default Navbar;
