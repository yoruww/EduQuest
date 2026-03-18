import type { SoonCourseConfig } from "./types";

export const DEFAULT_SOON_COURSE_MISSIONS_COUNT = 5;

export const SOON_COURSES: SoonCourseConfig[] = [
  {
    id: "react-castle",
    title: "Замок React",
    description: "Изучение компонентов и состояния React.",
    icon: "🏰",
  },
  {
    id: "algo-mountains",
    title: "Горы Алгоритмов",
    description: "Сложные алгоритмы и структуры данных.",
    icon: "⛰️",
  },
  {
    id: "api-ocean",
    title: "Океан API",
    description: "Работа с API и асинхронным кодом.",
    icon: "🌊",
  },
];