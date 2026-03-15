import type { Course } from "../../types/types";

export type CourseCardView = {
  id: string;
  title: string;
  description: string;
  missionsCount: number;
  completedMissions: number;
  locked: boolean;
  icon: string;
  soon?: boolean;
};

export type SoonCourseConfig = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type CourseCardThemeClass = string;

export type BuildCourseCardsParams = {
  courses: Course[];
  soonCourses: SoonCourseConfig[];
};