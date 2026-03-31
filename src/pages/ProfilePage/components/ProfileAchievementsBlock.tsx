import AchievementIcon from "../../../components/AchievementIcon/AchievementIcon";
import { RECENT_ACHIEVEMENTS_LIMIT } from "../constants";
import type { ProfileAchievementView } from "../types";
import styles from "../ProfilePage.module.css";

interface ProfileAchievementsBlockProps {
  achievements: ProfileAchievementView[];
}

const ProfileAchievementsBlock = ({
  achievements,
}: ProfileAchievementsBlockProps) => {
  const hasUnlockedAchievements = achievements.some(
    (achievement) => achievement.unlocked
  );

  return (
    <section className={styles.achievementsCard}>
      <div className={styles.achievementsHeader}>
        <h2 className={styles.achievementsTitle}>Последние достижения</h2>
      </div>

      <div className={styles.achievementsGrid}>
        {achievements.slice(0, RECENT_ACHIEVEMENTS_LIMIT).map((achievement) => (
          <div
            key={achievement.id}
            className={`${styles.achievementItem} ${
              achievement.unlocked
                ? styles.achievementUnlocked
                : styles.achievementLocked
            }`}
            title={achievement.unlocked ? "Получено" : "Пока не получено"}
          >
            <div className={styles.achievementIconBox}>
              <AchievementIcon
                id={achievement.id}
                className={styles.emojiIcon}
              />
            </div>
            <div className={styles.achievementName}>{achievement.title}</div>
          </div>
        ))}
      </div>

      {!hasUnlockedAchievements && (
        <div className={styles.emptyAchievements}>
          <div className={styles.emptyAchievementsIcon}>🏆</div>
          <div className={styles.emptyAchievementsText}>
            У вас пока нет достижений. Продолжайте проходить миссии!
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfileAchievementsBlock;