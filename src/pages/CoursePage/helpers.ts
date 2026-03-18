import { buildCourseRoute } from "../../constants/routes";
import type { Course } from "../../types/eduquest";
import type { MissionContent, MissionWithUi } from "./types";

export const getCourseIcon = (courseId: string): string => {
  switch (courseId) {
    case "forest-basics":
      return "🌳";
    case "js-desert":
      return "🏜️";
    default:
      return "📘";
  }
};

export const getCourseThemeClass = (
  courseId: string,
  styles: Record<string, string>
): string => {
  switch (courseId) {
    case "forest-basics":
      return styles.courseForest;
    case "js-desert":
      return styles.courseDesert;
    default:
      return "";
  }
};

export const getCourseById = (
  courses: Course[],
  courseId: string
): Course | null => {
  return courses.find((course) => course.id === courseId) ?? null;
};

export const buildMissionWithUiList = (
  course: Course,
  missionContentList: MissionContent[]
): MissionWithUi[] => {
  return course.missions.map((mission) => {
    const content = missionContentList.find((item) => item.id === mission.id);

    return {
      ...mission,
      icon: content?.icon ?? "📘",
      displayTitle: content?.title ?? mission.title,
    };
  });
};

export const getFirstUnlockedMissionId = (missions: MissionWithUi[]): string => {
  const firstUnlockedMission = missions.find((mission) => !mission.locked);
  return firstUnlockedMission?.id ?? missions[0]?.id ?? "";
};

export const getActiveMission = (
  missions: MissionWithUi[],
  activeMissionId: string
): MissionWithUi | null => {
  return missions.find((mission) => mission.id === activeMissionId) ?? null;
};

export const getActiveMissionContent = (
  missionContentList: MissionContent[],
  activeMissionId: string
): MissionContent | null => {
  return (
    missionContentList.find((mission) => mission.id === activeMissionId) ?? null
  );
};

export const getCompletedMissionsCount = (
  missions: MissionWithUi[]
): number => {
  return missions.filter((mission) => mission.completed).length;
};

export const getProgressPercent = (
  completedCount: number,
  totalCount: number
): number => {
  if (totalCount === 0) {
    return 0;
  }

  return Math.round((completedCount / totalCount) * 100);
};

export const getNextMission = (
  missions: MissionWithUi[],
  activeMissionId: string
): MissionWithUi | null => {
  const currentMissionIndex = missions.findIndex(
    (mission) => mission.id === activeMissionId
  );

  if (currentMissionIndex === -1) {
    return null;
  }

  return missions[currentMissionIndex + 1] ?? null;
};

export const getNextUnlockedCourseRoute = (
  courses: Course[],
  currentCourseId: string
): string | null => {
  const currentCourseIndex = courses.findIndex(
    (course) => course.id === currentCourseId
  );

  if (currentCourseIndex === -1) {
    return null;
  }

  const nextCourse = courses[currentCourseIndex + 1];

  if (!nextCourse || nextCourse.locked) {
    return null;
  }

  return buildCourseRoute(nextCourse.id);
};