import styles from "../CoursesPage.module.css";

const PageHeader = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Курсы</h1>
      <p className={styles.subtitle}>
        Исследуйте мир знаний и прокачивайте навыки
      </p>
    </header>
  );
};

export default PageHeader;