import type { Course } from "../../types/types";
import type {
  BuildCourseCardsParams,
  CourseCardView,
  SoonCourseConfig,
} from "./types";

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

export const getCardThemeClass = (
  courseId: string,
  styles: Record<string, string>
): string => {
  switch (courseId) {
    case "js-desert":
      return styles.cardDesert;
    default:
      return "";
  }
};

const mapRealCourseToCard = (course: Course): CourseCardView => {
  const missionsCount = course.missions.length;
  const completedMissions = course.missions.filter(
    (mission) => mission.completed
  ).length;

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    missionsCount,
    completedMissions,
    locked: course.locked,
    icon: getCourseIcon(course.id),
  };
};

const mapSoonCourseToCard = (course: SoonCourseConfig): CourseCardView => {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    missionsCount: 5,
    completedMissions: 0,
    locked: true,
    icon: course.icon,
    soon: true,
  };
};

export const buildCourseCards = ({
  courses,
  soonCourses,
}: BuildCourseCardsParams): CourseCardView[] => {
  const realCards = courses.map(mapRealCourseToCard);
  const soonCards = soonCourses.map(mapSoonCourseToCard);

  return [...realCards, ...soonCards];
};