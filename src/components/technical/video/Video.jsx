import React, { useEffect, useRef } from "react";

import style from "./Video.Style";

const Video = ({ className, stream, width, height, fit = "cover" }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!stream) return;

    if (stream && ref.current && !ref.current.srcObject) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  const handleCanPlay = () => {
    ref.current.play();
  };

  const attemptPlay = () => {
    ref &&
      ref.current &&
      ref.current.play().catch((error) => {
        console.error("Error attempting to play", error);
      });
  };

  useEffect(() => {
    attemptPlay();
  }, []);

  return (
    <video
      className={className}
      onCanPlay={handleCanPlay}
      ref={ref}
      width={width}
      height={height}
      autoPlay
      muted
      playsInline
    />
  );
};

export default style(Video);
