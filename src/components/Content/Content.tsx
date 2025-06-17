import styles from "./Content.module.scss";
import copy from "../../data/copy.json";

const Content = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <main
      className={styles.root}
      style={{
        pointerEvents: isVisible ? "auto" : "none",
        opacity: isVisible ? 1 : 0,
      }}
      hidden={!isVisible}
      aria-hidden={!isVisible}
    >
      <div className={styles.inner}>
        {copy.info.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </main>
  );
};

export default Content;
