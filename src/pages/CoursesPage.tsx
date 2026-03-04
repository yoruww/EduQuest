import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEduQuest } from "../hooks/useEduQuest";
import styles from "./CoursesPage.module.css";

type CourseCardView = {
  id: string;
  title: string;
  description: string;
  missionsCount: number;
  completedMissions: number;
  locked: boolean;
  icon: string;
  soon?: boolean;
};

const CoursesPage = () => {
  const navigate = useNavigate();
  const { data } = useEduQuest();

  const cards: CourseCardView[] = useMemo(() => {
    if (!data) return [];

    const forest = data.courses.find((c: any) => c.id === "forest-basics");
    const desert = data.courses.find((c: any) => c.id === "js-desert");

    const forestCompleted =
      forest?.missions?.filter((m: any) => m.completed).length ?? 0;
    const forestCount = forest?.missions?.length ?? 5;

    const desertCompleted =
      desert?.missions?.filter((m: any) => m.completed).length ?? 0;
    const desertCount = desert?.missions?.length ?? 5;

    return [
      {
        id: "forest-basics",
        title: forest?.title ?? "Лес Основ",
        description:
          forest?.description ??
          "Стартовая локация. Изучение базовых понятий программирования.",
        missionsCount: forestCount,
        completedMissions: forestCompleted,
        locked: false,
        icon: "🌳",
      },
      {
        id: "js-desert",
        title: desert?.title ?? "Пустыня JavaScript",
        description:
          desert?.description ?? "Изучение функций, циклов и массивов.",
        missionsCount: desertCount,
        completedMissions: desertCompleted,
        locked: desert?.locked ?? true,
        icon: "🏜️",
      },

      // Заглушки
      {
        id: "react-castle",
        title: "Замок React",
        description: "Изучение компонентов и состояния React.",
        missionsCount: 5,
        completedMissions: 0,
        locked: true,
        icon: "🏰",
        soon: true,
      },
      {
        id: "algo-mountains",
        title: "Горы Алгоритмов",
        description: "Сложные алгоритмы и структуры данных.",
        missionsCount: 5,
        completedMissions: 0,
        locked: true,
        icon: "⛰️",
        soon: true,
      },
      {
        id: "api-ocean",
        title: "Океан API",
        description: "Работа с API и асинхронным кодом.",
        missionsCount: 5,
        completedMissions: 0,
        locked: true,
        icon: "🌊",
        soon: true,
      },
    ];
  }, [data]);

  if (!data) return <div className={styles.loading}>Загрузка...</div>;

  const openCourse = (card: CourseCardView) => {
    if (card.locked || card.soon) return;
    navigate(`/course/${card.id}`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Все курсы</h1>
        <p className={styles.subtitle}>
          Исследуйте мир знаний и прокачивайте свои навыки
        </p>
      </header>

      <section className={styles.grid}>
        {cards.map((card) => {
          const isOpen = !card.locked && !card.soon;

          const progressPercent =
            card.missionsCount > 0
              ? Math.round((card.completedMissions / card.missionsCount) * 100)
              : 0;

          return (
            <button
              key={card.id}
              type="button"
              className={[
                styles.card,
                card.locked || card.soon ? styles.cardLocked : styles.cardActive,
              ].join(" ")}
              onClick={() => openCourse(card)}
              disabled={card.locked || card.soon}
              title={
                card.soon
                  ? "Скоро открытие"
                  : card.locked
                  ? "Курс закрыт"
                  : "Открыть курс"
              }
            >
              <div className={styles.topRow}>
                <div className={styles.iconWrap}>
                  <span className={styles.icon}>{card.icon}</span>
                </div>

                {(card.locked || card.soon) && (
                  <div className={styles.lockBadge} aria-label="locked">
                    🔒
                  </div>
                )}
              </div>

              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.desc}>{card.description}</p>

                {}
                {isOpen ? (
                  <>
                    <span className={styles.metaText}>
                      {card.completedMissions} из {card.missionsCount} миссий
                    </span>

                    <div className={styles.progressWrap}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className={styles.bottomRow}>
                      <span className={styles.missions}>
                        {card.missionsCount} миссий
                      </span>

                      <span className={styles.arrow} aria-hidden="true">
                        ›
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {}
                    {!card.soon && (
                      <span className={styles.metaText}>
                        {card.missionsCount} миссий
                      </span>
                    )}

                    {}
                    {card.soon && (
                      <span className={styles.metaText}>Скоро открытие</span>
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
};

export default CoursesPage;