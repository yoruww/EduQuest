export type CourseTheme = "forest" | "desert" | "default";

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

export const getCourseTheme = (courseId: string): CourseTheme => {
  switch (courseId) {
    case "forest-basics":
      return "forest";
    case "js-desert":
      return "desert";
    default:
      return "default";
  }
};