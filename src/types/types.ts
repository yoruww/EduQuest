export type AchievementCondition =
  | "complete-1-mission"
  | "complete-full-cource"
  | "earn-100-XP"
  | "complete-all";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: AchievementCondition;
}

export interface Mission {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  locked: boolean;
  isFinal?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  locked: boolean;
  completed: boolean;
  missions: Mission[];
  icon?: string;
}

export interface User {
  name: string;
  xp: number;
  stars: number;
  achievements: string[];
}

export interface EduQuestData {
  user: User;
  courses: Course[];
  achievements: Achievement[];
}