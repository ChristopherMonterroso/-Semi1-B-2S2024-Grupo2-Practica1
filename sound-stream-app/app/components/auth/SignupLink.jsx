import Link from 'next/link';
import styles from './LoginForm.module.css';

const SignupLink = () => {
  return (
    <div className={styles.signupLink}>
      <p>¿Aun no tienes cuenta?</p>
      <Link href="/register" className={styles.link}>
        Registrate
      </Link>
    </div>
  );
};

export default SignupLink;
