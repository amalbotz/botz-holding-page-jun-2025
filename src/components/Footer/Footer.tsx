import { useState, useEffect, useRef } from "react";
import styles from "./Footer.module.scss";
import copy from "../../data/copy.json";

const Footer = ({ toggleCookiePolicy }: { toggleCookiePolicy: () => void }) => {
  const [date, setDate] = useState(new Date());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isTouchingRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
    <footer className={styles.root}>
      <div>
        <div className={styles.ruler}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <nav>
          <button onClick={toggleCookiePolicy}>[ Cookie Policy ]</button>
          {copy.footer.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              [ {item.title} ]
            </a>
          ))}
        </nav>
      </div>
      <hr />
      <div>
        <div>
          X:{Math.round(position.x).toString().padStart(4, "0")} Y:
          {Math.round(position.y).toString().padStart(4, "0")}
        </div>
        <div>
          {`${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date
            .getSeconds()
            .toString()
            .padStart(2, "0")} ${date.getHours() >= 12 ? "PM" : "AM"} | ${date
            .getDate()
            .toString()
            .padStart(2, "0")} ${date
            .toLocaleString("en-US", { month: "short" })
            .toUpperCase()} ${date.getFullYear().toString().slice(-2)}`}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
