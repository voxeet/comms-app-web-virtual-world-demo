import { NotFoundEntity } from "../../../dataDefinitions/defect";
import Video from "./Video";
import React, { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

function Sound({ stream, position }) {
  const sound = useRef();
  const { camera } = useThree();
  const [listener] = useState(() => new THREE.AudioListener());
  useEffect(() => {
    const audioTracks = stream.getAudioTracks();
    if (!audioTracks || !audioTracks.length > 0) return;

    const audioTrack = audioTracks[0];
    const str = new MediaStream([audioTrack]);

    sound.current.setRefDistance(4);
    sound.current.setMediaStreamSource(str);
    sound.current.play();
    sound.current.setVolume(3.75);
    camera.add(listener);
    return () => camera.remove(listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <positionalAudio ref={sound} args={[listener]} position={position} />;
}

export default function ScreenSharing({
  position,
  stream,
  scale,
  rotation,
  args,
}) {
  return (
    stream !== NotFoundEntity && (
      <>
        <Sound position={position} stream={stream}></Sound>
        <Video
          args={args}
          position={position}
          scale={scale}
          stream={stream}
          rotation={rotation}
          muted={true}
        />
      </>
    )
  );
}
