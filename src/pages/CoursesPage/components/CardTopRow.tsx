import type { CourseCardView } from "../types";
import styles from "../CoursesPage.module.css";

interface Props {
  card: CourseCardView;
}

const CardTopRow = ({ card }: Props) => {
  return (
    <div className={styles.topRow}>
      <div className={styles.iconWrap}>
        <span className={styles.icon}>{card.icon}</span>
      </div>

      {(card.locked || card.soon) && (
        <div className={styles.lockBadge}>🔒</div>
      )}
    </div>
  );
};

export default CardTopRow;