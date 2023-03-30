import React, { useEffect, useRef, useState, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import {
  interactionGroups,
  RigidBody,
  TrimeshCollider,
  useRapier,
} from "@react-three/rapier";
import { isValid } from "../../../dataDefinitions/defect";
import Video from "./Video";

export function useDebouncedCallback(func, wait) {
  const timeout = useRef();

  return useCallback(
    (...args) => {
      const later = () => {
        clearTimeout(timeout.current);
        func(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, wait);
    },
    [func, wait]
  );
}

export default function Stage({
  position,
  startVideo,
  stopVideo,
  participantIds,
  stream,
  local,
}) {
  const { nodes, materials } = useGLTF("/stage/scene.gltf");
  const [onStage, setOnStage] = useState();

  const rapier = useRapier();

  const collider = useRef(null);

  const debounceVideo = useDebouncedCallback((id, enter) => {
    if (!local) return;
    if (enter) {
      if (!onStage) {
        setOnStage(id);
        startVideo({ participantId: id });
      }
    } else {
      if (onStage && onStage === id) {
        setOnStage(null);
        stopVideo();
      }
    }
  }, 2000);

  useEffect(() => {
    if (!local) return;
    if (onStage && !participantIds.includes(onStage)) {
      stopVideo(onStage);
      setOnStage(null);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(participantIds)]);

  useEffect(() => {
    if (!collider.current) return;

    collider.current.setActiveCollisionTypes(
      rapier.rapier.ActiveCollisionTypes.DEFAULT |
        rapier.rapier.ActiveCollisionTypes.KINEMATIC_FIXED
    );
    // eslint-disable-next-line
  }, [collider]);

  return (
    <>
      {isValid(stream) && (
        <Video
          args={[4.2, 2.5]}
          position={[position[0], position[1] + 5, position[2] - 10]}
          scale={4}
          stream={stream}
        />
      )}
      <group position={position} scale={0.012} dispose={null}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <group
              position={[0, -6.21, -858.96]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[100, 100, 100]}
            >
              <RigidBody
                userData={{ type: "stage" }}
                name={"stage"}
                type={"fixed"}
                colliders={false}
              >
                <TrimeshCollider
                  collisionGroups={interactionGroups(2, [0, 1])}
                  ref={collider}
                  onCollisionEnter={({ other }) => {
                    const id = other.rigidBody.userData.id;
                    const type = other.rigidBody.userData.type;
                    if (type !== "bot") return;
                    debounceVideo(id, true);
                  }}
                  onCollisionExit={({ other }) => {
                    const id = other.rigidBody.userData.id;
                    const type = other.rigidBody.userData.type;
                    if (type !== "bot") return;
                    debounceVideo(id, false);
                  }}
                  args={[
                    nodes["concert-stagemainfinal__0"].geometry.attributes
                      .position.array,
                    nodes["concert-stagemainfinal__0"].geometry.index.array ||
                      [],
                  ]}
                />
                <mesh
                  castShadow
                  geometry={nodes["concert-stagemainfinal__0"].geometry}
                  material={materials["Scene_-_Root"]}
                />
              </RigidBody>
            </group>
          </group>
        </group>
      </group>
    </>
  );
}

useGLTF.preload("/stage/scene.gltf");
