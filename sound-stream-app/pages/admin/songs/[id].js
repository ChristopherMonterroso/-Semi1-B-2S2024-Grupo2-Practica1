import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSongById, updateSong } from '../../../app/services/songsService';
import Modal from '../../../app/components/songs/Modal';
import styles from '../../../styles/NewSongPage.module.css';
import '../../../app/globals.css';

const EditSongPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    artist: '',
    photo: null,
    mp3File: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [previewAudio, setPreviewAudio] = useState(null);
  const [audioKey, setAudioKey] = useState(Date.now());
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const seconds = 3;

  useEffect(() => {
    if (id) {
      const fetchSong = async () => {
        const songResponse = await getSongById(id);
        if (songResponse) {
          setFormData({
            name: songResponse.song.name,
            duration: songResponse.song.duration,
            artist: songResponse.song.artist,
            photo: null,
            mp3File: null,
          });
          setPreviewImage(songResponse.song.photo);
          setPreviewAudio(songResponse.song.mp3File);
          setAudioKey(Date.now());
        }
      };

      fetchSong();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (name === 'photo') {
        setFormData({ ...formData, photo: file });
        setPreviewImage(URL.createObjectURL(file));
      } else if (name === 'mp3File') {
        setFormData({ ...formData, mp3File: file });

        const audioUrl = URL.createObjectURL(file);
        setPreviewAudio(audioUrl);
        setAudioKey(Date.now()); 

        const audio = new Audio(audioUrl);
        audio.onloadedmetadata = () => {
          const duration = audio.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
          setFormData((prevFormData) => ({
            ...prevFormData,
            duration: `${minutes}:${seconds}`,
          }));
        };
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setModalMessage('Actualizando la canción, por favor espera...');
    setShowModal(true);

    const updatedFormData = {
      ...formData,
      mp3File: formData.mp3File ? formData.mp3File : null,
    };

    const isUpdated = await updateSong(id, updatedFormData);

    setIsUpdating(false);
    if (isUpdated) {
      setModalMessage('Canción actualizada con éxito. Redirigiendo a la página de canciones..');
      setTimeout(() => {
        setShowModal(false);
        router.push('/admin/songs');
      }, seconds * 1000);
    } else {
      setModalMessage('Error al actualizar la canción');
      setTimeout(() => {
        setShowModal(false);
      }, seconds * 1000);
    }
  };

  return (
    <div className={styles.createSongContainer}>
      <div className={styles.title}>Editar Canción</div>
      <form onSubmit={handleSubmit} className={styles.createSongForm}>
        <input
          type="text"
          name="name"
          placeholder="Nombre de la canción"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duración (mm:ss)"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="artist"
          placeholder="Artista"
          value={formData.artist}
          onChange={handleChange}
          required
        />
        
        <label className={styles.fileLabel}>
          Seleccionar Imagen:
          <input
            type="file"
            name="photo"
            onChange={handleChange}
            accept="image/*"
            className={styles.fileInput}
          />
        </label>
        {previewImage && <img src={previewImage} alt="Preview" className={styles.previewImage} />}

        <label className={styles.fileLabel}>
          Seleccionar Archivo MP3:
          <input
            type="file"
            name="mp3File"
            onChange={handleChange}
            accept="audio/mpeg"
            className={styles.fileInput}
          />
        </label>
        {previewAudio && (
          <audio key={audioKey} controls className={styles.audioPlayer}>
            <source src={previewAudio} type="audio/mpeg" />
            Tu navegador no soporta la reproducción de audio.
          </audio>
        )}
        
        <button type="submit" className={styles.submitButton} disabled={isUpdating}>
          {isUpdating ? 'Actualizando...' : 'Actualizar Canción'}
        </button>
      </form>

      {showModal && <Modal message={modalMessage} />}
    </div>
  );
};

export default EditSongPage;
