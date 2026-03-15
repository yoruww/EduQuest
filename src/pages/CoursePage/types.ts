export type QuizOption = {
  id: string;
  text: string;
};

export type MissionContent = {
  id: string;
  title: string;
  icon: string;
  theory: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
};

export type AnswerState =
  | "idle"
  | "selected"
  | "checked_correct"
  | "checked_wrong";