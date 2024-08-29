import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/AdminPage.module.css';
import '../../app/globals.css';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.rol !== 'Admin') {
      router.push('/');
    } else {
      setUser(storedUser);
      setLoading(false);
    }
  }, [router]);

  const handleCategoryClick = () => {
    router.push('/admin/songs');
  };

  if (loading) return null;

  return (
    <div className={styles.adminContainer}>
      <h1>Panel de administración</h1>
      <p>Seleccione una categoría para gestionar:</p>
      <button className={styles.categoryButton} onClick={handleCategoryClick}>
        Canciones
      </button>
    </div>
  );
};

export default AdminPage;
