export type AchievementCondition =
  | "complete-1-mission"
  | "complete-full-course"
  | "earn-100-xp"
  | "complete-all";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: AchievementCondition;
}

export interface MissionOption {
  id: string;
  text: string;
}

export interface Mission {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  locked: boolean;
  isFinal?: boolean;
  icon?: string;
  theory?: string;
  question?: string;
  options?: MissionOption[];
  correctOptionId?: string;
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
  achievements: string[];
}

export interface EduQuestData {
  user: User;
  courses: Course[];
  achievements: Achievement[];
}