import { getCourseIcon, getCourseTheme } from "../../utils/courseMeta";
import type {
  AchievementView,
  BuildAchievementsParams,
  BuildMapNodesParams,
  MapNode,
} from "./types";

export const getNodeThemeClass = (
  nodeId: string,
  locked: boolean,
  styles: Record<string, string>
): string => {
  if (locked) {
    return "";
  }

  const theme = getCourseTheme(nodeId);

  switch (theme) {
    case "forest":
      return styles.nodeForest;
    case "desert":
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