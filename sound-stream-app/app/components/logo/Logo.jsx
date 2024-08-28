import styles from './Logo.module.css';

const Logo = () => {
  return (
    <div className={styles.logo}>
      <img src="/logo.png" alt="SoundStream" />
    </div>
  );
};

export default Logo;
