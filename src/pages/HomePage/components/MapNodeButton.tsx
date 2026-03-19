import { getNodeThemeClass } from "../helpers";
import type { MapNode } from "../types";
import styles from "../HomePage.module.css";

interface MapNodeButtonProps {
  node: MapNode;
}

const MapNodeButton = ({ node }: MapNodeButtonProps) => {
  const buttonClass = [
    styles.node,
    node.locked ? styles.nodeLocked : styles.nodeActive,
    getNodeThemeClass(node.id, node.locked, styles),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={node.onClick}
      disabled={!node.onClick}
      title={node.locked ? "Скоро открытие" : "Открыть"}
    >
      <div className={styles.circle}>
        <div className={styles.circleInner}>
          <span className={styles.nodeIcon}>{node.icon}</span>
        </div>
        {node.locked && <span className={styles.lock}>🔒</span>}
      </div>

      <div className={styles.nodeTitle}>{node.title}</div>
      <div className={styles.nodeSub}>{node.subtitle}</div>
    </button>
  );
};

export default MapNodeButton;