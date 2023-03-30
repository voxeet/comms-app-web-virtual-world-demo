import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useGraph } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";

export function Model(props) {
  const group = useRef();
  const { scene, materials, animations } = useGLTF(
    "/robot/RobotExpressive.glb"
  );

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const { actions, names } = useAnimations(animations, group);
  const [index] = useState(9);

  // Change animation when the index changes
  useEffect(() => {
    if (!actions) return;
    // Reset and fade in animation after an index has been changed
    actions[names[index]].reset().fadeIn(0.1).setEffectiveTimeScale(0.2).play();
    // In the clean-up phase, fade it out
    return () => actions[names[index]] && actions[names[index]].fadeOut(0.1);
  }, [index, actions, names]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      Math.cos(t / 10) / 10 + 0.25,
      0.1
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      Math.sin(t / 10) / 4 + 0.3,
      0.1
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      Math.sin(t / 10) / 10,
      0.1
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      (5 + Math.sin(t)) / 3,
      0.1
    );
  });

  return (
    <group scale={2} ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="RobotArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Bone} />
          </group>
          <group
            name="HandR"
            position={[0, 2.4, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="HandR_1"
              geometry={nodes.HandR_1.geometry}
              material={materials.Main}
              skeleton={nodes.HandR_1.skeleton}
            />
            <skinnedMesh
              name="HandR_2"
              geometry={nodes.HandR_2.geometry}
              material={materials.Grey}
              skeleton={nodes.HandR_2.skeleton}
            />
          </group>
          <group
            name="HandL"
            position={[0, 2.4, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="HandL_1"
              geometry={nodes.HandL_1.geometry}
              material={materials.Main}
              skeleton={nodes.HandL_1.skeleton}
            />
            <skinnedMesh
              name="HandL_2"
              geometry={nodes.HandL_2.geometry}
              material={materials.Grey}
              skeleton={nodes.HandL_2.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/robot/RobotExpressive.glb");
