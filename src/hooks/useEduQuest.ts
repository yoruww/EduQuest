import { useEffect, useState } from "react";
import type { EduQuestData } from "../types/eduquest";
import { getStorage, initStorage, saveStorage } from "../utils/storage";

export const useEduQuest = () => {
  const [data, setData] = useState<EduQuestData | null>(null);

  useEffect(() => {
    const stored = initStorage();
    setData(stored);
  }, []);

  const updateData = (newData: EduQuestData) => {
    setData(newData);
    saveStorage(newData);
  };

  const completeMission = (
    courseId: string,
    missionId: string,
    xpEarned: number
  ) => {
    const currentData = getStorage();
    if (!currentData) return;

    const updatedCourses = currentData.courses.map((course) => {
      if (course.id !== courseId) return course;

      const missionIndex = course.missions.findIndex(
        (mission) => mission.id === missionId
      );

      const updatedMissions = course.missions.map((mission, index) => {
        if (mission.id === missionId) {
          return { ...mission, completed: true };
        }

        if (index === missionIndex + 1) {
          return { ...mission, locked: false };
        }

        return mission;
      });

      const courseCompleted = updatedMissions.every((mission) => mission.completed);

      return {
        ...course,
        completed: courseCompleted,
        missions: updatedMissions,
      };
    });

    const currentCourseIndex = updatedCourses.findIndex(
      (course) => course.id === courseId
    );

    if (
      currentCourseIndex !== -1 &&
      updatedCourses[currentCourseIndex].completed &&
      updatedCourses[currentCourseIndex + 1]
    ) {
      updatedCourses[currentCourseIndex + 1] = {
        ...updatedCourses[currentCourseIndex + 1],
        locked: false,
      };
    }

    const updatedUser = {
      ...currentData.user,
      xp: currentData.user.xp + xpEarned,
    };

    const updatedData: EduQuestData = {
      ...currentData,
      user: updatedUser,
      courses: updatedCourses,
    };

    updateData(updatedData);
  };

  return {
    data,
    completeMission,
  };
};