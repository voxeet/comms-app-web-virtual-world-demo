import { useEffect, useMemo, useRef } from "react";
import { Vector3, CatmullRomCurve3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";

function randomFloatInRange(min, max) {
  return Math.random() * (max - min + 1) + min;
}

const SPEED = 1000;
export default function Parrot({ curveColor, ...props }) {
  const group = useRef();
  const spline = useMemo(() => {
    const randomPoints = [];
    for (let i = 0; i < 6; i++) {
      randomPoints.push(
        new Vector3(
          randomFloatInRange(-40, 40),
          randomFloatInRange(20, 30),
          randomFloatInRange(-40, 40)
        )
      );
    }

    const curve = new CatmullRomCurve3(randomPoints);
    curve.curveType = "centripetal";
    curve.closed = true;
    return curve;
  }, []);

  //const tubeGeom = new TubeBufferGeometry(spline, 250, 0.02, 10, true);

  const posIdx = useRef(0);

  const { nodes, materials, animations } = useGLTF("/parrot/Parrot.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    group.current.updateMatrix();
    actions["KeyAction"].setEffectiveTimeScale(2.5).play();
  }, [actions]);

  useFrame(() => {
    posIdx.current++;
    if (posIdx.current > SPEED) posIdx.current = 0;
    const pos = spline.getPoint(posIdx.current / SPEED);
    const posnext = spline.getPoint((posIdx.current + 1) / SPEED);

    group.current.position.x = pos.x;
    group.current.position.y = pos.y;
    group.current.position.z = pos.z;

    group.current.lookAt(posnext);
  });

  return (
    <>
      {/* Path preview */}
      {/*  <mesh geometry={tubeGeom}>
        <meshBasicMaterial color={curveColor} />
      </mesh>*/}
      <group ref={group} {...props} dispose={null}>
        <mesh
          castShadow
          name="Object_0"
          geometry={nodes.Object_0.geometry}
          material={materials.Material_0_COLOR_0}
          morphTargetDictionary={nodes.Object_0.morphTargetDictionary}
          morphTargetInfluences={nodes.Object_0.morphTargetInfluences}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>
    </>
  );
}

useGLTF.preload("/parrot/Parrot.glb");
