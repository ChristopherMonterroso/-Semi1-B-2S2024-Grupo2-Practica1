import { useRouter } from 'next/router';
import styles from '../../styles/AdminPage.module.css';
import '../../app/globals.css';

const AdminPage = () => {
  const router = useRouter();

  const handleCategoryClick = () => {
    router.push('/admin/songs');
  };

  const handleGoHome = () => {
    router.push('/home');
  };

  return (
    <div className={styles.adminContainer}>
      <button className={styles.goHomeButton} onClick={handleGoHome}>
        Regresar a Home
      </button>
      <h1>Panel de administración</h1>
      <p>Seleccione una categoría para gestionar:</p>
      <button className={styles.categoryButton} onClick={handleCategoryClick}>
        Canciones
      </button>
    </div>
  );
};

export default AdminPage;
