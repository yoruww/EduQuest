import type { UpcomingMapNode } from "./types";

export const UPCOMING_MAP_NODES: UpcomingMapNode[] = [
  {
    id: "react-castle",
    title: "Замок React",
    subtitle: "Скоро",
    icon: "🏰",
  },
  {
    id: "algo-mountains",
    title: "Горы Алгоритмов",
    subtitle: "Скоро",
    icon: "⛰️",
  },
  {
    id: "api-ocean",
    title: "Океан API",
    subtitle: "Скоро",
    icon: "🌊",
  },
];

export const ACHIEVEMENT_ICONS: Record<string, string> = {
  "first-mission": "🥇",
  "course-conqueror": "🏆",
  "100xp": "🎯",
  "all-courses": "📚",
};