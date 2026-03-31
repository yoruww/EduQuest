import type { ProfileStatCard } from "../types";
import styles from "../ProfilePage.module.css";

interface ProfileStatsGridProps {
  stats: ProfileStatCard[];
}

const ProfileStatsGrid = ({ stats }: ProfileStatsGridProps) => {
  return (
    <section className={styles.statsGrid}>
      {stats.map((stat) => (
        <div key={stat.id} className={styles.statCard}>
          <div className={styles.statTop}>
            <div
              className={`${styles.statIconCircle} ${
                styles[`tone${stat.tone[0].toUpperCase()}${stat.tone.slice(1)}`]
              }`}
            />
            <div
              className={`${styles.statIcon} ${
                styles[`icon${stat.tone[0].toUpperCase()}${stat.tone.slice(1)}`]
              }`}
            >
              {stat.icon}
            </div>
          </div>

          <div className={styles.statLabel}>{stat.label}</div>
          <div className={styles.statValue}>{stat.value}</div>
        </div>
      ))}
    </section>
  );
};

export default ProfileStatsGrid;