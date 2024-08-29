// components/ConfirmModal.js
import React from 'react';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ message, onConfirm, onCancel, loading }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <button 
            onClick={onConfirm} 
            className={styles.confirmButton}
            disabled={loading}
          >
            {loading ? 'Borrando...' : 'Sí'}
          </button>
          <button 
            onClick={onCancel} 
            className={styles.cancelButton}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
