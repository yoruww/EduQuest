import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Course, EduQuestData, Mission } from "../types/eduquest";
import { initStorage, saveStorage } from "../utils/storage";
import { applyUnlockedAchievements } from "../utils/achievements";

interface EduQuestContextValue {
  data: EduQuestData | null;
  setUserName: (name: string) => void;
  completeMission: (
    courseId: string,
    missionId: string,
    xpEarned: number
  ) => void;
  toggleCourseLock: (courseId: string) => void;
  updateMissionXp: (courseId: string, missionId: string, xp: number) => void;
  addMissionToCourse: (courseId: string, mission: Mission) => void;
  deleteMissionFromCourse: (courseId: string, missionId: string) => void;
  resetUserProgress: () => void;
}

const EduQuestContext = createContext<EduQuestContextValue | null>(null);

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

interface EduQuestProviderProps {
  children: ReactNode;
}

export const EduQuestProvider = ({ children }: EduQuestProviderProps) => {
  const [data, setData] = useState<EduQuestData | null>(null);

  useEffect(() => {
    setData(initStorage());
  }, []);

  const updateData = (newData: EduQuestData) => {
    setData(newData);
    saveStorage(newData);
  };

  const setUserName = (name: string) => {
    if (!data) return;

    const trimmedName = name.trim();

    if (!trimmedName) return;

    updateData({
      ...data,
      user: {
        ...data.user,
        name: trimmedName,
      },
    });
  };

  const completeMission = (
    courseId: string,
    missionId: string,
    xpEarned: number
  ) => {
    if (!data) return;

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

    updateData(applyUnlockedAchievements(updatedData));
  };

  const toggleCourseLock = (courseId: string) => {
    if (!data) return;

    const updatedCourses = data.courses.map((course) => {
      if (course.id !== courseId) {
        return course;
      }

      return {
        ...course,
        locked: !course.locked,
      };
    });

    updateData({
      ...data,
      courses: updatedCourses,
    });
  };

  const updateMissionXp = (
    courseId: string,
    missionId: string,
    xp: number
  ) => {
    if (!data) return;

    if (!Number.isFinite(xp) || xp <= 0) {
      return;
    }

    const updatedCourses = data.courses.map((course) => {
      if (course.id !== courseId) {
        return course;
      }

      return {
        ...course,
        missions: course.missions.map((mission) =>
          mission.id === missionId
            ? {
                ...mission,
                xp,
              }
            : mission
        ),
      };
    });

    updateData({
      ...data,
      courses: updatedCourses,
    });
  };

  const addMissionToCourse = (courseId: string, mission: Mission) => {
    if (!data) return;

    const updatedCourses = data.courses.map((course) => {
      if (course.id !== courseId) {
        return course;
      }

      return {
        ...course,
        completed: false,
        missions: [
          ...course.missions,
          {
            ...mission,
            completed: false,
            locked: course.missions.length > 0,
          },
        ],
      };
    });

    updateData({
      ...data,
      courses: updatedCourses,
    });
  };

  const deleteMissionFromCourse = (courseId: string, missionId: string) => {
    if (!data) return;

    const updatedCourses = data.courses.map((course) => {
      if (course.id !== courseId) {
        return course;
      }

      const updatedMissions = course.missions
        .filter((mission) => mission.id !== missionId)
        .map((mission, index) => ({
          ...mission,
          locked: index === 0 ? false : mission.locked,
        }));

      return {
        ...course,
        completed:
          updatedMissions.length > 0 &&
          updatedMissions.every((mission) => mission.completed),
        missions: updatedMissions,
      };
    });

    updateData({
      ...data,
      courses: updatedCourses,
    });
  };

  const resetUserProgress = () => {
    if (!data) return;

    const resetCourses = data.courses.map((course, courseIndex) => ({
      ...course,
      locked: courseIndex === 0 ? false : true,
      completed: false,
      missions: course.missions.map((mission, missionIndex) => ({
        ...mission,
        completed: false,
        locked: missionIndex === 0 ? false : true,
      })),
    }));

    updateData({
      ...data,
      user: {
        ...data.user,
        xp: 0,
        achievements: [],
      },
      courses: resetCourses,
    });
  };

  return (
    <EduQuestContext.Provider
      value={{
        data,
        setUserName,
        completeMission,
        toggleCourseLock,
        updateMissionXp,
        addMissionToCourse,
        deleteMissionFromCourse,
        resetUserProgress,
      }}
    >
      {children}
    </EduQuestContext.Provider>
  );
};

export const useEduQuestContext = () => {
  const context = useContext(EduQuestContext);

  if (!context) {
    throw new Error("useEduQuest must be used within EduQuestProvider");
  }

  return context;
};