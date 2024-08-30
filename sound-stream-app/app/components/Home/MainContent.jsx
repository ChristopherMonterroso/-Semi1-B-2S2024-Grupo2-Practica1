import { React, useState } from "react";
import { EDIT_USER } from "../../services/EditPerfil";
import { ADDFAVORITE } from "../../services/LikeFavorite";
import { DEL_SONGPLAYLIST } from "../../services/DelSongPlay";
import { DEL_PLAYLIST } from "../../services/DelPLaylist";
import { DEL_SONGFAVORITE } from "../../services/DelSongFav";
import { ADDSONGPLAY } from "../../services/AddSongPlay";
import { login } from "../../services/authService";

import "./MainContent.css";

function MainContent({
  Perfil,
  Canciones,
  setActCancion,
  ShowPlaylist,
  ActPlaylists,
  SongsPlaylists,
  SongPlaylist,
  UpdateCanciones,
  UpdatePlaylist,
  Playlists
}) {
  let userString = localStorage.getItem("user");
  let user = JSON.parse(userString);

  const [showModal, setShowModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [MSJ, setMSJ] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [lastName, setlastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [profilePhoto, setprofilePhoto] = useState(user.profilePhoto);
  const [password, setPassword] = useState("");
  const [Idsong, setIdsong] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(null); // Estado para la canción actual

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleMSJClick = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 1000); // Desaparece después de 2 segundos
  };


  const handleDeleteClick = async(idDel) => {

    if(ActPlaylists.id == -1){
      try {
        const result = await DEL_SONGFAVORITE(user.id, idDel);
  
        if(result.status){
  
          setMSJ(result.message)
          handleMSJClick();
  
        }else{
          setMSJ(result.message)
          handleMSJClick();
        }
       
      } catch (error) {
        alert('No se logro conectarse');
      } 

    }else{


    try {
      const result = await DEL_SONGPLAYLIST(ActPlaylists.id, idDel);

      if(result.status){

        setMSJ(result.message)
        handleMSJClick();

      }else{
        setMSJ(result.message)
        handleMSJClick();
      }
     
    } catch (error) {
      alert('No se logro conectarse');
    } 
  }

  SongPlaylist(ActPlaylists.id)

  };

  const handleDeletePlayClick = async() => {

    if(ActPlaylists.id == -1){
      setMSJ("Favorite no se puede eliminar!!")
        handleMSJClick();

    }else{
    try {
      const result = await DEL_PLAYLIST(ActPlaylists.id);

      if(result.status){

        setMSJ(result.message)
        handleMSJClick();
        UpdatePlaylist();
        UpdateCanciones();

      }else{
        setMSJ(result.message)
        handleMSJClick();
      }
     
    } catch (error) {
      alert('No se logro conectarse');
    } 
  }
};


  const handleLikeClick = async(idfav) => {

    try {
      const result = await ADDFAVORITE(user.id, idfav);

      if(result.status){

        setMSJ(result.message)
        handleMSJClick();

      }else{
        setMSJ(result.message)
        handleMSJClick();
      }
     
    } catch (error) {
      alert('No se logro conectarse');
    } 

  };

  const handleAddSoPlClick = async(idPlay) => {

    try {
      const result = await ADDSONGPLAY(idPlay, Idsong);

      if(result.status){

        setMSJ(result.message)
        handleMSJClick();

      }else{
        setMSJ(result.message)
        handleMSJClick();
      }
     
    } catch (error) {
      alert('No se logro conectarse');
    } 

    setShowModal(false);

  };



  const handleCancelClick = () => {
    setIsEditing(false);
    setName(user.name);
    setlastName(user.lastName);
    setEmail(user.email);
    setprofilePhoto(user.profilePhoto);
    setPassword("");
  };

  const handleprofilePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setprofilePhoto(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = async () => {
    const resBody = {
      name: name,
      lastName: lastName,
      email: email,
      profilePhoto: profilePhoto,
      password: password,
    };

    try {
      const result = await EDIT_USER(user.id, resBody);
      if (result.status) {
        console.log("Edit successful:", result);
        // localStorage.setItem('user', JSON.stringify(result.user));
        setIsEditing(false);

        alert("Datos actualizados correctamente.");
      } else {
        alert("Contraseña incorrecta. No se guardaron los datos.");
      }
    } catch (error) {
      alert("No se logro conectarse");
    }

    try {
      const result = await login(email, password);
      if (result.status) {
        localStorage.setItem("user", JSON.stringify(result.user));
        userString = localStorage.getItem("user");
        user = JSON.parse(userString);
        console.log(user);
      }
    } catch (error) {
      alert("Error al recuperar datos");
    }
  };

  const handleSongClick = (Cancion) => {
    console.log([Cancion]);
    setActCancion([Cancion]);
  };

  const handleSongsClick = () => {
    console.log();
    setActCancion(SongsPlaylists);
  };

  const handleNewPlaylistClick = (IdCan) => {
    setIdsong(IdCan);
    UpdatePlaylist();
    setShowModal(true);
  };



  return (
    <div className="main-content">
      {Perfil ? (
        <>
          <h2>Información del usuario</h2>
          <div className="profile-section">
            <div className="profile-pic">
              <img
                src={profilePhoto}
                alt="Foto de perfil"
                className="profile-pic-preview"
              />
            </div>
            {isEditing ? (
              <div className="profile-info">
                <div>
                  <label>
                    Nombre:
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Apellido:
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setlastName(e.target.value)}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Correo electrónico:
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Foto de perfil:
                    <input type="file" onChange={handleprofilePhotoChange} />
                  </label>
                </div>
                <div>
                  <label>
                    Contraseña:
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                </div>
                <div className="buttons">
                  <button className="button-save" onClick={handleSaveClick}>
                    Guardar cambios
                  </button>
                  <button
                    className="button-cancelar"
                    onClick={handleCancelClick}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <p>
                  <strong>Nombre:</strong> {name}
                </p>
                <p>
                  <strong>Apellido:</strong> {lastName}
                </p>
                <p>
                  <strong>Correo electrónico:</strong> {email}
                </p>
                <button className="button-editar" onClick={handleEditClick}>
                  Editar
                </button>
              </div>
            )}
          </div>
        </>
      ) : ShowPlaylist ? (
        <>
          <div className="playlist-view1">
            <div className="playlist-info1">
              <div className="playlist-image-container">
                <img
                  src={ActPlaylists.cover}
                  alt="Album cover"
                  className="playlist-image1"
                />
              </div>
              <div className="playlist-text1">
                <h1>{ActPlaylists.name}</h1>
                <p>{ActPlaylists.description}</p>
              </div>
            </div>
            <div className="playlist-buttons">
              <button  onClick={() => handleSongsClick()} className="play-icon">▶️</button>
              <button onClick={() => handleDeletePlayClick()} className="icon-btn">🗑️</button>
            </div>
            <div className="title-items">
                <div className="song-header-index">
                  <span>#</span>
                </div>
                <div className="song-header-title">
                  <span>Título</span>
                </div>
                <div className="song-header-duration">
                  <span>⏰</span>
                </div>
                <div className="song-header-album">
                  <span>Like</span>
                </div>
                <div className="song-header-date-added">
                  <span>delete</span>
                </div>
            </div>
            
              {SongsPlaylists.map((Cancion, index) => (
                <div key={index} className="song-item">
                <div className="song-index">
                  <button  onClick={() => handleSongClick(Cancion)} className="play-icon">▶️</button>
                </div>
                <div className="song-info">
                  <img
                    src={Cancion.photo}
                    alt="Song Thumbnail"
                    className="song-thumbnail"
                  />
                  <div>
                    <span className="song-title">{Cancion.name}</span>
                    <span className="song-artist">{Cancion.artist}</span>
                  </div>
                </div>
                <div className="song-duration">{Cancion.duration}</div>
                <div className="butto-like">
                  <button onClick={() => handleLikeClick(Cancion.id)} className="icon-btn">❤️</button>
                </div>
                <div className="butto-like">
                  <button onClick={() => handleDeleteClick(Cancion.id)} className="icon-btn">🗑️</button>
                </div>
              </div>
              ))}
              
          </div>
        </>
      ) : (
        <>
          <h1>Buenos días</h1>
          <div className="album-section">
            <h2>Canciones</h2>
            <div className="albums">
              {Canciones.map((Cancion, index) => (
                <div key={index} className="album">
                  <img
                    src={Cancion.photo}
                    alt={Cancion.name}
                    className="album-img"
                  />
                  <p>
                    <strong>{Cancion.name}</strong>
                  </p>
                  <p>{Cancion.artist}</p>
                  <div className="play-buttons-container">
                    <button
                      onClick={() => handleSongClick(Cancion)}
                      className="play-button"
                    >
                      ▶️
                    </button>
                    <button
                      onClick={() => handleLikeClick(Cancion.id)}
                      className="like-button"
                    >
                      ❤️
                    </button>
                    <button
                      onClick={() => handleNewPlaylistClick(Cancion.id)}
                      className="addPlaylist-button"
                    >
                      ➕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
          <div className="playlist-section">
          {Playlists.map((playlist, index) => (
            <div key={index} className="playlist-item" onClick={() => handleAddSoPlClick(playlist.id)}>
              <img src={playlist.cover} alt={playlist.name} className="playlist-image"/>
              <div className="playlist-details">
                <p>{playlist.name}</p>
              </div>
            </div>
          ))}
        </div>
          </div>
        </div>
      )}
       <div className="playlist-view">
      {/* El mensaje que aparecerá y desaparecerá */}
      {showMessage && <div className="message">{MSJ}</div>}
      </div>
    </div>
  );
}

export default MainContent;
