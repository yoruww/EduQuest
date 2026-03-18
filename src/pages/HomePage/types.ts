import type { Achievement, Course } from "../../types/eduquest";

export interface MapNode {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  locked: boolean;
  onClick?: () => void;
}

export interface UpcomingMapNode {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface AchievementView {
  id: string;
  title: string;
  unlocked: boolean;
}

export interface BuildMapNodesParams {
  courses: Course[];
  upcomingNodes: UpcomingMapNode[];
  onOpenCourse: (courseId: string) => void;
}

export interface BuildAchievementsParams {
  achievements: Achievement[];
  unlockedAchievementIds: string[];
}