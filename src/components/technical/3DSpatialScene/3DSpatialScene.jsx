import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";

import style from "./3DSpatialScene.Style";
import { Attractor, interactionGroups, Physics } from "@react-three/rapier";
import { AdaptiveDpr, AdaptiveEvents, Sky } from "@react-three/drei";

import LocalParticipant from "../../../containers/LocalParticipant";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import { useMouseCapture } from "../../hooks/useMouseCapture";
import Participant from "../../../containers/Participant";
import StageOne from "../../../containers/StageOne";
import StageTwo from "../../../containers/StageTwo";
import ScreenSharing from "../../../containers/ScreenSharing";
import Ground from "./Ground";
import Parrot from "./Parrot";
import Image from "./Image";

function getKeyboardInput(keyboard, mouse, width, height) {
  const { forward, backward, left, right, jump } = keyboard;

  let [x, y, z] = [0, 0, 0];

  if (forward) z -= 1.0;
  if (backward) z += 1.0;
  if (right) x += 1.0;
  if (left) x -= 1.0;
  if (jump) y += 1.0;

  const move = [x, y, z];
  const look = [mouse.x / width, mouse.y / height];
  const running = false;

  return { move, look, running };
}

const initial = [];

const SpatialScene = ({
  className,
  width = 200,
  height = 200,
  localParticipantId,
  remoteParticipantIds = initial,
  screenShareStreamId,
  mainStageStreamId,
  secondStageStreamId,
  setSpatialEnvironment,
}) => {
  useEffect(() => {
    // FIXME: should it be set as follow instead of: {x: 1, y: 1, z: 1 }
    const scale = { x: 5, y: 5, z: 5 };
    const forward = { x: 0, y: 0, z: -1 };
    const up = { x: 0, y: 1, z: 0 };
    const right = { x: 1, y: 0, z: 0 };

    setSpatialEnvironment({ scale, forward, up, right });
    // eslint-disable-next-line
  }, []);

  const keyboard = useKeyboardControls();
  const mouse = useMouseCapture();

  return (
    <>
      <Canvas
        camera={{ far: 200 }}
        className={className}
        style={{ width, height }}
        shadows
      >
        <fog attach="fog" args={["#d0d0d0", 100, 600]} />
        <Image />
        <Sky
          distance={450000}
          sunPosition={[5, 15, 8]}
          inclination={0}
          azimuth={0.25}
        />
        <AdaptiveEvents />
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.6} />
        <pointLight
          position={[80, 200, 80]}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <Suspense fallback={null}>
          <Physics gravity={[0, -10, 0]}>
            {/*helper*/}
            {/*   <gridHelper
            position={[0, 0, 0]}
            args={[1000, 1000, "#888", "#bbb"]}
            transparent
            opacity={0.05}
          />*/}

            <Attractor
              range={4}
              strength={-12}
              position={[0, 1, 0.2]}
              collisionGroups={interactionGroups(4, [0])}
            />

            {/* Parrots */}
            <Parrot />
            <Parrot />
            <Parrot />
            <Parrot />
            <Parrot />

            {localParticipantId && (
              <LocalParticipant
                input={() => getKeyboardInput(keyboard, mouse, width, height)}
              />
            )}

            {remoteParticipantIds.map((id) => (
              <Participant id={id} key={id} />
            ))}

            {/*main stage: demo*/}
            <StageOne id={mainStageStreamId} position={[-20, 1.7, -40]} />

            {/*second stage: concert*/}
            <StageTwo id={secondStageStreamId} position={[20, 1.7, -40]} />

            {/*third stage: screen sharing*/}
            <ScreenSharing
              position={[0, 40, -40]}
              rotation={[Math.PI / 10, 0, 0]}
              args={[16, 8]}
              scale={5}
              id={screenShareStreamId}
            />

            {/* Ground */}
            <Ground />
          </Physics>
        </Suspense>
      </Canvas>
      <div className={className}>
        <div className={"instructions"}>
          <h1 className={"title"}>Virtual World Demo</h1>
          <div className="controls">
            <p className="controls-content">
              Use <strong>WASD / ZQSD keys</strong> to move
              <br />
              Use the <strong>mouse</strong> to change direction
              <br />
              Jump with <strong>space</strong>
              <br />
              <strong>Esc</strong> to release the mouse
              <br />
            </p>
            <p>{"Enjoy !"}</p>
          </div>
        </div>
        <a className="right" href="https://dolby.io/">
          <b>dolby.io</b>
        </a>
      </div>
    </>
  );
};

export default style(SpatialScene);
