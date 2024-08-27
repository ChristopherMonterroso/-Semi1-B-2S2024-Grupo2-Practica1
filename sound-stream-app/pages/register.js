import RegisterForm from '../app/components/auth/RegisterForm';
import styles from '../styles/LoginPage.module.css';
import '../app/globals.css';

export default function RegisterPage() {
  return (
    <main className={styles.container}>
      <div className={styles.imageContainer}></div>
      <div className={styles.formContainer}>
        <RegisterForm />
      </div>
    </main>
  );
}
