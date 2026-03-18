import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEduQuest } from "../../hooks/useEduQuest";
import { buildCourseRoute } from "../../constants/routes";
import { SOON_COURSES } from "./constants";
import { buildCourseCards, getCardThemeClass } from "./helpers";
import type { CourseCardView } from "./types";
import styles from "./CoursesPage.module.css";

const CoursesPage = () => {
  const navigate = useNavigate();
  const { data } = useEduQuest();

  const cards = useMemo((): CourseCardView[] => {
    if (!data) {
      return [];
    }

    return buildCourseCards({
      courses: data.courses,
      soonCourses: SOON_COURSES,
    });
  }, [data]);

  const handleOpenCourse = (card: CourseCardView) => {
    if (card.locked || card.soon) {
      return;
    }

    navigate(buildCourseRoute(card.id));
  };

  if (!data) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

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

          const buttonTitle = card.soon
            ? "Скоро открытие"
            : card.locked
            ? "Курс закрыт"
            : "Открыть курс";

          return (
            <button
              key={card.id}
              type="button"
              className={[
                styles.card,
                isOpen ? styles.cardActive : styles.cardLocked,
                getCardThemeClass(card.id, styles),
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleOpenCourse(card)}
              disabled={card.locked || card.soon}
              title={buttonTitle}
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
                  <span className={styles.metaText}>
                    {card.soon ? "Скоро открытие" : `${card.missionsCount} миссий`}
                  </span>
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