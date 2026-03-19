import { ACHIEVEMENT_ICONS } from "../constants";
import styles from "../HomePage.module.css";

interface AchievementIconProps {
  id: string;
}

const AchievementIcon = ({ id }: AchievementIconProps) => {
  const icon = ACHIEVEMENT_ICONS[id] ?? "⭐";
  return <span className={styles.emojiIcon}>{icon}</span>;
};

export default AchievementIcon;