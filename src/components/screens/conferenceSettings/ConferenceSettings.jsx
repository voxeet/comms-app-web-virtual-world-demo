import React, { Suspense, useState } from "react";

import style from "./ConferenceSettings.Style";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Model } from "./Model";

const ConferenceSettings = ({ className, create }) => {
  const [conferenceName, setConferenceName] = useState("");
  const [spatialAudioStyle] = useState("shared");

  const handleSubmit = (event) => {
    event.preventDefault();
    create({
      alias: conferenceName,
      params: {
        liveRecording: true,
        ttl: 0,
        stats: "true",
        videoCodec: "H264",
        dolbyVoice: true,
        spatialAudioStyle,
      },
    });
  };

  const handleConferenceNameChange = (event) => {
    setConferenceName(event.target.value);
  };

  return (
    <div className={className}>
      <Canvas dpr={[1, 2]}>
        <pointLight position={[100, 100, 100]} intensity={0.8} />
        <hemisphereLight
          color="#ffffff"
          groundColor="#b9b9b9"
          position={[-7, 25, 13]}
          intensity={0.85}
        />
        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <Float>
              <Suspense fallback={null}>
                <Model
                  name="Headphones"
                  position={[1, 3, -25]}
                  rotation={[1, 0, -0.5]}
                />
              </Suspense>
            </Float>
          </group>
        </Suspense>
      </Canvas>
      <div className={"form"}>
        <h1 className={"title"}>Virtual World Demo</h1>
        <a className="right" href="https://dolby.io/">
          <b>dolby.io</b>
        </a>

        <form onSubmit={handleSubmit} data-testid="form">
          <input
            id="conferenceName"
            autoComplete="off"
            type="search"
            name="conferenceName"
            required
            value={conferenceName}
            onChange={handleConferenceNameChange}
            placeholder={"join an event and put your headphone on!"}
            autoFocus={true}
          />
        </form>
        <h2>
          To be an inventor, you have to be willing to live with a sense of
          uncertainty, <br />
          to work in this darkness and grope towards an answer, <br /> to put up
          with anxiety about whether there is an answer
          <br />
          <br /> -- Ray Dolby --
        </h2>
      </div>
    </div>
  );
};

export default style(ConferenceSettings);
