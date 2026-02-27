import { Link, NavLink } from "react-router-dom";
import styles from "./Layout.module.css";
import { useEduQuest } from "../../hooks/useEduQuest";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const { data } = useEduQuest();

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        {}
        <div className={styles.headerInner}>
          <Link to="/home" className={styles.logoBlock} aria-label="На главную">
            <div className={styles.logoIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <span className={styles.logoText}>EduQuest</span>
          </Link>

          <nav className={styles.nav}>
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Карта мира
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Курсы
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Профиль
            </NavLink>
          </nav>

          <div className={styles.rightBlock}>
            {data && (
              <>
                <div className={styles.stars}>⭐ {data.user.stars}</div>

                <div className={styles.userInfo}>
                  <div className={styles.avatar}>👑</div>
                  <span className={styles.username}>{data.user.name}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {}
      <main className={styles.main}>
        <div className={styles.mainInner}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;