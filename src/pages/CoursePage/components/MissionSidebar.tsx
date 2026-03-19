import type { MissionWithUi } from "../types";
import MissionButton from "./MissionButton";
import styles from "../CoursePage.module.css";

interface MissionSidebarProps {
  missions: MissionWithUi[];
  activeMissionId: string;
  onOpenMission: (missionId: string) => void;
}

const MissionSidebar = ({
  missions,
  activeMissionId,
  onOpenMission,
}: MissionSidebarProps) => {
  return (
    <aside className={styles.missions}>
      <h2 className={styles.missionsTitle}>Миссии курса</h2>

      <div className={styles.missionList}>
        {missions.map((mission) => (
          <MissionButton
            key={mission.id}
            mission={mission}
            isActive={mission.id === activeMissionId}
            onOpenMission={onOpenMission}
          />
        ))}
      </div>
    </aside>
  );
};

export default MissionSidebar;