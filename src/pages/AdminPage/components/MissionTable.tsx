import type { Course } from "../../../types/eduquest";
import styles from "../AdminPage.module.css";

interface MissionTableProps {
  course: Course;
  onUpdateMissionXp: (
    courseId: string,
    missionId: string,
    xp: number
  ) => void;
  onDeleteMission: (courseId: string, missionId: string) => void;
}

const MissionTable = ({
  course,
  onUpdateMissionXp,
  onDeleteMission,
}: MissionTableProps) => {
  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <span>Миссия</span>
        <span>XP</span>
        <span>Статус</span>
        <span>Действия</span>
      </div>

      {course.missions.length === 0 ? (
        <p className={styles.empty}>Миссии пока не добавлены.</p>
      ) : (
        course.missions.map((mission) => (
          <div key={mission.id} className={styles.tableRow}>
            <span>
              <strong>{mission.title}</strong>
              <small>
                {mission.question
                  ? "Задание добавлено"
                  : "Используется стандартный контент"}
              </small>
            </span>

            <input
              type="number"
              min="1"
              value={mission.xp}
              onChange={(event) =>
                onUpdateMissionXp(
                  course.id,
                  mission.id,
                  Number(event.target.value)
                )
              }
            />

            <span>
              {mission.completed ? "Выполнена" : "Не выполнена"} ·{" "}
              {mission.locked ? "Закрыта" : "Открыта"}
            </span>

            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => onDeleteMission(course.id, mission.id)}
            >
              Удалить
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MissionTable;