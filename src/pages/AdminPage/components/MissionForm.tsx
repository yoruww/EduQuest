import type { MissionForm as MissionFormType } from "../types";
import styles from "../AdminPage.module.css";

export type MissionFormField = keyof MissionFormType;

interface MissionFormProps {
  courseId: string;
  form: MissionFormType;
  onUpdateForm: (
    courseId: string,
    field: MissionFormField,
    value: string
  ) => void;
  onAddMission: (courseId: string) => void;
}

const MissionForm = ({
  courseId,
  form,
  onUpdateForm,
  onAddMission,
}: MissionFormProps) => {
  return (
    <div className={styles.form}>
      <h3>Добавить миссию с заданием</h3>

      <div className={styles.formGrid}>
        <label>
          Название миссии
          <input
            value={form.title}
            onChange={(event) =>
              onUpdateForm(courseId, "title", event.target.value)
            }
            placeholder="Например: Props в React"
          />
        </label>

        <label>
          XP
          <input
            type="number"
            min="1"
            value={form.xp}
            onChange={(event) =>
              onUpdateForm(courseId, "xp", event.target.value)
            }
          />
        </label>
      </div>

      <label>
        Теория
        <textarea
          value={form.theory}
          onChange={(event) =>
            onUpdateForm(courseId, "theory", event.target.value)
          }
          placeholder="Краткий учебный материал..."
        />
      </label>

      <label>
        Вопрос
        <input
          value={form.question}
          onChange={(event) =>
            onUpdateForm(courseId, "question", event.target.value)
          }
          placeholder="Вопрос по материалу"
        />
      </label>

      <div className={styles.answerGrid}>
        <label>
          Ответ A
          <input
            value={form.optionA}
            onChange={(event) =>
              onUpdateForm(courseId, "optionA", event.target.value)
            }
          />
        </label>

        <label>
          Ответ B
          <input
            value={form.optionB}
            onChange={(event) =>
              onUpdateForm(courseId, "optionB", event.target.value)
            }
          />
        </label>

        <label>
          Ответ C
          <input
            value={form.optionC}
            onChange={(event) =>
              onUpdateForm(courseId, "optionC", event.target.value)
            }
          />
        </label>

        <label>
          Правильный ответ
          <select
            value={form.correctOptionId}
            onChange={(event) =>
              onUpdateForm(courseId, "correctOptionId", event.target.value)
            }
          >
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        className={styles.primaryButton}
        onClick={() => onAddMission(courseId)}
      >
        Добавить миссию
      </button>
    </div>
  );
};

export default MissionForm;