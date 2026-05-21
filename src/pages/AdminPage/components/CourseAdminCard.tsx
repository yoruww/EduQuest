import type { Course } from "../../../types/eduquest";
import type { MissionForm as MissionFormType } from "../types";
import type { MissionFormField } from "./MissionForm";
import MissionTable from "./MissionTable";
import MissionForm from "./MissionForm";
import styles from "../AdminPage.module.css";

interface CourseAdminCardProps {
  course: Course;
  form: MissionFormType;
  onToggleCourseLock: (courseId: string) => void;
  onUpdateMissionXp: (
    courseId: string,
    missionId: string,
    xp: number
  ) => void;
  onDeleteMission: (courseId: string, missionId: string) => void;
  onUpdateForm: (
    courseId: string,
    field: MissionFormField,
    value: string
  ) => void;
  onAddMission: (courseId: string) => void;
}

const CourseAdminCard = ({
  course,
  form,
  onToggleCourseLock,
  onUpdateMissionXp,
  onDeleteMission,
  onUpdateForm,
  onAddMission,
}: CourseAdminCardProps) => {
  const totalXp = course.missions.reduce(
    (sum, mission) => sum + mission.xp,
    0
  );

  return (
    <article className={styles.courseCard}>
      <div className={styles.courseTop}>
        <div>
          <h2>
            {course.icon ?? "📘"} {course.title}
          </h2>
          <p>{course.description}</p>
        </div>

        <button
          type="button"
          className={course.locked ? styles.primaryButton : styles.warningButton}
          onClick={() => onToggleCourseLock(course.id)}
        >
          {course.locked ? "Открыть курс" : "Закрыть курс"}
        </button>
      </div>

      <div className={styles.courseMeta}>
        <span>{course.locked ? "Закрыт" : "Открыт"}</span>
        <span>Миссий: {course.missions.length}</span>
        <span>Всего XP: {totalXp}</span>
      </div>

      <MissionTable
        course={course}
        onUpdateMissionXp={onUpdateMissionXp}
        onDeleteMission={onDeleteMission}
      />

      <MissionForm
        courseId={course.id}
        form={form}
        onUpdateForm={onUpdateForm}
        onAddMission={onAddMission}
      />
    </article>
  );
};

export default CourseAdminCard;