import { Image, useTexture } from "@react-three/drei";

export default function ImageWrapper() {
  const texture = useTexture("/DLB_io_PwrBy_rgb_wht_@4x.png");
  return (
    <Image
      color={"black"}
      texture={texture}
      transparent
      position={[0, 20, 100]}
      scale={[37, 14]}
      rotation={[0, Math.PI, 0]}
    />
  );
}
