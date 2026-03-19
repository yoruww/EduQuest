import type { Course } from "../../../types/eduquest";
import styles from "../CoursePage.module.css";

interface CourseHeaderProps {
  course: Course;
  courseIcon: string;
  courseThemeClass: string;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

const CourseHeader = ({
  course,
  courseIcon,
  courseThemeClass,
  completedCount,
  totalCount,
  progressPercent,
}: CourseHeaderProps) => {
  return (
    <section className={[styles.courseCard, courseThemeClass].join(" ")}>
      <div className={styles.courseIcon}>{courseIcon}</div>

      <div className={styles.courseInfo}>
        <h1 className={styles.courseTitle}>{course.title}</h1>
        <p className={styles.courseDesc}>{course.description}</p>

        <div className={styles.courseProgressRow}>
          <span className={styles.courseProgressLabel}>Прогресс курса</span>
          <span className={styles.courseProgressValue}>
            {completedCount}/{totalCount || 1}
          </span>
        </div>

        <div className={styles.courseProgressBar}>
          <div
            className={styles.courseProgressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default CourseHeader;