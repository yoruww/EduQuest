import type { Achievement, Course } from "../../types/eduquest";
import {
  getCompletedCoursesCount,
  getCompletedMissionsCount,
  getTotalMissionsCount,
} from "../../utils/progress";
import type { ProfileAchievementView, ProfileStatCard } from "./types";

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