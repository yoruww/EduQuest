import { useEffect, useState } from "react";
import type { EduQuestData, User, Course, Achievement } from "../types/types";
import coursesData from "../mocks/courses.json";
import userData from "../mocks/user.json";
import achievementsData from "../mocks/achievements.json";

const STORAGE_KEY = "eduquest-data";

export const useEduQuest = () => {
  const [data, setData] = useState<EduQuestData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setData(JSON.parse(stored) as EduQuestData);
      return;
    }

    const initialData: EduQuestData = {
      user: userData as User,
      courses: coursesData as Course[],
      achievements: achievementsData as Achievement[],
    };

    setData(initialData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }, []);

  const updateData = (newData: EduQuestData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const completeMission = (
    courseId: string,
    missionId: string,
    xpEarned: number
  ) => {
    if (!data) return;

    const updatedCourses = data.courses.map((course) => {
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

    const updatedUser: User = {
      ...data.user,
      xp: data.user.xp + xpEarned,
    };

    const updatedData: EduQuestData = {
      ...data,
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