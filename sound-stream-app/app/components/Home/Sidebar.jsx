import React from 'react';
import { useRouter } from 'next/router';
import './Sidebar.css'; // Archivo de estilos


function Sidebar() {

  const router = useRouter(); 

  const handleInicioClick = () => {
    console.log("home")
    router.push('/home');
  };


  return (
    <div className="sidebar">
      <div className="logo"> 
        <img src="logo.png" alt="Logo" />
      </div>
      <ul>
        <li onClick={handleInicioClick}>Inicio</li>
        <li onClick={handleInicioClick}>Playlist</li>
      </ul>
    </div>
  );
}

export default Sidebar;
