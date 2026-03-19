import type { MissionWithUi } from "../types";
import styles from "../CoursePage.module.css";

interface MissionButtonProps {
  mission: MissionWithUi;
  isActive: boolean;
  onOpenMission: (missionId: string) => void;
}

const MissionButton = ({
  mission,
  isActive,
  onOpenMission,
}: MissionButtonProps) => {
  const isLocked = mission.locked;
  const isDone = mission.completed;

  return (
    <button
      type="button"
      className={[
        styles.missionItem,
        isActive ? styles.missionActive : "",
        isLocked ? styles.missionLocked : "",
        isDone ? styles.missionDone : "",
      ].join(" ")}
      onClick={() => onOpenMission(mission.id)}
      aria-disabled={isLocked ? "true" : "false"}
    >
      <div className={styles.missionIconWrap}>
        <div className={styles.missionIcon}>{isLocked ? "🔒" : mission.icon}</div>
      </div>

      <div className={styles.missionText}>
        <div className={styles.missionNameRow}>
          <div className={styles.missionName}>{mission.displayTitle}</div>
          {mission.isFinal ? (
            <span className={styles.finalBadge}>Финал</span>
          ) : null}
        </div>

        <div className={styles.missionMeta}>
          <span className={styles.xp}>⭐ +{mission.xp} XP</span>
          {isDone ? <span className={styles.done}>Завершено</span> : null}
        </div>
      </div>

      {isActive ? <span className={styles.dot} /> : null}
    </button>
  );
};

export default MissionButton;