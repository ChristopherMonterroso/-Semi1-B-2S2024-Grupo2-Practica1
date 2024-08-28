import {React, useState} from 'react';
import Navbar from './Navbar'; 
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Player from './Player';
import './Home.css';

function App() {


    const [Perfil, setPerfil] = useState(false);

    const handleInicioClick = () => {
        setPerfil(prevPerfil => !prevPerfil);
        console.log(Perfil)
    };

    

  return (
    <div className="app">
    <Navbar handleInicioClick={handleInicioClick}/> 
      <div className="main">
        <Sidebar />
        <MainContent Perfil={Perfil}/>
      </div>
      <Player />
    </div>
  );
}
export default App;
