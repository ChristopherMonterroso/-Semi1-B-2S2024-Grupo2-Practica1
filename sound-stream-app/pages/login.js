import LoginForm from '../app/components/auth/LoginForm';
import styles from '../styles/LoginPage.module.css';
import '../app/globals.css'

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <div className={styles.imageContainer}></div>
      <div className={styles.formContainer}>
        <LoginForm />
      </div>
    </main>
  );
}