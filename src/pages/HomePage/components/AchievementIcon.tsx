import {
  ACHIEVEMENT_ICONS,
  DEFAULT_ACHIEVEMENT_ICON,
} from "../../../constants/achievements";

interface AchievementIconProps {
  id: string;
  className?: string;
}

const AchievementIcon = ({ id, className }: AchievementIconProps) => {
  const icon = ACHIEVEMENT_ICONS[id] ?? DEFAULT_ACHIEVEMENT_ICON;

  return <span className={className}>{icon}</span>;
};

export default AchievementIcon;