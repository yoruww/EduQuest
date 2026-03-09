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

type AnswerState = "idle" | "selected" | "checked_correct" | "checked_wrong";

const COURSE_CONTENT: Record<string, MissionContent[]> = {
  "forest-basics": [
    {
      id: "algorithms",
      title: "Тропинка алгоритмов",
      icon: "🌱",
      theory:
        "Алгоритм — это последовательность шагов для решения задачи.\n\n" +
        "У алгоритма есть порядок действий, понятные шаги и конкретный результат.\n" +
        "Если описано только общее действие, а не шаги, это ещё не алгоритм.",
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
        "Переменная — это контейнер для хранения данных.\n\n" +
        "У переменной есть имя и значение. В JavaScript переменные обычно объявляют через let или const.\n" +
        "Запись должна быть в правильном порядке: сначала ключевое слово, потом имя, потом значение.",
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
        "Тип данных показывает, какое значение хранится в переменной.\n\n" +
        "Number — число, String — строка, Boolean — true/false.\n" +
        "Если значение записано в кавычках, это строка, даже если внутри число.",
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
        "Условия позволяют выполнять код по-разному в зависимости от ситуации.\n\n" +
        "В JavaScript для этого используют if.\n" +
        "Условие пишется в круглых скобках, а блок кода — в фигурных.",
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
        "Финальная миссия объединяет базовые знания.\n\n" +
        "Алгоритмы — это шаги, переменные — хранение данных, типы — вид значения, условия — выбор действия.\n" +
        "Хорошее понимание этих основ помогает двигаться дальше.",
      question: "Что верно про переменные?",
      options: [
        { id: "a", text: "Переменные нужны только для чисел" },
        { id: "b", text: "Переменные хранят данные, которые можно использовать в коде" },
        { id: "c", text: "Переменные нельзя менять" },
      ],
      correctOptionId: "b",
    },
  ],

  "js-desert": [
    {
      id: "functions",
      title: "Функции",
      icon: "⚙️",
      theory:
        "Функция — это блок кода, который можно запускать много раз.\n\n" +
        "Она помогает не повторять один и тот же код и делает программу удобнее.\n" +
        "Функцию можно объявить и потом вызвать по имени.",
      question: "Как правильно объявить функцию в JavaScript?",
      options: [
        { id: "a", text: "function hello() { }" },
        { id: "b", text: "func hello() { }" },
        { id: "c", text: "hello function() { }" },
      ],
      correctOptionId: "a",
    },
    {
      id: "options",
      title: "Параметры",
      icon: "🌵",
      theory:
        "Параметры — это данные, которые функция получает при вызове.\n\n" +
        "Они указываются в круглых скобках при объявлении функции.\n" +
        "С их помощью функция может работать с разными значениями.",
      question: "Где указываются параметры функции?",
      options: [
        { id: "a", text: "В фигурных скобках" },
        { id: "b", text: "В круглых скобках после имени функции" },
        { id: "c", text: "После return" },
      ],
      correctOptionId: "b",
    },
    {
      id: "cycles",
      title: "Циклы",
      icon: "☀️",
      theory:
        "Цикл позволяет повторять действие несколько раз.\n\n" +
        "Например, можно вывести числа от 1 до 5 без повторения одинакового кода.\n" +
        "В JavaScript часто используют цикл for.",
      question: "Какой оператор используют для цикла?",
      options: [
        { id: "a", text: "for" },
        { id: "b", text: "if" },
        { id: "c", text: "const" },
      ],
      correctOptionId: "a",
    },
    {
      id: "arrays",
      title: "Массивы",
      icon: "🐫",
      theory:
        "Массив — это список значений в одной переменной.\n\n" +
        "Элементы массива записываются в квадратных скобках.\n" +
        "Массив удобен, когда нужно хранить несколько значений вместе.",
      question: "Какая запись создаёт массив?",
      options: [
        { id: "a", text: "let arr = {1, 2, 3}" },
        { id: "b", text: "let arr = [1, 2, 3]" },
        { id: "c", text: "let arr = (1, 2, 3)" },
      ],
      correctOptionId: "b",
    },
    {
      id: "desert-final",
      title: "Храм JavaScript",
      icon: "🏛️",
      theory:
        "Финальная миссия курса собирает всё вместе: функции, параметры, циклы и массивы.\n\n" +
        "Функции помогают переиспользовать код, параметры передают данные, циклы повторяют действия, массивы хранят набор значений.",
      question: "Что лучше всего описывает массив?",
      options: [
        { id: "a", text: "Это условие для проверки" },
        { id: "b", text: "Это способ хранить несколько значений в одном месте" },
        { id: "c", text: "Это цикл" },
      ],
      correctOptionId: "b",
    },
  ],
};

const CoursePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data, completeMission } = useEduQuest();

  const courseId = params.id ?? "forest-basics";

  const course = useMemo(() => {
    if (!data) return null;
    return data.courses.find((c: any) => c.id === courseId) ?? null;
  }, [data, courseId]);

  const missionContentList = COURSE_CONTENT[courseId] ?? [];

  const missions = useMemo(() => {
    if (!course) return [];
    return course.missions.map((m: any) => {
      const content = missionContentList.find((x) => x.id === m.id);
      return {
        ...m,
        icon: content?.icon ?? "📘",
        displayTitle: content?.title ?? m.title,
      };
    });
  }, [course, missionContentList]);

  const firstUnlockedId = useMemo(() => {
    const first = missions.find((m: any) => !m.locked);
    return first?.id ?? missions[0]?.id ?? "";
  }, [missions]);

  const [activeMissionId, setActiveMissionId] = useState<string>("");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [showReward, setShowReward] = useState(false);
  const [rewardXp, setRewardXp] = useState(0);

  useEffect(() => {
    if (firstUnlockedId) setActiveMissionId(firstUnlockedId);
  }, [firstUnlockedId]);

  const activeContent = useMemo(() => {
    return missionContentList.find((m) => m.id === activeMissionId) ?? null;
  }, [missionContentList, activeMissionId]);

  const activeMission = useMemo(() => {
    return missions.find((m: any) => m.id === activeMissionId) ?? null;
  }, [missions, activeMissionId]);

  const completedCount = useMemo(() => {
    return missions.filter((m: any) => m.completed).length;
  }, [missions]);

  const totalCount = missions.length || 1;
  const progressPercent = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  const resetAnswerState = () => {
    setSelectedOptionId(null);
    setAnswerState("idle");
  };

  const openMission = (missionId: string) => {
    const mission = missions.find((m: any) => m.id === missionId);
    if (!mission || mission.locked) return;

    setActiveMissionId(missionId);
    resetAnswerState();
  };

  const handleSelect = (optionId: string) => {
    if (!activeMission || activeMission.locked) return;
    if (answerState === "checked_correct" || answerState === "checked_wrong") return;

    setSelectedOptionId(optionId);
    setAnswerState("selected");
  };

  const checkAnswer = () => {
    if (!selectedOptionId || !activeContent) return;

    const isCorrect = selectedOptionId === activeContent.correctOptionId;
    setAnswerState(isCorrect ? "checked_correct" : "checked_wrong");
  };

  const getNextMission = () => {
    const idx = missions.findIndex((m: any) => m.id === activeMissionId);
    return missions[idx + 1] ?? null;
  };

  const goNext = () => {
    const nextMission = getNextMission();

    if (nextMission && !nextMission.locked) {
      setActiveMissionId(nextMission.id);
      resetAnswerState();
      return;
    }

    if (courseId === "forest-basics") {
      const nextCourse = data?.courses.find((c: any) => c.id === "js-desert");
      if (nextCourse && !nextCourse.locked) {
        navigate("/course/js-desert");
        return;
      }
    }

    navigate("/courses");
  };

  const finishMission = () => {
    if (!activeMission) return;
    if (activeMission.completed) return;
    if (answerState !== "checked_correct" && answerState !== "checked_wrong") return;

    const awardXp = answerState === "checked_correct";
    const xp = awardXp ? activeMission.xp ?? 0 : 0;

    completeMission(courseId, activeMission.id, { awardXp });

    setRewardXp(xp);
    setShowReward(true);
  };

  if (!data || !course) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} type="button" onClick={() => navigate("/courses")}>
        ← Назад к курсам
      </button>

      <section
        className={[
          styles.courseCard,
          courseId === "forest-basics" ? styles.courseForest : "",
          courseId === "js-desert" ? styles.courseDesert : "",
        ].join(" ")}
      >
        <div className={styles.courseIcon}>
          {courseId === "forest-basics" ? "🌳" : "🏜️"}
        </div>

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
                >
                  <div className={styles.missionIconWrap}>
                    <div className={styles.missionIcon}>
                      {isLocked ? "🔒" : m.icon}
                    </div>
                  </div>

                  <div className={styles.missionText}>
                    <div className={styles.missionNameRow}>
                      <div className={styles.missionName}>{m.displayTitle}</div>
                      {m.isFinal ? <span className={styles.finalBadge}>Финал</span> : null}
                    </div>

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

        <div className={styles.content}>
          {!activeMission || activeMission.locked || !activeContent ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                {courseId === "forest-basics" ? "🌳" : "🏜️"}
              </div>
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

                    const isCorrectVisible =
                      (answerState === "checked_correct" &&
                        opt.id === activeContent.correctOptionId) ||
                      (answerState === "checked_wrong" &&
                        opt.id === activeContent.correctOptionId);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={[
                          styles.option,
                          isSelected && answerState === "selected" ? styles.optionSelected : "",
                          isWrongSelected ? styles.optionWrong : "",
                          isCorrectVisible ? styles.optionCorrect : "",
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

                  {(answerState === "checked_correct" || answerState === "checked_wrong") && (
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
                  ? courseId === "forest-basics"
                    ? "Следующий курс"
                    : "К списку курсов"
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