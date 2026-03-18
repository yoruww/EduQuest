import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useEduQuest } from "../../hooks/useEduQuest";
import styles from "./AuthPage.module.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const { data, setUserName } = useEduQuest();

  const [name, setName] = useState("");

  useEffect(() => {
    if (data?.user.name.trim()) {
      navigate(APP_ROUTES.home, { replace: true });
    }
  }, [data, navigate]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setUserName(trimmedName);
    navigate(APP_ROUTES.home);
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>🧭</div>
        </div>

        <h1 className={styles.title}>EduQuest</h1>
        <p className={styles.subtitle}>Образовательная RPG-платформа</p>

        <div className={styles.infoBox}>
          <span className={styles.infoIcon}>✨</span>
          <p className={styles.infoText}>
            Добро пожаловать в путешествие по миру знаний! Проходите миссии,
            зарабатывайте опыт и открывайте новые горизонты.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="user-name">
            Как вас зовут?
          </label>

          <input
            id="user-name"
            type="text"
            className={styles.input}
            placeholder="Введите ваше имя"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={24}
          />

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!name.trim()}
          >
            Начать путешествие
          </button>
        </form>

        <p className={styles.note}>
          Нажимая кнопку, вы начинаете своё приключение в мире программирования
        </p>
      </section>
    </div>
  );
};

export default AuthPage;