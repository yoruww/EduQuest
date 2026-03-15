import userMock from "../mocks/user.json";
import coursesMock from "../mocks/courses.json";
import achievementsMock from "../mocks/achievements.json";
import type {
  EduQuestData,
  User,
  Course,
  Achievement,
} from "../types/eduquest";

const STORAGE_KEY = "eduquest-data";

const createDefaultData = (): EduQuestData => ({
  user: structuredClone(userMock) as User,
  courses: structuredClone(coursesMock) as Course[],
  achievements: structuredClone(achievementsMock) as Achievement[],
});

export const initStorage = (): EduQuestData => {
  const existing = localStorage.getItem(STORAGE_KEY);

  if (!existing) {
    const data = createDefaultData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  try {
    return JSON.parse(existing) as EduQuestData;
  } catch {
    const data = createDefaultData();
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