import { useMemo } from "react";
import { useEduQuest } from "../../hooks/useEduQuest";
import {
  ACHIEVEMENT_ICONS,
  DEFAULT_ACHIEVEMENT_ICON,
  RECENT_ACHIEVEMENTS_LIMIT,
} from "./constants";
import {
  buildAchievementsView,
  buildStats,
  getCurrentLevelStartXp,
  getNextLevelXp,
  getUserLevel,
} from "./helpers";
import type { ProfileAchievementView, ProfileStatCard } from "./types";
import styles from "./ProfilePage.module.css";

interface AchievementIconProps {
  id: string;
}

const AchievementIcon = ({ id }: AchievementIconProps) => {
  const icon = ACHIEVEMENT_ICONS[id] ?? DEFAULT_ACHIEVEMENT_ICON;
  return <span className={styles.emojiIcon}>{icon}</span>;
};

const ProfilePage = () => {
  const { data } = useEduQuest();

  const xp = data?.user.xp ?? 0;

  const level = useMemo(() => {
    return getUserLevel(xp);
  }, [xp]);

  const achievementsView = useMemo<ProfileAchievementView[]>(() => {
    if (!data) {
      return [];
    }

    return buildAchievementsView(data.achievements, data.user.achievements);
  }, [data]);

  const stats = useMemo<ProfileStatCard[]>(() => {
    if (!data) {
      return [];
    }

    return buildStats(
      data.courses,
      data.user.xp,
      data.user.achievements.length,
      data.achievements.length
    );
  }, [data]);

  const currentLevelStartXp = getCurrentLevelStartXp(level);
  const nextLevelXp = getNextLevelXp(level);
  const currentLevelRange = nextLevelXp - currentLevelStartXp;
  const currentLevelProgress = xp - currentLevelStartXp;

  const xpPercent =
    currentLevelRange > 0
      ? Math.min(100, Math.round((currentLevelProgress / currentLevelRange) * 100))
      : 0;

  const hasUnlockedAchievements = achievementsView.some(
    (achievement) => achievement.unlocked
  );

  if (!data) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.page}>
      <section className={styles.heroCard}>
        <div className={styles.heroLeft}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>👑</div>
            <div className={styles.levelBadge}>
              🏆 {data.user.achievements.length}
            </div>
          </div>

          <div className={styles.heroInfo}>
            <h1 className={styles.userName}>{data.user.name}</h1>
            <div className={styles.userMeta}>
              Уровень {level} • {data.user.xp} общего опыта
            </div>

            <div className={styles.progressBlock}>
              <div className={styles.progressRow}>
                <span className={styles.progressLabel}>
                  До следующего уровня
                </span>
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
          <div className={styles.totalXpBadge}>⭐ {data.user.xp}</div>
          <div className={styles.totalXpText}>Всего опыта</div>
        </div>
      </section>

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

      <section className={styles.achievementsCard}>
        <div className={styles.achievementsHeader}>
          <h2 className={styles.achievementsTitle}>Последние достижения</h2>
        </div>

        <div className={styles.achievementsGrid}>
          {achievementsView
            .slice(0, RECENT_ACHIEVEMENTS_LIMIT)
            .map((achievement) => (
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
                  <AchievementIcon id={achievement.id} />
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
    </div>
  );
};

export default ProfilePage;