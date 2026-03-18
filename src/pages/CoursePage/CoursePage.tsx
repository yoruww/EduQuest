import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useEduQuest } from "../../hooks/useEduQuest";
import { COURSE_CONTENT } from "./courseContent";
import { DEFAULT_COURSE_ID } from "./constants";
import {
  buildMissionWithUiList,
  getActiveMission,
  getActiveMissionContent,
  getCompletedMissionsCount,
  getCourseById,
  getCourseIcon,
  getCourseThemeClass,
  getFirstUnlockedMissionId,
  getNextMission,
  getNextUnlockedCourseRoute,
  getProgressPercent,
} from "./helpers";
import type { AnswerState, MissionWithUi } from "./types";
import styles from "./CoursePage.module.css";

const CoursePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data, completeMission } = useEduQuest();

  const courseId = params.id ?? DEFAULT_COURSE_ID;

  const course = useMemo(() => {
    if (!data) {
      return null;
    }

    return getCourseById(data.courses, courseId);
  }, [data, courseId]);

  const missionContentList = COURSE_CONTENT[courseId] ?? [];

  const missions = useMemo<MissionWithUi[]>(() => {
    if (!course) {
      return [];
    }

    return buildMissionWithUiList(course, missionContentList);
  }, [course, missionContentList]);

  const firstUnlockedId = useMemo(() => {
    return getFirstUnlockedMissionId(missions);
  }, [missions]);

  const [activeMissionId, setActiveMissionId] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [showReward, setShowReward] = useState(false);
  const [rewardXp, setRewardXp] = useState(0);

  const resetAnswerState = () => {
    setSelectedOptionId(null);
    setAnswerState("idle");
  };

  const resetRewardState = () => {
    setShowReward(false);
    setRewardXp(0);
  };

  const resetMissionUiState = () => {
    resetAnswerState();
    resetRewardState();
  };

  useEffect(() => {
    if (!firstUnlockedId) {
      return;
    }

    setActiveMissionId(firstUnlockedId);
    resetMissionUiState();
  }, [firstUnlockedId, courseId]);

  const activeContent = useMemo(() => {
    return getActiveMissionContent(missionContentList, activeMissionId);
  }, [missionContentList, activeMissionId]);

  const activeMission = useMemo(() => {
    return getActiveMission(missions, activeMissionId);
  }, [missions, activeMissionId]);

  const completedCount = useMemo(() => {
    return getCompletedMissionsCount(missions);
  }, [missions]);

  const totalCount = missions.length;
  const progressPercent = getProgressPercent(completedCount, totalCount);

  const openMission = (missionId: string) => {
    const mission = missions.find((item) => item.id === missionId);

    if (!mission || mission.locked) {
      return;
    }

    setActiveMissionId(missionId);
    resetAnswerState();
  };

  const handleSelect = (optionId: string) => {
    if (!activeMission || activeMission.locked) {
      return;
    }

    if (
      answerState === "checked_correct" ||
      answerState === "checked_wrong"
    ) {
      return;
    }

    setSelectedOptionId(optionId);
    setAnswerState("selected");
  };

  const checkAnswer = () => {
    if (!selectedOptionId || !activeContent) {
      return;
    }

    const isCorrect = selectedOptionId === activeContent.correctOptionId;
    setAnswerState(isCorrect ? "checked_correct" : "checked_wrong");
  };

  const goNext = () => {
    const nextMission = getNextMission(missions, activeMissionId);

    if (nextMission && !nextMission.locked) {
      setActiveMissionId(nextMission.id);
      resetAnswerState();
      return;
    }

    if (data) {
      const nextCourseRoute = getNextUnlockedCourseRoute(data.courses, courseId);

      if (nextCourseRoute) {
        resetMissionUiState();
        navigate(nextCourseRoute);
        return;
      }
    }

    navigate(APP_ROUTES.courses);
  };

  const finishMission = () => {
    if (!activeMission) {
      return;
    }

    if (activeMission.completed) {
      return;
    }

    if (
      answerState !== "checked_correct" &&
      answerState !== "checked_wrong"
    ) {
      return;
    }

    const xp = answerState === "checked_correct" ? activeMission.xp : 0;

    completeMission(courseId, activeMission.id, xp);
    setRewardXp(xp);
    setShowReward(true);
  };

  if (!data || !course) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  const courseIcon = getCourseIcon(courseId);
  const courseThemeClass = getCourseThemeClass(courseId, styles);

  return (
    <div className={styles.page}>
      <button
        className={styles.back}
        type="button"
        onClick={() => navigate(APP_ROUTES.courses)}
      >
        ← Назад к курсам
      </button>

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

      <section className={styles.grid}>
        <aside className={styles.missions}>
          <h2 className={styles.missionsTitle}>Миссии курса</h2>

          <div className={styles.missionList}>
            {missions.map((mission) => {
              const isActive = mission.id === activeMissionId;
              const isLocked = mission.locked;
              const isDone = mission.completed;

              return (
                <button
                  key={mission.id}
                  type="button"
                  className={[
                    styles.missionItem,
                    isActive ? styles.missionActive : "",
                    isLocked ? styles.missionLocked : "",
                    isDone ? styles.missionDone : "",
                  ].join(" ")}
                  onClick={() => openMission(mission.id)}
                  aria-disabled={isLocked ? "true" : "false"}
                >
                  <div className={styles.missionIconWrap}>
                    <div className={styles.missionIcon}>
                      {isLocked ? "🔒" : mission.icon}
                    </div>
                  </div>

                  <div className={styles.missionText}>
                    <div className={styles.missionNameRow}>
                      <div className={styles.missionName}>
                        {mission.displayTitle}
                      </div>
                      {mission.isFinal ? (
                        <span className={styles.finalBadge}>Финал</span>
                      ) : null}
                    </div>

                    <div className={styles.missionMeta}>
                      <span className={styles.xp}>⭐ +{mission.xp} XP</span>
                      {isDone ? (
                        <span className={styles.done}>Завершено</span>
                      ) : null}
                    </div>
                  </div>

                  {isActive ? <span className={styles.dot} /> : null}
                </button>
              );
            })}
          </div>
        </aside>

        <div className={styles.content}>
          {!activeMission || activeMission.locked || !activeContent ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>{courseIcon}</div>
              <div className={styles.emptyTitle}>Выберите миссию</div>
              <div className={styles.emptyText}>
                Выберите миссию из списка слева, чтобы начать обучение
              </div>
            </div>
          ) : (
            <div className={styles.missionCard}>
              <div className={styles.missionHeader}>
                <div>
                  <h3 className={styles.missionTitle}>{activeContent.title}</h3>
                  <div className={styles.missionXp}>
                    ⭐ +{activeMission.xp} XP
                  </div>
                </div>
              </div>

              <div className={styles.theory}>
                <div className={styles.blockTitle}>
                  <span className={styles.blockIcon}>📚</span>
                  <span>Теория</span>
                </div>
                <p className={styles.theoryText}>{activeContent.theory}</p>
              </div>

              <div className={styles.task}>
                <div className={styles.blockTitle}>
                  <span className={styles.blockIcon}>❓</span>
                  <span>Задание</span>
                </div>

                <p className={styles.question}>{activeContent.question}</p>

                <div className={styles.options}>
                  {activeContent.options.map((option, idx) => {
                    const isSelected = selectedOptionId === option.id;

                    const isWrongSelected =
                      answerState === "checked_wrong" && isSelected;

                    const isCorrectVisible =
                      option.id === activeContent.correctOptionId &&
                      (answerState === "checked_correct" ||
                        answerState === "checked_wrong");

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={[
                          styles.option,
                          isSelected && answerState === "selected"
                            ? styles.optionSelected
                            : "",
                          isWrongSelected ? styles.optionWrong : "",
                          isCorrectVisible ? styles.optionCorrect : "",
                        ].join(" ")}
                        onClick={() => handleSelect(option.id)}
                      >
                        <span className={styles.badge}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={styles.optionText}>{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.actions}>
                  {(answerState === "idle" || answerState === "selected") && (
                    <button
                      type="button"
                      className={styles.checkBtn}
                      onClick={checkAnswer}
                      disabled={!selectedOptionId}
                    >
                      Проверить ответ
                    </button>
                  )}

                  {(answerState === "checked_correct" ||
                    answerState === "checked_wrong") && (
                    <button
                      type="button"
                      className={styles.finishBtn}
                      onClick={finishMission}
                    >
                      Завершить миссию
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showReward && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setShowReward(false)}
              aria-label="Закрыть"
            >
              ×
            </button>

            <div className={styles.modalIconWrap}>
              <div className={styles.modalIcon}>⭐</div>
            </div>

            <div className={styles.modalValue}>+{rewardXp} XP</div>

            <div className={styles.modalText}>
              {rewardXp > 0 ? "Опыт успешно начислен" : "Опыт не начислен"}
            </div>

            <div className={styles.modalBtns}>
              <button
                type="button"
                className={styles.modalGhost}
                onClick={() => setShowReward(false)}
              >
                Закрыть
              </button>

              <button
                type="button"
                className={styles.modalPrimary}
                onClick={() => {
                  setShowReward(false);
                  goNext();
                }}
              >
                {activeMission?.isFinal
                  ? "Следующий шаг"
                  : "Следующая миссия"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;