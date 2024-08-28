'use client';

import { useState } from 'react';
import { useRouter } from 'next/router'; 
import styles from './LoginForm.module.css';
import Logo from '../logo/Logo';
import { registerUser } from '../../services/registerService';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await registerUser(name, lastName, email, password, birthdate, profilePhoto);
      if (result.status) {
        console.log('Registration successful:', result);
        router.push('/login');
      } else {
        setError(`Ocurrió un error. ${result.message}`);
      }
    } catch (error) {
      setError('Error al registrar. Intente de nuevo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <Logo />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Nombre'
          />
        </div>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder='Apellido'
          />
        </div>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Correo electrónico'
          />
        </div>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Contraseña'
          />
        </div>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
            placeholder='Fecha de nacimiento'
          />
        </div>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="file"
            id="profilePhoto"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;