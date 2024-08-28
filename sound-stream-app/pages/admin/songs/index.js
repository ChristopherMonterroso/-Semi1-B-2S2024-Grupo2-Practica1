import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSongs, deleteSong } from '../../../app/services/songsService';
import ConfirmModal from '../../../app/components/songs/ConfirmModal';
import styles from '../../../styles/SongsPage.module.css';
import '../../../app/globals.css'

const SongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.rol !== 'Admin') {
      router.push('/');
    } else {
      const loadSongs = async () => {
        const songsData = await getSongs();
        setSongs(songsData.songs);
        setLoading(false);
      };

      loadSongs();
    }
  }, [router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const isDeleted = await deleteSong(songToDelete);
    if (isDeleted) {
      setSongs(songs.filter(song => song.id !== songToDelete));
      setShowConfirmModal(false);
    } else {
      alert('Error al eliminar la canción');
    }
    setIsDeleting(false);
  };

  const handleEdit = (id) => {
    router.push(`/admin/songs/${id}`);
  };

  const handleCreateNewSong = () => {
    router.push('/admin/songs/new');
  };

  const openConfirmModal = (id) => {
    setSongToDelete(id);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSongToDelete(null);
  };

  if (loading) return <p>Cargando canciones...</p>;

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>Gestión de canciones</h1>
      <button className={styles.createButton} onClick={handleCreateNewSong}>
        Crear nueva canción
      </button>
      <ul className={styles.songList}>
        {Array.isArray(songs) && songs.length > 0 ? (
          songs.map((song) => (
            <li key={song.id} className={styles.songItem}>
              <img src={song.photo} alt={song.name} className={styles.songImage} />
              <div className={styles.songDetails}>
                <p>Nombre: {song.name}</p>
                <p>Artista: {song.artist}</p>
                <p>Duración: {song.duration}</p>
                <p>Fecha de Creación: {song.creationDate}</p>
                <audio controls>
                  <source src={song.mp3File} type="audio/mpeg" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
              <div className={styles.songActions}>
                <button 
                  className={styles.editButton} 
                  onClick={() => handleEdit(song.id)}
                >
                  Editar
                </button>
                <button 
                  className={styles.deleteButton} 
                  onClick={() => openConfirmModal(song.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No se encontraron canciones.</p>
        )}
      </ul>

      {showConfirmModal && (
        <ConfirmModal
          message="¿Estás seguro de que quieres eliminar esta canción?"
          onConfirm={handleDelete}
          onCancel={closeConfirmModal}
          loading={isDeleting}
        />
      )}
    </div>
  );
};

export default SongsPage;