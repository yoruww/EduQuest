import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEduQuest } from "../hooks/useEduQuest";
import styles from "./HomePage.module.css";

type MapNode = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  state: "active" | "locked";
  onClick?: () => void;
};

const AchievementIcon = ({ id }: { id: string }) => {
  switch (id) {
    case "first-mission":
      return <span className={styles.emojiIcon}>🥇</span>;

    case "course-conqueror":
      return <span className={styles.emojiIcon}>🏆</span>;

    case "100xp":
      return <span className={styles.emojiIcon}>🎯</span>;

    case "all-courses":
      return <span className={styles.emojiIcon}>📚</span>;

    default:
      return <span className={styles.emojiIcon}>⭐</span>;
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const { data } = useEduQuest();

  const totalMissions =
    data?.courses.reduce((sum: number, c: any) => sum + c.missions.length, 0) ??
    0;

  const completedMissions =
    data?.courses.reduce(
      (sum: number, c: any) =>
        sum + c.missions.filter((m: any) => m.completed).length,
      0
    ) ?? 0;

  const worldProgressPercent =
    totalMissions > 0
      ? Math.round((completedMissions / totalMissions) * 100)
      : 0;

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

  const forestCourse = data?.courses.find((c: any) => c.id === "forest-basics");
  const desertCourse = data?.courses.find((c: any) => c.id === "js-desert");

  const nodes: MapNode[] = useMemo(() => {
    const list: MapNode[] = [];

    // Лес Основ
    list.push({
      id: "forest-basics",
      title: "Лес Основ",
      subtitle: `${forestCourse?.missions.length ?? 5} миссий`,
      icon: "🌳",
      state: "active",
      onClick: () => navigate("/course/forest-basics"),
    });

    // Пустыня JS
    const desertLocked = desertCourse?.locked ?? true;
    list.push({
      id: "js-desert",
      title: "Пустыня JavaScript",
      subtitle: `${desertCourse?.missions.length ?? 5} миссий`,
      icon: "🏜️",
      state: desertLocked ? "locked" : "active",
      onClick: desertLocked ? undefined : () => navigate("/course/js-desert"),
    });

    // Заглушки
    list.push({
      id: "react-castle",
      title: "Замок React",
      subtitle: "Скоро",
      icon: "🏰",
      state: "locked",
    });

    list.push({
      id: "algo-mountains",
      title: "Горы Алгоритмов",
      subtitle: "Скоро",
      icon: "⛰️",
      state: "locked",
    });

    list.push({
      id: "api-ocean",
      title: "Океан API",
      subtitle: "Скоро",
      icon: "🌊",
      state: "locked",
    });

    return list;
  }, [
    navigate,
    forestCourse?.missions.length,
    desertCourse?.missions.length,
    desertCourse?.locked,
  ]);

  const lastAchievements = useMemo(() => {
    if (!data) return [];
    const unlocked = new Set<string>(data.user.achievements);

    return data.achievements.slice(0, 4).map((a: any) => ({
      id: a.id as string,
      title: a.title as string,
      unlocked: unlocked.has(a.id as string),
    }));
  }, [data]);

  if (!data) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.page}>
      <section className={styles.mapCard}>
        <div className={styles.mapHeader}>
          <span className={styles.mapEmoji}>🗺️</span>
          <h1 className={styles.mapTitle}>Карта мира знаний</h1>
        </div>

        <div className={styles.mapArea}>
          <div className={styles.nodes}>
            {nodes.map((n: MapNode) => {
              const locked = n.state === "locked";
              const isForest = n.id === "forest-basics";
              const isDesert = n.id === "js-desert";

              const btnClass = [
                styles.node,
                locked ? styles.nodeLocked : styles.nodeActive,
                isForest ? styles.nodeForest : "",
                isDesert ? styles.nodeDesert : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={n.id}
                  type="button"
                  className={btnClass}
                  onClick={n.onClick}
                  disabled={!n.onClick}
                  title={locked ? "Скоро открытие" : "Открыть"}
                >
                  <div className={styles.circle}>
                    <div className={styles.circleInner}>
                      <span className={styles.nodeIcon}>{n.icon}</span>
                    </div>
                    {locked && <span className={styles.lock}>🔒</span>}
                  </div>

                  <div className={styles.nodeTitle}>{n.title}</div>
                  <div className={styles.nodeSub}>{n.subtitle}</div>
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
            {lastAchievements.map((a: any) => (
              <div
                key={a.id}
                className={`${styles.achItem} ${
                  a.unlocked ? styles.achUnlocked : styles.achLocked
                }`}
                title={a.unlocked ? "Получено" : "Пока не получено"}
              >
                <div className={styles.achIcon}>
                  <AchievementIcon id={a.id} />
                </div>
                <div className={styles.achText}>{a.title}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default HomePage;