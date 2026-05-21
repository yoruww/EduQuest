export type CourseTheme = "forest" | "desert" | "react" | "typescript" | "api" | "default";

export const getCourseIcon = (courseId: string): string => {
  switch (courseId) {
    case "forest-basics":
      return "🌳";
    case "js-desert":
      return "🏜️";
    case "react-castle":
      return "🏰";
    case "typescript-mountains":
      return "⛰️";
    case "api-ocean":
      return "🌊";
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
    case "react-castle":
      return "react";
    case "typescript-mountains":
      return "typescript";
    case "api-ocean":
      return "api";
    default:
      return "default";
  }
};