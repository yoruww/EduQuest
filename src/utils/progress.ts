import type { Course } from "../types/eduquest";

export const BASE_XP_PER_LEVEL = 100;

export const getXpRequiredForLevel = (level: number): number => {
  if (level <= 1) {
    return 0;
  }

  let totalXp = 0;

  for (let currentLevel = 1; currentLevel < level; currentLevel += 1) {
    totalXp += currentLevel * BASE_XP_PER_LEVEL;
  }

  return totalXp;
};

export const getUserLevel = (xp: number): number => {
  let level = 1;

  while (xp >= getXpRequiredForLevel(level + 1)) {
    level += 1;
  }

  return level;
};

export const getCurrentLevelStartXp = (level: number): number => {
  return getXpRequiredForLevel(level);
};

export const getNextLevelXp = (level: number): number => {
  return getXpRequiredForLevel(level + 1);
};

export const getCompletedMissionsCount = (courses: Course[]): number => {
  return courses.reduce(
    (sum, course) =>
      sum + course.missions.filter((mission) => mission.completed).length,
    0
  );
};

export const getTotalMissionsCount = (courses: Course[]): number => {
  return courses.reduce((sum, course) => sum + course.missions.length, 0);
};

export const getCompletedCoursesCount = (courses: Course[]): number => {
  return courses.filter((course) => course.completed).length;
};