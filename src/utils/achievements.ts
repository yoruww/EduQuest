import type { Achievement, EduQuestData } from "../types/eduquest";

const hasCompletedAtLeastOneMission = (data: EduQuestData): boolean => {
  return data.courses.some((course) =>
    course.missions.some((mission) => mission.completed)
  );
};

const hasCompletedFullCourse = (data: EduQuestData): boolean => {
  return data.courses.some((course) => course.completed);
};

const hasEarnedEnoughXp = (data: EduQuestData): boolean => {
  return data.user.xp >= 100;
};

const hasCompletedAllCourses = (data: EduQuestData): boolean => {
  return (
    data.courses.length > 0 &&
    data.courses.every((course) => course.completed)
  );
};

const isAchievementUnlocked = (
  achievement: Achievement,
  data: EduQuestData
): boolean => {
  switch (achievement.condition) {
    case "complete-1-mission":
      return hasCompletedAtLeastOneMission(data);

    case "complete-full-course":
      return hasCompletedFullCourse(data);

    case "earn-100-xp":
      return hasEarnedEnoughXp(data);

    case "complete-all":
      return hasCompletedAllCourses(data);

    default:
      return false;
  }
};

export const getUnlockedAchievementIds = (data: EduQuestData): string[] => {
  return data.achievements
    .filter((achievement) => isAchievementUnlocked(achievement, data))
    .map((achievement) => achievement.id);
};

export const applyUnlockedAchievements = (
  data: EduQuestData
): EduQuestData => {
  const unlockedAchievementIds = getUnlockedAchievementIds(data);

  return {
    ...data,
    user: {
      ...data.user,
      achievements: unlockedAchievementIds,
    },
  };
};