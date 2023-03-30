import { useMemo, useEffect } from "react";

export function useMouseCapture() {
  const mouse = useMemo(() => ({ x: 0, y: 0 }), []);

  const mouseMove = (e) => {
    if (
      document.pointerLockElement === document.body ||
      document.mozPointerLockElement === document.body
    ) {
      mouse.x += e.movementX;
      mouse.y += e.movementY;
    }
  };

  const capture = () => {
    // Ask the browser to lock the pointer
    document.body.requestPointerLock =
      document.body.requestPointerLock ||
      document.body.mozRequestPointerLock ||
      document.body.webkitRequestPointerLock;
    document.body.requestPointerLock();
  };

  useEffect(() => {
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("click", capture);
    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("click", capture);
    };
  });

  return mouse;
}
