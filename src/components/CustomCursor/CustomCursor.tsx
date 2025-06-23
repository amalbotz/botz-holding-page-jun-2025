import { useState, useEffect, useRef } from "react";
import styles from "./CustomCursor.module.scss";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isTouchingRef = useRef(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isTouchingRef.current) {
        setPosition({ x: event.clientX, y: event.clientY });
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches && event.touches.length > 0) {
        isTouchingRef.current = true;
        setPosition({
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        });
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches && event.touches.length > 0) {
        isTouchingRef.current = true;
        setPosition({
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        });
      }
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div
      className={styles.cursor}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div className={styles.horizontal}></div>
      <div className={styles.vertical}></div>
    </div>
  );
};

export default CustomCursor;
