import type { Achievement, Course } from "../../types/eduquest";
import type { ProfileAchievementView, ProfileStatCard } from "./types";

const BASE_XP_PER_LEVEL = 100;

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

export const buildAchievementsView = (
  achievements: Achievement[],
  unlockedAchievementIds: string[]
): ProfileAchievementView[] => {
  const unlockedSet = new Set(unlockedAchievementIds);

  return achievements.map((achievement) => ({
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    unlocked: unlockedSet.has(achievement.id),
  }));
};

export const buildStats = (
  courses: Course[],
  userXp: number,
  unlockedAchievementsCount: number,
  totalAchievementsCount: number
): ProfileStatCard[] => {
  const completedMissions = getCompletedMissionsCount(courses);
  const totalMissions = getTotalMissionsCount(courses);
  const completedCourses = getCompletedCoursesCount(courses);
  const totalCourses = courses.length;

  return [
    {
      id: "missions",
      label: "Пройдено миссий",
      value: `${completedMissions}/${totalMissions}`,
      icon: "◎",
      tone: "blue",
    },
    {
      id: "courses",
      label: "Завершено курсов",
      value: `${completedCourses}/${totalCourses}`,
      icon: "▣",
      tone: "violet",
    },
    {
      id: "xp",
      label: "Общий XP",
      value: `${userXp}`,
      icon: "☆",
      tone: "gold",
    },
    {
      id: "achievements",
      label: "Достижения",
      value: `${unlockedAchievementsCount}/${totalAchievementsCount}`,
      icon: "◆",
      tone: "green",
    },
  ];
};