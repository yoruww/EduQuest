import { useMemo } from "react";
import { useEduQuest } from "../../hooks/useEduQuest";
import { buildAchievementsView, buildStats } from "./helpers";
import {
  getCurrentLevelStartXp,
  getNextLevelXp,
  getUserLevel,
} from "../../utils/progress";
import type { ProfileAchievementView, ProfileStatCard } from "./types";
import ProfileHeroCard from "./components/ProfileHeroCard";
import ProfileStatsGrid from "./components/ProfileStatsGrid";
import ProfileAchievementsBlock from "./components/ProfileAchievementsBlock";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const { data } = useEduQuest();

  const xp = data?.user.xp ?? 0;

  const level = useMemo(() => {
    return getUserLevel(xp);
  }, [xp]);

  const achievementsView = useMemo<ProfileAchievementView[]>(() => {
    if (!data) {
      return [];
    }

    return buildAchievementsView(data.achievements, data.user.achievements);
  }, [data]);

  const stats = useMemo<ProfileStatCard[]>(() => {
    if (!data) {
      return [];
    }

    return buildStats(
      data.courses,
      data.user.xp,
      data.user.achievements.length,
      data.achievements.length
    );
  }, [data]);

  const currentLevelStartXp = getCurrentLevelStartXp(level);
  const nextLevelXp = getNextLevelXp(level);
  const currentLevelRange = nextLevelXp - currentLevelStartXp;
  const currentLevelProgress = xp - currentLevelStartXp;

  const xpPercent =
    currentLevelRange > 0
      ? Math.min(
          100,
          Math.round((currentLevelProgress / currentLevelRange) * 100)
        )
      : 0;

  if (!data) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.page}>
      <ProfileHeroCard
        userName={data.user.name}
        level={level}
        xp={data.user.xp}
        nextLevelXp={nextLevelXp}
        xpPercent={xpPercent}
        achievementsCount={data.user.achievements.length}
      />

      <ProfileStatsGrid stats={stats} />

      <ProfileAchievementsBlock achievements={achievementsView} />
    </div>
  );
};

export default ProfilePage;