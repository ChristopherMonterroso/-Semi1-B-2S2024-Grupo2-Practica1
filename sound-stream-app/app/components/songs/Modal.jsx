import styles from './Modal.module.css';

const Modal = ({ message }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Modal;
