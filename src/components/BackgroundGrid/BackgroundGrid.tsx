import { useRef, useEffect } from "react";
import styles from "./BackgroundGrid.module.scss";

interface BackgroundGridProps {
  maxSpeed?: number;
  disabled?: boolean;
}

const BackgroundGrid = ({
  maxSpeed = 20,
  disabled = true,
}: BackgroundGridProps) => {
  const bgRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const directionRef = useRef({ x: 0.5, y: 0.5 }); // Direction of movement
  const lastTimeRef = useRef<number>(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const targetMousePositionRef = useRef({ x: 0, y: 0 });
  const easingFactor = 0.015; // Lower = smoother/slower easing, higher = faster response

  useEffect(() => {
    if (disabled) return;
    const handlePointerMove = (event: PointerEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const dirX = (event.clientX - centerX) / centerX;
      const dirY = (event.clientY - centerY) / centerY;

      // Update target position, actual position will ease towards this
      targetMousePositionRef.current = { x: dirX, y: dirY };
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [disabled]);

  useEffect(() => {
    if (disabled) return;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Apply easing to mouse position
      mousePositionRef.current.x +=
        (targetMousePositionRef.current.x - mousePositionRef.current.x) *
        easingFactor;
      mousePositionRef.current.y +=
        (targetMousePositionRef.current.y - mousePositionRef.current.y) *
        easingFactor;

      const moveX =
        maxSpeed *
        deltaTime *
        mousePositionRef.current.x *
        directionRef.current.x;
      const moveY =
        maxSpeed *
        deltaTime *
        mousePositionRef.current.y *
        directionRef.current.y;

      positionRef.current.x += moveX;
      positionRef.current.y += moveY;

      if (bgRef.current) {
        bgRef.current.style.backgroundPosition = `${positionRef.current.x}px ${positionRef.current.y}px`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [maxSpeed, disabled]);

  return <div ref={bgRef} className={styles.backgroundGrid} />;
};

export default BackgroundGrid;
