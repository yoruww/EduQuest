import type { AnswerState, MissionContent as MissionContentType, MissionWithUi } from "../types";
import styles from "../CoursePage.module.css";

interface MissionContentProps {
  courseIcon: string;
  activeMission: MissionWithUi | null;
  activeContent: MissionContentType | null;
  selectedOptionId: string | null;
  answerState: AnswerState;
  onSelect: (optionId: string) => void;
  onCheckAnswer: () => void;
  onFinishMission: () => void;
}

const MissionContent = ({
  courseIcon,
  activeMission,
  activeContent,
  selectedOptionId,
  answerState,
  onSelect,
  onCheckAnswer,
  onFinishMission,
}: MissionContentProps) => {
  if (!activeMission || activeMission.locked || !activeContent) {
    return (
      <div className={styles.content}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>{courseIcon}</div>
          <div className={styles.emptyTitle}>Выберите миссию</div>
          <div className={styles.emptyText}>
            Выберите миссию из списка слева, чтобы начать обучение
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.content}>
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
                  onClick={() => onSelect(option.id)}
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
                onClick={onCheckAnswer}
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
                onClick={onFinishMission}
              >
                Завершить миссию
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionContent;