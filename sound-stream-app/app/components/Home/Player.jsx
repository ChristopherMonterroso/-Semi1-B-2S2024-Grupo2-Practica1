import React, { useState, useEffect, useRef } from 'react';
import './Player.css';

function Player({ActCancion}) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Verificar que haya canciones antes de intentar acceder a una
  const cancion = ActCancion.length > 0 ? ActCancion[currentSongIndex] : null;

  useEffect(() => {
    if (cancion && audioRef.current) {
      // Cargar el archivo de audio cuando cancion cambie
      audioRef.current.src = cancion.mp3File;
      audioRef.current.load();

      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };

      const handleEnded = () => {
        handleNext(); // Pasar a la siguiente canción cuando la actual termine
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);

      audioRef.current.play(); // Reproducir automáticamente cuando se cargue una canción

      // Limpiar eventos cuando se desmonta el componente
      return () => {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
      };
    }
  }, [cancion]);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleNext = () => {
    if (ActCancion.length > 0) {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === ActCancion.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrev = () => {
    if (ActCancion.length > 0) {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === 0 ? ActCancion.length - 1 : prevIndex - 1
      );
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="player">
      {cancion ? (
        <>
          <audio ref={audioRef} />
          <div className="player-info">
            <img src={cancion.photo} alt={cancion.name} className="song-photo" />
            <div className="song-details">
              <p className="song-name">{cancion.name}</p>
              <p className="artist-name">{cancion.artist}</p>
            </div>
            <button className="add-button">➕</button>
          </div>
          <div className="controls">
            <button className="control-button" onClick={handlePrev}>⏮</button>
            <button className="control-button" onClick={handlePlayPause}>⏯</button>
            <button className="control-button" onClick={handleNext}>⏭</button>
          </div>
          <div className="progress-container">
            <span>{formatTime(currentTime)}</span>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${(currentTime / duration) * 100}%`,
                }}
              ></div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </>
      ) : (
        <p>No hay ninguna canción seleccionada.</p>
      )}
    </div>
  );
}

export default Player;
