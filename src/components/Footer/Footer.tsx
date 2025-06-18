import { useState, useEffect } from "react";
import styles from "./Footer.module.scss";
import copy from "../../data/copy.json";

const Footer = () => {
  const [date, setDate] = useState(new Date());
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <footer className={styles.root}>
      <div>
        <div></div>
        <nav>
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
