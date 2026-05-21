import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useEduQuest } from "../../hooks/useEduQuest";
import type { Mission } from "../../types/eduquest";

import AdminHeader from "./components/AdminHeader";
import AdminSummary from "./components/AdminSummary";
import AdminToolbar from "./components/AdminToolbar";
import CourseAdminCard from "./components/CourseAdminCard";

import { createEmptyForm, createMissionId } from "./helpers";
import type { MissionForm } from "./types";

import styles from "./AdminPage.module.css";

const AdminPage = () => {
  const navigate = useNavigate();

  const {
    data,
    toggleCourseLock,
    updateMissionXp,
    addMissionToCourse,
    deleteMissionFromCourse,
    resetUserProgress,
  } = useEduQuest();

  const [forms, setForms] = useState<Record<string, MissionForm>>({});
  const [error, setError] = useState("");

  if (!data) {
    return <div className={styles.page}>Загрузка...</div>;
  }

  const getForm = (courseId: string): MissionForm => {
    return forms[courseId] ?? createEmptyForm();
  };

  const updateForm = (
    courseId: string,
    field: keyof MissionForm,
    value: string
  ) => {
    setForms((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] ?? createEmptyForm()),
        [field]: value,
      },
    }));
  };

  const handleAddMission = (courseId: string) => {
    const form = getForm(courseId);

    const title = form.title.trim();
    const xp = Number(form.xp);
    const theory = form.theory.trim();
    const question = form.question.trim();
    const optionA = form.optionA.trim();
    const optionB = form.optionB.trim();
    const optionC = form.optionC.trim();

    if (!title || !theory || !question || !optionA || !optionB || !optionC) {
      setError("Заполните название, теорию, вопрос и все варианты ответа.");
      return;
    }

    if (!Number.isFinite(xp) || xp <= 0) {
      setError("XP должен быть больше 0.");
      return;
    }

    const mission: Mission = {
      id: createMissionId(title),
      title,
      xp,
      completed: false,
      locked: true,
      theory,
      question,
      options: [
        { id: "a", text: optionA },
        { id: "b", text: optionB },
        { id: "c", text: optionC },
      ],
      correctOptionId: form.correctOptionId,
      icon: "📘",
    };

    addMissionToCourse(courseId, mission);

    setForms((prev) => ({
      ...prev,
      [courseId]: createEmptyForm(),
    }));

    setError("");
  };

  const handleDeleteMission = (courseId: string, missionId: string) => {
    const confirmed = window.confirm("Удалить миссию?");

    if (!confirmed) return;

    deleteMissionFromCourse(courseId, missionId);
  };

  const handleResetProgress = () => {
    const confirmed = window.confirm(
      "Сбросить прогресс? XP, достижения и выполненные миссии будут очищены."
    );

    if (!confirmed) return;

    resetUserProgress();
  };

  return (
    <div className={styles.page}>
      <AdminHeader onBack={() => navigate(APP_ROUTES.home)} />

      <AdminSummary data={data} />

      <AdminToolbar onResetProgress={handleResetProgress} />

      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.courseList}>
        {data.courses.map((course) => (
          <CourseAdminCard
            key={course.id}
            course={course}
            form={getForm(course.id)}
            onToggleCourseLock={toggleCourseLock}
            onUpdateMissionXp={updateMissionXp}
            onDeleteMission={handleDeleteMission}
            onUpdateForm={updateForm}
            onAddMission={handleAddMission}
          />
        ))}
      </section>
    </div>
  );
};

export default AdminPage;