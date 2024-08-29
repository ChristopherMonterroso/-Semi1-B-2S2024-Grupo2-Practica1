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


function App() {

    const [Perfil, setPerfil] = useState(false);
    const [ShowPlaylist, setShowPlaylist] = useState(false);
    const [Playlists, setPlaylists] = useState([]);
    const [ActPlaylists, setActPlaylists] = useState(null);
    const [SongsPlaylists, setSongsPlaylists] = useState(null);
    const [Canciones, setCanciones] = useState([]);
    const [ActCancion, setActCancion] = useState([]);

    let userString = localStorage.getItem('user');
    let user = JSON.parse(userString);


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
    



    const handleInicioClick = () => {
        setPerfil(true);
        console.log(Perfil)
    };

    

  return (
    <div className="app">
    <Navbar handleInicioClick={handleInicioClick}/> 
      <div className="main">
        <Sidebar Playlists={Playlists}  setPerfil={setPerfil} UpdatePlaylist={UpdatePlaylist} user={user.id} UpdateCanciones={UpdateCanciones}  setActPlaylists={setActPlaylists}  SongPlaylist={SongPlaylist}/>
        <MainContent Perfil={Perfil} Canciones={Canciones} setActCancion={setActCancion} ShowPlaylist={ShowPlaylist} SongsPlaylists={SongsPlaylists} ActPlaylists={ActPlaylists}/>
      </div>
 
      <Player ActCancion={ActCancion} />
    </div>
  );
}
export default App;
