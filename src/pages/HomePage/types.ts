import type { Achievement, Course } from "../../types/types";

export type MapNode = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  locked: boolean;
  onClick?: () => void;
};

export type UpcomingMapNode = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export type AchievementView = {
  id: string;
  title: string;
  unlocked: boolean;
};

export type BuildMapNodesParams = {
  courses: Course[];
  upcomingNodes: UpcomingMapNode[];
  onOpenCourse: (courseId: string) => void;
};

export type BuildAchievementsParams = {
  achievements: Achievement[];
  unlockedAchievementIds: string[];
};