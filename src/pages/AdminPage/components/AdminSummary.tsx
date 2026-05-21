import type { EduQuestData } from "../../../types/eduquest";
import styles from "../AdminPage.module.css";

interface AdminSummaryProps {
  data: EduQuestData;
}

const AdminSummary = ({ data }: AdminSummaryProps) => {
  const totalMissions = data.courses.reduce(
    (sum, course) => sum + course.missions.length,
    0
  );

  const completedMissions = data.courses.reduce(
    (sum, course) =>
      sum + course.missions.filter((mission) => mission.completed).length,
    0
  );

  return (
    <section className={styles.summary}>
      <article>
        <span>Пользователь</span>
        <strong>{data.user.name || "Игрок"}</strong>
      </article>

      <article>
        <span>Курсы</span>
        <strong>{data.courses.length}</strong>
      </article>

      <article>
        <span>Миссии</span>
        <strong>
          {completedMissions}/{totalMissions}
        </strong>
      </article>

      <article>
        <span>XP</span>
        <strong>{data.user.xp}</strong>
      </article>
    </section>
  );
};

export default AdminSummary;