import type { CourseCardView } from "../types";
import styles from "../CoursesPage.module.css";

interface Props {
  card: CourseCardView;
  isOpen: boolean;
}

const CardContent = ({ card, isOpen }: Props) => {
  const progressPercent =
    card.missionsCount > 0
      ? Math.round((card.completedMissions / card.missionsCount) * 100)
      : 0;

  return (
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

            <span className={styles.arrow}>›</span>
          </div>
        </>
      ) : (
        <span className={styles.metaText}>
          {card.soon
            ? "Скоро открытие"
            : `${card.missionsCount} миссий`}
        </span>
      )}
    </div>
  );
};

export default CardContent;