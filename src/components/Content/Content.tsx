import styles from "./Content.module.scss";
import copy from "../../data/copy.json";
import MailChimpSignup from "../MailChimpSignup/MailChimpSignup";

const Content = ({
  isVisible,
  toggleContent,
}: {
  isVisible: boolean;
  toggleContent: () => void;
}) => {
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
      <button
        className={styles.closeButton}
        onClick={toggleContent}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <div className={styles.info}>
          {copy.info.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <MailChimpSignup
          listId="3abbde466b"
          user="4f99e8cb5eb9360cc6519d150"
          datacenter="botzinnovation.us20"
        />
      </div>
    </main>
  );
};

export default Content;
