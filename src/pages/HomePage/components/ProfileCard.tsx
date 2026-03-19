import styles from "../HomePage.module.css";

interface ProfileCardProps {
  userName: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  xpPercent: number;
}

const ProfileCard = ({
  userName,
  level,
  xp,
  nextLevelXp,
  xpPercent,
}: ProfileCardProps) => {
  return (
    <div className={styles.sideCard}>
      <div className={styles.profileTop}>
        <div className={styles.bigAvatar}>👑</div>
        <div className={styles.profileName}>{userName}</div>
        <div className={styles.profileLevel}>Уровень {level}</div>
      </div>

      <div className={styles.progressRow}>
        <span className={styles.muted}>До следующего уровня</span>
        <span className={styles.progressValue}>
          {xp}/{nextLevelXp}
        </span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${xpPercent}%` }}
        />
      </div>
    </div>
  );
};

export default ProfileCard;