import styles from "../AdminPage.module.css";

interface AdminToolbarProps {
  onResetProgress: () => void;
}

const AdminToolbar = ({ onResetProgress }: AdminToolbarProps) => {
  return (
    <section className={styles.toolbar}>
      <div>
        <h2>Прогресс пользователя</h2>
        <p>
          Сброс очищает XP, достижения и выполнение миссий, но не удаляет
          добавленные задания.
        </p>
      </div>

      <button
        type="button"
        className={styles.dangerButton}
        onClick={onResetProgress}
      >
        Сбросить прогресс
      </button>
    </section>
  );
};

export default AdminToolbar;