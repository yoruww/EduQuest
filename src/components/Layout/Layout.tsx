import { Link, NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { useEduQuest } from "../../hooks/useEduQuest";
import { NAV_ITEMS } from "./constants";

const Layout = () => {
  const { data } = useEduQuest();

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
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
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                {label}
              </NavLink>
            ))}
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

      <main className={styles.main}>
        <div className={styles.mainInner}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;