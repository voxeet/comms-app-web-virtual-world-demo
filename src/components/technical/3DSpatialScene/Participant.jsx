import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, useAnimations, useGLTF } from "@react-three/drei";
import {
  CapsuleCollider,
  interactionGroups,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import { Vector3 } from "three";
import Video from "./Video";
import Mask from "./Mask";
import Hud from "./Hud";
import { SkeletonUtils } from "three-stdlib";
import { useFrame, useGraph } from "@react-three/fiber";
import { useDebouncedCallback } from "./Stage";
import { useSpring, config } from "@react-spring/three";

const vec = new Vector3();

// define mask vertices (
const points = new Float32Array([
  -1.9, -1.25, 0, 1.75, -1.25, 0, 1.75, 1.75, 0,

  -1.9, 1.75, 0, -1.9, -1.25, 0, 1.75, 1.75, 0,

  -1.9, -1.25, 0, -1.9, -0.3, 0, -2.9, -0.3, 0,

  -2.9, -0.3, 0, -1.9, -0.3, 0, -1.9, 1.75, 0,

  -1.9, 1.75, 0, -2.9, 1.75, 0, -2.9, -0.3, 0,

  1.75, -1.25, 0, 2, -0.85, 0, 1.75, -0.85, 0,

  1.75, -0.85, 0, 2.5, -0.85, 0, 2.5, 1.75, 0,

  2.5, 1.75, 0, 1.75, 1.75, 0, 1.75, -0.85, 0,

  2.5, -0.85, 0, 2.86, -0.85, 0, 2.86, 1.35, 0,

  2.86, 1.35, 0, 2.5, 1.35, 0, 2.5, -0.85, 0,

  2.5, 1.35, 0, 2.86, 1.35, 0, 2.5, 1.75, 0,
]);

let move = false;

export default function Participant({
  position,
  direction,
  speaking,
  name = "remote participant",
  id,
  color,
  type,
  video,
  stream,
}) {
  const { scene, materials, animations } = useGLTF(
    "/robot/RobotExpressive.glb"
  );
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);
  const { ref, actions, names } = useAnimations(animations);
  const [index, setIndex] = useState(6);

  const api = useRef(null);

  const positionSpringRef = useRef({
    done: false,
    x: 0,
    y: 1.4, // camera initial elevation according to 3d model bounding box
    z: 0,
  });

  const directionSpringRef = useRef({
    done: false,
    x: 0,
    y: 0,
    z: 0,
  });

  useSpring({
    config: config.default,
    ...(type === "bot" && { from: { x: 0, y: 0, z: 0 } }),
    to: {
      x: (position !== null && position.length > 2 && position[0]) || 0,
      y: (position != null && position.length > 2 && position[1]) || 0,
      z: (position !== null && position.length > 2 && position[2]) || 0,
    },

    onChange: ({ value: { x, y, z } }) => {
      positionSpringRef.current = { x, y, z };
    },
    onRest: () => {
      positionSpringRef.current = { done: true };
    },
  });

  useSpring({
    config: config.default,
    ...(type === "bot" && { from: { x: 0, y: 0, z: 0 } }),
    to: {
      x: (direction !== null && direction.length > 2 && direction[0]) || 0,
      y: (direction !== null && direction.length > 2 && direction[1]) || 0,
      z: (direction !== null && direction.length > 2 && direction[2]) || 0,
    },

    onChange: ({ value: { x, y, z } }) => {
      directionSpringRef.current = { x, y, z };
    },
    onRest: () => {
      directionSpringRef.current = { done: true };
    },
  });

  const debouncedAction = useDebouncedCallback(() => {
    if (!actions) return;

    move = false;
    actions[names[6]].fadeOut(0.2);
    actions[names[2]].reset().fadeIn(0.1).play();
  }, 300);

  useFrame(() => {
    if (!api || !api.current) return;

    const proxyVelocity = api.current.linvel();
    if (!proxyVelocity) return;
    const length = vec3(proxyVelocity).length();
    if (length > 0.1) {
      if (!move) {
        move = true;
        actions[names[2]].fadeOut(0.2);
        actions[names[6]].reset().fadeIn(0.1).play();
      }
      debouncedAction();
    }
  });

  useFrame((state) => {
    if (!api || !api.current) return;

    if (positionSpringRef.current.done) return;

    vec.set(
      positionSpringRef.current.x,
      positionSpringRef.current.y,
      positionSpringRef.current.z
    );
    api.current.setNextKinematicTranslation(vec);
  });

  useFrame((state) => {
    if (!api || !api.current) return;
    if (directionSpringRef.current.done) return;

    api.current.setNextKinematicRotation({
      x: directionSpringRef.current.x,
      y: directionSpringRef.current.y,
      z: directionSpringRef.current.z,
      w: 1,
    });
  });

  // Change animation when the index changes
  useEffect(() => {
    if (!actions || !position || !names) return;
    if (index > names.length - 1) return;

    if (!actions[names[index]]) return;

    // Reset and fade in animation after an index has been changed
    actions[names[index]].reset().fadeIn(0.1).play();
    // In the clean-up phase, fade it out
    return () => actions[names[index]] && actions[names[index]].fadeOut(0.1);
    // eslint-disable-next-line
  }, [index, actions, names]);

  useEffect(() => {
    if (!actions) return;
    if (!!speaking) {
      setIndex(0);
    } else {
      setIndex(2);
    }
  }, [actions, speaking]);

  return !position || !direction ? null : (
    <RigidBody
      position={[0, -20, 0]}
      userData={{ id, type }}
      ref={api}
      type={"kinematicPosition"}
      colliders={"hull"}
      collisionGroups={interactionGroups(1, [2])}
    >
      <group scale={0.35} position={[0, 1, 0]} rotation={[0, Math.PI, 0]}>
        <Hud rotation={[0, Math.PI, 0]} />
        {video && stream && type !== "bot" ? (
          <group position={[0, 3, 0]}>
            <Video maskId={id} args={[6, 3.2]} stream={stream} />
            <Mask points={points} maskId={id} />
          </group>
        ) : (
          <Text color={"white"} position={[0, 3.2, 0.1]} fontSize={1}>
            {name || id}
          </Text>
        )}
      </group>

      <group ref={ref} dispose={null}>
        <CapsuleCollider args={[0.5, 1]} />
        <group name="Root_Scene">
          <group
            position={[0, -1.4, 0]}
            scale={0.5}
            rotation={[0, -Math.PI, 0]}
            name="RootNode"
          >
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
                skeleton={nodes.HandR_2.skeleton}
              >
                <meshStandardMaterial color={color} />
              </skinnedMesh>
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
                skeleton={nodes.HandL_2.skeleton}
              >
                <meshStandardMaterial color={color} />
              </skinnedMesh>
            </group>
          </group>
        </group>
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/robot/RobotExpressive.glb");
