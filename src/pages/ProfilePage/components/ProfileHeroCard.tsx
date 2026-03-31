import styles from "../ProfilePage.module.css";

interface ProfileHeroCardProps {
  userName: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  xpPercent: number;
  achievementsCount: number;
}

const ProfileHeroCard = ({
  userName,
  level,
  xp,
  nextLevelXp,
  xpPercent,
  achievementsCount,
}: ProfileHeroCardProps) => {
  return (
    <section className={styles.heroCard}>
      <div className={styles.heroLeft}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>👑</div>
          <div className={styles.levelBadge}>🏆 {achievementsCount}</div>
        </div>

        <div className={styles.heroInfo}>
          <h1 className={styles.userName}>{userName}</h1>
          <div className={styles.userMeta}>
            Уровень {level} • {xp} общего опыта
          </div>

          <div className={styles.progressBlock}>
            <div className={styles.progressRow}>
              <span className={styles.progressLabel}>До следующего уровня</span>
              <span className={styles.progressValue}>
                {xp}/{nextLevelXp}
              </span>
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.heroRight}>
        <div className={styles.totalXpBadge}>⭐ {xp}</div>
        <div className={styles.totalXpText}>Всего опыта</div>
      </div>
    </section>
  );
};

export default ProfileHeroCard;