import ProfileForm from '../app/components/profile/ProfileForm';
import styles from '../styles/LoginPage.module.css';
import '../app/globals.css';

export default function ProfilePage() {
  return (

    <main className={styles.container}>
      <div className={styles.formContainer}>
      <ProfileForm />
      </div>
    </main>
  );
}
