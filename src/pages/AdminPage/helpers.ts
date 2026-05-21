import type { MissionForm } from "./types";

export const createEmptyForm = (): MissionForm => ({
  title: "",
  xp: "50",
  theory: "",
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  correctOptionId: "a",
});

export const createMissionId = (title: string): string => {
  const normalizedTitle = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-zа-яё0-9-]/gi, "");

  return `${normalizedTitle || "mission"}-${Date.now()}`;
};