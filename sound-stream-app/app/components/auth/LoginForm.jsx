'use client';

import { useState } from 'react';
import { useRouter } from 'next/router'; 
import styles from './LoginForm.module.css';
import Logo from './Logo';
import SignupLink from './SignupLink';
import { login } from '../../services/authService';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(email, password);
      if (result.status) {
        console.log('Login successful:', result);
        router.push('/');
      } else {
        setError(`Ocurrio un error. ${result.message}`);
      }
    } catch (error) {
      setError('Error al iniciar sesión. Intente de nuevo');
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

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>

        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <SignupLink />
      </form>
    </div>
  );
};

export default LoginForm;
