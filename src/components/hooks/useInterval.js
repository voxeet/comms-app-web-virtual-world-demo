import { useEffect, useRef } from "react";
export default function useInterval(callback, delay) {
  const intervalRef = useRef();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay === "number") {
      intervalRef.current = setInterval(() => callbackRef.current(), delay);

      return () => clearInterval(intervalRef.current);
    }
  }, [delay]);

  return intervalRef;
}
