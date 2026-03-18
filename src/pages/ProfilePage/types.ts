export type ProfileAchievementView = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

export type ProfileStatTone = "blue" | "violet" | "gold" | "green";

export type ProfileStatCard = {
  id: string;
  label: string;
  value: string;
  icon: string;
  tone: ProfileStatTone;
};