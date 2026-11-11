
import { useEffect } from "react";
import "./MouseMovement.css";

export default function MouseTrail() {
  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (!finePointer.matches || reducedMotion.matches) return;

    const dot = document.createElement("div");
    dot.className = "mouse-trail-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);

    let frame = null;
    let x = 0;
    let y = 0;

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;

      if (frame !== null) return;

      frame = requestAnimationFrame(() => {
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        dot.style.opacity = "1";
        frame = null;
      });
    };

    const hide = () => {
      dot.style.opacity = "0";
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", hide);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);

      if (frame !== null) cancelAnimationFrame(frame);

      dot.remove();
    };
  }, []);

  return null;
}
