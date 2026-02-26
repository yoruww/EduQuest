import { useEffect, useState } from "react";
import { initStorage, getStorage, saveStorage } from "../utils/storage";
import type { EduQuestData, Achievement } from "../types/eduquest";

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const useEduQuest = () => {
  const [data, setData] = useState<EduQuestData | null>(null);

  useEffect(() => {
    const stored = initStorage();
    setData(stored);
  }, []);

  const updateData = (updated: EduQuestData) => {
    
    const cloned = deepClone(updated);
    setData(cloned);
    saveStorage(cloned);
  };

  const checkAchievements = (updated: EduQuestData) => {
    const { user, achievements, courses } = updated;

    const grant = (a: Achievement) => {
      if (!user.achievements.includes(a.id)) user.achievements.push(a.id);
    };

    for (const achievement of achievements) {
      if (user.achievements.includes(achievement.id)) continue;

      switch (achievement.condition) {
        case "complete-1-mission":
          if (user.completedMissions.length >= 1) grant(achievement);
          break;

        case "complete-full-course":
          if (user.completedCourses.length >= 1) grant(achievement);
          break;

        case "earn-100-XP":
          if (user.xp >= 100) grant(achievement);
          break;

        case "complete-all":
          if (user.completedCourses.length === courses.length) grant(achievement);
          break;
      }
    }
  };

  const completeMission = (courseId: string, missionId: string) => {
    const stored = getStorage();
    if (!stored) return;

    
    const updated: EduQuestData = deepClone(stored);

    const course = updated.courses.find((c) => c.id === courseId);
    if (!course || course.locked) return;

    const mission = course.missions.find((m) => m.id === missionId);
    if (!mission) return;

    // нельзя пройти закрытую или уже пройденную миссию
    if (mission.locked || mission.completed) return;

    mission.completed = true;

    updated.user.stars += 1;
    updated.user.xp += mission.xp;

    if (!updated.user.completedMissions.includes(missionId)) {
      updated.user.completedMissions.push(missionId);
    }

    // открыть следующую миссию
    const missionIndex = course.missions.findIndex((m) => m.id === missionId);
    const nextMission = course.missions[missionIndex + 1];
    if (nextMission) nextMission.locked = false;

    // завершение курса
    const allCompleted = course.missions.every((m) => m.completed);
    if (allCompleted && !course.completed) {
      course.completed = true;

      if (!updated.user.completedCourses.includes(courseId)) {
        updated.user.completedCourses.push(courseId);
      }

      // открыть следующий курс
      const courseIndex = updated.courses.findIndex((c) => c.id === courseId);
      const nextCourse = updated.courses[courseIndex + 1];
      if (nextCourse && nextCourse.locked) {
        nextCourse.locked = false;
        // при открытии курса — открываем первую миссию 
        if (nextCourse.missions[0]) nextCourse.missions[0].locked = false;
      }
    }

    checkAchievements(updated);
    updateData(updated);
  };

  const getCourseProgress = (courseId: string) => {
    if (!data) return 0;

    const course = data.courses.find((c) => c.id === courseId);
    if (!course) return 0;

    const completed = course.missions.filter((m) => m.completed).length;
    return Math.round((completed / course.missions.length) * 100);
  };

  return {
    data,
    completeMission,
    getCourseProgress,
  };
};