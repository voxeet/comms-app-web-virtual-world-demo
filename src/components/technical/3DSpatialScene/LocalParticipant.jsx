import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useGraph, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  interactionGroups,
  RigidBody,
  useRapier,
  vec3,
} from "@react-three/rapier";
import { Quaternion, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import { clamp } from "leva/plugin";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { easing } from "maath";
import round from "lodash.round";
import useInterval from "../../hooks/useInterval.js";

let phi = 0;
let theta = 0;

let direction = 0;
let position = [0, 20, 0];

function isTheSamePosition(firstPosition, secondPosition) {
  return firstPosition.every(
    (coordinate, index) =>
      Math.abs(round(coordinate, 1) - round(secondPosition[index], 1)) < 0.1
  );
}

export const LocalParticipant = ({
  input = () => ({ move: [0, 0, 0], look: [0, 0] }),
  walk = 3,
  jump = 1.2,
  id,
  setDirection,
  setPosition,
  fetchRemoteParticipantsLocations,
  color,
  type,
}) => {
  const { scene, materials, animations } = useGLTF(
    "/robot/RobotExpressive.glb"
  );
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);
  const { ref, actions, names } = useAnimations(animations);

  const api = useRef(null);

  const { camera } = useThree();
  const rapier = useRapier();
  const [index, setIndex] = useState(3);
  const [nthTimeSinceLastPositionUpdate, setNthTimeSinceLastPositionUpdate] =
    useState(0);
  const [nthTimeSinceLastDirectionUpdate, setNthTimeSinceLastDirectionUpdate] =
    useState(0);

  // declare reusable, non-persistent variables, just don't need these being recreated every frame
  const speed = new Vector3(walk / 2, jump, walk);
  const offset = new Vector3(0, 0, 0);
  const gaze = new Quaternion();
  const yaw = new Quaternion();
  const pitch = new Quaternion();
  const cameraOffset = new Vector3(1, 1.8, 6);
  const yAxis = new Vector3(0, 1, 0);
  const xAxis = new Vector3(1, 0, 0);

  const drag = new Vector3(0.85, 1, 0.85);

  const updateOrientation = ([x, y]) => {
    const cameraSpeed = 3;
    const step = 0.1;
    phi = lerp(phi, -x * cameraSpeed, step);
    theta = lerp(theta, -y * cameraSpeed, step);
    theta = clamp(theta, -Math.PI / 4, Math.PI / 4);

    yaw.setFromAxisAngle(yAxis, phi);
    pitch.setFromAxisAngle(xAxis, theta);
    gaze.multiplyQuaternions(yaw, pitch).normalize();
  };

  // update direction
  useInterval(() => {
    if (!id) return;

    const pLocal = new Vector3(0, 0, -1);
    const pWorld = pLocal.applyMatrix4(camera.matrixWorld);
    const dir = pWorld.sub(camera.position).normalize();

    const angleInRadian = Math.atan2(dir.z, dir.x);
    const currentDirection = round(
      (angleInRadian + Math.PI / 2) * (180 / Math.PI),
      0
    );

    setNthTimeSinceLastDirectionUpdate(
      (previousNthTime) => previousNthTime + 1
    );

    if (
      Math.abs(currentDirection - direction) > 2 ||
      nthTimeSinceLastDirectionUpdate > 100
    ) {
      direction = currentDirection;
      setNthTimeSinceLastDirectionUpdate(0);

      setDirection({
        participantId: id,
        direction: { x: 0, y: direction, z: 0 },
      });
    }
  }, 60);

  // update position
  useInterval(() => {
    if (!id) return;

    if (api && api.current && api.current.translation) {
      const proxyPosition = api.current.translation();
      if (!proxyPosition) return;
      const currentPosition = Object.values(vec3(proxyPosition));
      setNthTimeSinceLastPositionUpdate(
        (previousNthTime) => previousNthTime + 1
      );

      if (
        !isTheSamePosition(currentPosition, position) ||
        nthTimeSinceLastPositionUpdate > 20
      ) {
        position = currentPosition;

        setPosition({
          participantId: id,
          position: {
            x: round(position[0], 1),
            y: round(position[1], 1),
            z: round(position[2], 1),
          },
        });

        setNthTimeSinceLastPositionUpdate(0);
      }
    }
  }, 300);

  // trigger animations
  useInterval(() => {
    if (!actions || !api || !api.current) return;
    const proxyLinVel = api.current.linvel();
    if (!proxyLinVel) return;
    const linvel = vec3(proxyLinVel);

    if (linvel.length() < 0.1) {
      setIndex(2);
    } else {
      setIndex(6);
    }
  }, 100);

  useFrame((state, delta) => {
    if (!id || !api.current || !ref.current) return;
    const proxyVelocity = api.current.linvel();
    if (!proxyVelocity) return;
    const velocity = vec3(proxyVelocity);

    const proxyPosition = api.current.translation();

    if (!proxyPosition) return;
    const position = vec3(proxyPosition);

    const { move, look, running } = input();
    updateOrientation(look);

    const world = rapier.world.raw();

    const ray = world.castRay(
      new rapier.rapier.Ray(api.current.translation(), { x: 0, y: -2.5, z: 0 })
    );

    const ground = ray && ray.collider && Math.abs(ray.toi) <= 1.75;

    // only allow movement input on ground
    if (ground) {
      offset
        .fromArray(move)
        .normalize()
        .multiply(running ? speed.clone().multiplyScalar(2.5) : speed)
        .applyQuaternion(yaw);

      const v = velocity.multiply(drag).add(offset);

      api.current.setLinvel(v, true);
    }

    camera.position.lerp(
      position.add(cameraOffset.clone().applyQuaternion(yaw)),
      0.1
    );

    camera.quaternion.copy(gaze);

    // rotate mesh inside the rigid body (easing applied).
    easing.dampE(
      ref.current.rotation,
      [0, -direction * (Math.PI / 180), 0],
      0.085,
      delta
    );

    // rotate rigid body (ease rotation: still have not found a way to do it)
    /*  api.current.setRotation({
          x: 0,
          y: -direction * (Math.PI / 180),
          z: 0,
          w: 1,
        });*/
  });

  // Change animation when the index changes
  useEffect(() => {
    if (!actions) return;
    // Reset and fade in animation after an index has been changed
    actions[names[index]].reset().fadeIn(0.1).play();
    // In the clean-up phase, fade it out
    return () => actions[names[index]] && actions[names[index]].fadeOut(0.1);
  }, [index, actions, names]);

  // set initial participant audio position
  useEffect(() => {
    if (!id) return;

    setPosition({
      participantId: id,
      position: {
        x: round(position[0], 1),
        y: round(position[1], 1),
        z: round(position[2], 1),
      },
    });

    setDirection({
      participantId: id,
      direction: { x: 0, y: direction, z: 0 },
    });

    return () => {
      phi = 0;
      theta = 0;
      direction = 0;
      position = [0, 20, 0];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchRemoteParticipantsLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RigidBody
      ref={api}
      position={[0, 20, 0]}
      enabledRotations={[false, false, false]}
      name={"player"}
      userData={{ id, type }}
      friction={1.5}
      restitution={0}
      gravityScale={4}
      colliders={false}
      collisionGroups={interactionGroups(0, [2, 4])}
    >
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
};

useGLTF.preload("/robot/RobotExpressive.glb");
