import type { Course } from "../../types/types";
import type {
  AchievementView,
  BuildAchievementsParams,
  BuildMapNodesParams,
  MapNode,
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

export const getNodeThemeClass = (
  nodeId: string,
  locked: boolean,
  styles: Record<string, string>
): string => {
  if (locked) return "";

  switch (nodeId) {
    case "forest-basics":
      return styles.nodeForest;
    case "js-desert":
      return styles.nodeDesert;
    default:
      return "";
  }
};

export const buildMapNodes = ({
  courses,
  upcomingNodes,
  onOpenCourse,
}: BuildMapNodesParams): MapNode[] => {
  const realNodes = courses.map((course: Course) => ({
    id: course.id,
    title: course.title,
    subtitle: `${course.missions.length} миссий`,
    icon: getCourseIcon(course.id),
    locked: course.locked,
    onClick: course.locked ? undefined : () => onOpenCourse(course.id),
  }));

  const soonNodes = upcomingNodes.map((node) => ({
    id: node.id,
    title: node.title,
    subtitle: node.subtitle,
    icon: node.icon,
    locked: true,
    onClick: undefined,
  }));

  return [...realNodes, ...soonNodes];
};

export const buildLastAchievements = ({
  achievements,
  unlockedAchievementIds,
}: BuildAchievementsParams): AchievementView[] => {
  const unlockedSet = new Set(unlockedAchievementIds);

  return achievements.slice(0, 4).map((achievement) => ({
    id: achievement.id,
    title: achievement.title,
    unlocked: unlockedSet.has(achievement.id),
  }));
};

export const getCompletedMissionsCount = (courses: Course[]): number => {
  return courses.reduce(
    (sum, course) =>
      sum + course.missions.filter((mission) => mission.completed).length,
    0
  );
};

export const getTotalMissionsCount = (courses: Course[]): number => {
  return courses.reduce((sum, course) => sum + course.missions.length, 0);
};