import { useMemo } from "react";
import type { CourseCardView } from "../types";
import { getCardThemeClass } from "../helpers";
import CardTopRow from "./CardTopRow";
import CardContent from "./CardContent";
import styles from "../CoursesPage.module.css";

interface Props {
  card: CourseCardView;
  onOpen: (card: CourseCardView) => void;
}

const getButtonTitle = (card: CourseCardView) => {
  if (card.soon) return "Скоро открытие";
  if (card.locked) return "Курс закрыт";
  return "Открыть курс";
};

const CourseCard = ({ card, onOpen }: Props) => {
  const isOpen = !card.locked && !card.soon;

  const className = useMemo(
    () =>
      [
        styles.card,
        isOpen ? styles.cardActive : styles.cardLocked,
        getCardThemeClass(card.id, styles),
      ]
        .filter(Boolean)
        .join(" "),
    [card.id, isOpen]
  );

  return (
    <button
      type="button"
      className={className}
      onClick={() => onOpen(card)}
      disabled={!isOpen}
      title={getButtonTitle(card)}
    >
      <CardTopRow card={card} />
      <CardContent card={card} isOpen={isOpen} />
    </button>
  );
};

export default CourseCard;