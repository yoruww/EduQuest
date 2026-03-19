import styles from "../CoursePage.module.css";

interface RewardModalProps {
  isOpen: boolean;
  rewardXp: number;
  isFinalMission: boolean;
  onClose: () => void;
  onNext: () => void;
}

const RewardModal = ({
  isOpen,
  rewardXp,
  isFinalMission,
  onClose,
  onNext,
}: RewardModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <div className={styles.modalIconWrap}>
          <div className={styles.modalIcon}>⭐</div>
        </div>

        <div className={styles.modalValue}>+{rewardXp} XP</div>

        <div className={styles.modalText}>
          {rewardXp > 0 ? "Опыт успешно начислен" : "Опыт не начислен"}
        </div>

        <div className={styles.modalBtns}>
          <button
            type="button"
            className={styles.modalGhost}
            onClick={onClose}
          >
            Закрыть
          </button>

          <button
            type="button"
            className={styles.modalPrimary}
            onClick={onNext}
          >
            {isFinalMission ? "Следующий шаг" : "Следующая миссия"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;