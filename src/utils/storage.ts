import userMock from "../mocks/user.json";
import coursesMock from "../mocks/courses.json";
import achievementsMock from "../mocks/achievements.json";
import type { EduQuestData, User, Course, Achievement } from "../types/eduquest";

const STORAGE_KEY = "eduquest-data";

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const initStorage = (): EduQuestData => {
  const existing = localStorage.getItem(STORAGE_KEY);

  const user = deepClone(userMock) as User;
  const courses = deepClone(coursesMock) as Course[];
  const achievements = deepClone(achievementsMock) as Achievement[];

  if (!existing) {
    const data: EduQuestData = { user, courses, achievements };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  try {
    return JSON.parse(existing) as EduQuestData;
  } catch {
    const data: EduQuestData = { user, courses, achievements };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
};

export const getStorage = (): EduQuestData | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EduQuestData;
  } catch {
    return null;
  }
};

export const saveStorage = (data: EduQuestData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const resetStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};