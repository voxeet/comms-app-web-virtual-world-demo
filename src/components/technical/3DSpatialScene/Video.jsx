import { Loader, useMask } from "@react-three/drei";
import React, { Suspense, useEffect, useState } from "react";
import * as THREE from "three";

export default function Video({
  id,
  maskId,
  stream,
  position = [0, 0, 0],
  scale = 1,
  args,
  rotation = [0, 0, 0],
  muted = true,
  ...rest
}) {
  const stencil = useMask(maskId, true);

  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      srcObject: stream,
      crossOrigin: "Anonymous",
      muted,
    })
  );

  useEffect(() => void video.play(), [video]);

  return (
    <Suspense fallback={<Loader />}>
      <mesh position={position} scale={scale} {...rest} rotation={rotation}>
        <planeGeometry args={args} />
        <meshStandardMaterial
          color={"rgb(225,225,225)"}
          roughness={0.1}
          metalness={0.3}
          emissive={"black"}
          emissiveIntensity={1}
          side={THREE.DoubleSide}
          {...(stencil && maskId && { ...stencil })}
        >
          <videoTexture attach="map" args={[video]} />
          <videoTexture attach="emissiveMap" args={[video]} />
        </meshStandardMaterial>
      </mesh>
    </Suspense>
  );
}
