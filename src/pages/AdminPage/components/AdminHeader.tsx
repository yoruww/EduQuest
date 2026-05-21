import styles from "../AdminPage.module.css";

interface AdminHeaderProps {
  onBack: () => void;
}

const AdminHeader = ({ onBack }: AdminHeaderProps) => {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.kicker}>Admin Console</p>
        <h1>Панель управления EduQuest</h1>
        <p>
          Управление курсами, миссиями, XP и учебными заданиями через
          localStorage.
        </p>
      </div>

      <button type="button" className={styles.backButton} onClick={onBack}>
        На главную
      </button>
    </header>
  );
};

export default AdminHeader;