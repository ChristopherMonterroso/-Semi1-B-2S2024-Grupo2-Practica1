import { useState } from 'react';
import { useRouter } from 'next/router';
import { createSong } from '../../../app/services/songsService';
import Modal from '../../../app/components/songs/Modal';
import styles from '../../../styles/NewSongPage.module.css';
import '../../../app/globals.css';

const CreateSongPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    artist: '',
    photo: null,
    mp3File: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [previewAudio, setPreviewAudio] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const seconds = 3;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });

      if (name === 'photo') {
        setPreviewImage(URL.createObjectURL(files[0]));
      } else if (name === 'mp3File') {
        const file = files[0];
        setPreviewAudio(URL.createObjectURL(file));

        const audio = new Audio(URL.createObjectURL(file));
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
    setIsCreating(true);
    setModalMessage('Creando la canción, por favor espera...');
    setShowModal(true);

    const newSong = await createSong(formData);

    setIsCreating(false);
    if (newSong) {
      setModalMessage('Canción creada con éxito. Redirigiendo a la página de canciones..');
      setTimeout(() => {
        setShowModal(false);
        router.push('/admin/songs');
      }, seconds * 1000);
    } else {
      setModalMessage('Error al crear la canción');
      setTimeout(() => {
        setShowModal(false);
      }, seconds * 1000);
    }
  };

  return (
    <div className={styles.createSongContainer}>
      <div className={styles.title}>Crear Nueva Canción</div>
      <form onSubmit={handleSubmit} className={styles.createSongForm}>
        <input
          type="text"
          name="name"
          placeholder="Nombre de la canción"
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
            required
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
            required
            className={styles.fileInput}
          />
        </label>
        {previewAudio && (
          <audio controls className={styles.audioPlayer}>
            <source src={previewAudio} type="audio/mpeg" />
            Tu navegador no soporta la reproducción de audio.
          </audio>
        )}
        
        <button type="submit" className={styles.submitButton} disabled={isCreating}>
          {isCreating ? 'Creando...' : 'Crear Canción'}
        </button>
      </form>

      {showModal && <Modal message={modalMessage} />}
    </div>
  );
};

export default CreateSongPage;
