import {React, useState, useEffect} from 'react';
import Navbar from './Navbar'; 
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Player from './Player';
import { LIST_PLAYLIST } from '../../services/ListPlaylist';
import { LIST_SONGS } from '../../services/ListCanciones';
import { LIST_SONGSPLAYLIST } from '../../services/SongPlayl';
import { LIST_SONGSFAVORITES } from '../../services/SongFavorites';
import './Home.css';
import Cookies from 'js-cookie';


function App() {

    const [Perfil, setPerfil] = useState(false);
    const [ShowPlaylist, setShowPlaylist] = useState(false);
    const [Playlists, setPlaylists] = useState([]);
    const [ActPlaylists, setActPlaylists] = useState(null);
    const [SongsPlaylists, setSongsPlaylists] = useState(null);
    const [Canciones, setCanciones] = useState([]);
    const [ActCancion, setActCancion] = useState([]);

    const userCookie = Cookies.get('user');
    let user = {
      id: -1
    };
    
    if (userCookie) {
      try {
        user = JSON.parse(userCookie);
      } catch (error) {
        console.error("Error al parsear la cookie 'user':", error);
      }
    } else {
      console.warn("No se encontró la cookie 'user'");
    }

    useEffect(() => {
      // Esto se ejecutará una vez cuando el componente se monte (cargue o recargue la página)
      UpdateCanciones();

  }, []);

    const UpdatePlaylist = async() => {
    
        try {
          const result = await LIST_PLAYLIST(user.id);
          if (result.status) {
            console.log('Edit successful:', result);
            
            setPlaylists(result.playlist)
            
          } else {
            
            setPlaylists([])
            alert(result.message);
          }
        } catch (error) {
          alert('No se logro conectarse');
        } 

    };


    const UpdateCanciones = async() => {
    
      try {
        const result = await LIST_SONGS();
        if (result.status) {
          console.log('get successful:', result);
          
          setCanciones(result.songs)
          
        } else {
          setCanciones([])
          console.log(result.message);
        }
      } catch (error) {
        console.log('No se logro conectarse');
      } 

      setShowPlaylist(false)

  };


  const SongPlaylist = async(id) => {
    if (id == -1){

      try {
        const result = await LIST_SONGSFAVORITES(user.id);
  
        if (result.hasOwnProperty('status')) {
          setSongsPlaylists([])
          console.log(result.message);
        }else{
          console.log('Edit successful:', result);
        
          const songsArray = result.map(info => info.Song);
          setSongsPlaylists(songsArray)

        }
      } catch (error) {
        alert('No se logro conectarse');
      } 

    }else{

    try {
      const result = await LIST_SONGSPLAYLIST(id);


      if (result.hasOwnProperty('status')) {
        setSongsPlaylists([])
        console.log(result.message);
      }else{
        console.log('Edit successful:', result);
        setSongsPlaylists(result)

      }
    } catch (error) {
      alert('No se logro conectarse');
    } 
  }

    setShowPlaylist(true);

    
};


const handleRadioClick = () => {
  UpdateCanciones();

  const shuffledCanciones = [...Canciones];

  for (let i = shuffledCanciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledCanciones[i], shuffledCanciones[j]] = [shuffledCanciones[j], shuffledCanciones[i]];
  }

  setActCancion(shuffledCanciones);

};

    



    const handleInicioClick = () => {
        setPerfil(true);
        console.log(Perfil)
    };

    

  return (
    <div className="app">
    <Navbar setShowPlaylist={setShowPlaylist} UpdateCanciones= {UpdateCanciones} Canciones={Canciones} setCanciones={setCanciones} /> 
      <div className="main">
        <Sidebar handleRadioClick={handleRadioClick} Playlists={Playlists}  setPerfil={setPerfil} UpdatePlaylist={UpdatePlaylist} user={user.id} UpdateCanciones={UpdateCanciones}  setActPlaylists={setActPlaylists}  SongPlaylist={SongPlaylist}/>
        <MainContent Playlists={Playlists} UpdateCanciones= {UpdateCanciones} UpdatePlaylist={UpdatePlaylist} SongPlaylist={SongPlaylist} Perfil={Perfil} Canciones={Canciones} setActCancion={setActCancion} ShowPlaylist={ShowPlaylist} SongsPlaylists={SongsPlaylists} ActPlaylists={ActPlaylists}/>
      </div>
 
      <Player  ActCancion={ActCancion} />
    </div>
  );
}
export default App;
