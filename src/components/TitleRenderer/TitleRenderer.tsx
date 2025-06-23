import TitleRendererWebGL from "./TitleRendererWebGL";
import styles from "./TitleRenderer.module.scss";
import { useEffect, useRef } from "react";

interface TitleRendererProps {
  isObscured: boolean;
}

const TitleRenderer = ({ isObscured }: TitleRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          renderer.onMouseMove([e.clientX, e.clientY]);
        };
        window.addEventListener("mousemove", onMouseMove);

        return () => {
          window.removeEventListener("mousemove", onMouseMove);
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
