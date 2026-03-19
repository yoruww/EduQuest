import type { MapNode } from "../types";
import MapNodeButton from "./MapNodeButton";
import styles from "../HomePage.module.css";

interface MapSectionProps {
  nodes: MapNode[];
}

const MapSection = ({ nodes }: MapSectionProps) => {
  return (
    <section className={styles.mapCard}>
      <div className={styles.mapHeader}>
        <span className={styles.mapEmoji}>🗺️</span>
        <h1 className={styles.mapTitle}>Карта мира знаний</h1>
      </div>

      <div className={styles.mapArea}>
        <div className={styles.nodes}>
          {nodes.map((node) => (
            <MapNodeButton key={node.id} node={node} />
          ))}
        </div>

        <div className={styles.cloud1} />
        <div className={styles.cloud2} />
      </div>
    </section>
  );
};

export default MapSection;