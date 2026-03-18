import type { Course } from "../../types/eduquest";
import type {
  AchievementView,
  BuildAchievementsParams,
  BuildMapNodesParams,
  MapNode,
} from "./types";

const BASE_XP_PER_LEVEL = 100;

export const getXpRequiredForLevel = (level: number): number => {
  if (level <= 1) {
    return 0;
  }

  let totalXp = 0;

  for (let currentLevel = 1; currentLevel < level; currentLevel += 1) {
    totalXp += currentLevel * BASE_XP_PER_LEVEL;
  }

  return totalXp;
};

export const getUserLevel = (xp: number): number => {
  let level = 1;

  while (xp >= getXpRequiredForLevel(level + 1)) {
    level += 1;
  }

  return level;
};

export const getCurrentLevelStartXp = (level: number): number => {
  return getXpRequiredForLevel(level);
};

export const getNextLevelXp = (level: number): number => {
  return getXpRequiredForLevel(level + 1);
};

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
  if (locked) {
    return "";
  }

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
  const realNodes = courses.map((course) => ({
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