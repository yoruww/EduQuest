import { ACHIEVEMENT_ICONS, DEFAULT_ACHIEVEMENT_ICON } from "../../constants/achievements";

interface AchievementIconProps {
  id: string;
  className?: string;
  defaultIcon?: string;
}

const AchievementIcon = ({
  id,
  className,
  defaultIcon = DEFAULT_ACHIEVEMENT_ICON,
}: AchievementIconProps) => {
  const icon = ACHIEVEMENT_ICONS[id] ?? defaultIcon;

  return <span className={className}>{icon}</span>;
};

export default AchievementIcon;