import React from 'react';
import './Player.css';

function Player() {
  return (
    <div className="player">
      <p>Now Playing: One Call Away - Charlie Puth</p>
      <div className="controls">
        {/* Controles de reproducción */}
        <button>⏮</button>
        <button>⏯</button>
        <button>⏭</button>
      </div>
      <div className="progress-bar">
        {/* Barra de progreso */}
        <div className="progress"></div>
      </div>
    </div>
  );
}

export default Player;
