import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEduQuest } from "../../hooks/useEduQuest";
import { buildCourseCards } from "./helpers";
import { SOON_COURSES } from "./constants";
import type { CourseCardView } from "./types";
import PageHeader from "./components/PageHeader";
import CourseCard from "./components/CourseCard";
import styles from "./CoursesPage.module.css";

const CoursesPage = () => {
  const navigate = useNavigate();
  const { data } = useEduQuest();

  const cards = useMemo((): CourseCardView[] => {
    if (!data) return [];

    return buildCourseCards({
      courses: data.courses,
      soonCourses: SOON_COURSES,
    });
  }, [data]);

  const handleOpenCourse = (card: CourseCardView) => {
    if (card.locked || card.soon) return;

    navigate(`/course/${card.id}`);
  };

  if (!data) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.page}>
      <PageHeader />

      <section className={styles.grid}>
        {cards.map((card) => (
          <CourseCard
            key={card.id}
            card={card}
            onOpen={handleOpenCourse}
          />
        ))}
      </section>
    </div>
  );
};

export default CoursesPage;