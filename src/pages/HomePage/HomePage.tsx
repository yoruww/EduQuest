import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { buildCourseRoute } from "../../constants/routes";
import { useEduQuest } from "../../hooks/useEduQuest";
import { UPCOMING_MAP_NODES } from "./constants";
import {
  buildLastAchievements,
  buildMapNodes,
  getCompletedMissionsCount,
  getCurrentLevelStartXp,
  getNextLevelXp,
  getTotalMissionsCount,
  getUserLevel,
} from "./helpers";
import type { AchievementView, MapNode } from "./types";
import MapSection from "./components/MapSection";
import ProfileCard from "./components/ProfileCard";
import WorldProgressCard from "./components/WorldProgressCard";
import AchievementsCard from "./components/AchievementsCard";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { data } = useEduQuest();

  const xp = data?.user.xp ?? 0;

  const level = useMemo(() => {
    return getUserLevel(xp);
  }, [xp]);

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

  const nodes = useMemo<MapNode[]>(() => {
    if (!data) {
      return [];
    }

    return buildMapNodes({
      courses: data.courses,
      upcomingNodes: UPCOMING_MAP_NODES,
      onOpenCourse: (courseId) => navigate(buildCourseRoute(courseId)),
    });
  }, [data, navigate]);

  const totalMissions = data ? getTotalMissionsCount(data.courses) : 0;
  const completedMissions = data ? getCompletedMissionsCount(data.courses) : 0;

  const worldProgressPercent =
    totalMissions > 0
      ? Math.round((completedMissions / totalMissions) * 100)
      : 0;

  const lastAchievements = useMemo<AchievementView[]>(() => {
    if (!data) {
      return [];
    }

    return buildLastAchievements({
      achievements: data.achievements,
      unlockedAchievementIds: data.user.achievements,
    });
  }, [data]);

  if (!data) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.page}>
      <MapSection nodes={nodes} />

      <aside className={styles.sidebar}>
        <ProfileCard
          userName={data.user.name}
          level={level}
          xp={xp}
          nextLevelXp={nextLevelXp}
          xpPercent={xpPercent}
        />

        <WorldProgressCard
          completedMissions={completedMissions}
          totalMissions={totalMissions}
          worldProgressPercent={worldProgressPercent}
        />

        <AchievementsCard achievements={lastAchievements} />
      </aside>
    </div>
  );
};

export default HomePage;