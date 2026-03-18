import { useEffect, useState } from "react";
import type { Course, EduQuestData } from "../types/eduquest";
import { initStorage, saveStorage } from "../utils/storage";
import { applyUnlockedAchievements } from "../utils/achievements";

const unlockNextMission = (
  missions: Course["missions"],
  missionId: string
): Course["missions"] => {
  const missionIndex = missions.findIndex((mission) => mission.id === missionId);

  return missions.map((mission, index) => {
    if (mission.id === missionId) {
      return { ...mission, completed: true };
    }

    if (index === missionIndex + 1) {
      return { ...mission, locked: false };
    }

    return mission;
  });
};

const unlockNextCourse = (courses: Course[], courseId: string): Course[] => {
  const currentCourseIndex = courses.findIndex((course) => course.id === courseId);

  if (currentCourseIndex === -1) {
    return courses;
  }

  const currentCourse = courses[currentCourseIndex];

  if (!currentCourse.completed || !courses[currentCourseIndex + 1]) {
    return courses;
  }

  return courses.map((course, index) => {
    if (index === currentCourseIndex + 1) {
      return { ...course, locked: false };
    }

    return course;
  });
};

export const useEduQuest = () => {
  const [data, setData] = useState<EduQuestData | null>(null);

  useEffect(() => {
    const storedData = initStorage();
    setData(storedData);
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
    if (!data) {
      return;
    }

    const updatedCourses = data.courses.map((course) => {
      if (course.id !== courseId) {
        return course;
      }

      const updatedMissions = unlockNextMission(course.missions, missionId);
      const courseCompleted = updatedMissions.every((mission) => mission.completed);

      return {
        ...course,
        completed: courseCompleted,
        missions: updatedMissions,
      };
    });

    const coursesWithUnlockedNext = unlockNextCourse(updatedCourses, courseId);

    const updatedData: EduQuestData = {
      ...data,
      user: {
        ...data.user,
        xp: data.user.xp + xpEarned,
      },
      courses: coursesWithUnlockedNext,
    };

    const dataWithAchievements = applyUnlockedAchievements(updatedData);

    updateData(dataWithAchievements);
  };

  return {
    data,
    completeMission,
  };
};