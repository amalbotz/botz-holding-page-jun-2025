import styles from "./Overlay.module.scss";
import { useEffect } from "react";

const Overlay = ({
  isVisible,
  toggle,
  children,
}: {
  isVisible: boolean;
  toggle: (shouldOpen?: boolean) => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggle(false);
      }
    };

    if (isVisible) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible]);

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
        onClick={() => toggle(false)}
        tabIndex={-1}
        aria-hidden="true"
      />

      {children}
    </main>
  );
};

export default Overlay;
