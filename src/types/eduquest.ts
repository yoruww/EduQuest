export type AchievementCondition =
  | "complete-1-mission"
  | "complete-full-course"
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
}

export interface User {
  id: string;
  name: string;
  stars: number;
  xp: number;
  completedMissions: string[];
  completedCourses: string[];
  achievements: string[];
}

export interface EduQuestData {
  user: User;
  courses: Course[];
  achievements: Achievement[];
}