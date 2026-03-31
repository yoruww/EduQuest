import type { Course } from "../../types/eduquest";
import { getCourseIcon, getCourseTheme } from "../../utils/courseMeta";
import { DEFAULT_SOON_COURSE_MISSIONS_COUNT } from "./constants";
import type {
  BuildCourseCardsParams,
  CourseCardView,
  SoonCourseConfig,
} from "./types";

export const getCardThemeClass = (
  courseId: string,
  styles: Record<string, string>
): string => {
  const theme = getCourseTheme(courseId);

  switch (theme) {
    case "desert":
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
    missionsCount: DEFAULT_SOON_COURSE_MISSIONS_COUNT,
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