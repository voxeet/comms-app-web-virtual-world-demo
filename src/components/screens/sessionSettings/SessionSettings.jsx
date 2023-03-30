import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

import style from "./SessionSettings.Style";
import { Float } from "@react-three/drei";
import { Model } from "./Model";

const SessionSettings = ({ className, open, ready }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    ready();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    open({ name });
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 5, 35], fov: 50 }} dpr={[1, 2]}>
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
                <Model />
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
        <form
          id={"sessionForm"}
          autoComplete="false"
          onSubmit={handleSubmit}
          data-testid="form"
        >
          <input
            contentEditable={true}
            autoFocus={true}
            id={"sessionName"}
            required
            value={name}
            onChange={handleNameChange}
            placeholder={"type your name, hit enter!"}
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

export default style(SessionSettings);
