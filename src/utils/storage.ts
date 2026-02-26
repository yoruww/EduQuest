import userMock from "../mocks/user.json";
import coursesMock from "../mocks/courses.json";
import achievementsMock from "../mocks/achievements.json";

const STORAGE_KEY = "eduquest-data";

export const initStorage = () => {
  const existing = localStorage.getItem(STORAGE_KEY);

  if (!existing) {
    const data = {
      user: userMock,
      courses: coursesMock,
      achievements: achievementsMock,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  return JSON.parse(existing);
};

export const getStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveStorage = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const resetStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};