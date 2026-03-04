import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEduQuest } from "../hooks/useEduQuest";
import styles from "./CoursePage.module.css";

type QuizOption = { id: string; text: string };
type MissionContent = {
  id: string;
  title: string;
  icon: string; 
  theory: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
};

const COURSE_ID = "forest-basics";

const FOREST_MISSIONS: MissionContent[] = [
  {
    id: "algorithms",
    title: "Тропинка алгоритмов",
    icon: "🌱",
    theory:
      "Алгоритм — это чёткая последовательность шагов, которая приводит к результату.\n\n" +
      "У алгоритма обычно есть:\n" +
      "• порядок действий (шаги идут один за другим)\n" +
      "• понятные действия (каждый шаг можно выполнить)\n" +
      "• итог (получаем конкретный результат)\n\n" +
      "Одна фраза или просто описание «что сделать» — это ещё не алгоритм. Нужны именно шаги.",
    question: "Какой вариант является алгоритмом?",
    options: [
      { id: "a", text: "Сделать чай" },
      { id: "b", text: "Вскипятить воду → добавить чай → подождать" },
      { id: "c", text: "Чай вкусный" },
    ],
    correctOptionId: "b",
  },
  {
    id: "variables",
    title: "Переменные",
    icon: "🌿",
    theory:
      "Переменная — это «именованная коробка», в которую можно положить значение и потом использовать его в коде.\n\n" +
      "В JavaScript переменные объявляют ключевыми словами:\n" +
      "• let — значение можно менять\n" +
      "• const — значение менять нельзя\n\n" +
      "Важно: в объявлении есть имя переменной, знак = и значение. Слова вроде “variable” в JS не используют.",
    question: "Как правильно объявить переменную?",
    options: [
      { id: "a", text: "variable age = 18" },
      { id: "b", text: "let age = 18" },
      { id: "c", text: "age = let 18" },
    ],
    correctOptionId: "b",
  },
  {
    id: "types",
    title: "Типы данных",
    icon: "🌲",
    theory:
      "Тип данных показывает, что именно хранится в переменной.\n\n" +
      "• Number — числа (25, 3.14)\n" +
      "• String — строки (текст). Если значение в кавычках — это строка.\n" +
      "• Boolean — true или false\n\n" +
      "Обрати внимание: \"25\" и 25 — это разные типы. Кавычки превращают число в строку.",
    question: "Какой тип у значения “25”?",
    options: [
      { id: "a", text: "Number" },
      { id: "b", text: "String" },
      { id: "c", text: "Boolean" },
    ],
    correctOptionId: "b",
  },
  {
    id: "conditions",
    title: "Условия",
    icon: "🍃",
    theory:
      "Условие (if) позволяет выполнять код только тогда, когда проверка истинна.\n\n" +
      "В JavaScript правильный синтаксис:\n" +
      "• условие пишется в круглых скобках ( )\n" +
      "• блок кода — в фигурных скобках { }\n\n" +
      "Слова вроде “then” в JavaScript не используются.",
    question: "Какая запись условия в JavaScript правильная?",
    options: [
      { id: "a", text: "if x > 5 then" },
      { id: "b", text: "if (x > 5) { }" },
      { id: "c", text: "if x > 5 { }" },
    ],
    correctOptionId: "b",
  },
  {
    id: "forest-final",
    title: "Сердце леса",
    icon: "🌳",
    theory:
      "Ты уже знаешь базу: алгоритмы, переменные, типы и условия.\n\n" +
      "Переменные — это способ хранить значения под именем, чтобы:\n" +
      "• использовать одно и то же значение много раз\n" +
      "• изменять значение в процессе работы программы (если это let)\n\n" +
      "Главное: переменная хранит данные, а не «тип» или «команду».",
    question: "Что верно про переменные?",
    options: [
      { id: "a", text: "Переменные нужны только для чисел" },
      { id: "b", text: "Переменные хранят данные, которые можно использовать в коде" },
      { id: "c", text: "Переменные нельзя менять" },
    ],
    correctOptionId: "b",
  },
];

type AnswerState = "idle" | "selected" | "checked_correct" | "checked_wrong";

const CoursePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data, completeMission } = useEduQuest();

  useEffect(() => {
    if (params.id && params.id !== COURSE_ID) navigate("/courses");
  }, [params.id, navigate]);

  const course = useMemo(() => {
    if (!data) return null;
    return data.courses.find((c: any) => c.id === COURSE_ID) ?? null;
  }, [data]);

  const missions = useMemo(() => {
    if (!course) return [];
    return course.missions.map((m: any) => {
      const content = FOREST_MISSIONS.find((x) => x.id === m.id);
      return {
        ...m,
        icon: content?.icon ?? "🌿",
        title: content?.title ?? m.title,
      };
    });
  }, [course]);

  const firstUnlockedId = useMemo(() => {
    const first = missions.find((m: any) => !m.locked);
    return first?.id ?? "algorithms";
  }, [missions]);

  const [activeMissionId, setActiveMissionId] = useState<string>("algorithms");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [showReward, setShowReward] = useState(false);
  const [rewardXp, setRewardXp] = useState<number>(0);

  useEffect(() => {
    if (firstUnlockedId) setActiveMissionId(firstUnlockedId);
  }, [firstUnlockedId]);

  const activeContent = useMemo(() => {
    return FOREST_MISSIONS.find((m) => m.id === activeMissionId) ?? FOREST_MISSIONS[0];
  }, [activeMissionId]);

  const activeMission = useMemo(() => {
    return missions.find((m: any) => m.id === activeMissionId) ?? null;
  }, [missions, activeMissionId]);

  const completedCount = useMemo(() => {
    return missions.filter((m: any) => m.completed).length;
  }, [missions]);

  const totalCount = missions.length || 5;
  const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const resetAnswer = () => {
    setSelectedOptionId(null);
    setAnswerState("idle");
  };

  const openMission = (missionId: string) => {
    const m = missions.find((x: any) => x.id === missionId);
    if (!m || m.locked) return;

    setActiveMissionId(missionId);
    resetAnswer();
  };

  const handleSelect = (optionId: string) => {
    if (!activeMission || activeMission.locked) return;
    if (answerState === "checked_correct" || answerState === "checked_wrong") return;

    setSelectedOptionId(optionId);
    setAnswerState("selected");
  };

  const checkAnswer = () => {
    if (!selectedOptionId) return;
    if (!activeContent) return;

    const isCorrect = selectedOptionId === activeContent.correctOptionId;
    setAnswerState(isCorrect ? "checked_correct" : "checked_wrong");
  };

  const goNextUnlocked = () => {
    const idx = missions.findIndex((m: any) => m.id === activeMissionId);
    const next = missions[idx + 1];
    if (next && !next.locked) {
      setActiveMissionId(next.id);
      resetAnswer();
      return;
    }
  };

  const finishMission = (awardXp: boolean) => {
  if (!activeMission) return;
  if (activeMission.completed) return;

  const xp = awardXp ? (activeMission.xp ?? 0) : 0;

  completeMission(COURSE_ID, activeMission.id, { awardXp });

  setRewardXp(xp);
  setShowReward(true);

};

  if (!data || !course) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.page}>
      <button className={styles.back} type="button" onClick={() => navigate("/courses")}>
        ← Назад к курсам
      </button>

      {}
      <section className={styles.courseCard}>
        <div className={styles.courseIcon}>🌳</div>

        <div className={styles.courseInfo}>
          <h1 className={styles.courseTitle}>{course.title}</h1>
          <p className={styles.courseDesc}>{course.description}</p>

          <div className={styles.courseProgressRow}>
            <span className={styles.courseProgressLabel}>Прогресс курса</span>
            <span className={styles.courseProgressValue}>
              {completedCount}/{totalCount}
            </span>
          </div>

          <div className={styles.courseProgressBar}>
            <div className={styles.courseProgressFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </section>

      {}
      <section className={styles.grid}>
        {}
        <aside className={styles.missions}>
          <h2 className={styles.missionsTitle}>Миссии курса</h2>

          <div className={styles.missionList}>
            {missions.map((m: any) => {
              const isActive = m.id === activeMissionId;
              const isLocked = !!m.locked;
              const isDone = !!m.completed;

              return (
                <button
                  key={m.id}
                  type="button"
                  className={[
                    styles.missionItem,
                    isActive ? styles.missionActive : "",
                    isLocked ? styles.missionLocked : "",
                    isDone ? styles.missionDone : "",
                  ].join(" ")}
                  onClick={() => openMission(m.id)}
                  aria-disabled={isLocked ? "true" : "false"}
                  title={isLocked ? "Миссия закрыта" : "Открыть миссию"}
                >
                  <div className={styles.missionIconWrap}>
                    <div className={styles.missionIcon}>
                      {isLocked ? "🔒" : m.icon}
                    </div>
                  </div>

                  <div className={styles.missionText}>
                    <div className={styles.missionName}>{m.title}</div>
                    <div className={styles.missionMeta}>
                      <span className={styles.xp}>⭐ +{m.xp} XP</span>
                      {isDone ? <span className={styles.done}>Завершено</span> : null}
                    </div>
                  </div>

                  {isActive ? <span className={styles.dot} /> : null}
                </button>
              );
            })}
          </div>
        </aside>

        {}
        <div className={styles.content}>
          {!activeMission || activeMission.locked ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🌳</div>
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
                  <div className={styles.missionXp}>⭐ +{activeMission.xp} XP</div>
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
                  {activeContent.options.map((opt, idx) => {
                    const isSelected = selectedOptionId === opt.id;
                    const isWrongSelected =
                      answerState === "checked_wrong" && isSelected;
                    const isCorrectSelected =
                      answerState === "checked_correct" && isSelected;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={[
                          styles.option,
                          isSelected ? styles.optionSelected : "",
                          isWrongSelected ? styles.optionWrong : "",
                          isCorrectSelected ? styles.optionCorrect : "",
                        ].join(" ")}
                        onClick={() => handleSelect(opt.id)}
                      >
                        <span className={styles.badge}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={styles.optionText}>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.actions}>
                  {answerState === "idle" || answerState === "selected" ? (
                    <button
                      type="button"
                      className={styles.checkBtn}
                      onClick={checkAnswer}
                      disabled={!selectedOptionId}
                    >
                      Проверить ответ
                    </button>
                  ) : answerState === "checked_correct" ? (
                    <button
                      type="button"
                      className={styles.finishBtn}
                      onClick={() => finishMission(true)}
                    >
                      Завершить миссию
                    </button>
                  ) : (
                    <div className={styles.afterWrong}>
                      <div className={styles.wrongHint}>
                        Неверно. Можно попробовать ещё раз или перейти дальше без XP.
                      </div>

                      <div className={styles.afterWrongBtns}>
                        <button
                          type="button"
                          className={styles.tryAgainBtn}
                          onClick={resetAnswer}
                        >
                          Попробовать ещё
                        </button>

                        <button
                          type="button"
                          className={styles.skipBtn}
                          onClick={() => finishMission(false)}
                        >
                          Дальше без XP
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {}
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

            <div className={styles.modalValue}>
              {rewardXp > 0 ? `+${rewardXp} XP` : "0 XP"}
            </div>

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
                  goNextUnlocked();
                }}
              >
                Следующая миссия
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;