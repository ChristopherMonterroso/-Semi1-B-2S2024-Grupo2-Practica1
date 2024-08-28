import React from 'react';
import './MainContent.css';

function MainContent({Perfil}) {
  return (
    <div className="main-content">
        {Perfil ? 
        (<>
        hola
        </>
    ) : (
        <>
        <h1>Buenos días</h1>
        <div className="album-section">
            <h2>Explora Álbumes</h2>
            <div className="albums">
            {/* Añade imágenes de los álbumes aquí */}
            <img src="album1.png" alt="Album 1" />
            <img src="album2.png" alt="Album 2" />
            <img src="album3.png" alt="Album 3" />
            {/* Puedes añadir más álbumes */}
            </div>
        </div>
        </>
    )}
    </div>
  );
}

export default MainContent;
