export const APP_ROUTES = {
  auth: "/",
  home: "/home",
  courses: "/courses",
  course: "/course/:id",
  profile: "/profile",
} as const;

export const buildCourseRoute = (id: string): string => `/course/${id}`;