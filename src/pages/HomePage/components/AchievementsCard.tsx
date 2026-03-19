import type { AchievementView } from "../types";
import AchievementIcon from "./AchievementIcon";
import styles from "../HomePage.module.css";

interface AchievementsCardProps {
  achievements: AchievementView[];
}

const AchievementsCard = ({ achievements }: AchievementsCardProps) => {
  return (
    <div className={styles.sideCard}>
      <div className={styles.cardTitleRow}>
        <span className={styles.cardTitle}>Последние достижения</span>
      </div>

      <div className={styles.achievementsGrid}>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`${styles.achItem} ${
              achievement.unlocked ? styles.achUnlocked : styles.achLocked
            }`}
            title={achievement.unlocked ? "Получено" : "Пока не получено"}
          >
            <div className={styles.achIcon}>
              <AchievementIcon id={achievement.id} />
            </div>
            <div className={styles.achText}>{achievement.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsCard;