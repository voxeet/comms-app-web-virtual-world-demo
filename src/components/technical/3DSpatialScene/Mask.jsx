import React from "react";
import { Mask } from "@react-three/drei";

export default function VideoMask({ mid, points }) {
  return (
    <Mask id={mid} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={points}
          count={points.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
    </Mask>
  );
}
