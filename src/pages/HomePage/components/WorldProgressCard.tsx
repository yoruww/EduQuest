import styles from "../HomePage.module.css";

interface WorldProgressCardProps {
  completedMissions: number;
  totalMissions: number;
  worldProgressPercent: number;
}

const WorldProgressCard = ({
  completedMissions,
  totalMissions,
  worldProgressPercent,
}: WorldProgressCardProps) => {
  return (
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
  );
};

export default WorldProgressCard;