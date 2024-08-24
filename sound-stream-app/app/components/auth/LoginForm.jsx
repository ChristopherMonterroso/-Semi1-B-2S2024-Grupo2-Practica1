'use client';

import { useState } from 'react';
import styles from './LoginForm.module.css';
import Logo from './Logo';
import SignupLink from './SignupLink';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login");
  };

  return (
    <div className={styles.formWrapper}>
      <Logo />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="text"
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
        
        <button type="submit" className={styles.button}>
          Iniciar sesión
        </button>

        {/*submitted && <p className={styles.submittedMessage}>Form submitted!</p>*/}
        
        <SignupLink />
      </form>
    </div>
  );
};

export default LoginForm;