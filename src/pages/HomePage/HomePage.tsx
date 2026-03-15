import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEduQuest } from "../../hooks/useEduQuest";
import { ACHIEVEMENT_ICONS, UPCOMING_MAP_NODES } from "./constants";
import {
  buildLastAchievements,
  buildMapNodes,
  getCompletedMissionsCount,
  getNodeThemeClass,
  getTotalMissionsCount,
} from "./helpers";
import type { AchievementView, MapNode } from "./types";
import styles from "./HomePage.module.css";

const AchievementIcon = ({ id }: { id: string }) => {
  const icon = ACHIEVEMENT_ICONS[id] ?? "⭐";
  return <span className={styles.emojiIcon}>{icon}</span>;
};

const HomePage = () => {
  const navigate = useNavigate();
  const { data } = useEduQuest();

  const level = useMemo(() => {
    const xp = data?.user.xp ?? 0;
    return Math.floor(xp / 100) + 1;
  }, [data?.user.xp]);

  const xpToNextLevel = 300;
  const xpProgress = data?.user.xp ?? 0;
  const xpPercent = Math.min(
    100,
    Math.round((xpProgress / xpToNextLevel) * 100)
  );

  const nodes = useMemo<MapNode[]>(() => {
    if (!data) return [];

    return buildMapNodes({
      courses: data.courses,
      upcomingNodes: UPCOMING_MAP_NODES,
      onOpenCourse: (courseId) => navigate(`/course/${courseId}`),
    });
  }, [data, navigate]);

  const totalMissions = useMemo(() => {
    if (!data) return 0;
    return getTotalMissionsCount(data.courses);
  }, [data]);

  const completedMissions = useMemo(() => {
    if (!data) return 0;
    return getCompletedMissionsCount(data.courses);
  }, [data]);

  const worldProgressPercent =
    totalMissions > 0
      ? Math.round((completedMissions / totalMissions) * 100)
      : 0;

  const lastAchievements = useMemo<AchievementView[]>(() => {
    if (!data) return [];

    return buildLastAchievements({
      achievements: data.achievements,
      unlockedAchievementIds: data.user.achievements,
    });
  }, [data]);

  if (!data) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.page}>
      <section className={styles.mapCard}>
        <div className={styles.mapHeader}>
          <span className={styles.mapEmoji}>🗺️</span>
          <h1 className={styles.mapTitle}>Карта мира знаний</h1>
        </div>

        <div className={styles.mapArea}>
          <div className={styles.nodes}>
            {nodes.map((node) => {
              const btnClass = [
                styles.node,
                node.locked ? styles.nodeLocked : styles.nodeActive,
                getNodeThemeClass(node.id, node.locked, styles),
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={node.id}
                  type="button"
                  className={btnClass}
                  onClick={node.onClick}
                  disabled={!node.onClick}
                  title={node.locked ? "Скоро открытие" : "Открыть"}
                >
                  <div className={styles.circle}>
                    <div className={styles.circleInner}>
                      <span className={styles.nodeIcon}>{node.icon}</span>
                    </div>
                    {node.locked && <span className={styles.lock}>🔒</span>}
                  </div>

                  <div className={styles.nodeTitle}>{node.title}</div>
                  <div className={styles.nodeSub}>{node.subtitle}</div>
                </button>
              );
            })}
          </div>

          <div className={styles.cloud1} />
          <div className={styles.cloud2} />
        </div>
      </section>

      <aside className={styles.sidebar}>
        <div className={styles.sideCard}>
          <div className={styles.profileTop}>
            <div className={styles.bigAvatar}>👑</div>
            <div className={styles.profileName}>{data.user.name}</div>
            <div className={styles.profileLevel}>Уровень {level}</div>
          </div>

          <div className={styles.progressRow}>
            <span className={styles.muted}>До следующего уровня</span>
            <span className={styles.progressValue}>
              {Math.min(xpProgress, xpToNextLevel)}/{xpToNextLevel}
            </span>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        <div className={styles.sideCard}>
          <div className={styles.cardTitleRow}>
            <span className={styles.sparkle}>✨</span>
            <span className={styles.cardTitle}>Прогресс карты мира</span>
          </div>

          <div className={styles.progressRow}>
            <span className={styles.muted}>Завершено миссий</span>
            <span className={styles.progressValue}>
              {completedMissions}/{totalMissions}
            </span>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${worldProgressPercent}%` }}
            />
          </div>

          <div className={styles.bigPercent}>{worldProgressPercent}%</div>
        </div>

        <div className={styles.sideCard}>
          <div className={styles.cardTitleRow}>
            <span className={styles.cardTitle}>Последние достижения</span>
          </div>

          <div className={styles.achievementsGrid}>
            {lastAchievements.map((achievement) => (
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
      </aside>
    </div>
  );
};

export default HomePage;