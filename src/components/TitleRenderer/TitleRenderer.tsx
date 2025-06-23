import TitleRendererWebGL from "./TitleRendererWebGL";
import styles from "./TitleRenderer.module.scss";
import { useEffect, useRef } from "react";

interface TitleRendererProps {
  isObscured: boolean;
}

const TitleRenderer = ({ isObscured }: TitleRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTouchingRef = useRef(false);

  useEffect(() => {
    if (canvasRef.current) {
      const gl = canvasRef.current.getContext("webgl2");
      let rafId: number;

      if (gl) {
        const renderer = new TitleRendererWebGL(gl);

        const animate = () => {
          renderer.render();
          rafId = requestAnimationFrame(animate);
        };
        animate();

        const onMouseMove = (e: MouseEvent) => {
          if (!isTouchingRef.current) {
            renderer.isTouching = true;
            renderer.onMouseMove([e.clientX, e.clientY]);
          }
        };

        const onTouchStart = (e: TouchEvent) => {
          if (e.touches && e.touches.length > 0) {
            isTouchingRef.current = true;
            renderer.isTouching = true;
            renderer.onMouseMove([e.touches[0].clientX, e.touches[0].clientY]);
          }
        };

        const onTouchMove = (e: TouchEvent) => {
          if (e.touches && e.touches.length > 0) {
            isTouchingRef.current = true;
            renderer.isTouching = true;
            renderer.onMouseMove([e.touches[0].clientX, e.touches[0].clientY]);
          }
        };

        const onTouchEnd = () => {
          isTouchingRef.current = false;
          renderer.isTouching = false;
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchstart", onTouchStart);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchEnd);

        return () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("touchstart", onTouchStart);
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("touchend", onTouchEnd);
          cancelAnimationFrame(rafId);
        };
      }
    }
  }, []);

  return (
    <canvas
      className={styles.root}
      ref={canvasRef}
      style={{ filter: isObscured ? "blur(15px)" : "none" }}
    />
  );
};

export default TitleRenderer;
