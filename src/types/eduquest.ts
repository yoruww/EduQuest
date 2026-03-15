import { useEffect, useState } from "react";
import { EduQuestData, AchievementCondition } from "../types/types";
import courses from "../mocks/courses.json";
import user from "../mocks/user.json";
import achievements from "../mocks/achievements.json";
import { loadData, saveData } from "../utils/storage";

export const useEduQuest = () => {
  const [data, setData] = useState<EduQuestData | null>(null);

  useEffect(() => {
    const stored = loadData();

    if (stored) {
      setData(stored);
    } else {
      const initial: EduQuestData = {
        user,
        courses,
        achievements,
      };

      setData(initial);
      saveData(initial);
    }
  }, []);

  const updateData = (newData: EduQuestData) => {
    setData(newData);
    saveData(newData);
  };

  const completeMission = (courseId: string, missionId: string, xpEarned: number) => {
    if (!data) return;

    const updatedCourses = data.courses.map((course) => {
      if (course.id !== courseId) return course;

      const updatedMissions = course.missions.map((mission) => {
        if (mission.id !== missionId) return mission;

        return {
          ...mission,
          completed: true,
        };
      });

      return {
        ...course,
        missions: updatedMissions,
      };
    });

    const updatedUser = {
      ...data.user,
      xp: data.user.xp + xpEarned,
    };

    const updated: EduQuestData = {
      ...data,
      user: updatedUser,
      courses: updatedCourses,
    };

    checkAchievements(updated);
    updateData(updated);
  };

  const checkAchievements = (currentData: EduQuestData) => {
    const unlocked = new Set(currentData.user.achievements);

    currentData.achievements.forEach((achievement) => {
      if (unlocked.has(achievement.id)) return;

      switch (achievement.condition) {
        case AchievementCondition.CompleteOneMission: {
          const completed = currentData.courses.some((course) =>
            course.missions.some((m) => m.completed)
          );
          if (completed) unlocked.add(achievement.id);
          break;
        }

        case AchievementCondition.CompleteFullCourse: {
          const full = currentData.courses.some((course) =>
            course.missions.every((m) => m.completed)
          );
          if (full) unlocked.add(achievement.id);
          break;
        }

        case AchievementCondition.Earn100XP: {
          if (currentData.user.xp >= 100) unlocked.add(achievement.id);
          break;
        }

        case AchievementCondition.CompleteAll: {
          const all = currentData.courses.every((course) =>
            course.missions.every((m) => m.completed)
          );
          if (all) unlocked.add(achievement.id);
          break;
        }
      }
    });

    currentData.user.achievements = Array.from(unlocked);
  };

  return {
    data,
    completeMission,
  };
};