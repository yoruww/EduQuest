import { useEffect, useState } from "react";
import { initStorage, getStorage, saveStorage } from "../utils/storage";

export const useEduQuest = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = initStorage();
    setData(stored);
  }, []);

  const updateData = (updated: any) => {
    setData({ ...updated });
    saveStorage(updated);
  };

  const completeMission = (courseId: string, missionId: string) => {
    const updated = getStorage();
    if (!updated) return;

    const course = updated.courses.find((c: any) => c.id === courseId);
    if (!course) return;

    const mission = course.missions.find((m: any) => m.id === missionId);
    if (!mission || mission.completed) return;

    mission.completed = true;

    updated.user.stars += 1;
    updated.user.xp += mission.xp;
    updated.user.completedMissions.push(missionId);

    const missionIndex = course.missions.findIndex((m: any) => m.id === missionId);
    if (course.missions[missionIndex + 1]) {
      course.missions[missionIndex + 1].locked = false;
    }

    const allCompleted = course.missions.every((m: any) => m.completed);

    if (allCompleted && !course.completed) {
      course.completed = true;
      updated.user.completedCourses.push(courseId);

      const courseIndex = updated.courses.findIndex((c: any) => c.id === courseId);
      if (updated.courses[courseIndex + 1]) {
        updated.courses[courseIndex + 1].locked = false;
      }
    }

    checkAchievements(updated);
    updateData(updated);
  };

  const checkAchievements = (updated: any) => {
    const { user, achievements, courses } = updated;

    achievements.forEach((achievement: any) => {
      if (user.achievements.includes(achievement.id)) return;

      switch (achievement.condition) {
        case "complete-1-mission":
          if (user.completedMissions.length >= 1) {
            user.achievements.push(achievement.id);
          }
          break;

        case "complete-full-cource":
          if (user.completedCourses.length >= 1) {
            user.achievements.push(achievement.id);
          }
          break;

        case "earn-100-XP":
          if (user.xp >= 100) {
            user.achievements.push(achievement.id);
          }
          break;

        case "complete-all":
          if (user.completedCourses.length === courses.length) {
            user.achievements.push(achievement.id);
          }
          break;
      }
    });
  };

  const getCourseProgress = (courseId: string) => {
    if (!data) return 0;

    const course = data.courses.find((c: any) => c.id === courseId);
    if (!course) return 0;

    const completed = course.missions.filter((m: any) => m.completed).length;
    return Math.round((completed / course.missions.length) * 100);
  };

  return {
    data,
    completeMission,
    getCourseProgress,
  };
};