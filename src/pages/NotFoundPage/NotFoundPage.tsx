import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.emoji}>🧭</div>

        <div className={styles.code}>404</div>

        <h1 className={styles.title}>Кажется, вы свернули не туда</h1>

        <p className={styles.text}>
          Эта страница не найдена. Возможно, путь устарел или такой страницы
          просто не существует в мире EduQuest.
        </p>
      </section>
    </div>
  );
}

export default NotFoundPage;