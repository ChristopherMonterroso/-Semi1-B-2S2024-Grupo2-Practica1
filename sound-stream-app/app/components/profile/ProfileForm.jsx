import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import styles from './ProfileForm.module.css';
import Modal from './Modal';
import { updateUser } from '../../services/profileService';
import { login } from '../../services/authService';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setName(storedUser.name);
      setLastName(storedUser.lastName);
      setEmail(storedUser.email);
      setProfilePhoto(storedUser.profilePhoto);
    }
  }, []);

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleCancel = () => {
    setIsEditable(false);
    setProfilePhoto(user.profilePhoto);
    setName(user.name);
    setLastName(user.lastName);
    setEmail(user.email);
    setPassword('');
    setError(null);
  };

  const handleSaveChanges = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = new FormData();
      updatedUser.append('name', name);
      updatedUser.append('lastName', lastName);
      updatedUser.append('email', email);
      if (profilePhoto) {
        updatedUser.append('profilePhoto', profilePhoto);
      }
      updatedUser.append('password', password);

      const result = await updateUser(user.id, updatedUser);
      if (result.status) {
        const loginResult = await login(email, password);
        if (loginResult.status) {
          localStorage.setItem('user', JSON.stringify(loginResult.user));
          router.reload();
        } else {
          setError(`Ocurrió un error al actualizar. ${loginResult.message}`);
        }
      } else {
        setError(`Ocurrió un error. ${result.message}`);
      }
    } catch (error) {
      setError('Error al actualizar el perfil. Intente de nuevo.');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setIsEditable(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profilePhotoWrapper}>
        <img 
          src={profilePhoto} 
          alt="Profile Photo" 
          className={styles.profilePhoto} 
        />
        {isEditable && (
          <input
            className={styles.inputFile}
            type="file"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />
        )}
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditable}
            placeholder='Nombre'
          />
        </div>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!isEditable}
            placeholder='Apellido'
          />
        </div>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditable}
            placeholder='Correo electrónico'
          />
        </div>
        {isEditable ? (
          <>
            <button 
              className={styles.button} 
              onClick={handleSaveChanges}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button 
              className={`${styles.button} ${styles.cancelButton}`} 
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button 
            className={styles.button} 
            onClick={handleEdit}
          >
            Editar Perfil
          </button>
        )}

        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>

      {isModalOpen && (
        <Modal 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          password={password}
          setPassword={setPassword}
        />
      )}
    </div>
  );
};

export default ProfilePage;
